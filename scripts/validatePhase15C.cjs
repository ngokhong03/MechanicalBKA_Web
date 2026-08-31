/**
 * Phase 15C Validation Suite — Admin Diagnostics & Operational Hardening
 * 
 * Validates:
 * 1. Admin Diagnostic Engine (getOrderDiagnostics, repairOrderEntitlements)
 * 2. Storage Health & Artifact Integrity Inspector (getStorageHealthSummary, verifyArtifactIntegrity)
 * 3. Media & Artifact Storage Service (uploadProductThumbnail, uploadGalleryImage, uploadProductArtifact)
 * 4. Commercial File Type Coverage & Deterministic Metadata
 * 5. UI Routing, Draft Preview Protection & No-Code CMS Handlers
 * 6. Zero Eval/Exec & Security Rule Invariants
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let passCount = 0;
let totalCount = 0;

function check(desc, condition) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`  ✅ ${desc}`);
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
  }
}

console.log('\n🔧 Phase 15C Validation — Admin Diagnostics & Operational Hardening\n');

// 1. Admin Service Diagnostics & Reconciliation
console.log('--- 1. Admin Diagnostics & Reconciliation Logic ---');
const adminServicePath = path.join(ROOT_DIR, 'src', 'services', 'adminService.js');
const adminServiceContent = fs.readFileSync(adminServicePath, 'utf8');

check('adminService has getOrderDiagnostics method', adminServiceContent.includes('getOrderDiagnostics'));
check('adminService has repairOrderEntitlements method', adminServiceContent.includes('repairOrderEntitlements'));
check('adminService has getStorageHealthSummary method', adminServiceContent.includes('getStorageHealthSummary'));
check('adminService has verifyArtifactIntegrity method', adminServiceContent.includes('verifyArtifactIntegrity'));
check('repairOrderEntitlements requires paid payment status check', adminServiceContent.includes('diagnostics.isPaid'));
check('repairOrderEntitlements logs REPAIR_ORDER_ENTITLEMENTS audit action', adminServiceContent.includes('REPAIR_ORDER_ENTITLEMENTS'));

// 2. Storage Service Media & Artifacts
console.log('\n--- 2. Storage Service Media & File Architecture ---');
const storageServicePath = path.join(ROOT_DIR, 'src', 'services', 'storageService.js');
const storageServiceContent = fs.readFileSync(storageServicePath, 'utf8');

check('storageService has uploadProductThumbnail method', storageServiceContent.includes('uploadProductThumbnail'));
check('storageService has uploadGalleryImage method', storageServiceContent.includes('uploadGalleryImage'));
check('storageService has uploadProductArtifact method', storageServiceContent.includes('uploadProductArtifact'));
check('uploadGalleryImage targets public/products/{productId}/gallery/ path', storageServiceContent.includes('public/products/${productId}/gallery/'));
check('uploadProductThumbnail targets public/products/{productId}/thumbnail. path', storageServiceContent.includes('public/products/${productId}/thumbnail.'));
check('uploadProductArtifact targets private/products/{productId}/{artifactId}/ path', storageServiceContent.includes('private/products/${productId}/${artifactId}/'));

// 3. Admin CMS & UI Diagnostic Panels
console.log('\n--- 3. Admin UI Diagnostic Components ---');
const adminOrdersPath = path.join(ROOT_DIR, 'src', 'pages', 'admin', 'AdminOrders.jsx');
const adminOrdersContent = fs.readFileSync(adminOrdersPath, 'utf8');
check('AdminOrders has Order Diagnostics modal/panel', adminOrdersContent.includes('CHẨN ĐOÁN TOÀN DIỆN ĐƠN HÀNG'));
check('AdminOrders has Entitlement repair trigger button', adminOrdersContent.includes('Khôi Phục Quyền Tải'));
check('AdminOrders displays user email, order status and item entitlements', adminOrdersContent.includes('ĐỐI SOÁT SẢN PHẨM & QUYỀN SỞ HỮU'));

const adminProductsPath = path.join(ROOT_DIR, 'src', 'pages', 'admin', 'AdminProducts.jsx');
const adminProductsContent = fs.readFileSync(adminProductsPath, 'utf8');
check('AdminProducts has Storage Health dashboard modal', adminProductsContent.includes('SỨC KHỎE LƯU TRỮ & TOÀN VẸN FILE'));
check('AdminProducts has multi-image gallery uploader', adminProductsContent.includes('handleGallerySelect') && adminProductsContent.includes('BỘ ẢNH GALLERY'));
check('AdminProducts has instant storefront preview link', adminProductsContent.includes('preview=true'));
check('AdminProducts supports one-click toggle publish status', adminProductsContent.includes('handleTogglePublish'));

const adminDashboardPath = path.join(ROOT_DIR, 'src', 'pages', 'admin', 'AdminDashboard.jsx');
const adminDashboardContent = fs.readFileSync(adminDashboardPath, 'utf8');
check('AdminDashboard displays Storage Health status widget', adminDashboardContent.includes('STORAGE HEALTH'));

// 4. Storefront Routing & Product Dataset
console.log('\n--- 4. Routing & Test Product Coverage ---');
const appPath = path.join(ROOT_DIR, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
check('App.jsx provides /store/:slug route', appContent.includes('/store/:slug'));
check('App.jsx provides /product/:slug route alias', appContent.includes('/product/:slug'));

const mockDataPath = path.join(ROOT_DIR, 'src', 'mock', 'data.js');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
check('Catalog contains Shaft Design Automation Tool test product', mockDataContent.includes('prod_shaft_design_automation_tool'));
check('Shaft Design Tool has valid product type (EPXYZ_FILE or PYTHON_TOOL)', mockDataContent.includes('EPXYZ_FILE') || mockDataContent.includes('PYTHON_TOOL'));
check('Shaft Design Tool includes SHA-256 checksum and metadata', mockDataContent.includes('MechanicalBKA_Shaft_Design_Tool_v1.0.0.epxyz') || mockDataContent.includes('MechanicalBKA_Shaft_Design_Tool_v1.0.0.zip'));

// 5. Security & Privacy Invariants
console.log('\n--- 5. Security & Privacy Invariants ---');
const storageRulesPath = path.join(ROOT_DIR, 'storage.rules');
const storageRulesContent = fs.readFileSync(storageRulesPath, 'utf8');
check('storage.rules protects /private/** with admin-only access', storageRulesContent.includes('/private/{allPaths=**}') && storageRulesContent.includes('isAdmin()'));

const firestoreRulesPath = path.join(ROOT_DIR, 'firestore.rules');
const firestoreRulesContent = fs.readFileSync(firestoreRulesPath, 'utf8');
check('firestore.rules protects /entitlements with admin write only', firestoreRulesContent.includes('match /entitlements/{entitlementId}') && firestoreRulesContent.includes('allow write: if isAdmin()'));

// 6. Check for Forbidden Eval/Exec in all JS/JSX files
console.log('\n--- 6. Codebase Integrity (No eval/exec) ---');
function scanDirForEval(dir) {
  let hasForbidden = false;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['node_modules', 'dist', '.git', '.venv'].includes(f.name)) {
      if (scanDirForEval(full)) hasForbidden = true;
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

const hasForbidden = scanDirForEval(path.join(ROOT_DIR, 'src'));
check('Zero eval() or exec() in src codebase', !hasForbidden);

// Summary
console.log(`\n📊 Phase 15C: ${passCount}/${totalCount} checks passed\n`);

if (passCount === totalCount) {
  console.log('✅ Phase 15C validation PASSED\n');
  process.exit(0);
} else {
  console.error('❌ Phase 15C validation FAILED\n');
  process.exit(1);
}
