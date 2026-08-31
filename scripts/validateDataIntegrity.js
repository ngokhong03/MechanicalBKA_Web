import fs from 'fs';
import path from 'path';

// Read data files
const dataJsPath = path.resolve('src/mock/data.js');
const syncedVideosPath = path.resolve('src/mock/syncedVideos.json');

const syncedVideos = JSON.parse(fs.readFileSync(syncedVideosPath, 'utf8'));

// Extract exports from data.js
const dataContent = fs.readFileSync(dataJsPath, 'utf8');

function extractExport(name) {
  const regex = new RegExp(`export const ${name} = ([\\s\\S]*?);\\n\\nexport const`);
  const match = dataContent.match(regex);
  if (match) {
    return JSON.parse(match[1]);
  }
  // If last export before videos
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
const videos = syncedVideos;

console.log('=== DATA INTEGRITY VALIDATION SCRIPT ===\n');

let errorCount = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    errorCount++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Check entity counts
assert(specialties.length === 4, `Specialties count = ${specialties.length} (expected 4)`);
assert(software.length === 4, `Software count = ${software.length} (expected 4)`);
assert(courses.length >= 6, `Courses count = ${courses.length} (expected >= 6)`);
assert(lessons.length >= 24, `Lessons count = ${lessons.length} (expected >= 24)`);
assert(products.length >= 8, `Products count = ${products.length} (expected >= 8)`);
assert(videos.length === 30, `Videos count = ${videos.length} (expected 30)`);

// 2. Check duplicate IDs
const allIds = new Set();
function checkDuplicates(arr, name) {
  const localSet = new Set();
  let dups = 0;
  arr.forEach(item => {
    if (localSet.has(item.id)) {
      console.error(`Duplicate ID in ${name}: ${item.id}`);
      dups++;
    }
    localSet.add(item.id);
    allIds.add(item.id);
  });
  assert(dups === 0, `No duplicate IDs in ${name}`);
}

checkDuplicates(specialties, 'specialties');
checkDuplicates(software, 'software');
checkDuplicates(courses, 'courses');
checkDuplicates(lessons, 'lessons');
checkDuplicates(products, 'products');
checkDuplicates(videos, 'videos');

// 3. Check YouTube Video IDs in videos
const videoIdSet = new Set();
let videoDups = 0;
videos.forEach(v => {
  if (videoIdSet.has(v.youtubeVideoId)) videoDups++;
  videoIdSet.add(v.youtubeVideoId);
});
assert(videoDups === 0, `No duplicate youtubeVideoId in videos (0 dups)`);

// 4. Foreign Key validations
const specIdSet = new Set(specialties.map(s => s.id));
const softIdSet = new Set(software.map(s => s.id));
const courseIdSet = new Set(courses.map(c => c.id));
const prodIdSet = new Set(products.map(p => p.id));
const lessonIdSet = new Set(lessons.map(l => l.id));

// Courses Foreign Keys
let courseSpecErrors = 0;
let courseSoftErrors = 0;
courses.forEach(c => {
  c.specialtyIds.forEach(id => {
    if (!specIdSet.has(id)) courseSpecErrors++;
  });
  c.softwareIds.forEach(id => {
    if (!softIdSet.has(id)) courseSoftErrors++;
  });
});
assert(courseSpecErrors === 0, `All course.specialtyIds are valid`);
assert(courseSoftErrors === 0, `All course.softwareIds are valid`);

// Lessons Foreign Keys
let lessonCourseErrors = 0;
let lessonMaterialErrors = 0;
lessons.forEach(l => {
  if (!courseIdSet.has(l.courseId)) lessonCourseErrors++;
  (l.materialIds || []).forEach(mid => {
    if (!prodIdSet.has(mid)) lessonMaterialErrors++;
  });
});
assert(lessonCourseErrors === 0, `All lesson.courseId reference existing courses`);
assert(lessonMaterialErrors === 0, `All lesson.materialIds reference existing products`);

// Products Foreign Keys & Files
let prodSpecErrors = 0;
let prodSoftErrors = 0;
let prodFileErrors = 0;
let totalFiles = 0;
const validAccessTypes = new Set(['FREE', 'PAID', 'COURSE_ONLY']);
const validProductTypes = new Set(['CAD', 'PDF', 'ZIP']);
const validFileTypes = new Set(['CAD', 'PDF', 'ZIP']);

products.forEach(p => {
  p.specialtyIds.forEach(id => {
    if (!specIdSet.has(id)) prodSpecErrors++;
  });
  p.softwareIds.forEach(id => {
    if (!softIdSet.has(id)) prodSoftErrors++;
  });
  if (!validAccessTypes.has(p.accessType)) {
    console.error(`Invalid accessType in product ${p.id}: ${p.accessType}`);
    errorCount++;
  }
  if (!validProductTypes.has(p.productType)) {
    console.error(`Invalid productType in product ${p.id}: ${p.productType}`);
    errorCount++;
  }
  (p.files || []).forEach(f => {
    totalFiles++;
    if (f.productId !== p.id) prodFileErrors++;
    if (!validFileTypes.has(f.fileType)) {
      console.error(`Invalid fileType in file ${f.id}: ${f.fileType}`);
      errorCount++;
    }
    if (!f.checksum || f.checksum.length !== 64 || !/^[0-9a-f]{64}$/i.test(f.checksum)) {
      console.error(`Invalid 64-char hex checksum in file ${f.id}: ${f.checksum}`);
      errorCount++;
    }
  });
});

assert(prodSpecErrors === 0, `All product.specialtyIds are valid`);
assert(prodSoftErrors === 0, `All product.softwareIds are valid`);
assert(prodFileErrors === 0, `All file.productId match parent product.id`);
assert(totalFiles >= 8, `Total product files = ${totalFiles} (expected >= 8)`);

// Video <-> Lesson Link integrity
let linkedVideos = 0;
let unlinkedVideos = 0;
videos.forEach(v => {
  if (v.lessonId) {
    linkedVideos++;
    if (!lessonIdSet.has(v.lessonId)) {
      console.error(`Video ${v.id} references non-existent lesson ${v.lessonId}`);
      errorCount++;
    }
    if (!courseIdSet.has(v.courseId)) {
      console.error(`Video ${v.id} references non-existent course ${v.courseId}`);
      errorCount++;
    }
  } else {
    unlinkedVideos++;
  }
});
assert(linkedVideos === 29, `Exact 29 instructional videos linked to Lessons (got ${linkedVideos})`);
assert(unlinkedVideos === 1, `Exact 1 general/intro video unlinked (got ${unlinkedVideos})`);

console.log('\n========================================');
if (errorCount === 0) {
  console.log('🎉 ALL INTEGRITY CHECKS PASSED PERFECTLY (0 ERRORS)');
} else {
  console.error(`❌ FAILED WITH ${errorCount} ERRORS!`);
  process.exit(1);
}
console.log('========================================\n');
