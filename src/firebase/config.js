import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase Client Configuration
// Sử dụng các biến môi trường VITE_FIREBASE_* nếu được cung cấp
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mechanicalbka-prod',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Kiểm tra xem Firebase có được kích hoạt không (mặc định false trong Mock Mode)
export const isFirebaseEnabled = import.meta.env.VITE_USE_FIREBASE === 'true';

let app = null;
let db = null;
let auth = null;
let storage = null;
let googleProvider = null;

if (isFirebaseEnabled && firebaseConfig.apiKey) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    console.info('[Firebase] Đã khởi tạo kết nối Firebase Authentication, Firestore & Storage thành công.');
  } catch (error) {
    console.warn('[Firebase] Không thể khởi tạo Firebase SDK, chuyển về chế độ Mock Data/Auth:', error.message);
  }
}

export { app, db, auth, storage, googleProvider };
export default db;
