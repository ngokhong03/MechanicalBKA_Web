const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors');

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
