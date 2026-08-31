/**
 * Phase 18A Validation Script
 * MechanicalBKA — Software Support & EngineeringPaper Partnership Landing Page
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let passCount = 0;
let totalCount = 0;

function check(label, condition) {
  totalCount++;
  if (condition) {
    console.log(`  ✅ ${label}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
  }
}

console.log('\n📄 Phase 18A Validation — Software Support / EngineeringPaper Landing Page\n');

// 1. Homepage Positioning & Independent Project Identity
console.log('--- 1. Homepage Positioning & Independent Identity ---');
const homeJsxPath = path.join(ROOT_DIR, 'src', 'pages', 'Home.jsx');
const homeJsxCode = fs.readFileSync(homeJsxPath, 'utf8');

check('Home.jsx contains "MECHANICALBKA" headline', homeJsxCode.includes('MECHANICALBKA'));
check('Home.jsx identifies as independent technical project', homeJsxCode.includes('dự án độc lập') || homeJsxCode.includes('INDEPENDENT_PROJECT'));
check('Home.jsx highlights Engineering Paper (.epxyz)', homeJsxCode.includes('Engineering Paper (.epxyz)') || homeJsxCode.includes('Engineering Paper XYZ'));
check('Zero promotional Excel wording on Homepage', !/file excel|bảng tính excel|excel calculator|công cụ excel/i.test(homeJsxCode));

// 2. Software Support / Educational License Section
console.log('\n--- 2. Software Support Section (#software-support) ---');
check('Section #software-support exists in Home.jsx', homeJsxCode.includes('id="software-support"'));
check('Contains "SOFTWARE SUPPORT / EDUCATIONAL LICENSE" eyebrow', homeJsxCode.includes('SOFTWARE SUPPORT / EDUCATIONAL LICENSE'));
check('Contains "Hỗ trợ phần mềm cho dự án kỹ thuật độc lập" heading', homeJsxCode.includes('Hỗ trợ phần mềm cho dự án kỹ thuật độc lập'));
check('Mentions EngineeringPaper.pro', homeJsxCode.includes('EngineeringPaper.pro'));
check('Mentions "Complimentary Educational / Project License"', homeJsxCode.includes('Complimentary Educational / Project License'));
check('Contains 5 specified usage purposes', 
  homeJsxCode.includes('Phát triển các mẫu tính toán kỹ thuật cơ khí') &&
  homeJsxCode.includes('Xây dựng tài liệu Engineering Paper phục vụ học tập') &&
  homeJsxCode.includes('Trình bày quá trình tính toán rõ ràng') &&
  homeJsxCode.includes('Phát triển kho tài nguyên kỹ thuật cho cộng đồng') &&
  homeJsxCode.includes('Giới thiệu các workflow tính toán hiện đại')
);

// 3. Why EngineeringPaper Subsection
console.log('\n--- 3. Why EngineeringPaper Subsection ---');
check('Contains "WHY ENGINEERINGPAPER?" subsection', homeJsxCode.includes('WHY ENGINEERINGPAPER?'));
check('Card 01: ENGINEERING EDUCATION', homeJsxCode.includes('ENGINEERING EDUCATION'));
check('Card 02: TECHNICAL CONTENT', homeJsxCode.includes('TECHNICAL CONTENT'));
check('Card 03: COMMUNITY SHARING', homeJsxCode.includes('COMMUNITY SHARING'));

// 4. Transparent Project Status & Disclaimer
console.log('\n--- 4. Transparent Project Status & Disclaimer ---');
check('Contains "INDEPENDENT PROJECT" badge', homeJsxCode.includes('INDEPENDENT PROJECT'));
check('Contains Vietnamese independent disclaimer', homeJsxCode.includes('MechanicalBKA là dự án độc lập và hiện không trực thuộc, không được tài trợ hoặc chứng nhận chính thức bởi EngineeringPaper LLC.'));
check('Contains English independent disclaimer', homeJsxCode.includes('MechanicalBKA is an independent project and is not affiliated with, sponsored by, or officially endorsed by EngineeringPaper LLC.'));

// 5. Software Support Actions & Mailto
console.log('\n--- 5. Software Support Actions & Mailto ---');
check('Contains mailto link for support inquiry', homeJsxCode.includes('mailto:'));
check('Contains CTA to /store?type=EPXYZ_FILE', homeJsxCode.includes('/store?type=EPXYZ_FILE'));

// 6. Coffee Support & QR Integrity (Preserved)
console.log('\n--- 6. Coffee Support Section (Preserved) ---');
check('Coffee support section (#support-coffee) exists', homeJsxCode.includes('id="support-coffee"'));
check('Account owner is "NGUYỄN NGỌC TRONG"', homeJsxCode.includes('NGUYỄN NGỌC TRONG'));
check('Bank is "ViettelPay (MB Bank)"', homeJsxCode.includes('ViettelPay (MB Bank)'));
check('Account number is "9704 2292 0140 3709 105"', homeJsxCode.includes('9704 2292 0140 3709 105') || homeJsxCode.includes('9704229201403709105'));
const qrPath = path.join(ROOT_DIR, 'public', 'assets', 'vietqr_viettelpay.png');
check('VietQR image file exists and is non-empty', fs.existsSync(qrPath) && fs.statSync(qrPath).size > 10000);

// 7. Header & Navigation Fix
console.log('\n--- 7. Header & Navigation Fix ---');
const headerJsxPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Header.jsx');
const headerJsxCode = fs.readFileSync(headerJsxPath, 'utf8');
check('Header.jsx wraps logo in .header-logo-wrap', headerJsxCode.includes('header-logo-wrap'));
check('Header.jsx wraps navigation in .header-navigation', headerJsxCode.includes('header-navigation'));

const headerCssPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Header.css');
const headerCssCode = fs.readFileSync(headerCssPath, 'utf8');
check('Header.css gives flex-shrink: 0 to logo wrap', headerCssCode.includes('header-logo-wrap') && headerCssCode.includes('flex-shrink: 0'));

const navCssPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Navigation.css');
const navCssCode = fs.readFileSync(navCssPath, 'utf8');
check('Navigation.css has responsive gap rules for 1200px and 1024px', navCssCode.includes('@media (max-width: 1200px)') && navCssCode.includes('@media (max-width: 1024px)'));

// 8. SEO Metadata
console.log('\n--- 8. SEO Metadata ---');
const indexPath = path.join(ROOT_DIR, 'index.html');
const indexCode = fs.readFileSync(indexPath, 'utf8');
check('index.html title matches "MechanicalBKA — Tài liệu & Công cụ Kỹ thuật Cơ khí"', indexCode.includes('<title>MechanicalBKA — Tài liệu & Công cụ Kỹ thuật Cơ khí</title>'));
check('index.html description matches independent project summary', indexCode.includes('MechanicalBKA là dự án độc lập đang xây dựng kho tài liệu, đồ án, CAD và Engineering Paper'));

const appJsxPath = path.join(ROOT_DIR, 'src', 'App.jsx');
const appJsxCode = fs.readFileSync(appJsxPath, 'utf8');
check('App.jsx dynamic title matches "MechanicalBKA — Tài liệu & Công cụ Kỹ thuật Cơ khí"', appJsxCode.includes("MechanicalBKA — Tài liệu & Công cụ Kỹ thuật Cơ khí"));

// 9. Code Integrity & Security
console.log('\n--- 9. Code Integrity & Security ---');
function scanDirForForbidden(dir) {
  let hasForbidden = false;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['node_modules', 'dist', '.git', '.venv'].includes(f.name)) {
      if (scanDirForForbidden(full)) hasForbidden = true;
    } else if (f.isFile() && (f.name.endsWith('.js') || f.name.endsWith('.jsx'))) {
      const code = fs.readFileSync(full, 'utf8');
      if (/\beval\s*\(/.test(code) || /\bexec\s*\(/.test(code)) {
        hasForbidden = true;
        console.error(`  Forbidden eval/exec in: ${full}`);
      }
    }
  }
  return hasForbidden;
}
check('Zero forbidden eval() or exec() in src code', !scanDirForForbidden(path.join(ROOT_DIR, 'src')));

// Summary
console.log(`\n📊 Phase 18A: ${passCount}/${totalCount} checks passed\n`);

if (passCount === totalCount) {
  console.log('✅ Phase 18A validation PASSED\n');
  process.exit(0);
} else {
  console.error('❌ Phase 18A validation FAILED\n');
  process.exit(1);
}
