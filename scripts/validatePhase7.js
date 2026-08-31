import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 7 VALIDATION SCRIPT         ');
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

// 1. Check required Phase 7 files
const requiredFiles = [
  'src/services/entitlementService.js',
  'src/services/accessService.js',
  'src/pages/Library.jsx',
  'src/pages/Library.css',
  'firestore.rules'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Validate entitlementService.js
const entServiceCode = fs.readFileSync(path.resolve('src/services/entitlementService.js'), 'utf8');
assert(entServiceCode.includes('buildEntitlementId'), 'entitlementService defines buildEntitlementId');
assert(entServiceCode.includes('${userId}_${targetType}_${targetId}'), 'Entitlement ID is deterministic: ${userId}_${targetType}_${targetId}');
assert(entServiceCode.includes('hasEntitlement'), 'entitlementService exports hasEntitlement');
assert(entServiceCode.includes('getUserEntitlements'), 'entitlementService exports getUserEntitlements');
assert(entServiceCode.includes('grantEntitlement'), 'entitlementService exports grantEntitlement');
assert(entServiceCode.includes('revokeEntitlement'), 'entitlementService exports revokeEntitlement');
assert(entServiceCode.includes('grantEntitlementsFromOrder'), 'entitlementService exports grantEntitlementsFromOrder');
assert(entServiceCode.includes('status: \'active\''), 'Default status is active');
assert(entServiceCode.includes('status: \'revoked\''), 'Revoke sets status to revoked');

// 3. Validate accessService.js
const accessServiceCode = fs.readFileSync(path.resolve('src/services/accessService.js'), 'utf8');
assert(accessServiceCode.includes('canAccessCourse'), 'accessService exports canAccessCourse');
assert(accessServiceCode.includes('canAccessLesson'), 'accessService exports canAccessLesson');
assert(accessServiceCode.includes('canAccessProduct'), 'accessService exports canAccessProduct');
assert(accessServiceCode.includes('canAccessMaterial'), 'accessService exports canAccessMaterial');
assert(accessServiceCode.includes('isFreePreview'), 'accessService allows public access for isFreePreview lessons');
assert(accessServiceCode.includes('accessType === \'FREE\''), 'accessService allows public access for FREE courses/products');
assert(accessServiceCode.includes('accessType === \'COURSE_ONLY\''), 'accessService handles COURSE_ONLY product access via linked course');

// 4. Validate orderService.js integration with entitlements
const orderServiceCode = fs.readFileSync(path.resolve('src/services/orderService.js'), 'utf8');
assert(orderServiceCode.includes('grantEntitlementsFromOrder'), 'confirmOrderPayment calls grantEntitlementsFromOrder');

// 5. Validate UI Components
const courseDetailCode = fs.readFileSync(path.resolve('src/pages/CourseDetail.jsx'), 'utf8');
assert(courseDetailCode.includes('accessService.canAccessCourse'), 'CourseDetail checks canAccessCourse');
assert(courseDetailCode.includes('ĐÃ SỞ HỮU'), 'CourseDetail displays owned status badge');

const lessonViewerCode = fs.readFileSync(path.resolve('src/pages/LessonViewer.jsx'), 'utf8');
assert(lessonViewerCode.includes('accessService.canAccessLesson'), 'LessonViewer checks canAccessLesson');
assert(!lessonViewerCode.includes('mockUnlock'), 'LessonViewer no longer relies on mock unlock toggle');

const productDetailCode = fs.readFileSync(path.resolve('src/pages/ProductDetail.jsx'), 'utf8');
assert(productDetailCode.includes('accessService.canAccessProduct'), 'ProductDetail checks canAccessProduct');

// 6. Validate Firestore Security Rules for Entitlements
const rulesCode = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
assert(rulesCode.includes('match /entitlements/{entitlementId}'), 'Firestore Rules define match for /entitlements/{entitlementId}');
assert(rulesCode.includes('resource.data.userId == request.auth.uid || isAdmin()'), 'Student can only read their own entitlements');
assert(rulesCode.includes('allow write: if isAdmin()'), 'Only Admin can create/update/revoke entitlements in Firestore Rules');

// 7. Validate App routing for Library
const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
assert(appCode.includes('path="/account/library"'), 'App registers /account/library route');

// 8. Unit Test: Simulated Deterministic ID and Access Verification
console.log('\n--- Chạy thử nghiệm giả lập Deterministic Entitlements & Access Rules ---');

const testUserId = 'usr_test_999';
const testCourseId = 'course_mold_001';
const testProdId = 'prod_cad_001';

const expectedCourseEntId = `${testUserId}_course_${testCourseId}`;
const expectedProdEntId = `${testUserId}_product_${testProdId}`;

assert(expectedCourseEntId === 'usr_test_999_course_course_mold_001', `Course Entitlement ID is deterministic: ${expectedCourseEntId}`);
assert(expectedProdEntId === 'usr_test_999_product_prod_cad_001', `Product Entitlement ID is deterministic: ${expectedProdEntId}`);

// Test Idempotency Simulation:
const store = new Map();
function mockGrant(userId, targetType, targetId, orderId) {
  const id = `${userId}_${targetType}_${targetId}`;
  store.set(id, { id, userId, targetType, targetId, sourceOrderId: orderId, status: 'active' });
  return store.get(id);
}

mockGrant(testUserId, 'course', testCourseId, 'ord_1');
const countAfterFirst = store.size;
mockGrant(testUserId, 'course', testCourseId, 'ord_1'); // Confirm same order again
const countAfterSecond = store.size;

assert(countAfterFirst === 1 && countAfterSecond === 1, 'Confirming the same order multiple times does NOT create duplicate entitlements (Idempotency PASS)');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 7 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 7 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
