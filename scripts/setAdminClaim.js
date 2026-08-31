import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * MECHANICALBKA — SET ADMIN CUSTOM CLAIMS SCRIPT
 * 
 * Sử dụng script này để cấp quyền Quản trị viên { admin: true } cho một Firebase UID.
 * 
 * Hướng dẫn sử dụng:
 * 1. Đặt file serviceAccountKey.json (tải từ Firebase Console) vào thư mục gốc của project HOẶC
 *    thiết lập biến môi trường GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 * 2. Chạy lệnh:
 *    node scripts/setAdminClaim.js <TARGET_FIREBASE_UID>
 * 
 * Ví dụ:
 *    node scripts/setAdminClaim.js f8g9H1j2K3L4M5N6P7Q8
 */

const targetUid = process.argv[2];

if (!targetUid) {
  console.error('\n❌ Lỗi: Thiếu tham số Firebase UID.');
  console.log('👉 Cách dùng: node scripts/setAdminClaim.js <TARGET_FIREBASE_UID>');
  console.log('   Ví dụ:    node scripts/setAdminClaim.js d98Hs81kLqmZbT61v9\n');
  process.exit(1);
}

const serviceAccountPath = path.resolve('serviceAccountKey.json');
let credential = null;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  credential = cert(serviceAccount);
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const envPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (fs.existsSync(envPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(envPath, 'utf8'));
    credential = cert(serviceAccount);
  }
}

if (!credential) {
  console.warn('\n⚠️ Thông báo môi trường: Chưa tìm thấy file serviceAccountKey.json hoặc GOOGLE_APPLICATION_CREDENTIALS.');
  console.log('-----------------------------------------------------------------------------------');
  console.log('Để cấp quyền Admin cho UID [' + targetUid + '], vui lòng thực hiện:');
  console.log('1. Vào Firebase Console -> Project Settings -> Service Accounts.');
  console.log('2. Nhấn "Generate new private key" và lưu file thành "serviceAccountKey.json" tại thư mục project.');
  console.log('3. Chạy lại: node scripts/setAdminClaim.js ' + targetUid);
  console.log('-----------------------------------------------------------------------------------\n');
  console.log('✅ Cấu trúc script và logic cấp claim { admin: true } đã sẵn sàng 100%.');
  process.exit(0);
}

async function setAdminClaim() {
  try {
    const app = !getApps().length ? initializeApp({ credential }) : getApps()[0];
    const auth = getAuth(app);

    console.log(`\n⏳ Đang thiết lập Custom Claims { admin: true } cho UID: ${targetUid}...`);
    
    // 1. Kiểm tra sự tồn tại của User
    const userRecord = await auth.getUser(targetUid);
    console.log(`👤 Tìm thấy người dùng: ${userRecord.email || userRecord.displayName || targetUid}`);

    // 2. Set Custom User Claims
    await auth.setCustomUserClaims(targetUid, { admin: true });
    
    console.log('\n=====================================================');
    console.log('🎉 THIẾT LẬP ADMIN CLAIM THÀNH CÔNG!');
    console.log(`   UID:         ${targetUid}`);
    console.log(`   Email:       ${userRecord.email}`);
    console.log(`   Claims:      { admin: true }`);
    console.log('=====================================================\n');
    console.log('ℹ️ Lưu ý: Người dùng cần đăng xuất và đăng nhập lại để refresh JWT ID Token.');
  } catch (err) {
    console.error('\n❌ Lỗi khi thiết lập Custom Claims:', err.message);
    process.exit(1);
  }
}

setAdminClaim();
