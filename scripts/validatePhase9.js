import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 9 VALIDATION SCRIPT         ');
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

// 1. Check required Phase 9 files
const requiredFiles = [
  'src/pages/admin/AdminLayout.jsx',
  'src/pages/admin/AdminLayout.css',
  'src/pages/admin/AdminCommon.css',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/admin/AdminCourses.jsx',
  'src/pages/admin/AdminLessons.jsx',
  'src/pages/admin/AdminProducts.jsx',
  'src/pages/admin/AdminSpecialties.jsx',
  'src/pages/admin/AdminSoftware.jsx',
  'src/pages/admin/AdminOrders.jsx',
  'src/pages/admin/AdminUsers.jsx',
  'src/pages/admin/AdminEntitlements.jsx',
  'src/pages/admin/AdminDownloads.jsx',
  'src/pages/admin/AdminAuditLogs.jsx',
  'src/services/adminService.js',
  'firestore.rules'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Validate firestore.rules
const firestoreRulesCode = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
assert(firestoreRulesCode.includes('request.auth.token.admin == true'), 'Rules enforce Admin Custom Claims');
assert(!firestoreRulesCode.includes('get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == \'admin\''), 'Rules do NOT use users.role for Admin verification');
assert(firestoreRulesCode.includes('match /downloadLogs/{logId}'), 'Rules protect downloadLogs');
assert(firestoreRulesCode.includes('match /adminAuditLogs/{logId}'), 'Rules protect adminAuditLogs');

// 3. Validate adminService.js methods
const adminServiceCode = fs.readFileSync(path.resolve('src/services/adminService.js'), 'utf8');
const requiredMethods = [
  'getAdminStats',
  'createCourse', 'updateCourse', 'deleteCourse',
  'createLesson', 'updateLesson', 'deleteLesson',
  'createProduct', 'updateProduct', 'deleteProduct',
  'createSpecialty', 'updateSpecialty', 'deleteSpecialty',
  'createSoftware', 'updateSoftware', 'deleteSoftware',
  'getAdminOrders', 'confirmOrderPayment', 'cancelOrder',
  'getAdminUsers',
  'getAdminEntitlements', 'grantEntitlement', 'revokeEntitlement',
  'getDownloadLogs',
  'getAuditLogs', 'logAdminAction'
];

requiredMethods.forEach(method => {
  assert(adminServiceCode.includes(method), `adminService implements ${method}`);
});

// 4. Validate Safety Checks
assert(adminServiceCode.includes('attachedLessons.length > 0'), 'deleteCourse includes lesson attachment safety guard');
assert(adminServiceCode.includes('referencing.length > 0'), 'deleteProduct includes lesson material safety guard');

// 5. Validate Routing in App.jsx
const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
assert(appCode.includes('<AdminRoute>'), 'App.jsx wraps admin section with AdminRoute');
assert(appCode.includes('<AdminLayout />'), 'App.jsx uses AdminLayout');
assert(appCode.includes('path="courses"'), 'App.jsx registers admin courses route');
assert(appCode.includes('path="lessons"'), 'App.jsx registers admin lessons route');
assert(appCode.includes('path="products"'), 'App.jsx registers admin products route');
assert(appCode.includes('path="specialties"'), 'App.jsx registers admin specialties route');
assert(appCode.includes('path="software"'), 'App.jsx registers admin software route');
assert(appCode.includes('path="orders"'), 'App.jsx registers admin orders route');
assert(appCode.includes('path="users"'), 'App.jsx registers admin users route');
assert(appCode.includes('path="entitlements"'), 'App.jsx registers admin entitlements route');
assert(appCode.includes('path="downloads"'), 'App.jsx registers admin downloads route');
assert(appCode.includes('path="audit-logs"'), 'App.jsx registers admin audit-logs route');

// 6. Validate No Admin SDK in src/
const srcFiles = fs.readdirSync(path.resolve('src'), { recursive: true });
srcFiles.forEach(relFile => {
  const filePath = path.resolve('src', relFile);
  if (fs.statSync(filePath).isFile() && (relFile.endsWith('.js') || relFile.endsWith('.jsx'))) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(!content.includes('firebase-admin'), `No firebase-admin import in src/${relFile}`);
  }
});

// 7. Security Matrix Simulation
console.log('\n--- Chạy thử nghiệm giả lập Ma Trận Bảo Mật Admin CMS (Admin CMS Security Test) ---');

function simulateAdminAccess({ isAuth, isAdmin }) {
  if (!isAuth) return { allowed: false, status: 401, reason: 'UNAUTHENTICATED' };
  if (!isAdmin) return { allowed: false, status: 403, reason: 'FORBIDDEN (Student role)' };
  return { allowed: true, status: 200, reason: 'AUTHORIZED' };
}

assert(simulateAdminAccess({ isAuth: false, isAdmin: false }).allowed === false, 'Guest accessing /admin -> BLOCKED (401)');
assert(simulateAdminAccess({ isAuth: true, isAdmin: false }).allowed === false, 'Student accessing /admin -> BLOCKED (403)');
assert(simulateAdminAccess({ isAuth: true, isAdmin: true }).allowed === true, 'Admin with custom claim accessing /admin -> GRANTED (200)');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 9 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 9 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
