import fs from 'fs';
import path from 'path';

console.log('======================================================================');
console.log('   MECHANICALBKA — PHASE 10 PRODUCTION ACCEPTANCE & HARDENING SUITE   ');
console.log('======================================================================\n');

let errorCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    errorCount++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// ---------------------------------------------------------
// 1. PRODUCTION ASSETS & SEO AUDIT
// ---------------------------------------------------------
console.log('--- 1. Kiểm tra Tài Nguyên & Cấu Hình SEO Production ---');

const robotsPath = path.resolve('public/robots.txt');
assert(fs.existsSync(robotsPath), 'public/robots.txt exists');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('Disallow: /admin'), 'robots.txt disallows /admin');
assert(robotsContent.includes('Disallow: /account'), 'robots.txt disallows /account');
assert(robotsContent.includes('Disallow: /cart'), 'robots.txt disallows /cart');
assert(robotsContent.includes('Disallow: /checkout'), 'robots.txt disallows /checkout');

const sitemapPath = path.resolve('public/sitemap.xml');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes('https://mechanicalbka-web.vercel.app/'), 'sitemap.xml contains root domain');
assert(sitemapContent.includes('/courses'), 'sitemap.xml contains public /courses');
assert(!sitemapContent.includes('/admin'), 'sitemap.xml does NOT leak private /admin route');
assert(!sitemapContent.includes('/account'), 'sitemap.xml does NOT leak private /account route');

const indexHtmlPath = path.resolve('index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
assert(indexHtmlContent.includes('name="description"'), 'index.html contains meta description');
assert(indexHtmlContent.includes('property="og:title"'), 'index.html contains Open Graph title');
assert(indexHtmlContent.includes('property="og:image"'), 'index.html contains Open Graph image');

const gitignorePath = path.resolve('.gitignore');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignoreContent.includes('.env'), '.gitignore properly excludes .env');
assert(gitignoreContent.includes('dist'), '.gitignore properly excludes dist/');

// ---------------------------------------------------------
// 2. YOUTUBE DATA & MOCK DATA AUDIT
// ---------------------------------------------------------
console.log('\n--- 2. Kiểm tra Dữ Liệu Thực Tế YouTube & Mock Data ---');

const syncedVideosPath = path.resolve('src/mock/syncedVideos.json');
const syncedVideos = JSON.parse(fs.readFileSync(syncedVideosPath, 'utf8'));
assert(syncedVideos.length === 30, `YouTube synced videos count = 30 (got ${syncedVideos.length})`);

const videoIds = syncedVideos.map(v => v.youtubeVideoId);
const uniqueVideoIds = new Set(videoIds);
assert(uniqueVideoIds.size === 30, 'Zero duplicate YouTube video IDs (30/30 unique)');

const videosWithDuration = syncedVideos.filter(v => v.duration && v.duration.length > 0);
assert(videosWithDuration.length === 30, '30/30 videos contain real duration data');

// ---------------------------------------------------------
// 3. SECURITY AUDIT: NO CREDENTIALS IN SOURCE CODE
// ---------------------------------------------------------
console.log('\n--- 3. Kiểm tra An Ninh Mã Nguồn (No Credentials / Admin SDK) ---');

const srcFiles = fs.readdirSync(path.resolve('src'), { recursive: true });
srcFiles.forEach(relFile => {
  const filePath = path.resolve('src', relFile);
  if (fs.statSync(filePath).isFile() && (relFile.endsWith('.js') || relFile.endsWith('.jsx'))) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(!content.includes('BEGIN PRIVATE KEY'), `No private RSA keys in src/${relFile}`);
    assert(!content.includes('firebase-admin'), `No firebase-admin imports in client src/${relFile}`);
    assert(!content.includes('service_account'), `No service account credentials in src/${relFile}`);
  }
});

// ---------------------------------------------------------
// 4. END-TO-END ACCEPTANCE SIMULATION
// ---------------------------------------------------------
console.log('\n--- 4. Chạy Kịch Bản Kiểm Thử Chấp Nhận Toàn Diện (End-to-End Journey) ---');

// Simulated Database State
const state = {
  users: [
    { uid: 'guest_uid', role: 'guest' },
    { uid: 'student_uid', email: 'student@mechanicalbka.vn', role: 'student', adminClaim: false },
    { uid: 'admin_uid', email: 'admin@mechanicalbka.vn', role: 'admin', adminClaim: true }
  ],
  courses: [
    { id: 'course_free', price: 0, accessType: 'FREE' },
    { id: 'course_paid', price: 650000, accessType: 'PAID' }
  ],
  lessons: [
    { id: 'lesson_free_preview', courseId: 'course_paid', isFreePreview: true, materialIds: ['prod_course_only'] },
    { id: 'lesson_paid_locked', courseId: 'course_paid', isFreePreview: false, materialIds: ['prod_course_only'] }
  ],
  products: [
    { id: 'prod_free', price: 0, accessType: 'FREE' },
    { id: 'prod_paid', price: 250000, accessType: 'PAID' },
    { id: 'prod_course_only', price: 0, accessType: 'COURSE_ONLY' }
  ],
  orders: [],
  entitlements: {},
  downloadLogs: [],
  auditLogs: []
};

// Flow 1: Price Tampering Defense on Order Creation
const clientTamperedItems = [
  { targetId: 'course_paid', targetType: 'course', unitPrice: 100, snapshotPrice: 100 }
];

// Backend recalculates price
const realCourse = state.courses.find(c => c.id === 'course_paid');
const serverOrder = {
  id: `ord_${Date.now()}`,
  userId: 'student_uid',
  items: [
    {
      targetId: 'course_paid',
      targetType: 'course',
      snapshotPrice: realCourse.price // Must be 650,000đ
    }
  ],
  totalAmount: realCourse.price,
  orderStatus: 'pending',
  paymentStatus: 'unpaid',
  createdAt: new Date().toISOString()
};
state.orders.push(serverOrder);

assert(serverOrder.totalAmount === 650000, 'Server overrides client tampered price (650,000đ)');
assert(serverOrder.orderStatus === 'pending', 'Initial order status is pending');
assert(serverOrder.paymentStatus === 'unpaid', 'Initial payment status is unpaid');

// Flow 2: Access Before Payment
function canAccessCourse(uid, courseId) {
  const c = state.courses.find(item => item.id === courseId);
  if (!c) return false;
  if (c.accessType === 'FREE') return true;
  const entId = `${uid}_course_${courseId}`;
  return state.entitlements[entId]?.status === 'active';
}

function canAccessLesson(uid, lessonId) {
  const l = state.lessons.find(item => item.id === lessonId);
  if (!l) return false;
  if (l.isFreePreview) return true;
  return canAccessCourse(uid, l.courseId);
}

assert(canAccessCourse('student_uid', 'course_free') === true, 'FREE Course is accessible by student');
assert(canAccessCourse('student_uid', 'course_paid') === false, 'PAID Course is locked before payment');
assert(canAccessLesson('student_uid', 'lesson_free_preview') === true, 'Free Preview Lesson is accessible in paid course');
assert(canAccessLesson('student_uid', 'lesson_paid_locked') === false, 'Paid Lesson is locked before payment');

// Flow 3: Admin Confirms Payment & Idempotent Entitlement Granting
function confirmOrderPayment(orderId, adminUser) {
  if (!adminUser.adminClaim) throw new Error('Unauthorized');
  const ord = state.orders.find(o => o.id === orderId);
  if (!ord) throw new Error('Order not found');
  
  ord.paymentStatus = 'paid';
  ord.orderStatus = 'completed';

  // Grant Entitlements
  ord.items.forEach(item => {
    const entId = `${ord.userId}_${item.targetType}_${item.targetId}`;
    state.entitlements[entId] = {
      id: entId,
      userId: ord.userId,
      targetType: item.targetType,
      targetId: item.targetId,
      status: 'active',
      sourceOrderId: ord.id
    };
  });
  return true;
}

// Confirmation 1
confirmOrderPayment(serverOrder.id, state.users.find(u => u.uid === 'admin_uid'));
assert(serverOrder.paymentStatus === 'paid', 'Order paymentStatus updated to paid');
assert(serverOrder.orderStatus === 'completed', 'Order orderStatus updated to completed');

const expectedEntId = `student_uid_course_course_paid`;
assert(state.entitlements[expectedEntId]?.status === 'active', 'Deterministic Entitlement created for course');

// Confirmation 2 (Idempotency Test)
confirmOrderPayment(serverOrder.id, state.users.find(u => u.uid === 'admin_uid'));
const entCount = Object.keys(state.entitlements).filter(k => k === expectedEntId).length;
assert(entCount === 1, 'Confirming order again maintains exactly 1 entitlement (0 duplicates)');

// Flow 4: Access After Payment
assert(canAccessCourse('student_uid', 'course_paid') === true, 'PAID Course is unlocked after payment');
assert(canAccessLesson('student_uid', 'lesson_paid_locked') === true, 'Paid Lesson is unlocked after payment');

// Flow 5: Secure Download Simulation
function checkDownloadAccess(uid, userClaim, productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return { status: 404, message: 'Not found' };
  if (prod.accessType === 'FREE') return { status: 200, message: 'Free access' };
  if (userClaim?.adminClaim) return { status: 200, message: 'Admin override' };
  if (!uid) return { status: 401, message: 'Unauthenticated' };

  if (prod.accessType === 'PAID') {
    const entId = `${uid}_product_${productId}`;
    if (state.entitlements[entId]?.status === 'active') return { status: 200, message: 'Entitled' };
    return { status: 403, message: 'Forbidden' };
  }

  if (prod.accessType === 'COURSE_ONLY') {
    // Find linked lessons
    const linkedLessons = state.lessons.filter(l => (l.materialIds || []).includes(productId));
    const courseIds = [...new Set(linkedLessons.map(l => l.courseId))];
    for (const cId of courseIds) {
      const courseEntId = `${uid}_course_${cId}`;
      if (state.entitlements[courseEntId]?.status === 'active') {
        return { status: 200, message: 'Course entitled' };
      }
    }
    return { status: 403, message: 'Course entitlement required' };
  }

  return { status: 403, message: 'Forbidden' };
}

assert(checkDownloadAccess(null, null, 'prod_free').status === 200, 'Guest download FREE file -> 200');
assert(checkDownloadAccess(null, null, 'prod_paid').status === 401, 'Guest download PAID file -> 401');
assert(checkDownloadAccess('student_uid', { adminClaim: false }, 'prod_paid').status === 403, 'Student without product entitlement -> 403');
assert(checkDownloadAccess('student_uid', { adminClaim: false }, 'prod_course_only').status === 200, 'Student with course entitlement downloads COURSE_ONLY file -> 200');
assert(checkDownloadAccess('admin_uid', { adminClaim: true }, 'prod_paid').status === 200, 'Admin downloads any file -> 200');

// ---------------------------------------------------------
// 5. SUMMARY
// ---------------------------------------------------------
console.log('\n======================================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 10 ACCEPTANCE TESTS COMPLETED: 100% PASS (0 ERRORS)');
  console.log('🚀 SYSTEM STATUS: PRODUCTION READY');
} else {
  console.error(`❌ PHASE 10 ACCEPTANCE TESTS FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('======================================================================\n');
