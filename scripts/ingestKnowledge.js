import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';

// 1. Simple helper to parse .env file
const loadEnv = () => {
  try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const firstEqual = trimmed.indexOf('=');
          if (firstEqual > 0) {
            const key = trimmed.substring(0, firstEqual).trim();
            const value = trimmed.substring(firstEqual + 1).trim();
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error('Lỗi khi đọc file .env:', err.message);
  }
};

loadEnv();

const rawData = [
  { id: 'contact_info', text: 'Thông tin liên hệ của tác giả TrongBKA (MechanicalBKA): Số điện thoại (SĐT) hoặc Zalo: 0862990403. Email liên hệ: trongme2bka@gmail.com' },
  { id: 'youtube_main', text: 'Kênh YouTube chính thức của MechanicalBKA (TrongBKA) là: https://youtube.com/@trongbka. Dữ liệu từ kênh này là nguồn chính thức và ưu tiên số 1.' },
  { id: 'youtube_ref_1', text: 'Kênh YouTube tham khảo về giáo dục: Vertanux1 (https://youtube.com/@vertanux1). Đây là nguồn tài liệu tham khảo (ưu tiên 2).' },
  { id: 'youtube_ref_2', text: 'Kênh YouTube tham khảo về kỹ thuật: EPXYZ (https://youtube.com/@epxyz). Đây là nguồn tài liệu tham khảo (ưu tiên 2).' },
  { id: 'website_ref_1', text: 'Trang web tham khảo giáo dục: https://engineeringpaper.xyz và https://blog.engineeringpaper.xyz. Đây là nguồn tài liệu tham khảo (ưu tiên 2).' },
  { id: 'password_zip', text: 'Mật khẩu để giải nén cho tất cả các file tài liệu nén (file ZIP, file RAR) tải về trên trang web MechanicalBKA là: 16042003' },
  { id: 'courses_overview', text: 'MechanicalBKA cung cấp các khóa học/module chuyên sâu về: Chế tạo máy (Module 1), Khuôn dập tạo hình (Module 2), Vật liệu Polymer và Composite, Khuôn ép phun (Module 5.1 đến 5.7). Các phần mềm chính được giảng dạy bao gồm: Autodesk Inventor, SOLIDWORKS, X-TIMON.' },
  { id: 'rules_rag', text: 'Quy tắc trả lời của Chatbot (System Rule): Không được tự bịa ra thông tin (no hallucination). Luôn phân biệt rõ nguồn chính thức từ MechanicalBKA và nguồn tham khảo (Vertanux1, EPXYZ). Nếu không có dữ liệu để trả lời, phải nói rõ là không biết hoặc liên hệ trực tiếp tác giả.'}
];

async function ingest() {
  console.log('=====================================================');
  console.log('   MECHANICALBKA — KNOWLEDGE BASE INGESTION          ');
  console.log('=====================================================\n');

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Lỗi: Không tìm thấy VITE_GEMINI_API_KEY trong .env');
    process.exit(1);
  }

  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'mechanicalbka-prod',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
  };

  if (!firebaseConfig.apiKey) {
    console.log('ℹ️ Thông báo: VITE_FIREBASE_API_KEY chưa cấu hình.');
    console.log('   Sẽ tiến hành chạy nháp (Dry-run) embedding API.');
  }

  const ai = new GoogleGenAI({ apiKey });
  let db = null;
  if (firebaseConfig.apiKey) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  }

  console.log(`📦 Bắt đầu xử lý ${rawData.length} document chunks...`);

  for (const chunk of rawData) {
    try {
      console.log(`- Đang tạo embedding cho: [${chunk.id}]...`);
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: chunk.text,
      });

      const embedding = response.embeddings[0].values;
      
      const docData = {
        text: chunk.text,
        embedding: embedding,
        updatedAt: new Date().toISOString()
      };

      if (db) {
        await setDoc(doc(db, 'knowledge_base', chunk.id), docData, { merge: true });
        console.log(`  ✅ Đã lưu [${chunk.id}] vào Firestore.`);
      } else {
        console.log(`  ✅ (Dry-run) Sinh thành công embedding ${embedding.length} chiều.`);
      }
    } catch (error) {
      console.error(`  ❌ Lỗi khi xử lý [${chunk.id}]:`, error.message);
    }
  }

  console.log('\n=====================================================');
  console.log('🎉 INGESTION HOÀN TẤT THÀNH CÔNG!');
  console.log('=====================================================\n');
}

ingest();
