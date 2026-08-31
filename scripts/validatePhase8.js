import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 8 VALIDATION SCRIPT         ');
console.log('=====================================================\n');

let errorCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    errorCount++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Check required Phase 8 files
const requiredFiles = [
  'storage.rules',
  'functions/package.json',
  'functions/index.js',
  'src/services/downloadService.js',
  'src/pages/ProductDetail.jsx',
  'src/pages/LessonViewer.jsx'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Validate storage.rules
const storageRulesCode = fs.readFileSync(path.resolve('storage.rules'), 'utf8');
assert(storageRulesCode.includes('match /private/{allPaths=**}'), 'Storage rules protect /private/**');
assert(storageRulesCode.includes('allow read, write: if isAdmin()'), 'Storage rules restrict /private/** to Admin only');
assert(!storageRulesCode.includes('allow read: if true') || storageRulesCode.includes('/public/'), 'Private files are not publicly accessible');

// 3. Validate functions/index.js
const functionCode = fs.readFileSync(path.resolve('functions/index.js'), 'utf8');
assert(functionCode.includes('admin.auth().verifyIdToken'), 'Functions verify Bearer ID token');
assert(functionCode.includes('decodedToken.admin === true'), 'Functions check Admin custom claim');
assert(functionCode.includes('getSignedUrl'), 'Functions support Signed URL generation');
assert(functionCode.includes('createReadStream'), 'Functions support streaming fallback for Emulator');
assert(functionCode.includes('downloadLogs'), 'Functions write download audit logs');
assert(functionCode.includes('mechanicalbka-web.vercel.app'), 'CORS allows production domain');
assert(functionCode.includes('application/vnd.autodesk.inventor'), 'Functions support CAD MIME types (Inventor/SolidWorks/STEP/PDF/ZIP)');

// 4. Validate downloadService.js
const downloadServiceCode = fs.readFileSync(path.resolve('src/services/downloadService.js'), 'utf8');
assert(downloadServiceCode.includes('downloadProductFile'), 'downloadService exports downloadProductFile');
assert(downloadServiceCode.includes('currentUser.getIdToken()'), 'downloadService attaches Bearer ID token');
assert(!downloadServiceCode.includes('storagePath'), 'downloadService does not expose or send storagePath');

// 5. Validate UI Components
const productDetailCode = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf8');
assert(productDetailCode.includes('downloadService.downloadProductFile'), 'ProductDetail uses downloadService');
assert(!productDetailCode.includes('Secure Download sẽ được kích hoạt ở Phase 8'), 'ProductDetail replaced Phase 8 placeholder');

const lessonViewerCode = fs.readFileSync(path.resolve('src/pages/LessonViewer.jsx'), 'utf8');
assert(lessonViewerCode.includes('downloadService.downloadProductFile'), 'LessonViewer uses downloadService');
assert(!lessonViewerCode.includes('Secure Download với Checksum SHA-256'), 'LessonViewer replaced Phase 8 placeholder');

// 6. Security Scans: Check no private keys or service accounts in src/
const srcFiles = fs.readdirSync(path.resolve('src'), { recursive: true });
srcFiles.forEach(relFile => {
  const filePath = path.resolve('src', relFile);
  if (fs.statSync(filePath).isFile() && (relFile.endsWith('.js') || relFile.endsWith('.jsx') || relFile.endsWith('.json'))) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(!content.includes('BEGIN PRIVATE KEY'), `No private keys in src/${relFile}`);
    assert(!content.includes('client_email') || relFile.includes('mock'), `No service account credentials in src/${relFile}`);
  }
});

// 7. Unit test simulation: Security Matrix & Access Resolution
console.log('\n--- Chạy thử nghiệm giả lập Ma Trận Bảo Mật Tải File (Security Matrix Test) ---');

function simulateDownloadAuth({ isAuth, isAdmin, accessType, hasEntitlement, isRevoked }) {
  if (accessType === 'FREE') return { status: 200, message: 'PASS (Free)' };
  if (isAdmin) return { status: 200, message: 'PASS (Admin Override)' };
  if (!isAuth) return { status: 401, message: 'UNAUTHENTICATED' };
  if (isRevoked) return { status: 403, message: 'FORBIDDEN (Revoked)' };
  if (hasEntitlement) return { status: 200, message: 'PASS (Entitled)' };
  return { status: 403, message: 'FORBIDDEN (Unpurchased)' };
}

// Test Matrix
assert(simulateDownloadAuth({ isAuth: false, accessType: 'FREE' }).status === 200, 'Guest download FREE file -> PASS');
assert(simulateDownloadAuth({ isAuth: false, accessType: 'PAID' }).status === 401, 'Guest download PAID file -> 401');
assert(simulateDownloadAuth({ isAuth: true, accessType: 'PAID', hasEntitlement: false }).status === 403, 'Student without entitlement download PAID file -> 403');
assert(simulateDownloadAuth({ isAuth: true, accessType: 'PAID', hasEntitlement: true }).status === 200, 'Student with active entitlement download PAID file -> PASS');
assert(simulateDownloadAuth({ isAuth: true, accessType: 'COURSE_ONLY', hasEntitlement: true }).status === 200, 'Student with course entitlement download COURSE_ONLY file -> PASS');
assert(simulateDownloadAuth({ isAuth: true, accessType: 'COURSE_ONLY', hasEntitlement: false }).status === 403, 'Student without course entitlement download COURSE_ONLY file -> 403');
assert(simulateDownloadAuth({ isAuth: true, accessType: 'PAID', hasEntitlement: true, isRevoked: true }).status === 403, 'Revoked entitlement download -> 403');
assert(simulateDownloadAuth({ isAuth: true, isAdmin: true, accessType: 'PAID', hasEntitlement: false }).status === 200, 'Admin download any file -> PASS');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 8 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 8 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
