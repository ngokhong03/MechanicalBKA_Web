const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { YoutubeTranscript } = require('youtube-transcript');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = admin.storage();

// Allowed origins for CORS
const allowedOrigins = [
  'https://mechanicalbka-web.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
];

const corsHandler = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or matched origins
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
});

// MIME Type helper for CAD & technical documents
const getMimeType = (fileName) => {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    zip: 'application/zip',
    ipt: 'application/vnd.autodesk.inventor',
    iam: 'application/vnd.autodesk.inventor',
    idw: 'application/vnd.autodesk.inventor',
    sldprt: 'application/sldworks',
    sldasm: 'application/sldworks',
    step: 'application/step',
    stp: 'application/step',
    dwg: 'image/vnd.dwg',
    dxf: 'image/vnd.dxf'
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Secure Download Endpoint: GET /api/download?productId=XXX&fileId=YYY
 */
exports.download = onRequest({ region: 'asia-southeast1', maxInstances: 10 }, (req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Phương thức không được hỗ trợ. Chỉ chấp nhận GET.' });
    }

    const { productId, fileId } = req.query;

    if (!productId || !fileId) {
      return res.status(400).json({ error: 'Yêu cầu cung cấp đầy đủ productId và fileId.' });
    }

    try {
      // 1. Auth Verification (Firebase ID Token)
      let uid = null;
      let isAdmin = false;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1].trim();
        try {
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          uid = decodedToken.uid;
          isAdmin = decodedToken.admin === true;
        } catch (authErr) {
          console.warn('[DownloadAPI] Token xác thực không hợp lệ:', authErr.message);
          return res.status(401).json({ error: 'Bạn cần đăng nhập để tải tài liệu.' });
        }
      }

      // 2. File Lookup in Firestore
      const productRef = db.collection('products').doc(productId);
      const productSnap = await productRef.get();

      if (!productSnap.exists) {
        return res.status(404).json({ error: 'Không tìm thấy thông tin sản phẩm.' });
      }

      const product = productSnap.data();

      const fileRef = productRef.collection('files').doc(fileId);
      const fileSnap = await fileRef.get();

      if (!fileSnap.exists) {
        return res.status(404).json({ error: 'Không tìm thấy tệp tin trong hệ thống.' });
      }

      const fileData = fileSnap.data();
      const fileName = fileData.fileName || 'file_download';
      const storagePath = fileData.storagePath || `private/products/${productId}/${fileId}/${fileName}`;

      // 3. Access Control & Entitlement Verification
      let hasAccess = false;

      if (product.accessType === 'FREE' || product.price === 0) {
        // FREE Product -> Cho phép tải tự do (kể cả khách)
        hasAccess = true;
      } else if (isAdmin) {
        // Admin -> Được tải mọi tệp tin
        hasAccess = true;
      } else if (!uid) {
        // PAID / COURSE_ONLY nhưng chưa đăng nhập -> 401
        return res.status(401).json({ error: 'Bạn cần đăng nhập để tải tài liệu.' });
      } else if (product.accessType === 'PAID') {
        // Kiểm tra Entitlement Product: ${uid}_product_${productId}
        const entId = `${uid}_product_${productId}`;
        const entSnap = await db.collection('entitlements').doc(entId).get();
        if (entSnap.exists && entSnap.data().status === 'active') {
          hasAccess = true;
        }
      } else if (product.accessType === 'COURSE_ONLY') {
        // Kiểm tra Khóa học liên kết chứa file này
        const lessonsSnap = await db.collection('lessons').where('materialIds', 'array-contains', productId).get();
        const courseIds = [...new Set(lessonsSnap.docs.map(d => d.data().courseId).filter(Boolean))];

        for (const cId of courseIds) {
          const courseEntId = `${uid}_course_${cId}`;
          const courseEntSnap = await db.collection('entitlements').doc(courseEntId).get();
          if (courseEntSnap.exists && courseEntSnap.data().status === 'active') {
            hasAccess = true;
            break;
          }
        }
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Bạn chưa có quyền tải tài liệu này.' });
      }

      // 4. Download Logging (Không lưu Auth Token hoặc Signed URL)
      const downloadLog = {
        userId: uid || 'guest',
        productId,
        fileId,
        fileName,
        createdAt: new Date().toISOString(),
        method: process.env.FUNCTIONS_EMULATOR === 'true' ? 'stream' : 'signed_url'
      };

      await db.collection('downloadLogs').add(downloadLog).catch(logErr => {
        console.warn('[DownloadAPI] Lỗi ghi download log:', logErr.message);
      });

      // 5. Generate Signed URL or Fallback Streaming
      const bucket = storage.bucket();
      const storageFile = bucket.file(storagePath);

      // Check if file exists in Storage
      const [exists] = await storageFile.exists();
      if (!exists) {
        console.warn(`[DownloadAPI] File không tồn tại trong Storage: ${storagePath}`);
        return res.status(404).json({ error: 'Tệp tin không tồn tại trong bộ nhớ lưu trữ.' });
      }

      const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

      if (!isEmulator) {
        // Production: Signed URL (Hạn dùng 5 phút)
        const [signedUrl] = await storageFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 5 * 60 * 1000,
          responseDisposition: `attachment; filename="${encodeURIComponent(fileName)}"`
        });

        // Nếu client chấp nhận JSON hoặc gọi qua AJAX
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
          return res.json({ downloadUrl: signedUrl, fileName });
        }

        // Hoặc HTTP 302 Redirect trực tiếp tới Signed URL
        return res.redirect(302, signedUrl);
      } else {
        // Emulator Fallback: Server-side streaming
        const mimeType = getMimeType(fileName);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

        const readStream = storageFile.createReadStream();
        readStream.on('error', (streamErr) => {
          console.error('[DownloadAPI] Lỗi streaming file:', streamErr);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Không thể tải tệp lúc này. Vui lòng thử lại.' });
          }
        });

        return readStream.pipe(res);
      }
    } catch (err) {
      console.error('[DownloadAPI] Lỗi xử lý download:', err);
      return res.status(500).json({ error: 'Không thể tải tệp lúc này. Vui lòng thử lại.' });
    }
  });
});

/**
 * AI Summarize Video Endpoint
 */
exports.summarizeVideo = onCall({ region: 'asia-southeast1', maxInstances: 10, cors: allowedOrigins }, async (request) => {
  const { videoId } = request.data;
  if (!videoId) {
    throw new HttpsError('invalid-argument', 'Video ID is required.');
  }

  // Load API key from environment
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY; 
  if (!apiKey) {
    throw new HttpsError('internal', 'Missing GEMINI_API_KEY in backend environment.');
  }

  try {
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = transcriptArray.map(item => item.text).join(' ');

    if (!fullText) {
      throw new HttpsError('not-found', 'Video không có phụ đề.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Bạn là một trợ lý AI phân tích nội dung học thuật và kỹ thuật.
Hãy đọc phụ đề của một video hướng dẫn/giảng dạy sau đây và tóm tắt nó:

NỘI DUNG PHỤ ĐỀ:
"""
${fullText}
"""

YÊU CẦU:
1. Viết 1 đoạn tóm tắt ngắn (3-4 câu) về nội dung chính của video.
2. Liệt kê 3-5 điểm nổi bật (bullet points) hoặc bài học quan trọng nhất.
3. Nếu nội dung liên quan đến kỹ thuật cơ khí, hãy nhấn mạnh các kiến thức kỹ thuật đó.
Dùng tiếng Việt tự nhiên, rõ ràng.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return { summary: response.text };
  } catch (error) {
    console.error('[SummarizeAPI] Error:', error.message);
    // Nếu lỗi do YoutubeTranscript ném ra khi video không có sub
    if (error.message.includes('Transcript is disabled')) {
      throw new HttpsError('not-found', 'Video này không có phụ đề trên YouTube, không thể tóm tắt nội dung.');
    }
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Không thể tóm tắt video. Lỗi hệ thống.');
  }
});

/**
 * AI Chatbot Endpoint (Knowledge Base / RAG)
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fallback data in case Firestore is empty (dry-run mode)
const FALLBACK_KNOWLEDGE = [
  'Thông tin liên hệ của tác giả TrongBKA (MechanicalBKA): SĐT/Zalo: 0862990403. Email: trongme2bka@gmail.com',
  'Kênh YouTube chính thức của MechanicalBKA (TrongBKA) là: https://youtube.com/@trongbka. Dữ liệu từ kênh này là nguồn chính thức (ưu tiên số 1).',
  'Kênh YouTube tham khảo về giáo dục: Vertanux1 (https://youtube.com/@vertanux1). Nguồn ưu tiên 2.',
  'Kênh YouTube tham khảo về kỹ thuật: EPXYZ (https://youtube.com/@epxyz). Nguồn ưu tiên 2.',
  'Trang web tham khảo giáo dục: https://engineeringpaper.xyz và https://blog.engineeringpaper.xyz. Nguồn ưu tiên 2.',
  'Mật khẩu giải nén file tài liệu (ZIP, RAR) trên MechanicalBKA là: 16042003',
  'MechanicalBKA cung cấp khóa học: Chế tạo máy (Module 1), Khuôn dập (Module 2), Vật liệu Polymer và Composite, Khuôn ép phun (Module 5.1 - 5.7). Phần mềm: Autodesk Inventor, SOLIDWORKS, X-TIMON.',
];

exports.chatAPI = onCall({ region: 'asia-southeast1', maxInstances: 10, cors: allowedOrigins }, async (request) => {
  const { message, history } = request.data;
  if (!message) {
    throw new HttpsError('invalid-argument', 'Message is required.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY; 
  if (!apiKey) {
    throw new HttpsError('internal', 'Missing GEMINI_API_KEY.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // 1. Get embedding for user message
    const embedRes = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: message,
    });
    const queryVector = embedRes.embeddings[0].values;

    // 2. Fetch Knowledge Base from Firestore
    const kbSnapshot = await db.collection('knowledge_base').get();
    let contexts = [];

    if (kbSnapshot.empty) {
      // Fallback
      contexts = FALLBACK_KNOWLEDGE;
    } else {
      // RAG Search
      const docs = [];
      kbSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.embedding && data.text) {
          docs.push({ text: data.text, embedding: data.embedding });
        }
      });

      // Score and sort
      docs.forEach(doc => {
        doc.score = cosineSimilarity(queryVector, doc.embedding);
      });
      docs.sort((a, b) => b.score - a.score);
      
      // Top 3 most relevant
      contexts = docs.slice(0, 3).map(d => d.text);
    }

    // 3. Construct System Prompt
    const systemInstruction = `
Bạn là Trợ lý AI (Software Architect + Full-stack Engineer) của MechanicalBKA.
Nhiệm vụ của bạn là giải đáp thắc mắc cho người dùng.

QUY TẮC QUAN TRỌNG:
1. KHÔNG tự bịa ra thông tin (No Hallucination).
2. Dựa vào NGỮ CẢNH cung cấp dưới đây để trả lời.
3. Nếu ngữ cảnh không có thông tin, hãy nói "Tôi không có thông tin về vấn đề này, vui lòng liên hệ tác giả (0862990403)."
4. Ưu tiên số 1 là dữ liệu từ MechanicalBKA. Tham khảo là Vertanux1 và EPXYZ.
5. Luôn vui vẻ, lịch sự và dùng tiếng Việt.

NGỮ CẢNH TÌM ĐƯỢC:
${contexts.map(c => '- ' + c).join('\n')}
    `;

    // 4. Generate Response
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return { response: response.text };
  } catch (error) {
    console.error('[ChatAPI] Error:', error.message);
    throw new HttpsError('internal', 'Lỗi hệ thống khi xử lý Chatbot RAG.');
  }
});
