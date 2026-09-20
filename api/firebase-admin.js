import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  try {
    let credential;
    if (process.env.FIREBASE_PRIVATE_KEY) {
      // Environment variables on Vercel
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      // Fallback for local development
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      if (fs.existsSync(serviceAccountPath)) {
        credential = admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')));
      } else {
        console.warn('No Firebase Admin credentials found!');
      }
    }
    
    if (credential) {
      admin.initializeApp({ credential });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default admin;
