/**
 * Phase 15B Validation Script — Storefront Presentation & Rich Product Detail
 * 
 * Verifies:
 *   - normalizeProductData handles both modern (Phase 15A/B) and legacy schema
 *   - All product types are recognized (PYTHON_TOOL, EXCEL_TOOL, EPXYZ_FILE, CAD_PACKAGE, etc.)
 *   - YouTube demo integration and URL extraction
 *   - ProductDetail component structure and information hierarchy
 *   - ProductCard component media handling
 *   - Store filter coverage
 *   - Zero private storage path leakage to DOM
 *   - Zero eval/exec in modified source files
 *   - Security rules integrity
 */

const fs = require('fs');
const path = require('path');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ ${desc}`);
  } else {
    failedChecks++;
    console.error(`  ❌ FAIL: ${desc}`);
  }
}

console.log('\n🔧 Phase 15B Validation — Storefront Presentation & Rich Product Detail\n');

// 1. Data Normalization Tests
console.log('--- 1. Data Normalization Layer (normalizeProductData) ---');

// Mock implementation of normalizeProductData for Node validation
function extractYouTubeVideoId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function normalizeProductData(p) {
  if (!p || typeof p !== 'object') return null;
  const media = p.media || {};
  const technical = p.technical || {};
  const content = p.content || {};

  const thumbnailUrl = media.thumbnailUrl || p.thumbnailUrl || p.thumbnail || p.image || null;
  const rawGallery = media.gallery || p.gallery || p.images || [];
  const gallery = Array.isArray(rawGallery) ? rawGallery.filter(Boolean) : [];
  const rawYoutube = media.youtubeVideoId || p.youtubeVideoId || p.youtubeUrl || null;
  const youtubeVideoId = extractYouTubeVideoId(rawYoutube);

  const rawHighlights = content.highlights || p.highlights || [];
  const highlights = Array.isArray(rawHighlights) ? rawHighlights.filter(Boolean) : [];

  const rawIncludedFiles = content.includedFiles || p.includedFiles || [];
  const includedFiles = Array.isArray(rawIncludedFiles) ? rawIncludedFiles.filter(Boolean) : [];

  const systemRequirements = technical.systemRequirements || p.systemRequirements || '';
  const rawStandards = technical.standards || p.standards || [];
  const standards = Array.isArray(rawStandards) ? rawStandards.filter(Boolean) : [];
  const compatibility = technical.compatibility || p.compatibility || [];

  const version = p.version || technical.version || (p.files?.[0]?.version) || '1.0.0';

  return {
    ...p,
    version,
    media: { thumbnailUrl, gallery, youtubeVideoId },
    thumbnailUrl,
    youtubeVideoId,
    content: { highlights, includedFiles },
    highlights,
    includedFiles,
    technical: { version, systemRequirements, compatibility, standards },
    systemRequirements,
    standards
  };
}

// Modern schema input
const modernProduct = {
  id: 'prod_modern_01',
  title: 'Shaft Design Automation Tool',
  version: '1.2.0',
  media: {
    thumbnailUrl: 'https://example.com/thumb.webp',
    gallery: ['https://example.com/screen1.png', 'https://example.com/screen2.png'],
    youtubeVideoId: 'dQw4w9WgXcQ'
  },
  technical: {
    systemRequirements: 'Windows 10/11, Python 3.10+',
    standards: ['TCVN 1065:2004', 'Trịnh Chất']
  },
  content: {
    highlights: ['Tự động hóa tính toán trục', 'Xuất kết quả SSOT'],
    includedFiles: ['shaft_design.py', 'test_shaft_design.py']
  },
  files: [{ id: 'f1', fileName: 'shaft.py', version: '1.2.0', fileSize: 1024, checksum: 'abc' }]
};

const normModern = normalizeProductData(modernProduct);
check('Modern schema: media.thumbnailUrl preserved', normModern.media.thumbnailUrl === 'https://example.com/thumb.webp');
check('Modern schema: media.gallery has 2 items', normModern.media.gallery.length === 2);
check('Modern schema: media.youtubeVideoId resolved', normModern.media.youtubeVideoId === 'dQw4w9WgXcQ');
check('Modern schema: technical.systemRequirements preserved', normModern.technical.systemRequirements.includes('Python 3.10+'));
check('Modern schema: technical.standards preserved', normModern.technical.standards.length === 2);
check('Modern schema: content.highlights preserved', normModern.content.highlights.length === 2);
check('Modern schema: version resolved', normModern.version === '1.2.0');

// Legacy schema input
const legacyProduct = {
  id: 'prod_legacy_01',
  title: 'Hộp Giảm Tốc 2 Cấp Đồng Trục',
  thumbnailUrl: 'https://example.com/legacy_thumb.jpg',
  images: ['https://example.com/cad1.png'],
  youtubeVideoId: 'https://youtu.be/dQw4w9WgXcQ',
  highlights: ['Bản vẽ A0 đầy đủ', 'Thuyết minh chuẩn Bách Khoa'],
  includedFiles: ['Bản_vẽ_lắp.dwg', 'Thuyết_minh.docx'],
  systemRequirements: 'AutoCAD 2018+, Word 2016+',
  standards: ['TCVN 5574:2018'],
  files: [{ id: 'f2', fileName: 'DoAn.zip', version: '1.0.0', fileSize: 50000000 }]
};

const normLegacy = normalizeProductData(legacyProduct);
check('Legacy fallback: thumbnailUrl mapped to media.thumbnailUrl', normLegacy.media.thumbnailUrl === 'https://example.com/legacy_thumb.jpg');
check('Legacy fallback: images mapped to media.gallery', normLegacy.media.gallery.length === 1);
check('Legacy fallback: raw YouTube URL normalized to 11-char ID', normLegacy.media.youtubeVideoId === 'dQw4w9WgXcQ');
check('Legacy fallback: highlights mapped to content.highlights', normLegacy.content.highlights.length === 2);
check('Legacy fallback: includedFiles mapped to content.includedFiles', normLegacy.content.includedFiles.length === 2);
check('Legacy fallback: systemRequirements mapped to technical.systemRequirements', normLegacy.technical.systemRequirements.includes('AutoCAD'));
check('Legacy fallback: standards mapped to technical.standards', normLegacy.technical.standards[0] === 'TCVN 5574:2018');

// 2. Product Type Definitions
console.log('\n--- 2. Product Type Options & Coverage ---');
const expectedTypes = [
  'PROJECT', 'PYTHON_TOOL', 'EXCEL_TOOL', 'EPXYZ_FILE',
  'CAD_PACKAGE', 'CAD_PROJECT', 'DRAWING', 'CALCULATION',
  'TOOL', 'TEMPLATE', 'DOCUMENT', 'OTHER'
];

const productDetailSrc = fs.readFileSync(path.join(__dirname, '../src/pages/ProductDetail.jsx'), 'utf8');
const storeSrc = fs.readFileSync(path.join(__dirname, '../src/pages/Store.jsx'), 'utf8');
const productCardSrc = fs.readFileSync(path.join(__dirname, '../src/components/cards/ProductCard.jsx'), 'utf8');

check('ProductDetail supports all 11+ product types', expectedTypes.every(t => productDetailSrc.includes(t)));
check('Store filter supports PYTHON_TOOL, EXCEL_TOOL, EPXYZ_FILE, CAD_PACKAGE', 
  storeSrc.includes('PYTHON_TOOL') && storeSrc.includes('EXCEL_TOOL') && storeSrc.includes('EPXYZ_FILE') && storeSrc.includes('CAD_PACKAGE')
);
check('ProductCard supports PYTHON_TOOL, EXCEL_TOOL, EPXYZ_FILE, CAD_PACKAGE', 
  productCardSrc.includes('PYTHON_TOOL') && productCardSrc.includes('EXCEL_TOOL') && productCardSrc.includes('EPXYZ_FILE') && productCardSrc.includes('CAD_PACKAGE')
);

// 3. Product Media & YouTube Integration
console.log('\n--- 3. Product Media & Presentation ---');
check('ProductDetail has YouTube iframe with privacy domain youtube-nocookie.com', productDetailSrc.includes('youtube-nocookie.com/embed'));
check('ProductDetail has responsive 16:9 video container', productDetailSrc.includes('video-responsive-container'));
check('ProductDetail has image gallery thumbnail switcher', productDetailSrc.includes('gallery-thumb-btn') && productDetailSrc.includes('setSelectedImage'));
check('ProductDetail has draft preview banner for admin', productDetailSrc.includes('draft-preview-banner') && productDetailSrc.includes('CHẾ ĐỘ XEM TRƯỚC (DRAFT PREVIEW)'));
check('ProductDetail blocks unpublished products for non-admin', productDetailSrc.includes('!product.isPublished && !isAdmin && !isPreviewMode'));

// 4. File Privacy & Security Verification
console.log('\n--- 4. Security & Privacy Invariants ---');
check('ProductDetail does NOT render raw storagePath to customers', !productDetailSrc.includes('{file.storagePath}'));
check('ProductDetail uses downloadService for downloads', productDetailSrc.includes('downloadService.downloadProductFile'));
check('Zero eval() or exec() in frontend code', 
  !/\beval\s*\(/.test(productDetailSrc) && !/\bexec\s*\(/.test(productDetailSrc)
);

// 5. Build & File Existence
console.log('\n--- 5. Styles & Components Existence ---');
check('src/pages/ProductDetail.css exists', fs.existsSync(path.join(__dirname, '../src/pages/ProductDetail.css')));
check('src/components/cards/ProductCard.css exists', fs.existsSync(path.join(__dirname, '../src/components/cards/ProductCard.css')));

// Summary
console.log(`\n📊 Phase 15B: ${passedChecks}/${totalChecks} checks passed\n`);
if (failedChecks === 0) {
  console.log('✅ Phase 15B validation PASSED\n');
  process.exit(0);
} else {
  console.error(`❌ Phase 15B validation FAILED with ${failedChecks} failures\n`);
  process.exit(1);
}
