/**
 * MechanicalBKA — Phase 13 Validation Script
 * Validates all Phase 13 requirements.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

let passed = 0;
let failed = 0;
const results = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    results.push(`  ✅ PASS: ${name}`);
  } else {
    failed++;
    results.push(`  ❌ FAIL: ${name}${detail ? ' — ' + detail : ''}`);
  }
}

function readFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  MechanicalBKA — Phase 13 Validation                   ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// 1. Home.jsx uses dataProvider (not direct mock import)
const homeContent = readFile('src/pages/Home.jsx');
check(
  '1. Home.jsx imports dataProvider',
  homeContent && homeContent.includes("from '../services/dataProvider'"),
  'Missing dataProvider import'
);
check(
  '2. Home.jsx does NOT directly import mock/data.js',
  homeContent && !homeContent.includes("from '../mock/data"),
  'Direct mock import found'
);
check(
  '3. Home.jsx has loading state',
  homeContent && homeContent.includes('useState(true)') && homeContent.includes('setLoading'),
  'Missing loading state'
);

// 4. No "học liệu" in key non-course pages
const filesToCheckWording = [
  'src/pages/Store.jsx',
  'src/pages/ProductDetail.jsx',
  'src/components/layout/Header.jsx',
  'src/pages/admin/AdminProducts.jsx',
  'src/pages/Cart.jsx',
  'src/pages/Search.jsx',
  'src/pages/Account.jsx',
  'src/components/layout/Footer.jsx',
  'src/pages/admin/AdminLayout.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/pages/OrderHistory.jsx',
];
let wordingIssues = [];
for (const f of filesToCheckWording) {
  const content = readFile(f);
  if (content && content.includes('học liệu')) {
    wordingIssues.push(f);
  }
}
check(
  '4. No "học liệu" in non-course page UI labels',
  wordingIssues.length === 0,
  `Found in: ${wordingIssues.join(', ')}`
);

// 5. index.html has <title> tag
const indexHtml = readFile('index.html');
check(
  '5. index.html has <title> tag',
  indexHtml && indexHtml.includes('<title>') && indexHtml.includes('MechanicalBKA'),
  'Missing <title> tag'
);

// 6. ProductDetail has explicit imports
const pdContent = readFile('src/pages/ProductDetail.jsx');
check(
  '6. ProductDetail imports React, useState, useEffect',
  pdContent &&
    pdContent.includes("import React") &&
    pdContent.includes("useState") &&
    pdContent.includes("useEffect"),
  'Missing React/hooks imports'
);
check(
  '7. ProductDetail imports useParams, Link',
  pdContent &&
    pdContent.includes("useParams") &&
    pdContent.includes("Link"),
  'Missing router imports'
);

// 8. ProductDetail renders highlights and includedFiles
check(
  '8. ProductDetail renders highlights[]',
  pdContent && pdContent.includes('product.highlights'),
  'Missing highlights rendering'
);
check(
  '9. ProductDetail renders includedFiles[]',
  pdContent && pdContent.includes('product.includedFiles'),
  'Missing includedFiles rendering'
);

// 10. ProductDetail has PRODUCT_TYPE_LABELS map
check(
  '10. ProductDetail has human-readable productType labels',
  pdContent && pdContent.includes('PRODUCT_TYPE_LABELS'),
  'Missing PRODUCT_TYPE_LABELS'
);

// 11. Projects reads specialty/software from URL
const projContent = readFile('src/pages/Projects.jsx');
check(
  '11. Projects syncs specialty from URL params',
  projContent && projContent.includes("searchParams.get('specialty')"),
  'Missing specialty URL param sync'
);
check(
  '12. Projects syncs software from URL params',
  projContent && projContent.includes("searchParams.get('software')"),
  'Missing software URL param sync'
);

// 13. Store has featured filter
const storeContent = readFile('src/pages/Store.jsx');
check(
  '13. Store has isFeaturedOnly filter',
  storeContent && storeContent.includes('isFeaturedOnly'),
  'Missing featured filter in Store'
);

// 14. Projects has featured filter
check(
  '14. Projects has isFeaturedOnly filter',
  projContent && projContent.includes('isFeaturedOnly'),
  'Missing featured filter in Projects'
);

// 15. App.jsx uses React.lazy + Suspense
const appContent = readFile('src/App.jsx');
check(
  '15. App.jsx uses React.lazy for admin routes',
  appContent && appContent.includes('lazy(') && appContent.includes('AdminLayout'),
  'Missing React.lazy'
);
check(
  '16. App.jsx imports Suspense',
  appContent && appContent.includes('Suspense'),
  'Missing Suspense import'
);

// 17. cors exists in functions/package.json
const funcPkg = readFile('functions/package.json');
check(
  '17. cors listed in functions/package.json dependencies',
  funcPkg && funcPkg.includes('"cors"'),
  'Missing cors dependency'
);

// 18. No storagePath exposure in frontend src (excluding mock data)
const allSrcFiles = [];
function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'mock') {
      walkDir(full);
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
      allSrcFiles.push(full);
    }
  }
}
walkDir(path.join(SRC, 'services'));
walkDir(path.join(SRC, 'pages'));
walkDir(path.join(SRC, 'components'));
let storagePathExposed = false;
for (const f of allSrcFiles) {
  const c = fs.readFileSync(f, 'utf-8');
  if (c.includes('storagePath') && !f.includes('mock') && !f.includes('adminService')) {
    storagePathExposed = true;
    break;
  }
}
check(
  '18. No storagePath exposure in frontend (excl. mock/admin)',
  !storagePathExposed,
  'storagePath found in client code'
);

// 19. App.jsx has all required routes
const requiredRoutes = ['/', '/projects', '/store', '/courses', '/videos', '/search', '/cart', '/checkout', '/admin', '/account', '/auth'];
let missingRoutes = requiredRoutes.filter(r => !appContent.includes(`path="${r}"`));
check(
  '19. App.jsx contains all required routes',
  missingRoutes.length === 0,
  `Missing: ${missingRoutes.join(', ')}`
);

// 20. dataProvider supports Mock/Firebase mode
const dpContent = readFile('src/services/dataProvider.js');
check(
  '20. dataProvider supports dual Mock/Firebase mode',
  dpContent && (dpContent.includes('isFirebaseEnabled') || dpContent.includes('VITE_USE_FIREBASE')),
  'Missing Firebase mode check'
);

// Print results
console.log('RESULTS:');
results.forEach(r => console.log(r));
console.log(`\n${'─'.repeat(56)}`);
console.log(`  TOTAL: ${passed + failed} checks | ✅ ${passed} passed | ❌ ${failed} failed`);
console.log(`${'─'.repeat(56)}`);

if (failed > 0) {
  console.log('\n⛔ PHASE 13 VALIDATION: FAIL\n');
  process.exit(1);
} else {
  console.log('\n🎉 PHASE 13 VALIDATION: ALL PASS\n');
  process.exit(0);
}
