import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load biến môi trường từ file .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ LỖI: Không tìm thấy VITE_GEMINI_API_KEY trong file .env');
  console.error('Vui lòng thêm biến này vào file .env của bạn để sử dụng AI.');
  process.exit(1);
}

// Khởi tạo Gemini client
const ai = new GoogleGenAI({ apiKey });

async function summarizeVideo(videoIdOrUrl) {
  try {
    console.log(`\n⏳ Đang lấy phụ đề từ video: ${videoIdOrUrl}...`);
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoIdOrUrl);
    
    // Nối các đoạn phụ đề lại thành một đoạn văn bản lớn
    const fullText = transcriptArray.map(item => item.text).join(' ');
    
    if (!fullText) {
      throw new Error('Video này không có phụ đề (transcript).');
    }
    
    console.log(`✅ Đã lấy thành công phụ đề! (${fullText.split(' ').length} từ)`);
    console.log('🤖 Đang yêu cầu Gemini tóm tắt...');
    
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
3. Nếu nội dung liên quan đến kỹ thuật cơ khí (như mô phỏng, CNC, thiết kế khuôn...), hãy nhấn mạnh các kiến thức kỹ thuật đó.
Dùng tiếng Việt tự nhiên, rõ ràng.
`;

    // Gọi Gemini API (Sử dụng model gemini-2.5-flash vì nó nhanh và tốt cho văn bản dài)
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    console.log('\n================ TÓM TẮT TỪ AI ================');
    console.log(response.text);
    console.log('===============================================\n');

  } catch (error) {
    console.error('❌ CÓ LỖI XẢY RA:');
    console.error(error.message);
  }
}

// Lấy video ID từ tham số dòng lệnh (VD: node scripts/summarizeVideo.js gF1T2C0x-oM)
const videoId = process.argv[2];

if (!videoId) {
  console.log('💡 HƯỚNG DẪN SỬ DỤNG:');
  console.log('Chạy lệnh sau trong terminal, thay [VIDEO_ID] bằng ID thực của video YouTube:');
  console.log('node scripts/summarizeVideo.js [VIDEO_ID_HOAC_URL]');
  process.exit(0);
}

summarizeVideo(videoId);
