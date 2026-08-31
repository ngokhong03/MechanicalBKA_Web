import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  X, 
  HardDrive, 
  Star, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  CheckCircle, 
  FileCode, 
  Layers, 
  FileCheck, 
  RefreshCw,
  Eye,
  Activity,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { storageService } from '../../services/storageService';
import { 
  extractYouTubeVideoId, 
  formatFileSize, 
  validateArtifactFile, 
  validateThumbnailFile,
  ALLOWED_ARTIFACT_EXTENSIONS 
} from '../../utils/mediaUtils';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const PRODUCT_TYPE_OPTIONS = [
  { value: 'EPXYZ_FILE', label: 'Engineering Paper XYZ (.epxyz)' },
  { value: 'PROJECT', label: 'Đồ Án Chi Tiết Máy' },
  { value: 'CAD_PROJECT', label: 'Bộ File CAD 3D' },
  { value: 'CAD_PACKAGE', label: 'Bộ File CAD 3D Tham Số Hóa' },
  { value: 'DRAWING', label: 'Bản Vẽ Kỹ Thuật' },
  { value: 'CALCULATION', label: 'Bảng Tính Toán' },
  { value: 'PYTHON_TOOL', label: 'Tool Tự Động Hóa Python' },
  { value: 'EXCEL_TOOL', label: 'Bảng Tính Tự Động Hóa Excel' },
  { value: 'TOOL', label: 'Tool Kỹ Thuật' },
  { value: 'TEMPLATE', label: 'Template Đồ Án' },
  { value: 'DOCUMENT', label: 'Tài Liệu Kỹ Thuật' },
  { value: 'OTHER', label: 'Khác' }
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAccess, setFilterAccess] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'media' | 'files' | 'content'
  const [showSeoSection, setShowSeoSection] = useState(false);
  
  // Storage Health Modal State
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [storageHealth, setStorageHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [verifyingArtifactId, setVerifyingArtifactId] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    version: '1.0.0',
    changelog: '',
    price: 0,
    accessType: 'PAID',
    productType: 'PROJECT',
    projectType: '',
    isPublished: true,
    isFeatured: false,
    specialtyIds: [],
    softwareIds: [],
    fileTypes: ['ZIP'],
    thumbnailUrl: '',
    gallery: [],
    youtubeVideoId: '',
    highlights: [],
    includedFiles: [],
    systemRequirements: '',
    standards: [],
    metaTitle: '',
    metaDescription: '',
    files: []
  });

  // Media Inputs State
  const [youtubeInput, setYoutubeInput] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // File Upload State
  const [artifactUploading, setArtifactUploading] = useState(false);
  const [artifactProgress, setArtifactProgress] = useState(0);
  const [artifactUploadStatus, setArtifactUploadStatus] = useState('');
  const [replacingFileId, setReplacingFileId] = useState(null);
  const [newHighlight, setNewHighlight] = useState('');
  const [newIncludedFile, setNewIncludedFile] = useState('');
  const [newStandard, setNewStandard] = useState('');

  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProducts, resSpecs, resSofts] = await Promise.all([
        adminService.getProducts(),
        adminService.getSpecialties(),
        adminService.getSoftware()
      ]);
      setProducts(resProducts);
      setSpecialties(resSpecs);
      setSoftware(resSofts);
    } catch (err) {
      console.error('[AdminProducts] Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenStorageHealth = async () => {
    setIsHealthModalOpen(true);
    setHealthLoading(true);
    try {
      const health = await adminService.getStorageHealthSummary();
      setStorageHealth(health);
    } catch (err) {
      console.error('[AdminProducts] Lỗi kiểm tra Storage:', err);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleVerifyArtifact = async (prodId, fileId) => {
    setVerifyingArtifactId(fileId);
    try {
      const res = await adminService.verifyArtifactIntegrity(prodId, fileId);
      setVerificationResults(prev => ({ ...prev, [fileId]: res }));
    } catch (err) {
      alert(`[Lỗi xác thực file] ${err.message}`);
    } finally {
      setVerifyingArtifactId(null);
    }
  };

  const handleTogglePublish = async (product) => {
    const nextState = !product.isPublished;
    try {
      await adminService.updateProduct(product.id, {
        ...product,
        isPublished: nextState
      });
      await loadData();
    } catch (err) {
      alert(`[Lỗi thay đổi trạng thái] ${err.message}`);
    }
  };

  const getDefaultFormData = () => ({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    version: '1.0.0',
    changelog: 'Phiên bản đầu tiên phát hành chính thức.',
    price: 150000,
    accessType: 'PAID',
    productType: 'PROJECT',
    projectType: 'Hộp giảm tốc',
    isPublished: true,
    isFeatured: false,
    specialtyIds: specialties.length > 0 ? [specialties[0].id] : [],
    softwareIds: [],
    fileTypes: ['ZIP'],
    thumbnailUrl: '',
    gallery: [],
    youtubeVideoId: '',
    highlights: [],
    includedFiles: [],
    systemRequirements: '',
    standards: ['TCVN', 'Tiêu chuẩn Cơ Khí'],
    metaTitle: '',
    metaDescription: '',
    files: []
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(getDefaultFormData());
    setYoutubeInput('');
    setActiveTab('basic');
    setShowSeoSection(false);
    setFormError('');
    setReplacingFileId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const media = product.media || {};
    const technical = product.technical || {};
    const content = product.content || {};

    const initialYoutube = media.youtubeVideoId || product.youtubeVideoId || '';
    setYoutubeInput(initialYoutube);

    setFormData({
      title: product.title || '',
      slug: product.slug || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      version: product.version || technical.version || (product.files?.[0]?.version) || '1.0.0',
      changelog: product.changelog || 'Cập nhật tài liệu kỹ thuật.',
      price: product.price || 0,
      accessType: product.accessType || 'PAID',
      productType: product.productType || 'PROJECT',
      projectType: product.projectType || '',
      isPublished: product.isPublished ?? true,
      isFeatured: product.isFeatured ?? false,
      specialtyIds: product.specialtyIds || [],
      softwareIds: product.softwareIds || [],
      fileTypes: product.fileTypes || ['ZIP'],
      thumbnailUrl: media.thumbnailUrl || product.thumbnailUrl || product.thumbnail || '',
      gallery: media.gallery || product.gallery || product.images || [],
      youtubeVideoId: initialYoutube,
      highlights: product.highlights || content.highlights || [],
      includedFiles: product.includedFiles || content.includedFiles || [],
      systemRequirements: product.systemRequirements || technical.systemRequirements || '',
      standards: product.standards || technical.standards || [],
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      files: (product.files || []).map(f => ({
        id: f.id,
        fileName: f.fileName || '',
        storagePath: f.storagePath || '',
        fileType: f.fileType || 'ZIP',
        fileSize: f.fileSize || 0,
        contentType: f.contentType || 'application/octet-stream',
        version: f.version || '1.0.0',
        checksum: f.checksum || '',
        createdAt: f.createdAt || new Date().toISOString(),
        updatedAt: f.updatedAt || new Date().toISOString()
      }))
    });

    setActiveTab('basic');
    setShowSeoSection(!!(product.metaTitle || product.metaDescription));
    setFormError('');
    setReplacingFileId(null);
    setIsModalOpen(true);
  };

  // YouTube Video Handlers
  const handleYoutubeChange = (e) => {
    const val = e.target.value;
    setYoutubeInput(val);
    const extractedId = extractYouTubeVideoId(val);
    setFormData(prev => ({ ...prev, youtubeVideoId: extractedId || '' }));
  };

  // Thumbnail Image Handlers
  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateThumbnailFile(file);
    if (!validation.isValid) {
      alert(`[Lỗi ảnh Thumbnail] ${validation.error}`);
      return;
    }

    setThumbnailUploading(true);
    setThumbnailProgress(0);
    setFormError('');

    try {
      const prodId = editingProduct?.id || `prod_${Date.now()}`;
      const uploadResult = await storageService.uploadProductThumbnail(
        prodId, 
        file, 
        (pct) => setThumbnailProgress(pct)
      );

      setFormData(prev => ({
        ...prev,
        thumbnailUrl: uploadResult.url
      }));
    } catch (err) {
      console.error('[AdminProducts] Lỗi tải ảnh thumbnail:', err);
      setFormError(`Tải ảnh thumbnail thất bại: ${err.message}`);
    } finally {
      setThumbnailUploading(false);
      setThumbnailProgress(0);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
  };

  // Gallery Multi-Image Handlers
  const handleGallerySelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setGalleryUploading(true);
    setFormError('');

    try {
      const prodId = editingProduct?.id || `prod_${Date.now()}`;
      const uploadedUrls = [];

      for (const file of files) {
        const res = await storageService.uploadGalleryImage(prodId, file);
        uploadedUrls.push(res.url);
      }

      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls]
      }));
    } catch (err) {
      console.error('[AdminProducts] Lỗi tải ảnh gallery:', err);
      setFormError(`Tải ảnh gallery thất bại: ${err.message}`);
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));
  };

  // Commercial Artifact Upload Handlers
  const handleArtifactFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateArtifactFile(file);
    if (!validation.isValid) {
      alert(`[Lỗi File Tải Lên] ${validation.error}`);
      return;
    }

    const prodId = editingProduct?.id || (formData.slug ? `prod_${formData.slug}` : `prod_${Date.now()}`);
    const artifactVersion = formData.version || '1.0.0';

    setArtifactUploading(true);
    setArtifactProgress(0);
    setArtifactUploadStatus('Đang tính toán SHA-256 & tải lên Firebase Storage...');
    setFormError('');

    try {
      const artifactMeta = await storageService.uploadProductArtifact(
        prodId,
        file,
        artifactVersion,
        (pct) => setArtifactProgress(pct)
      );

      if (replacingFileId) {
        const updatedFiles = formData.files.map(f => f.id === replacingFileId ? artifactMeta : f);
        setFormData(prev => ({
          ...prev,
          files: updatedFiles,
          version: artifactMeta.version
        }));
        setReplacingFileId(null);
      } else {
        setFormData(prev => ({
          ...prev,
          files: [...prev.files, artifactMeta],
          fileTypes: Array.from(new Set([...prev.fileTypes, artifactMeta.fileType]))
        }));
      }

      setArtifactUploadStatus('Tải lên thành công!');
    } catch (err) {
      console.error('[AdminProducts] Lỗi upload artifact:', err);
      setFormError(`Tải tệp tin kỹ thuật thất bại: ${err.message}`);
    } finally {
      setArtifactUploading(false);
      setArtifactProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTriggerReplaceFile = (fileId) => {
    setReplacingFileId(fileId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  // Highlights & Included Files Handlers
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }));
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
  };

  const handleAddIncludedFile = () => {
    if (!newIncludedFile.trim()) return;
    setFormData(prev => ({ ...prev, includedFiles: [...prev.includedFiles, newIncludedFile.trim()] }));
    setNewIncludedFile('');
  };

  const handleRemoveIncludedFile = (index) => {
    setFormData(prev => ({ ...prev, includedFiles: prev.includedFiles.filter((_, i) => i !== index) }));
  };

  const handleAddStandard = () => {
    if (!newStandard.trim()) return;
    setFormData(prev => ({ ...prev, standards: [...prev.standards, newStandard.trim()] }));
    setNewStandard('');
  };

  const handleRemoveStandard = (index) => {
    setFormData(prev => ({ ...prev, standards: prev.standards.filter((_, i) => i !== index) }));
  };

  const handleToggleSpecialty = (specId) => {
    const current = formData.specialtyIds || [];
    const updated = current.includes(specId) 
      ? current.filter(id => id !== specId) 
      : [...current, specId];
    setFormData(prev => ({ ...prev, specialtyIds: updated }));
  };

  const handleToggleSoftware = (softId) => {
    const current = formData.softwareIds || [];
    const updated = current.includes(softId)
      ? current.filter(id => id !== softId)
      : [...current, softId];
    setFormData(prev => ({ ...prev, softwareIds: updated }));
  };

  const handleSave = async (e, forcePublished = null) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề sản phẩm kỹ thuật.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('Vui lòng nhập slug URL.');
      return;
    }
    if (formData.price < 0) {
      setFormError('Giá bán không được âm.');
      return;
    }

    const payload = {
      ...formData,
      media: {
        thumbnailUrl: formData.thumbnailUrl || null,
        gallery: formData.gallery || [],
        youtubeVideoId: formData.youtubeVideoId || null
      },
      isPublished: forcePublished !== null ? forcePublished : formData.isPublished
    };

    setSaving(true);
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu sản phẩm kỹ thuật.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?`)) {
      try {
        await adminService.deleteProduct(product.id);
        await loadData();
      } catch (err) {
        alert(`[Lỗi Xóa Sản Phẩm] ${err.message}`);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.slug || '').toLowerCase().includes(search.toLowerCase());
    const matchAccess = filterAccess === 'ALL' || p.accessType === filterAccess;
    const matchType = filterType === 'ALL' || p.productType === filterType;
    return matchSearch && matchAccess && matchType;
  });

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductTypeLabel = (type) => {
    const found = PRODUCT_TYPE_OPTIONS.find(o => o.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="admin-products-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">QUẢN LÝ SẢN PHẨM & TOOL KỸ THUẬT</h1>
          <p className="admin-page-desc">Quản trị catalog, tải file thương mại (.zip, .xlsx, .epxyz, .py), ảnh thumbnail, gallery và video demo</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" icon={Activity} onClick={handleOpenStorageHealth} style={{ fontSize: '11px' }}>
            Sức Khỏe Storage
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Thêm Sản Phẩm Mới
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-table-toolbar glass font-mono">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm sản phẩm / slug..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select 
            value={filterAccess} 
            onChange={(e) => setFilterAccess(e.target.value)}
            className="admin-form-select"
            style={{ padding: '8px 12px' }}
          >
            <option value="ALL">Tất cả loại truy cập</option>
            <option value="FREE">Miễn Phí (FREE)</option>
            <option value="PAID">Trả Phí (PAID)</option>
            <option value="COURSE_ONLY">Chỉ kèm khóa học</option>
          </select>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="admin-form-select"
            style={{ padding: '8px 12px' }}
          >
            <option value="ALL">Tất cả phân loại</option>
            {PRODUCT_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredProducts.length} sản phẩm
        </span>
      </div>

      {/* Table */}
      <div className="admin-table-container font-mono">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản Phẩm & Phiên Bản</th>
              <th>Phân Loại</th>
              <th>Truy cập</th>
              <th>Giá Bán</th>
              <th>File Gốc</th>
              <th>Media</th>
              <th>Trạng thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const hasThumb = Boolean(product.media?.thumbnailUrl || product.thumbnailUrl || product.thumbnail);
              const hasVid = Boolean(product.media?.youtubeVideoId || product.youtubeVideoId);
              const galleryCount = product.media?.gallery?.length || 0;
              return (
                <tr key={product.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#FFF', maxWidth: '280px' }}>{product.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      /{product.slug}
                      <span style={{ color: '#10B981', marginLeft: '6px' }}>v{product.version || '1.0.0'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill info" style={{ fontSize: '10px' }}>{getProductTypeLabel(product.productType)}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${product.accessType === 'FREE' ? 'info' : product.accessType === 'PAID' ? 'warning' : 'danger'}`}>
                      {product.accessType}
                    </span>
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HardDrive size={13} /> {product.files?.length || 0} file
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ color: hasThumb ? '#10B981' : 'var(--text-muted)', fontSize: '11px' }} title={hasThumb ? `Thumbnail sẵn sàng (${galleryCount} ảnh gallery)` : 'Chưa có thumbnail'}>
                        <ImageIcon size={14} />
                      </span>
                      <span style={{ color: hasVid ? '#EF4444' : 'var(--text-muted)', fontSize: '11px' }} title={hasVid ? `YouTube ID: ${product.media?.youtubeVideoId || product.youtubeVideoId}` : 'Chưa có demo'}>
                        <Video size={14} />
                      </span>
                    </div>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      onClick={() => handleTogglePublish(product)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                      title="Nhấp để chuyển đổi Đã đăng / Bản nháp"
                    >
                      {product.isPublished ? (
                        <span style={{ color: '#10B981', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ToggleRight size={15} /> Đã đăng
                        </span>
                      ) : (
                        <span style={{ color: '#F59E0B', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ToggleLeft size={15} /> Bản nháp
                        </span>
                      )}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a 
                        href={`/store/${product.slug}?preview=true`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="admin-preview-btn font-mono"
                        style={{ padding: '4px 8px', fontSize: '11px', color: '#38BDF8', textDecoration: 'none', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        title="Mở xem trước storefront"
                      >
                        <ExternalLink size={11} /> Xem
                      </a>
                      <Button variant="outline" onClick={() => handleOpenEdit(product)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                        <Edit2 size={12} style={{ marginRight: '3px' }} /> Sửa
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(product)} style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* STORAGE HEALTH MODAL */}
      {isHealthModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content font-mono" style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                SỨC KHỎE LƯU TRỮ & TOÀN VẸN FILE (STORAGE HEALTH DASHBOARD)
              </span>
              <button onClick={() => setIsHealthModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {healthLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary)' }}>
                ĐANG QUÉT VÀ KIỂM TRA SỨC KHỎE STORAGE...
              </div>
            ) : storageHealth ? (
              <div>
                {/* Stats Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TỔNG SẢN PHẨM</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFF' }}>{storageHealth.totalProducts}</div>
                    <div style={{ fontSize: '10px', color: '#10B981' }}>{storageHealth.publishedCount} Đã đăng | {storageHealth.draftCount} Nháp</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TỔNG ARTIFACTS</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38BDF8' }}>{storageHealth.totalArtifacts}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tệp thương mại private</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>THIẾU THUMBNAIL</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: storageHealth.missingThumbnails > 0 ? '#F59E0B' : '#10B981' }}>
                      {storageHealth.missingThumbnails}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cần bổ sung ảnh</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LỖI TOÀN VẸN CHECKSUM</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: storageHealth.missingChecksums > 0 ? '#EF4444' : '#10B981' }}>
                      {storageHealth.missingChecksums}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{storageHealth.overallStatus}</div>
                  </div>
                </div>

                {/* Per Product Health Table */}
                <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '10px', display: 'block' }}>
                  DANH SÁCH SẢN PHẨM & TÌNH TRẠNG ARTIFACT
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                  {storageHealth.productHealthList.map(p => (
                    <div key={p.productId} style={{ 
                      background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ color: '#FFF', fontWeight: '600', fontSize: '12px' }}>{p.title}</span>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          v{p.version} | {p.artifactCount} artifacts | Thumbnail: {p.hasThumbnail ? '✓' : '✗'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`status-pill ${p.status === 'HEALTHY' ? 'success' : 'warning'}`} style={{ fontSize: '10px' }}>
                          {p.status}
                        </span>
                        <Button 
                          variant="outline" 
                          onClick={() => handleVerifyArtifact(p.productId, 'art_main')}
                          style={{ padding: '3px 8px', fontSize: '10px' }}
                        >
                          <ShieldCheck size={11} style={{ marginRight: '3px' }} /> Xác Thực
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content font-mono" style={{ maxHeight: '90vh', overflowY: 'auto', maxWidth: '860px' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                {editingProduct ? 'CHỈNH SỬA SẢN PHẨM & TOOL' : 'TẠO MỚI SẢN PHẨM & TOOL THƯƠNG MẠI'}
              </span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className={`admin-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
                style={{ 
                  background: activeTab === 'basic' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: `1px solid ${activeTab === 'basic' ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
                  color: activeTab === 'basic' ? '#FFF' : 'var(--text-muted)',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit'
                }}
              >
                1. Thông Tin Cơ Bản
              </button>
              <button 
                type="button" 
                className={`admin-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
                style={{ 
                  background: activeTab === 'media' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: `1px solid ${activeTab === 'media' ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
                  color: activeTab === 'media' ? '#FFF' : 'var(--text-muted)',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit'
                }}
              >
                2. Thumbnail, Gallery & Demo
              </button>
              <button 
                type="button" 
                className={`admin-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
                style={{ 
                  background: activeTab === 'files' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: `1px solid ${activeTab === 'files' ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
                  color: activeTab === 'files' ? '#FFF' : 'var(--text-muted)',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit'
                }}
              >
                3. File Thương Mại ({formData.files.length})
              </button>
              <button 
                type="button" 
                className={`admin-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
                style={{ 
                  background: activeTab === 'content' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  border: `1px solid ${activeTab === 'content' ? '#38BDF8' : 'rgba(255,255,255,0.1)'}`,
                  color: activeTab === 'content' ? '#FFF' : 'var(--text-muted)',
                  padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit'
                }}
              >
                4. Nội Dung & Tiêu Chuẩn
              </button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>
                <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {formError}
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Tiêu đề sản phẩm kỹ thuật *</label>
                    <input 
                      type="text" 
                      className="admin-form-input" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ví dụ: Shaft Design Automation Tool — Tự động hóa thiết kế trục TCVN"
                      required
                    />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Slug URL *</label>
                      <input 
                        type="text" 
                        className="admin-form-input" 
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="shaft-design-automation-tool"
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Phiên bản Sản Phẩm (Semantic Version)</label>
                      <input 
                        type="text" 
                        className="admin-form-input" 
                        value={formData.version} 
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Nhật ký thay đổi (Changelog)</label>
                    <input 
                      type="text" 
                      className="admin-form-input" 
                      value={formData.changelog} 
                      onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                      placeholder="VD: Cập nhật thuật toán tính ứng suất theo TCVN 1065:2004..."
                    />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Phân Loại Sản Phẩm</label>
                      <select 
                        className="admin-form-select"
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      >
                        {PRODUCT_TYPE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Loại Truy Cập</label>
                      <select 
                        className="admin-form-select"
                        value={formData.accessType}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          accessType: e.target.value,
                          price: e.target.value === 'FREE' || e.target.value === 'COURSE_ONLY' ? 0 : formData.price
                        })}
                      >
                        <option value="FREE">Miễn Phí (FREE)</option>
                        <option value="PAID">Trả Phí (PAID)</option>
                        <option value="COURSE_ONLY">Chỉ Kèm Khóa Học (COURSE_ONLY)</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Giá Bán (VNĐ)</label>
                      <input 
                        type="number" 
                        className="admin-form-input" 
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        disabled={formData.accessType === 'FREE' || formData.accessType === 'COURSE_ONLY'}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Trạng thái phát hành</label>
                      <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={formData.isPublished} 
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          />
                          <span>Công khai (Published)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={formData.isFeatured} 
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          />
                          <Star size={12} style={{ color: formData.isFeatured ? '#FBBF24' : 'var(--text-muted)' }} />
                          <span>Nổi bật</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Mô tả ngắn (Hiển thị đầu trang sản phẩm)</label>
                    <input 
                      type="text" 
                      className="admin-form-input" 
                      value={formData.shortDescription} 
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Tóm tắt giá trị chính của tool/file kỹ thuật trong 1 câu..."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Mô tả chi tiết sản phẩm</label>
                    <textarea 
                      className="admin-form-textarea" 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Chi tiết về thuật toán, tính năng, hướng dẫn mở file..."
                    ></textarea>
                  </div>

                  {/* Taxonomy */}
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '8px', display: 'block' }}>CHUYÊN NGÀNH</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      {specialties.map(spec => (
                        <label key={spec.id} style={{ 
                          display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
                          background: (formData.specialtyIds || []).includes(spec.id) ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${(formData.specialtyIds || []).includes(spec.id) ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '6px', padding: '6px 10px', fontSize: '11px'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={(formData.specialtyIds || []).includes(spec.id)}
                            onChange={() => handleToggleSpecialty(spec.id)}
                            style={{ accentColor: '#38BDF8' }}
                          />
                          {spec.name}
                        </label>
                      ))}
                    </div>

                    <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '8px', display: 'block' }}>PHẦN MỀM LIÊN QUAN</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {software.map(soft => (
                        <label key={soft.id} style={{ 
                          display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
                          background: (formData.softwareIds || []).includes(soft.id) ? 'rgba(167, 139, 250, 0.15)' : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${(formData.softwareIds || []).includes(soft.id) ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '6px', padding: '6px 10px', fontSize: '11px'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={(formData.softwareIds || []).includes(soft.id)}
                            onChange={() => handleToggleSoftware(soft.id)}
                            style={{ accentColor: '#A78BFA' }}
                          />
                          {soft.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA, GALLERY & DEMO */}
              {activeTab === 'media' && (
                <div>
                  {/* Thumbnail Image Uploader */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="admin-form-label" style={{ color: '#FFF', margin: 0 }}>
                        <ImageIcon size={14} style={{ marginRight: '6px', verticalAlign: 'middle', color: '#38BDF8' }} />
                        ẢNH THUMBNAIL SẢN PHẨM
                      </label>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lưu tại: public/products/{'{id}'}/thumbnail.webp</span>
                    </div>

                    <input 
                      type="file" 
                      ref={thumbnailInputRef} 
                      onChange={handleThumbnailSelect} 
                      accept=".jpg,.jpeg,.png,.webp,.svg"
                      style={{ display: 'none' }}
                    />

                    {formData.thumbnailUrl ? (
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img 
                          src={formData.thumbnailUrl} 
                          alt="Thumbnail Preview" 
                          style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #38BDF8' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} /> Thumbnail đã sẵn sàng
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => thumbnailInputRef.current?.click()}
                              disabled={thumbnailUploading}
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                            >
                              Thay Đổi Ảnh
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleRemoveThumbnail}
                              style={{ padding: '4px 10px', fontSize: '11px', color: '#EF4444' }}
                            >
                              Gỡ Ảnh
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => thumbnailInputRef.current?.click()}
                        style={{ 
                          border: '2px dashed rgba(56, 189, 248, 0.3)', 
                          borderRadius: '8px', 
                          padding: '24px', 
                          textAlign: 'center', 
                          cursor: 'pointer',
                          background: 'rgba(56, 189, 248, 0.02)'
                        }}
                      >
                        <UploadCloud size={32} style={{ color: '#38BDF8', marginBottom: '8px' }} />
                        <div style={{ color: '#FFF', fontSize: '13px', fontWeight: '600' }}>
                          {thumbnailUploading ? `Đang tải ảnh lên (${thumbnailProgress}%)...` : 'Nhấp để chọn hoặc kéo thả ảnh Thumbnail'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                          Hỗ trợ JPG, PNG, WEBP (Tối đa 5 MB)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-Image Gallery Uploader */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label className="admin-form-label" style={{ color: '#FFF', margin: 0 }}>
                        <Layers size={14} style={{ marginRight: '6px', verticalAlign: 'middle', color: '#A78BFA' }} />
                        BỘ ẢNH GALLERY ({formData.gallery.length} ảnh)
                      </label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={galleryUploading}
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                      >
                        + Thêm Ảnh Gallery
                      </Button>
                    </div>

                    <input 
                      type="file" 
                      ref={galleryInputRef} 
                      onChange={handleGallerySelect} 
                      accept=".jpg,.jpeg,.png,.webp,.svg"
                      multiple
                      style={{ display: 'none' }}
                    />

                    {formData.gallery.length > 0 ? (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {formData.gallery.map((imgUrl, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '100px', height: '65px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#EF4444', cursor: 'pointer', borderRadius: '3px', padding: '2px' }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                        Chưa có ảnh screenshot bổ sung. Nhấp "+ Thêm Ảnh Gallery" để tải thêm.
                      </div>
                    )}
                  </div>

                  {/* YouTube Demo Field */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
                    <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '8px', display: 'block' }}>
                      <Video size={14} style={{ marginRight: '6px', verticalAlign: 'middle', color: '#EF4444' }} />
                      VIDEO DEMO SẢN PHẨM (YOUTUBE URL HOẶC VIDEO ID)
                    </label>

                    <input 
                      type="text" 
                      className="admin-form-input" 
                      value={youtubeInput} 
                      onChange={handleYoutubeChange}
                      placeholder="Dán link YouTube (VD: https://youtu.be/dQw4w9WgXcQ hoặc ID: dQw4w9WgXcQ)"
                    />

                    {formData.youtubeVideoId ? (
                      <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '12px', color: '#A7F3D0' }}>
                        <CheckCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Đã chuẩn hóa YouTube ID: <strong>{formData.youtubeVideoId}</strong>
                        <span style={{ marginLeft: '12px', color: 'var(--text-muted)', fontSize: '11px' }}>
                          (Sẵn sàng nhúng trình phát ở Storefront)
                        </span>
                      </div>
                    ) : youtubeInput.trim() ? (
                      <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '11px', color: '#FCA5A5' }}>
                        <AlertTriangle size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Link YouTube không hợp lệ hoặc không trích xuất được Video ID (11 ký tự).
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* TAB 3: COMMERCIAL FILES */}
              {activeTab === 'files' && (
                <div>
                  {/* File Upload Box */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleArtifactFileSelect} 
                    style={{ display: 'none' }}
                  />

                  <div 
                    onClick={() => !artifactUploading && fileInputRef.current?.click()}
                    style={{ 
                      border: '2px dashed rgba(16, 185, 129, 0.4)', 
                      borderRadius: '8px', 
                      padding: '24px', 
                      textAlign: 'center', 
                      cursor: artifactUploading ? 'not-allowed' : 'pointer',
                      background: 'rgba(16, 185, 129, 0.03)',
                      marginBottom: '20px'
                    }}
                  >
                    <UploadCloud size={36} style={{ color: '#10B981', marginBottom: '8px' }} />
                    <div style={{ color: '#FFF', fontSize: '14px', fontWeight: '600' }}>
                      {artifactUploading 
                        ? `Đang xử lý & tải lên: ${artifactProgress}%` 
                        : (replacingFileId ? 'Chọn file mới để thay thế tệp hiện tại' : 'Nhấp để tải lên tệp tin kỹ thuật (.ZIP, .XLSX, .EPXYZ, .PY, CAD...)')}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px' }}>
                      Hệ thống tự động tính SHA-256 Checksum, dung lượng & phân loại file (Tối đa 250 MB).
                    </div>
                    {artifactUploading && (
                      <div style={{ marginTop: '12px', width: '100%', maxWidth: '320px', margin: '12px auto 0', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${artifactProgress}%`, height: '100%', background: '#10B981', transition: 'width 0.2s' }}></div>
                      </div>
                    )}
                  </div>

                  {/* Artifacts List */}
                  <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '10px', display: 'block' }}>
                    DANH SÁCH FILE THƯƠNG MẠI ({formData.files.length} tệp)
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formData.files.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '16px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                        Chưa có file nào được đính kèm. Vui lòng tải lên ít nhất 1 file thương mại.
                      </div>
                    ) : (
                      formData.files.map((file) => (
                        <div key={file.id} style={{ 
                          background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', 
                          borderRadius: '8px', padding: '12px 14px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', 
                                border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 8px', 
                                borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' 
                              }}>
                                {file.fileType || 'ZIP'}
                              </span>
                              <span style={{ fontSize: '13px', color: '#FFF', fontWeight: '600' }}>{file.fileName}</span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => handleTriggerReplaceFile(file.id)}
                                style={{ padding: '3px 8px', fontSize: '10px' }}
                              >
                                <RefreshCw size={11} style={{ marginRight: '3px' }} /> Thay Thế
                              </Button>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveFile(file.id)}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                            <div>Dung lượng: <strong style={{ color: '#FFF' }}>{formatFileSize(file.fileSize)}</strong></div>
                            <div>Phiên bản: <strong style={{ color: '#10B981' }}>v{file.version || '1.0.0'}</strong></div>
                          </div>

                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                            SHA-256: <span style={{ color: '#FBBF24' }}>{file.checksum ? file.checksum.substring(0, 24) + '...' : 'Tự động tính'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTENT & TECHNICAL */}
              {activeTab === 'content' && (
                <div>
                  {/* Highlights */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="admin-form-label" style={{ color: '#FFF' }}>ĐIỂM NỔI BẬT (HIGHLIGHTS)</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        type="text" 
                        className="admin-form-input" 
                        value={newHighlight} 
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Thêm điểm nổi bật (VD: Tính toán tự động theo TCVN 1065...)"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddHighlight} style={{ padding: '6px 12px', fontSize: '11px' }}>
                        + Thêm
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {formData.highlights.map((hl, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}>
                          <span>✓ {hl}</span>
                          <button type="button" onClick={() => handleRemoveHighlight(idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Included Files */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="admin-form-label" style={{ color: '#FFF' }}>DANH SÁCH BỘ TÀI LIỆU BAO GỒM (INCLUDED FILES)</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        type="text" 
                        className="admin-form-input" 
                        value={newIncludedFile} 
                        onChange={(e) => setNewIncludedFile(e.target.value)}
                        placeholder="Thêm thành phần (VD: File Engineering Paper XYZ .epxyz, File CAD 3D Inventor, Tài liệu hướng dẫn...)"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIncludedFile(); } }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddIncludedFile} style={{ padding: '6px 12px', fontSize: '11px' }}>
                        + Thêm
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {formData.includedFiles.map((inc, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}>
                          <span>📁 {inc}</span>
                          <button type="button" onClick={() => handleRemoveIncludedFile(idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Requirements */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Yêu cầu hệ thống (System Requirements)</label>
                    <textarea 
                      className="admin-form-textarea" 
                      rows={2}
                      value={formData.systemRequirements}
                      onChange={(e) => setFormData({ ...formData, systemRequirements: e.target.value })}
                      placeholder="VD: Engineering Paper XYZ phiên bản tương thích, Windows 10/11 64-bit, Autodesk Inventor 2022+..."
                    ></textarea>
                  </div>

                  {/* Standards */}
                  <div style={{ marginBottom: '16px' }}>
                    <label className="admin-form-label" style={{ color: '#FFF' }}>TIÊU CHUẨN ÁP DỤNG (STANDARDS / REFERENCES)</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        type="text" 
                        className="admin-form-input" 
                        value={newStandard} 
                        onChange={(e) => setNewStandard(e.target.value)}
                        placeholder="VD: TCVN 1065:2004, Trịnh Chất & Lê Văn Uyển..."
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStandard(); } }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddStandard} style={{ padding: '6px 12px', fontSize: '11px' }}>
                        + Thêm
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {formData.standards.map((std, idx) => (
                        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#7DD3FC', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                          {std}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveStandard(idx)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SEO Section Collapsible */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setShowSeoSection(!showSeoSection)}
                      style={{ 
                        background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600',
                        fontFamily: 'inherit', padding: 0
                      }}
                    >
                      <Globe size={14} style={{ color: '#38BDF8' }} />
                      CẤU HÌNH SEO & META TAGS
                      {showSeoSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showSeoSection && (
                      <div style={{ marginTop: '12px' }}>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Meta Title (SEO)</label>
                          <input 
                            type="text" 
                            className="admin-form-input" 
                            value={formData.metaTitle} 
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                            placeholder="Tiêu đề hiển thị trên Google Search — tối đa 60 ký tự"
                            maxLength={70}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-form-label">Meta Description (SEO)</label>
                          <textarea 
                            className="admin-form-textarea" 
                            rows={2}
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            placeholder="Mô tả hiển thị trên Google — tối đa 160 ký tự"
                            maxLength={170}
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="admin-modal-actions" style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {formData.slug && (
                    <a 
                      href={`/store/${formData.slug}?preview=true`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: '12px', color: '#38BDF8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={13} /> Xem trước storefront
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                    Hủy Bỏ
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => handleSave(null, false)} 
                    disabled={saving || artifactUploading || thumbnailUploading}
                    style={{ borderColor: '#F59E0B', color: '#FCD34D' }}
                  >
                    Lưu Bản Nháp (Draft)
                  </Button>
                  <Button 
                    variant="primary" 
                    type="button" 
                    onClick={() => handleSave(null, true)} 
                    disabled={saving || artifactUploading || thumbnailUploading}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu & Xuất Bản (Publish)'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
