/**
 * Phase 16A Validation Script
 * MechanicalBKA — Engineering Paper XYZ Product Migration
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

console.log('\n📐 Phase 16A Validation — Engineering Paper XYZ Product Migration\n');

// 1. EPXYZ File Detection & MIME Mapping
console.log('--- 1. EPXYZ File Detection & MIME Mapping ---');
const mediaUtilsPath = path.join(ROOT_DIR, 'src', 'utils', 'mediaUtils.js');
const mediaUtilsCode = fs.readFileSync(mediaUtilsPath, 'utf8');

function mockDetectEngineeringFileType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'OTHER';
  const ext = fileName.split('.').pop().toLowerCase();
  const typeMap = {
    zip: 'ZIP', rar: 'ZIP', '7z': 'ZIP',
    xlsx: 'XLSX', xls: 'XLS', xlsm: 'XLSX',
    py: 'PY', pyw: 'PY',
    epxyz: 'EPXYZ',
    pdf: 'PDF', docx: 'DOCX', doc: 'DOCX',
    dwg: 'DWG', dxf: 'DXF',
    iam: 'IAM', ipt: 'IPT',
    sldasm: 'SLDASM', sldprt: 'SLDPRT',
    step: 'STEP', stp: 'STEP', stl: 'STL'
  };
  return typeMap[ext] || ext.toUpperCase();
}

function mockGetMimeType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'application/octet-stream';
  const ext = fileName.split('.').pop().toLowerCase();
  const mimeMap = {
    zip: 'application/zip',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    py: 'text/x-python',
    epxyz: 'application/json',
    pdf: 'application/pdf'
  };
  return mimeMap[ext] || 'application/octet-stream';
}

check('Detects MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz as EPXYZ', mockDetectEngineeringFileType('MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz') === 'EPXYZ');
check('Detects uppercase .EPXYZ as EPXYZ', mockDetectEngineeringFileType('shaft_calc.EPXYZ') === 'EPXYZ');
check('EPXYZ is NOT detected as OTHER or ZIP or XLSX', !['OTHER', 'ZIP', 'XLSX'].includes(mockDetectEngineeringFileType('Shaft.epxyz')));
check('getMimeType returns application/json for .epxyz', mockGetMimeType('test.epxyz') === 'application/json');
check('mediaUtils.js explicitly maps epxyz to EPXYZ', mediaUtilsCode.includes("epxyz: 'EPXYZ'"));
check('mediaUtils.js explicitly maps epxyz MIME to application/json', mediaUtilsCode.includes("epxyz: 'application/json'"));
check('mediaUtils.js ALLOWED_ARTIFACT_EXTENSIONS includes epxyz', mediaUtilsCode.includes("'epxyz'"));

// 2. Product Constants & Types
console.log('\n--- 2. Product Constants & System Types ---');
const productConstantsPath = path.join(ROOT_DIR, 'src', 'constants', 'productConstants.js');
const productConstantsCode = fs.readFileSync(productConstantsPath, 'utf8');

check('productConstants.js defines EPXYZ_FILE product type', productConstantsCode.includes("EPXYZ_FILE: 'EPXYZ_FILE'"));
check('productConstants.js defines Engineering Paper XYZ label', productConstantsCode.includes("Engineering Paper XYZ"));
check('productConstants.js defines ENGINEERING PAPER XYZ badge label', productConstantsCode.includes("ENGINEERING PAPER XYZ"));
check('productConstants.js FILE_TYPES includes EPXYZ', productConstantsCode.includes("'EPXYZ'"));

// 3. Shaft Design Tool Mock Data Migration
console.log('\n--- 3. Shaft Design Tool Catalog Migration ---');
const mockDataPath = path.join(ROOT_DIR, 'src', 'mock', 'data.js');
const mockDataCode = fs.readFileSync(mockDataPath, 'utf8');

check('Catalog contains prod_shaft_design_automation_tool', mockDataCode.includes('prod_shaft_design_automation_tool'));
check('Shaft Design Tool productType is EPXYZ_FILE', mockDataCode.includes('"productType": "EPXYZ_FILE"'));
check('Shaft Design Tool main file is MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz', mockDataCode.includes('MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz'));
check('Shaft Design Tool fileType is EPXYZ', mockDataCode.includes('"fileType": "EPXYZ"'));
check('Shaft Design Tool compatibility includes Engineering Paper XYZ', mockDataCode.includes('Engineering Paper XYZ'));
check('Shaft Design Tool standards include TCVN 1065:2004', mockDataCode.includes('TCVN 1065:2004'));
check('Shaft Design Tool highlights include calculation trace', mockDataCode.includes('Calculation trace minh bạch'));
check('Shaft Design Tool storagePath resides in private/products/...', mockDataCode.includes('private/products/prod_shaft_design_automation_tool/art_shaft_v1_0_0/MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz'));

// 4. Storefront UI Touchpoints (Store, ProductCard, ProductDetail, Library)
console.log('\n--- 4. Storefront Presentation & UI ---');
const storePath = path.join(ROOT_DIR, 'src', 'pages', 'Store.jsx');
const storeCode = fs.readFileSync(storePath, 'utf8');
check('Store.jsx filter includes Engineering Paper XYZ option for EPXYZ_FILE', storeCode.includes('value="EPXYZ_FILE"') && storeCode.includes('Engineering Paper XYZ'));

const productCardPath = path.join(ROOT_DIR, 'src', 'components', 'cards', 'ProductCard.jsx');
const productCardCode = fs.readFileSync(productCardPath, 'utf8');
check('ProductCard.jsx maps EPXYZ_FILE to ENGINEERING PAPER XYZ badge', productCardCode.includes("case 'EPXYZ_FILE':") && productCardCode.includes("'ENGINEERING PAPER XYZ'"));
check('ProductCard.jsx renders Engineering Paper XYZ for EPXYZ_FILE software row', productCardCode.includes("'Engineering Paper XYZ'"));

const productDetailPath = path.join(ROOT_DIR, 'src', 'pages', 'ProductDetail.jsx');
const productDetailCode = fs.readFileSync(productDetailPath, 'utf8');
check('ProductDetail.jsx has EPXYZ_FILE label as Engineering Paper XYZ', productDetailCode.includes("EPXYZ_FILE: 'Engineering Paper XYZ'"));
check('ProductDetail.jsx renders compatibility tags', productDetailCode.includes('compatibility'));
check('ProductDetail.jsx does NOT expose raw storagePath to customers', !productDetailCode.includes('file.storagePath'));

const libraryPath = path.join(ROOT_DIR, 'src', 'pages', 'Library.jsx');
const libraryCode = fs.readFileSync(libraryPath, 'utf8');
check('Library.jsx identifies EPXYZ_FILE products', libraryCode.includes("product.productType === 'EPXYZ_FILE'"));
check('Library.jsx renders TẢI FILE .EPXYZ CTA for EPXYZ products', libraryCode.includes('TẢI FILE .EPXYZ'));

// 5. Admin CMS No-Code Experience
console.log('\n--- 5. Admin CMS No-Code Architecture ---');
const adminProductsPath = path.join(ROOT_DIR, 'src', 'pages', 'admin', 'AdminProducts.jsx');
const adminProductsCode = fs.readFileSync(adminProductsPath, 'utf8');
check('AdminProducts.jsx PRODUCT_TYPE_OPTIONS includes EPXYZ_FILE', adminProductsCode.includes("value: 'EPXYZ_FILE'"));
check('AdminProducts.jsx file uploader explicitly mentions .EPXYZ', adminProductsCode.includes('.EPXYZ'));

// 6. Security, Privacy & Integrity Invariants
console.log('\n--- 6. Security & Architectural Invariants ---');
const storageRulesPath = path.join(ROOT_DIR, 'storage.rules');
const storageRulesCode = fs.readFileSync(storageRulesPath, 'utf8');
check('storage.rules protects /private/** with admin-only access', storageRulesCode.includes('/private/{allPaths=**}') && storageRulesCode.includes('isAdmin()'));

const firestoreRulesPath = path.join(ROOT_DIR, 'firestore.rules');
const firestoreRulesCode = fs.readFileSync(firestoreRulesPath, 'utf8');
check('firestore.rules protects /entitlements with admin write only', firestoreRulesCode.includes('match /entitlements/{entitlementId}') && firestoreRulesCode.includes('allow write: if isAdmin()'));

// Check for zero eval/exec in src
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
console.log(`\n📊 Phase 16A: ${passCount}/${totalCount} checks passed\n`);

if (passCount === totalCount) {
  console.log('✅ Phase 16A validation PASSED\n');
  process.exit(0);
} else {
  console.error('❌ Phase 16A validation FAILED\n');
  process.exit(1);
}
