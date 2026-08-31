/**
 * MechanicalBKA — Product Constants
 * Single source of truth for all product-related enums and label mappings.
 * Import from here instead of hard-coding labels in individual components.
 */

// ============================================================
// PRODUCT TYPE
// ============================================================
export const PRODUCT_TYPES = {
  EPXYZ_FILE: 'EPXYZ_FILE',
  PROJECT: 'PROJECT',
  CAD_PROJECT: 'CAD_PROJECT',
  DRAWING: 'DRAWING',
  CALCULATION: 'CALCULATION',
  PYTHON_TOOL: 'PYTHON_TOOL',
  EXCEL_TOOL: 'EXCEL_TOOL',
  TOOL: 'TOOL',
  TEMPLATE: 'TEMPLATE',
  DOCUMENT: 'DOCUMENT',
  OTHER: 'OTHER'
};

export const PRODUCT_TYPE_LABELS = {
  [PRODUCT_TYPES.EPXYZ_FILE]: 'Engineering Paper XYZ',
  [PRODUCT_TYPES.PROJECT]: 'Đồ Án Chi Tiết Máy',
  [PRODUCT_TYPES.CAD_PROJECT]: 'Bộ File CAD 3D',
  [PRODUCT_TYPES.DRAWING]: 'Bản Vẽ Kỹ Thuật',
  [PRODUCT_TYPES.CALCULATION]: 'Bảng Tính Toán',
  [PRODUCT_TYPES.PYTHON_TOOL]: 'Tool Tự Động Hóa Python',
  [PRODUCT_TYPES.EXCEL_TOOL]: 'Bảng Tính Tự Động Hóa Excel',
  [PRODUCT_TYPES.TOOL]: 'Tool Kỹ Thuật',
  [PRODUCT_TYPES.TEMPLATE]: 'Template Đồ Án',
  [PRODUCT_TYPES.DOCUMENT]: 'Tài Liệu Kỹ Thuật',
  [PRODUCT_TYPES.OTHER]: 'Khác'
};

// Short labels for badges on ProductCard
export const PRODUCT_TYPE_BADGE_LABELS = {
  [PRODUCT_TYPES.EPXYZ_FILE]: 'ENGINEERING PAPER XYZ',
  [PRODUCT_TYPES.PROJECT]: 'ĐỒ ÁN',
  [PRODUCT_TYPES.CAD_PROJECT]: 'CAD 3D',
  [PRODUCT_TYPES.DRAWING]: 'BẢN VẼ',
  [PRODUCT_TYPES.CALCULATION]: 'TÍNH TOÁN',
  [PRODUCT_TYPES.PYTHON_TOOL]: 'TOOL PYTHON',
  [PRODUCT_TYPES.EXCEL_TOOL]: 'BẢNG TÍNH EXCEL',
  [PRODUCT_TYPES.TOOL]: 'TOOL',
  [PRODUCT_TYPES.TEMPLATE]: 'TEMPLATE',
  [PRODUCT_TYPES.DOCUMENT]: 'TÀI LIỆU',
  [PRODUCT_TYPES.OTHER]: 'KHÁC'
};

export const PRODUCT_TYPE_OPTIONS = Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label
}));

// ============================================================
// PROJECT TYPE (for productType = PROJECT or CAD_PROJECT)
// ============================================================
export const PROJECT_TYPES = {
  GEARBOX: 'Hộp giảm tốc',
  CONVEYOR: 'Hệ dẫn động băng tải',
  GEAR_TRANSMISSION: 'Bộ truyền bánh răng',
  SHAFT: 'Thiết kế trục',
  BEARING: 'Thiết kế ổ lăn',
  COUPLING: 'Khớp nối',
  MOLD: 'Khuôn mẫu',
  CUTTING_TOOL: 'Dụng cụ cắt',
  EXTRUSION_DIE: 'Đầu đùn định hình',
  CAD_3D: 'CAD 3D',
  CALCULATION: 'Tính toán kỹ thuật',
  PROGRAMMING_TOOL: 'Công cụ lập trình',
  TEMPLATE: 'Template thuyết minh',
  HANDBOOK: 'Sổ tay kỹ thuật',
  GUIDE: 'Cẩm nang kỹ thuật',
  LECTURE: 'Tài liệu giảng dạy',
  SIMULATION: 'Dữ liệu mô phỏng',
  FORMING_DIE: 'Khuôn dập',
  DRAWING: 'Bản vẽ kỹ thuật',
  OTHER: 'Khác'
};

export const PROJECT_TYPE_OPTIONS = Object.entries(PROJECT_TYPES).map(([key, label]) => ({
  value: label,
  label
}));

// ============================================================
// FILE TYPES
// ============================================================
export const FILE_TYPES = [
  'EPXYZ', 'ZIP', 'PY', 'IAM', 'IPT', 'SLDASM', 'SLDPRT', 'STEP',
  'DWG', 'DXF', 'PDF', 'XLSX', 'DOCX', 'CAD', 'STL', 'IGES'
];

// ============================================================
// ACCESS TYPES
// ============================================================
export const ACCESS_TYPES = {
  FREE: 'FREE',
  PAID: 'PAID',
  COURSE_ONLY: 'COURSE_ONLY'
};

export const ACCESS_TYPE_LABELS = {
  [ACCESS_TYPES.FREE]: 'Miễn Phí',
  [ACCESS_TYPES.PAID]: 'Trả Phí',
  [ACCESS_TYPES.COURSE_ONLY]: 'Chỉ Kèm Khóa Học'
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get Vietnamese label for a productType enum value.
 * @param {string} type - e.g., 'PROJECT', 'CAD_PROJECT'
 * @returns {string} Vietnamese label
 */
export const getProductTypeLabel = (type) => {
  return PRODUCT_TYPE_LABELS[type] || type || 'File Kỹ Thuật';
};

/**
 * Get short badge label for a productType enum value.
 * @param {string} type - e.g., 'PROJECT'
 * @returns {string} Short badge text
 */
export const getProductTypeBadgeLabel = (type) => {
  return PRODUCT_TYPE_BADGE_LABELS[type] || type || 'FILE';
};

/**
 * Get Vietnamese label for a projectType string value.
 * If projectType is already a Vietnamese label (legacy), returns as-is.
 * @param {string} projectType - e.g., 'Hộp giảm tốc'
 * @returns {string}
 */
export const getProjectTypeLabel = (projectType) => {
  if (!projectType) return '';
  // If it's a key, look up the label
  if (PROJECT_TYPES[projectType]) return PROJECT_TYPES[projectType];
  // Otherwise it's already a Vietnamese string
  return projectType;
};
