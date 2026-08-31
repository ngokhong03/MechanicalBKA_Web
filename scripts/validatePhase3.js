import fs from 'fs';
import path from 'path';

console.log('=====================================================');
console.log('   MECHANICALBKA — PHASE 3 VALIDATION SCRIPT         ');
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

// 1. Check required Phase 3 files
const requiredFiles = [
  'firestore.rules',
  'src/firebase/config.js',
  'src/services/dataProvider.js',
  'scripts/seedFirestore.js',
  'src/mock/data.js',
  'src/mock/syncedVideos.json'
];

requiredFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Parse Mock Data
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
const syncedVideos = JSON.parse(fs.readFileSync(path.resolve('src/mock/syncedVideos.json'), 'utf8'));

// 3. Check entity counts
assert(specialties.length === 4, `Specialties count = ${specialties.length} (4 expected)`);
assert(software.length === 4, `Software count = ${software.length} (4 expected)`);
assert(courses.length >= 6, `Courses count = ${courses.length} (>= 6 expected)`);
assert(lessons.length >= 24, `Lessons count = ${lessons.length} (>= 24 expected)`);
assert(products.length >= 8, `Products count = ${products.length} (>= 8 expected)`);
assert(syncedVideos.length === 30, `Videos count = ${syncedVideos.length} (30 expected)`);

// 4. Check duplicate IDs
function checkDuplicates(arr, name) {
  const localSet = new Set();
  let dups = 0;
  arr.forEach(item => {
    if (localSet.has(item.id)) {
      console.error(`Duplicate ID in ${name}: ${item.id}`);
      dups++;
    }
    localSet.add(item.id);
  });
  assert(dups === 0, `No duplicate IDs in collection [${name}]`);
}

checkDuplicates(specialties, 'specialties');
checkDuplicates(software, 'software');
checkDuplicates(courses, 'courses');
checkDuplicates(lessons, 'lessons');
checkDuplicates(products, 'products');
checkDuplicates(syncedVideos, 'videos');

// 5. Check foreign keys
const specIdSet = new Set(specialties.map(s => s.id));
const softIdSet = new Set(software.map(s => s.id));
const courseIdSet = new Set(courses.map(c => c.id));
const prodIdSet = new Set(products.map(p => p.id));
const lessonIdSet = new Set(lessons.map(l => l.id));

let fkErrors = 0;

// Courses
courses.forEach(c => {
  (c.specialtyIds || []).forEach(id => {
    if (!specIdSet.has(id)) {
      console.error(`Course ${c.id} has invalid specialtyId: ${id}`);
      fkErrors++;
    }
  });
  (c.softwareIds || []).forEach(id => {
    if (!softIdSet.has(id)) {
      console.error(`Course ${c.id} has invalid softwareId: ${id}`);
      fkErrors++;
    }
  });
});

// Lessons
lessons.forEach(l => {
  if (!courseIdSet.has(l.courseId)) {
    console.error(`Lesson ${l.id} has non-existent courseId: ${l.courseId}`);
    fkErrors++;
  }
  (l.materialIds || []).forEach(mid => {
    if (!prodIdSet.has(mid)) {
      console.error(`Lesson ${l.id} has non-existent materialId: ${mid}`);
      fkErrors++;
    }
  });
});

// Products
products.forEach(p => {
  (p.specialtyIds || []).forEach(id => {
    if (!specIdSet.has(id)) {
      console.error(`Product ${p.id} has invalid specialtyId: ${id}`);
      fkErrors++;
    }
  });
  (p.softwareIds || []).forEach(id => {
    if (!softIdSet.has(id)) {
      console.error(`Product ${p.id} has invalid softwareId: ${id}`);
      fkErrors++;
    }
  });
});

assert(fkErrors === 0, `All foreign keys (specialtyIds, softwareIds, courseId, materialIds) are valid`);

// 6. Check Product Files subcollection
let fileErrors = 0;
let totalFiles = 0;
products.forEach(p => {
  (p.files || []).forEach(f => {
    totalFiles++;
    if (f.productId !== p.id) {
      console.error(`File ${f.id} has mismatched productId: ${f.productId} (expected ${p.id})`);
      fileErrors++;
    }
    if (!f.checksum || f.checksum.length !== 64 || !/^[0-9a-f]{64}$/i.test(f.checksum)) {
      console.error(`File ${f.id} has invalid SHA-256 checksum: ${f.checksum}`);
      fileErrors++;
    }
  });
});

assert(fileErrors === 0, `All Product Files subcollection records and checksums are valid (total: ${totalFiles})`);

// 7. Check Required Fields & Schema types
let schemaErrors = 0;
const validAccessTypes = new Set(['FREE', 'PAID', 'COURSE_ONLY']);
const validProductTypes = new Set(['CAD', 'PDF', 'ZIP', 'PROJECT', 'CAD_PROJECT', 'CALCULATION', 'DRAWING', 'TEMPLATE', 'TOOL', 'DOCUMENT', 'OTHER']);

courses.forEach(c => {
  if (!c.id || !c.title || !c.slug || !c.description || !validAccessTypes.has(c.accessType)) {
    console.error(`Course ${c.id} missing required schema fields`);
    schemaErrors++;
  }
});

products.forEach(p => {
  if (!p.id || !p.title || !p.slug || !p.description || !validAccessTypes.has(p.accessType) || !validProductTypes.has(p.productType)) {
    console.error(`Product ${p.id} missing required schema fields`);
    schemaErrors++;
  }
});

lessons.forEach(l => {
  if (!l.id || !l.courseId || !l.title || !l.slug || l.order === undefined) {
    console.error(`Lesson ${l.id} missing required schema fields`);
    schemaErrors++;
  }
});

assert(schemaErrors === 0, `All schema required fields and enum values are valid`);

// 8. Check Firestore Security Rules text
const rulesContent = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
assert(rulesContent.includes('request.auth.token.admin == true'), 'Firestore Rules verify Admin via Auth Custom Claims { admin: true }');
assert(!rulesContent.includes('users/{uid}.role'), 'Firestore Rules do not use users/{uid}.role for Admin authorization');
assert(rulesContent.includes('request.resource.data.role == resource.data.role'), 'Firestore Rules prevent Student role escalation');
assert(rulesContent.includes('match /entitlements/{entitlementId}'), 'Firestore Rules cover entitlements collection');

// 9. Check Data Provider Abstraction
const dataProviderContent = fs.readFileSync(path.resolve('src/services/dataProvider.js'), 'utf8');
assert(dataProviderContent.includes('isFirebaseEnabled'), 'DataProvider respects isFirebaseEnabled switch');
assert(dataProviderContent.includes('mockSpecialties'), 'DataProvider has fallback to Mock Data');

console.log('\n=====================================================');
if (errorCount === 0) {
  console.log('🎉 PHASE 3 VALIDATION COMPLETED: 100% PASS (0 ERRORS)');
} else {
  console.error(`❌ PHASE 3 VALIDATION FAILED WITH ${errorCount} ERRORS`);
  process.exit(1);
}
console.log('=====================================================\n');
