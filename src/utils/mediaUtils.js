/**
 * Media & Engineering Asset Utilities
 * MechanicalBKA Engineering Tool Marketplace
 * 
 * Provides:
 *   - YouTube URL parsing & ID extraction
 *   - Automatic SHA-256 checksum calculation via Web Crypto API / Node.js
 *   - Engineering file type detection & MIME mapping
 *   - File size formatting & validation
 */

// Supported commercial artifact extensions
export const ALLOWED_ARTIFACT_EXTENSIONS = [
  'zip', 'rar', '7z', 'tar', 'gz',
  'xlsx', 'xls', 'xlsm', 'csv',
  'py', 'pyw',
  'epxyz',
  'pdf', 'docx', 'doc',
  'dwg', 'dxf',
  'iam', 'ipt', 'idw',
  'sldasm', 'sldprt', 'slddrw',
  'step', 'stp', 'iges', 'igs', 'stl'
];

// Supported thumbnail image extensions
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg'];

// Default limits
export const MAX_ARTIFACT_SIZE_BYTES = 250 * 1024 * 1024; // 250 MB
export const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;   // 5 MB

/**
 * Extract and normalize YouTube Video ID from various URL formats or raw ID.
 * 
 * @param {string} input - YouTube URL or raw Video ID
 * @returns {string|null} 11-character YouTube video ID, or null if invalid
 */
export function extractYouTubeVideoId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Regex matching standard, short, embed, and shorts URLs
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
      /^[a-zA-Z0-9_-]{11}$/
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (err) {
    console.warn('[mediaUtils] Lỗi trích xuất YouTube ID:', err);
  }

  return null;
}

/**
 * Validate whether a string is a valid YouTube Video ID.
 */
export function isValidYouTubeVideoId(id) {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]{11}$/.test(id.trim());
}

/**
 * Format bytes into human-readable string.
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Detect engineering file type from file name.
 */
export function detectEngineeringFileType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'OTHER';
  const ext = fileName.split('.').pop().toLowerCase();
  
  const typeMap = {
    zip: 'ZIP',
    rar: 'ZIP',
    '7z': 'ZIP',
    xlsx: 'XLSX',
    xls: 'XLS',
    xlsm: 'XLSX',
    py: 'PY',
    pyw: 'PY',
    epxyz: 'EPXYZ',
    pdf: 'PDF',
    docx: 'DOCX',
    doc: 'DOCX',
    dwg: 'DWG',
    dxf: 'DXF',
    iam: 'IAM',
    ipt: 'IPT',
    idw: 'CAD',
    sldasm: 'SLDASM',
    sldprt: 'SLDPRT',
    slddrw: 'CAD',
    step: 'STEP',
    stp: 'STEP',
    stl: 'STL',
    iges: 'CAD',
    igs: 'CAD'
  };

  return typeMap[ext] || ext.toUpperCase();
}

/**
 * Get standard MIME Content-Type for file name.
 */
export function getMimeType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'application/octet-stream';
  const ext = fileName.split('.').pop().toLowerCase();

  const mimeMap = {
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    py: 'text/x-python',
    epxyz: 'application/json',
    dwg: 'image/vnd.dwg',
    dxf: 'image/vnd.dxf',
    ipt: 'application/vnd.autodesk.inventor',
    iam: 'application/vnd.autodesk.inventor',
    idw: 'application/vnd.autodesk.inventor',
    sldprt: 'application/sldworks',
    sldasm: 'application/sldworks',
    step: 'application/step',
    stp: 'application/step',
    stl: 'model/stl',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  };

  return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Calculate SHA-256 hash of a File / Blob / ArrayBuffer.
 * Works seamlessly in Browser (Web Crypto API) and Node.js environments.
 * 
 * @param {File|Blob|ArrayBuffer|Uint8Array} fileOrData
 * @returns {Promise<string>} 64-character lowercase hex string
 */
export async function calculateFileSha256(fileOrData) {
  if (!fileOrData) {
    throw new Error('Dữ liệu tệp không hợp lệ để tính toán mã băm SHA-256.');
  }

  const cryptoApi = globalThis.crypto || (typeof window !== 'undefined' ? window.crypto : null);
  if (cryptoApi && cryptoApi.subtle) {
    let arrayBuffer;
    if (fileOrData instanceof ArrayBuffer) {
      arrayBuffer = fileOrData;
    } else if (fileOrData.buffer instanceof ArrayBuffer) {
      arrayBuffer = fileOrData.buffer;
    } else if (typeof fileOrData.arrayBuffer === 'function') {
      arrayBuffer = await fileOrData.arrayBuffer();
    } else if (typeof fileOrData === 'string') {
      arrayBuffer = new TextEncoder().encode(fileOrData).buffer;
    } else {
      throw new Error('Không thể đọc dữ liệu nhị phân từ tệp tin.');
    }

    const hashBuffer = await cryptoApi.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  throw new Error('Môi trường không hỗ trợ Web Crypto API (crypto.subtle).');
}

/**
 * Validate artifact file for upload.
 */
export function validateArtifactFile(file, maxSizeBytes = MAX_ARTIFACT_SIZE_BYTES) {
  if (!file) {
    return { isValid: false, error: 'Chưa chọn tệp tin tải lên.' };
  }

  const name = file.name || '';
  const ext = name.split('.').pop().toLowerCase();

  if (!ALLOWED_ARTIFACT_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Định dạng tệp .${ext} không nằm trong danh sách hỗ trợ thương mại (${ALLOWED_ARTIFACT_EXTENSIONS.slice(0, 10).join(', ')}...).`
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Dung lượng tệp (${formatFileSize(file.size)}) vượt quá giới hạn cho phép (${formatFileSize(maxSizeBytes)}).`
    };
  }

  return {
    isValid: true,
    fileType: detectEngineeringFileType(name),
    mimeType: getMimeType(name)
  };
}

/**
 * Validate thumbnail image file.
 */
export function validateThumbnailFile(file, maxSizeBytes = MAX_THUMBNAIL_SIZE_BYTES) {
  if (!file) {
    return { isValid: false, error: 'Chưa chọn ảnh thumbnail.' };
  }

  const name = file.name || '';
  const ext = name.split('.').pop().toLowerCase();

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Ảnh thumbnail chỉ chấp nhận định dạng: ${ALLOWED_IMAGE_EXTENSIONS.join(', ').toUpperCase()}.`
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Dung lượng ảnh (${formatFileSize(file.size)}) vượt quá giới hạn cho phép (${formatFileSize(maxSizeBytes)}).`
    };
  }

  return {
    isValid: true,
    mimeType: getMimeType(name)
  };
}

/**
 * Normalizes product object across legacy and current schema (Phase 15A/15B).
 * Ensures safe fallback for media, technical specs, highlights, and standards.
 * 
 * @param {Object} p - Raw product document
 * @returns {Object|null} Normalized product
 */
export function normalizeProductData(p) {
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
    media: {
      thumbnailUrl,
      gallery,
      youtubeVideoId
    },
    thumbnailUrl,
    youtubeVideoId,
    content: {
      highlights,
      includedFiles
    },
    highlights,
    includedFiles,
    technical: {
      version,
      systemRequirements,
      compatibility,
      standards
    },
    systemRequirements,
    standards
  };
}
