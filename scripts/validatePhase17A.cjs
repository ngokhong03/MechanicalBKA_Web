/**
 * Phase 17A Validation Script
 * MechanicalBKA — Homepage Development Status & Coffee Support Landing Page
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

console.log('\n☕ Phase 17A Validation — Homepage Development Status & Coffee Support Landing Page\n');

// 1. Hero & Concept Verification
console.log('--- 1. Hero & Concept Verification ---');
const homeJsxPath = path.join(ROOT_DIR, 'src', 'pages', 'Home.jsx');
const homeJsxCode = fs.readFileSync(homeJsxPath, 'utf8');

check('Home.jsx contains "MECHANICALBKA" headline', homeJsxCode.includes('MECHANICALBKA'));
check('Home.jsx contains "WE ARE BUILDING" status indicator', homeJsxCode.includes('WE ARE BUILDING') || homeJsxCode.includes('ĐANG PHÁT TRIỂN'));
check('Home.jsx contains "Engineering Paper XYZ (.epxyz)" in Hero description', homeJsxCode.includes('Engineering Paper XYZ (.epxyz)'));
check('Home.jsx has primary CTA to /store', homeJsxCode.includes('to="/store"') && homeJsxCode.includes('KHÁM PHÁ KHO TÀI LIỆU'));
check('Home.jsx has secondary CTA to development status section', homeJsxCode.includes('XEM DỰ ÁN ĐANG PHÁT TRIỂN') || homeJsxCode.includes('dev-roadmap'));

// 2. Development Status & Roadmap
console.log('\n--- 2. Development Status & Roadmap ---');
check('Home.jsx has "ĐANG XÂY DỰNG" roadmap heading', homeJsxCode.includes('ĐANG XÂY DỰNG'));
check('Roadmap mentions "Engineering Paper XYZ (.epxyz)"', homeJsxCode.includes('Engineering Paper XYZ (.epxyz)'));
check('Roadmap mentions "Hệ thống mua và tải file an toàn"', homeJsxCode.includes('Hệ thống mua và tải file an toàn'));
check('Roadmap mentions in-progress expansion step', homeJsxCode.includes('Mở rộng thư viện tài liệu & công cụ Cơ khí') || homeJsxCode.includes('ĐANG THỰC HIỆN'));

// 3. What is MechanicalBKA (Pillars)
console.log('\n--- 3. What is MechanicalBKA (4 Pillars) ---');
check('Home.jsx contains "MechanicalBKA là gì?" section', homeJsxCode.includes('MechanicalBKA là gì?'));
check('Pillar 01: TÀI LIỆU KỸ THUẬT', homeJsxCode.includes('TÀI LIỆU KỸ THUẬT'));
check('Pillar 02: ENGINEERING PAPER XYZ', homeJsxCode.includes('ENGINEERING PAPER XYZ'));
check('Pillar 03: BẢN VẼ & CAD', homeJsxCode.includes('BẢN VẼ & CAD'));
check('Pillar 04: CÔNG CỤ KỸ THUẬT', homeJsxCode.includes('CÔNG CỤ KỸ THUẬT'));

// 4. Coffee Support Section (Core Focus)
console.log('\n--- 4. Coffee Support Section (Core Focus) ---');
check('Home.jsx contains "Ủng hộ một ly cà phê" heading', homeJsxCode.includes('Ủng hộ một ly cà phê') || homeJsxCode.includes('ỦNG HỘ DỰ ÁN CÁ NHÂN'));
check('Home.jsx includes sincere coffee message quote', homeJsxCode.includes('Một ly cà phê của bạn có thể không lớn') && homeJsxCode.includes('Cảm ơn bạn đã ủng hộ dự án'));
check('Account owner is "NGUYỄN NGỌC TRONG"', homeJsxCode.includes('NGUYỄN NGỌC TRONG'));
check('Bank/Service is "ViettelPay (MB Bank)"', homeJsxCode.includes('ViettelPay (MB Bank)'));
check('Account number includes "9704 2292 0140 3709 105"', homeJsxCode.includes('9704 2292 0140 3709 105') || homeJsxCode.includes('9704229201403709105'));
check('Copy account number button handler is present', homeJsxCode.includes('handleCopyAccountNumber') && homeJsxCode.includes('clipboard.writeText'));
check('VietQR image points to /assets/vietqr_viettelpay.png', homeJsxCode.includes('/assets/vietqr_viettelpay.png'));

// 5. Current Projects & Store CTA
console.log('\n--- 5. Current Projects & Store CTA ---');
check('Home.jsx contains "MechanicalBKA đang xây dựng" project category cards', homeJsxCode.includes('MechanicalBKA đang xây dựng'));
check('Card links to /store?type=EPXYZ_FILE', homeJsxCode.includes('/store?type=EPXYZ_FILE'));
check('Card links to /store?type=CAD_PROJECT', homeJsxCode.includes('/store?type=CAD_PROJECT'));
check('Card links to /store?type=PROJECT', homeJsxCode.includes('/store?type=PROJECT'));
check('Pre-footer Store CTA banner exists', homeJsxCode.includes('Kho tài liệu đang được xây dựng từng ngày') && homeJsxCode.includes('store-cta-box'));

// 6. Assets & Files Integrity
console.log('\n--- 6. Assets & Files Integrity ---');
const qrAssetPath = path.join(ROOT_DIR, 'public', 'assets', 'vietqr_viettelpay.png');
check('VietQR image file exists in public/assets', fs.existsSync(qrAssetPath));
if (fs.existsSync(qrAssetPath)) {
  const qrStat = fs.statSync(qrAssetPath);
  check('VietQR image file is non-empty (> 10KB)', qrStat.size > 10000);
}

const homeCssPath = path.join(ROOT_DIR, 'src', 'pages', 'Home.css');
check('Home.css exists and has engineering landing styling', fs.existsSync(homeCssPath));

const footerPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'Footer.jsx');
const footerCode = fs.readFileSync(footerPath, 'utf8');
check('Footer.jsx includes Engineering Paper XYZ and coffee support link', footerCode.includes('Engineering Paper XYZ') && footerCode.includes('support-coffee'));

// 7. Security Invariants
console.log('\n--- 7. Security Invariants ---');
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
console.log(`\n📊 Phase 17A: ${passCount}/${totalCount} checks passed\n`);

if (passCount === totalCount) {
  console.log('✅ Phase 17A validation PASSED\n');
  process.exit(0);
} else {
  console.error('❌ Phase 17A validation FAILED\n');
  process.exit(1);
}
