import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * MECHANICALBKA — SET ADMIN CUSTOM CLAIMS BY EMAIL SCRIPT
 * 
 * Sử dụng script này để cấp quyền Quản trị viên { admin: true } cho một Email.
 * 
 * Hướng dẫn sử dụng:
 * 1. Đặt file serviceAccountKey.json (tải từ Firebase Console) vào thư mục gốc của project HOẶC
 *    thiết lập biến môi trường GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 * 2. Chạy lệnh:
 *    node scripts/setAdminClaimByEmail.js <TARGET_EMAIL>
 * 
 * Ví dụ:
 *    node scripts/setAdminClaimByEmail.js trongme2bka@gmail.com
 */

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error('\n❌ Lỗi: Thiếu tham số Email.');
  console.log('👉 Cách dùng: node scripts/setAdminClaimByEmail.js <TARGET_EMAIL>');
  console.log('   Ví dụ:    node scripts/setAdminClaimByEmail.js trongme2bka@gmail.com\n');
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
  console.log('Vui lòng thêm serviceAccountKey.json để kết nối tới Firebase Admin.');
  process.exit(0);
}

async function setAdminClaim() {
  try {
    const app = !getApps().length ? initializeApp({ credential }) : getApps()[0];
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log(`\n⏳ Đang tìm kiếm người dùng với email: ${targetEmail}...`);
    
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(targetEmail);
      console.log(`👤 Tìm thấy người dùng: ${userRecord.displayName || ''} (UID: ${userRecord.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`\n❌ Người dùng chưa tồn tại trên hệ thống Firebase.`);
        console.log(`👉 BẠN CẦN LÀM: Hãy mở trang web, nhấn Đăng nhập bằng Google (chọn tài khoản ${targetEmail}).`);
        console.log(`Sau khi đăng nhập thành công lần đầu tiên, hãy quay lại đây chạy lệnh này lần nữa.\n`);
        process.exit(1);
      } else {
        throw error;
      }
    }

    // 2. Set Custom User Claims
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    
    // 3. Cập nhật Role trong Firestore (optional nhưng giúp đồng bộ giao diện nếu cần)
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({ role: 'admin' }, { merge: true });

    console.log('\n=====================================================');
    console.log('🎉 THIẾT LẬP ADMIN CLAIM THÀNH CÔNG!');
    console.log(`   Email:       ${targetEmail}`);
    console.log(`   UID:         ${userRecord.uid}`);
    console.log(`   Claims:      { admin: true }`);
    console.log('=====================================================\n');
    console.log('ℹ️ Lưu ý: Người dùng cần đăng xuất và đăng nhập lại để refresh token.');
  } catch (err) {
    console.error('\n❌ Lỗi khi thiết lập Custom Claims:', err.message);
    process.exit(1);
  }
}

setAdminClaim();
