import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Download, 
  AlertTriangle, 
  Check, 
  ShoppingBag, 
  Info, 
  FileText, 
  CheckCircle, 
  Video, 
  Layers, 
  Cpu, 
  Calculator, 
  FileSpreadsheet, 
  FileCode, 
  ShieldCheck, 
  HardDrive, 
  Eye, 
  BookOpen, 
  Settings, 
  Award,
  Sparkles
} from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import { accessService } from '../services/accessService';
import { downloadService } from '../services/downloadService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { normalizeProductData, formatFileSize } from '../utils/mediaUtils';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './ProductDetail.css';

// Product type human-readable labels
const PRODUCT_TYPE_LABELS = {
  EPXYZ_FILE: 'Engineering Paper XYZ',
  PROJECT: 'Đồ Án Chi Tiết Máy',
  PYTHON_TOOL: 'Tool Tự Động Hóa Python',
  EXCEL_TOOL: 'Bảng Tính Tự Động Hóa Excel',
  CAD_PACKAGE: 'Bộ File CAD 3D Tham Số Hóa',
  CAD_PROJECT: 'Bộ File CAD 3D',
  DRAWING: 'Bản Vẽ Kỹ Thuật',
  CALCULATION: 'Bảng Tính Toán',
  TOOL: 'Tool Kỹ Thuật',
  TEMPLATE: 'Template Đồ Án',
  DOCUMENT: 'Tài Liệu Kỹ Thuật',
  OTHER: 'Sản Phẩm Kỹ Thuật'
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'EPXYZ_FILE':
      return <Sparkles size={15} style={{ color: '#A78BFA' }} />;
    case 'PYTHON_TOOL':
      return <FileCode size={15} style={{ color: '#38BDF8' }} />;
    case 'EXCEL_TOOL':
    case 'CALCULATION':
      return <Calculator size={15} style={{ color: '#10B981' }} />;
    case 'CAD_PACKAGE':
    case 'CAD_PROJECT':
      return <Layers size={15} style={{ color: '#F59E0B' }} />;
    case 'PROJECT':
      return <Cpu size={15} style={{ color: '#F97316' }} />;
    default:
      return <FileText size={15} style={{ color: '#94A3B8' }} />;
  }
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('preview') === 'true';

  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [linkingCourses, setLinkingCourses] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true || (user && user.email === 'admin@mechanicalbka.com');

  useEffect(() => {
    let isMounted = true;
    async function loadProductData() {
      setLoading(true);
      try {
        const [rawProduct, specs, softs, allCourses, allLessons] = await Promise.all([
          dataProvider.getProductBySlug(slug),
          dataProvider.getSpecialties(),
          dataProvider.getSoftware(),
          dataProvider.getCourses(),
          dataProvider.getLessons()
        ]);

        const normalized = normalizeProductData(rawProduct);

        let accessOk = false;
        if (normalized) {
          accessOk = await accessService.canAccessProduct(user?.uid, normalized.id);
        }

        if (isMounted && normalized) {
          setProduct(normalized);
          setHasAccess(accessOk);

          // Initial selected image
          const initialImg = normalized.media?.thumbnailUrl || (normalized.media?.gallery?.[0]) || '';
          setSelectedImage(initialImg);

          // Find linking courses (if COURSE_ONLY)
          const linked = (allCourses || []).filter(c => {
            const courseLessons = (allLessons || []).filter(l => l.courseId === c.id);
            return courseLessons.some(l => (l.materialIds || []).includes(normalized.id));
          });
          setLinkingCourses(linked);
        }

        if (isMounted) {
          setSpecialtiesList(specs || []);
          setSoftwareList(softs || []);
        }
      } catch (err) {
        console.error('[ProductDetail] Lỗi tải chi tiết sản phẩm:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductData();
    return () => { isMounted = false; };
  }, [slug, user]);

  // Dynamic SEO
  useEffect(() => {
    if (product) {
      document.title = product.metaTitle 
        ? `${product.metaTitle} | MechanicalBKA` 
        : `${product.title} (v${product.version}) — MechanicalBKA`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && (product.metaDescription || product.shortDescription || product.description)) {
        metaDesc.setAttribute('content', product.metaDescription || product.shortDescription || product.description.substring(0, 160));
      }
    }
    return () => {
      document.title = 'MechanicalBKA — Kho File Kỹ Thuật Cơ Khí & Tool Tự Động Hóa';
    };
  }, [product]);

  if (loading) {
    return (
      <div className="container font-mono" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--primary)' }}>
        ĐANG TẢI THÔNG TIN SẢN PHẨM KỸ THUẬT...
      </div>
    );
  }

  // If not found or if unpublished and not admin
  if (!product || (!product.isPublished && !isAdmin && !isPreviewMode)) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h2>Không tìm thấy sản phẩm</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px 0' }}>
          Sản phẩm kỹ thuật không tồn tại, đã bị xóa hoặc chưa được công khai.
        </p>
        <Link to="/store">
          <Button variant="primary">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  // Resolve specialty & software
  const productSpecialties = specialtiesList.filter(spec => (product.specialtyIds || []).includes(spec.id));
  const productSoftware = softwareList.filter(soft => (product.softwareIds || []).includes(soft.id));

  // Calculate stats
  const fileCount = product.files?.length || 0;
  const totalSizeBytes = product.files?.reduce((acc, file) => acc + (file.fileSize || 0), 0) || 0;

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleSecureDownload = async (fileId, fileName) => {
    setDownloadingId(fileId);
    setDownloadError('');
    try {
      await downloadService.downloadProductFile(product.id, fileId, fileName);
    } catch (err) {
      setDownloadError(err.message || 'Không thể tải tệp tin lúc này.');
    } finally {
      setDownloadingId(null);
    }
  };

  const firstFile = product.files && product.files.length > 0 ? product.files[0] : null;
  const allImages = [
    ...(product.media?.thumbnailUrl ? [product.media.thumbnailUrl] : []),
    ...(product.media?.gallery || [])
  ];
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="product-detail-page container" style={{ padding: '36px 24px 60px' }}>
      {/* Draft Preview Banner for Admin */}
      {!product.isPublished && (
        <div className="draft-preview-banner font-mono">
          <AlertTriangle size={16} />
          <span>
            <strong>CHẾ ĐỘ XEM TRƯỚC (DRAFT PREVIEW)</strong>: Sản phẩm này đang ở trạng thái bản nháp và chưa công khai với khách hàng.
          </span>
        </div>
      )}

      {/* Top back breadcrumb */}
      <div className="product-breadcrumb font-mono">
        <Link to="/store">Kho File Kỹ Thuật</Link>
        <span className="separator">/</span>
        <span className="current">{product.title}</span>
      </div>

      <div className="product-layout-grid">
        {/* Left Column: Media & Product Content */}
        <div className="product-main-column">
          
          {/* Header Title Block */}
          <div className="product-header-block">
            <div className="product-meta-badges">
              <span className="product-type-badge font-mono">
                {getTypeIcon(product.productType)}
                <span>{PRODUCT_TYPE_LABELS[product.productType] || product.productType}</span>
              </span>
              <span className="version-pill font-mono">v{product.version}</span>
              {product.projectType && (
                <span className="detail-tag font-mono project-tag">
                  {product.projectType}
                </span>
              )}
            </div>

            <h1 className="product-detail-title">{product.title}</h1>

            {product.shortDescription && (
              <p className="product-short-desc">{product.shortDescription}</p>
            )}

            {/* Tags: Specialties & Software */}
            <div className="product-detail-tags">
              {productSpecialties.map(s => (
                <span key={s.id} className="detail-tag specialty-tag font-mono">{s.name}</span>
              ))}
              {productSoftware.length > 0 ? (
                productSoftware.map(s => (
                  <span key={s.id} className="detail-tag software-tag font-mono">{s.name}</span>
                ))
              ) : (product.technical?.compatibility || []).map((comp, idx) => (
                <span key={idx} className="detail-tag software-tag font-mono">{comp}</span>
              ))}
            </div>
          </div>

          {/* Product Media Section (Image Gallery & Switcher) */}
          <div className="product-media-wrapper">
            {/* Main Preview */}
            <div className="product-main-preview">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.title} 
                  className="product-main-img"
                  loading="eager"
                />
              ) : (
                <div className="product-placeholder-graphic font-mono">
                  {getTypeIcon(product.productType)}
                  <span style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {PRODUCT_TYPE_LABELS[product.productType] || 'FILE KỸ THUẬT GỐC'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (if multi-image) */}
            {uniqueImages.length > 1 && (
              <div className="product-gallery-strip">
                {uniqueImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImage(imgUrl)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${product.title} screenshot ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Video Demonstration */}
          {product.media?.youtubeVideoId && (
            <div className="product-video-section">
              <div className="section-subtitle-bar font-mono">
                <Video size={16} style={{ color: '#EF4444' }} />
                <span>VIDEO DEMO THỰC TẾ & HƯỚNG DẪN SỬ DỤNG</span>
              </div>
              <div className="video-responsive-container">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${product.media.youtubeVideoId}?rel=0`}
                  title={`${product.title} Video Demonstration`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Product Specs Summary Bar */}
          <div className="product-specs-bar font-mono">
            <div className="spec-stat-item">
              <span className="spec-stat-val">{fileCount}</span>
              <span className="spec-stat-lbl">tệp đính kèm</span>
            </div>
            <div className="spec-stat-item">
              <span className="spec-stat-val">{formatFileSize(totalSizeBytes)}</span>
              <span className="spec-stat-lbl">dung lượng</span>
            </div>
            <div className="spec-stat-item">
              <span className="spec-stat-val text-emerald">v{product.version}</span>
              <span className="spec-stat-lbl">phiên bản</span>
            </div>
            <div className="spec-stat-formats">
              <span className="spec-stat-lbl" style={{ marginRight: '6px' }}>Định dạng:</span>
              {(product.fileTypes || ['ZIP']).map(ft => (
                <span key={ft} className="format-chip">{ft}</span>
              ))}
            </div>
          </div>

          {/* Highlights Section */}
          {product.content?.highlights && product.content.highlights.length > 0 && (
            <div className="product-section-block">
              <h3 className="section-block-title font-mono">
                <Sparkles size={16} style={{ color: '#38BDF8' }} />
                ĐIỂM NỔI BẬT & TÍNH NĂNG CHÍNH
              </h3>
              <div className="highlights-grid">
                {product.content.highlights.map((hl, idx) => (
                  <div key={idx} className="highlight-card font-mono">
                    <CheckCircle size={15} className="highlight-check-icon" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Description */}
          <div className="product-section-block">
            <h3 className="section-block-title font-mono">
              <BookOpen size={16} style={{ color: 'var(--primary)' }} />
              MÔ TẢ CHI TIẾT SẢN PHẨM
            </h3>
            <div className="product-description-text">
              {product.description?.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))}
            </div>
          </div>

          {/* Included Files Section */}
          {product.content?.includedFiles && product.content.includedFiles.length > 0 && (
            <div className="product-section-block">
              <h3 className="section-block-title font-mono">
                <Layers size={16} style={{ color: '#A78BFA' }} />
                BỘ HỒ SƠ & TỆP TIN BAO GỒM
              </h3>
              <div className="included-files-list font-mono">
                {product.content.includedFiles.map((f, idx) => (
                  <div key={idx} className="included-file-item">
                    <FileText size={14} style={{ color: '#A78BFA', flexShrink: 0 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Requirements & Standards */}
          {(product.technical?.systemRequirements || (product.technical?.standards && product.technical.standards.length > 0)) && (
            <div className="product-section-block">
              <h3 className="section-block-title font-mono">
                <Settings size={16} style={{ color: '#F59E0B' }} />
                THÔNG SỐ KỸ THUẬT & TIÊU CHUẨN
              </h3>

              <div className="technical-details-grid font-mono">
                {product.technical.systemRequirements && (
                  <div className="technical-card">
                    <span className="tech-card-label">YÊU CẦU HỆ THỐNG & PHẦN MỀM</span>
                    <p className="tech-card-val">{product.technical.systemRequirements}</p>
                  </div>
                )}

                {product.technical.standards && product.technical.standards.length > 0 && (
                  <div className="technical-card">
                    <span className="tech-card-label">TIÊU CHUẨN & TÀI LIỆU THAM KHẢO</span>
                    <div className="standards-tag-row">
                      {product.technical.standards.map((std, idx) => (
                        <span key={idx} className="standard-chip">
                          <Award size={12} style={{ marginRight: '4px' }} />
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Error Banner */}
          {downloadError && (
            <div className="font-mono download-error-banner">
              <AlertTriangle size={16} />
              <span>{downloadError}</span>
            </div>
          )}

          {/* Files List Section */}
          <div className="product-section-block">
            <h3 className="section-block-title font-mono">
              <HardDrive size={16} style={{ color: '#38BDF8' }} />
              DANH SÁCH FILE THƯƠNG MẠI ({fileCount} tệp)
            </h3>
            
            <div className="product-files-list">
              {product.files && product.files.map(file => {
                const isDownloading = downloadingId === file.id;
                return (
                  <div key={file.id} className="file-info-card glass font-mono">
                    <div className="file-card-left">
                      <span className="file-card-type-badge">{file.fileType || 'ZIP'}</span>
                      <div className="file-card-details">
                        <span className="file-card-name">{file.fileName}</span>
                        <span className="file-card-meta">
                          Dung lượng: {formatFileSize(file.fileSize)} | Phiên bản: {file.version || product.version}
                        </span>
                      </div>
                    </div>

                    <div className="file-card-right">
                      {file.checksum && (
                        <span className="checksum-tag" title={`Mã băm SHA-256 xác thực tệp: ${file.checksum}`}>
                          SHA-256: {file.checksum.substring(0, 12)}...
                        </span>
                      )}

                      {(hasAccess || product.accessType === 'FREE') && (
                        <Button
                          variant="outline"
                          onClick={() => handleSecureDownload(file.id, file.fileName)}
                          disabled={isDownloading}
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          <Download size={13} style={{ marginRight: '4px' }} />
                          {isDownloading ? 'ĐANG TẢI...' : 'TẢI FILE'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Purchase Sidebar */}
        <aside className="product-sidebar-column">
          <div className="purchase-card-sidebar glass">
            <div className="sidebar-purchase-header font-mono">
              THÔNG TIN GIAO DỊCH & SỞ HỮU
            </div>

            <div className="sidebar-info-body">


              <div className="sidebar-cta-group">
                {hasAccess ? (
                  <Button 
                    variant="primary" 
                    icon={Download} 
                    className="w-100"
                    onClick={() => handleSecureDownload(firstFile?.id || 'file_01', firstFile?.fileName || product.title)}
                    disabled={Boolean(downloadingId)}
                  >
                    {downloadingId ? 'Đang tải xuống...' : 'Tải tài liệu đính kèm'}
                  </Button>
                ) : product.accessType === 'FREE' ? (
                  <Button 
                    variant="primary" 
                    icon={Download} 
                    className="w-100"
                    onClick={() => handleSecureDownload(firstFile?.id || 'file_01', firstFile?.fileName || product.title)}
                    disabled={Boolean(downloadingId)}
                  >
                    {downloadingId ? 'Đang tải xuống...' : 'Tải miễn phí ngay'}
                  </Button>
                ) : product.accessType === 'PAID' ? (
                  <>
                    <Button
                      variant={inCart ? "secondary" : "primary"}
                      className="w-100"
                      onClick={handleAddToCart}
                      disabled={inCart}
                    >
                      {inCart ? (
                        <>
                          <Check size={16} style={{ marginRight: '6px' }} /> Đã thêm vào giỏ
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} style={{ marginRight: '6px' }} /> Thêm vào giỏ hàng
                        </>
                      )}
                    </Button>

                    <Link to={`/checkout?targetId=${product.id}&targetType=product`} style={{ width: '100%' }}>
                      <Button variant="outline" className="w-100">Mua để tải ngay</Button>
                    </Link>
                  </>
                ) : (
                  /* COURSE_ONLY warning */
                  <div className="course-only-warning-box">
                    <div className="warning-header font-mono">
                      <Info size={16} /> CHỈ KÈM KHÓA HỌC
                    </div>
                    <p className="warning-desc">
                      Tệp tin nguồn này được đính kèm độc quyền. Để tải file này, bạn cần đăng ký khóa học liên kết dưới đây:
                    </p>
                    {linkingCourses.map(course => (
                      <Link key={course.id} to={`/courses/${course.slug}`} className="linking-course-btn font-mono">
                        {course.title.substring(0, 32)}... →
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="sidebar-trust-features font-mono">
                <div className="trust-feature-item">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>File kỹ thuật định dạng gốc</span>
                </div>
                <div className="trust-feature-item">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>Xác thực SHA-256 Checksum</span>
                </div>
                <div className="trust-feature-item">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>Tải qua Secure Cloud API</span>
                </div>
                <div className="trust-feature-item">
                  <ShieldCheck size={14} className="text-emerald" />
                  <span>Sở hữu vĩnh viễn & Tải lại</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
