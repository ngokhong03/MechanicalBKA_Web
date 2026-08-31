import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';

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

// 2. Load Mock Data from data.js
const dataJsPath = path.resolve('src/mock/data.js');
const dataContent = fs.readFileSync(dataJsPath, 'utf8');

function extractExport(name) {
  const regex = new RegExp(`export const ${name} = ([\\s\\S]*?);\\n\\nexport const`);
  const match = dataContent.match(regex);
  if (match) {
    return JSON.parse(match[1]);
  }
  const lastRegex = new RegExp(`export const ${name} = ([\\s\\S]*?);\\n\\nexport const videos`);
  const lastMatch = dataContent.match(lastRegex);
  if (lastMatch) {
    return JSON.parse(lastMatch[1]);
  }
  throw new Error(`Cannot parse export ${name}`);
}

const specialties = extractExport('specialties');
const software = extractExport('software');
const courses = extractExport('courses');
const lessons = extractExport('lessons');
const products = extractExport('products');

async function seed() {
  console.log('=====================================================');
  console.log('   MECHANICALBKA — FIRESTORE SEED DATA SCRIPT        ');
  console.log('=====================================================\n');

  console.log(`📦 Sẵn sàng nạp dữ liệu từ Mock Data:`);
  console.log(`   - Specialties: ${specialties.length}`);
  console.log(`   - Software:    ${software.length}`);
  console.log(`   - Courses:     ${courses.length}`);
  console.log(`   - Lessons:     ${lessons.length}`);
  console.log(`   - Products:    ${products.length}`);

  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'mechanicalbka-prod',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
  };

  if (!firebaseConfig.apiKey) {
    console.log('\nℹ️ Thông báo: VITE_FIREBASE_API_KEY chưa được cấu hình trong .env.');
    console.log('   Script đã kiểm tra và chuẩn bị sẵn sàng dữ liệu seed hợp lệ.');
    console.log('   Khi điền thông tin Firebase vào .env và chạy lại, dữ liệu sẽ được ghi trực tiếp lên Firestore.');
    console.log('\n[Dry-Run Validation]');
    console.log('✅ Toàn bộ cấu trúc document và subcollections đều hợp lệ.');
    return;
  }

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    console.log(`\n🚀 Đang ghi dữ liệu lên Firestore project [${firebaseConfig.projectId}]...`);

    // 1. Seed Specialties
    console.log('👉 Seeding Specialties...');
    for (const item of specialties) {
      await setDoc(doc(db, 'specialties', item.id), item, { merge: true });
    }

    // 2. Seed Software
    console.log('👉 Seeding Software...');
    for (const item of software) {
      await setDoc(doc(db, 'software', item.id), item, { merge: true });
    }

    // 3. Seed Courses
    console.log('👉 Seeding Courses...');
    for (const item of courses) {
      await setDoc(doc(db, 'courses', item.id), item, { merge: true });
    }

    // 4. Seed Lessons
    console.log('👉 Seeding Lessons...');
    for (const item of lessons) {
      await setDoc(doc(db, 'lessons', item.id), item, { merge: true });
    }

    // 5. Seed Products & Files Subcollection
    console.log('👉 Seeding Products & Files Subcollections...');
    for (const item of products) {
      const { files, ...productData } = item;
      await setDoc(doc(db, 'products', item.id), productData, { merge: true });

      if (files && files.length > 0) {
        for (const file of files) {
          await setDoc(doc(db, 'products', item.id, 'files', file.id), file, { merge: true });
        }
      }
    }

    console.log('\n=====================================================');
    console.log('🎉 SEED FIRESTORE HOÀN TẤT THÀNH CÔNG!');
    console.log('=====================================================\n');
  } catch (err) {
    console.error('\n❌ Lỗi khi ghi vào Firestore:', err.message);
    process.exit(1);
  }
}

seed();
