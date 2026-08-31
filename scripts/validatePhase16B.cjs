/**
 * Phase 16B Validation Script
 * MechanicalBKA — Engineering Paper XYZ Product Migration & Identity Hardening
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

console.log('\n📐 Phase 16B Validation — Engineering Paper XYZ Product Identity & System Verification\n');

// 1. Core Product Type Architecture & Enums
console.log('--- 1. Core Product Type Architecture & Enums ---');
const productConstantsPath = path.join(ROOT_DIR, 'src', 'constants', 'productConstants.js');
const productConstantsCode = fs.readFileSync(productConstantsPath, 'utf8');

check('PRODUCT_TYPES includes EPXYZ_FILE', productConstantsCode.includes("EPXYZ_FILE: 'EPXYZ_FILE'"));
check('PRODUCT_TYPE_LABELS[EPXYZ_FILE] is "Engineering Paper XYZ"', productConstantsCode.includes("[PRODUCT_TYPES.EPXYZ_FILE]: 'Engineering Paper XYZ'"));
check('PRODUCT_TYPE_BADGE_LABELS[EPXYZ_FILE] is "ENGINEERING PAPER XYZ"', productConstantsCode.includes("[PRODUCT_TYPES.EPXYZ_FILE]: 'ENGINEERING PAPER XYZ'"));
check('FILE_TYPES list contains EPXYZ', productConstantsCode.includes("'EPXYZ'"));

// 2. Shaft Design Tool Positioning & Catalog Data
console.log('\n--- 2. Shaft Design Tool Positioning & Catalog Data ---');
const mockDataPath = path.join(ROOT_DIR, 'src', 'mock', 'data.js');
const mockDataCode = fs.readFileSync(mockDataPath, 'utf8');

check('Catalog contains prod_shaft_design_automation_tool', mockDataCode.includes('prod_shaft_design_automation_tool'));
check('Shaft Design Tool productType is EPXYZ_FILE', mockDataCode.includes('"productType": "EPXYZ_FILE"'));
check('Shaft Design Tool title reflects Engineering Paper XYZ', mockDataCode.includes('Engineering Paper XYZ — Tự Động Hóa Thiết Kế Trục Theo TCVN'));
check('Shaft Design Tool main artifact is .epxyz', mockDataCode.includes('MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz'));
check('Shaft Design Tool fileType is EPXYZ', mockDataCode.includes('"fileType": "EPXYZ"'));
check('Shaft Design Tool storagePath is in private/products/...', mockDataCode.includes('private/products/prod_shaft_design_automation_tool/art_shaft_v1_0_0/MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz'));
check('Shaft Design Tool compatibility specifies Engineering Paper XYZ', mockDataCode.includes('Engineering Paper XYZ'));
check('Shaft Design Tool technical standards include TCVN 1065:2004', mockDataCode.includes('TCVN 1065:2004'));
check('Shaft Design Tool highlights include step-by-step calculation trace', mockDataCode.includes('Calculation trace minh bạch'));
check('Shaft Design Tool price is 350.000 VND and PAID', mockDataCode.includes('"price": 350000') && mockDataCode.includes('"accessType": "PAID"'));

// 3. EPXYZ File Detection, Validation & Utilities
console.log('\n--- 3. EPXYZ File Detection, Validation & Utilities ---');
const mediaUtilsPath = path.join(ROOT_DIR, 'src', 'utils', 'mediaUtils.js');
const mediaUtilsCode = fs.readFileSync(mediaUtilsPath, 'utf8');

check('ALLOWED_ARTIFACT_EXTENSIONS includes epxyz', mediaUtilsCode.includes("'epxyz'"));
check('detectEngineeringFileType explicitly maps epxyz to EPXYZ', mediaUtilsCode.includes("epxyz: 'EPXYZ'"));
check('getMimeType maps epxyz to application/json', mediaUtilsCode.includes("epxyz: 'application/json'"));

// 4. Storefront & Customer Touchpoints
console.log('\n--- 4. Storefront & Customer Touchpoints ---');
const storePath = path.join(ROOT_DIR, 'src', 'pages', 'Store.jsx');
const storeCode = fs.readFileSync(storePath, 'utf8');
check('Store.jsx filter includes option value="EPXYZ_FILE" with Engineering Paper XYZ', storeCode.includes('value="EPXYZ_FILE"') && storeCode.includes('Engineering Paper XYZ'));

const productCardPath = path.join(ROOT_DIR, 'src', 'components', 'cards', 'ProductCard.jsx');
const productCardCode = fs.readFileSync(productCardPath, 'utf8');
check('ProductCard.jsx formats EPXYZ_FILE as "ENGINEERING PAPER XYZ"', productCardCode.includes("case 'EPXYZ_FILE':") && productCardCode.includes("'ENGINEERING PAPER XYZ'"));
check('ProductCard.jsx renders Engineering Paper XYZ for software row when productType is EPXYZ_FILE', productCardCode.includes("'Engineering Paper XYZ'"));

const productDetailPath = path.join(ROOT_DIR, 'src', 'pages', 'ProductDetail.jsx');
const productDetailCode = fs.readFileSync(productDetailPath, 'utf8');
check('ProductDetail.jsx maps EPXYZ_FILE to "Engineering Paper XYZ"', productDetailCode.includes("EPXYZ_FILE: 'Engineering Paper XYZ'"));
check('ProductDetail.jsx does NOT expose raw storagePath to customers', !productDetailCode.includes('file.storagePath'));

const libraryPath = path.join(ROOT_DIR, 'src', 'pages', 'Library.jsx');
const libraryCode = fs.readFileSync(libraryPath, 'utf8');
check('Library.jsx detects EPXYZ_FILE products', libraryCode.includes("product.productType === 'EPXYZ_FILE'"));
check('Library.jsx renders "TẢI FILE .EPXYZ" CTA button', libraryCode.includes('TẢI FILE .EPXYZ'));

const homePath = path.join(ROOT_DIR, 'src', 'pages', 'Home.jsx');
const homeCode = fs.readFileSync(homePath, 'utf8');
check('Home.jsx calculationProducts includes EPXYZ_FILE', homeCode.includes('EPXYZ_FILE'));
check('Home.jsx calculation section mentions Engineering Paper XYZ', homeCode.includes('Engineering Paper XYZ (.epxyz)'));

// 5. Admin CMS No-Code Experience
console.log('\n--- 5. Admin CMS No-Code Experience ---');
const adminProductsPath = path.join(ROOT_DIR, 'src', 'pages', 'admin', 'AdminProducts.jsx');
const adminProductsCode = fs.readFileSync(adminProductsPath, 'utf8');

check('AdminProducts.jsx PRODUCT_TYPE_OPTIONS contains EPXYZ_FILE option', adminProductsCode.includes("value: 'EPXYZ_FILE'"));
check('AdminProducts.jsx file uploader supports .EPXYZ', adminProductsCode.includes('.EPXYZ'));
check('AdminProducts.jsx has draft preview link support (preview=true)', adminProductsCode.includes('preview=true'));
check('AdminProducts.jsx supports publish/unpublish toggle', adminProductsCode.includes('handleTogglePublish'));

// 6. Security Invariants & Rules
console.log('\n--- 6. Security Invariants & Code Integrity ---');
const storageRulesPath = path.join(ROOT_DIR, 'storage.rules');
const storageRulesCode = fs.readFileSync(storageRulesPath, 'utf8');
check('storage.rules protects /private/** with admin-only access', storageRulesCode.includes('/private/{allPaths=**}') && storageRulesCode.includes('isAdmin()'));

const firestoreRulesPath = path.join(ROOT_DIR, 'firestore.rules');
const firestoreRulesCode = fs.readFileSync(firestoreRulesPath, 'utf8');
check('firestore.rules protects /entitlements with admin write only', firestoreRulesCode.includes('match /entitlements/{entitlementId}') && firestoreRulesCode.includes('allow write: if isAdmin()'));

// Zero forbidden eval/exec
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

const hasForbidden = scanDirForForbidden(path.join(ROOT_DIR, 'src'));
check('Zero eval() or exec() in src codebase', !hasForbidden);

// Summary
console.log(`\n📊 Phase 16B: ${passCount}/${totalCount} checks passed\n`);

if (passCount === totalCount) {
  console.log('✅ Phase 16B validation PASSED\n');
  process.exit(0);
} else {
  console.error('❌ Phase 16B validation FAILED\n');
  process.exit(1);
}
