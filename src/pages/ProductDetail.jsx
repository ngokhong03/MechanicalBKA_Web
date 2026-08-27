import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { specialties, software, products, courses, lessons } from '../mock/data';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();

  // Find product
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h2>Không tìm thấy tài liệu</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px 0' }}>
          Đường dẫn học liệu không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/store">
          <Button variant="primary">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  // Resolve specialty & software
  const productSpecialties = specialties.filter(spec => product.specialtyIds.includes(spec.id));
  const productSoftware = software.filter(soft => product.softwareIds.includes(soft.id));

  // Find courses linking to this product for COURSE_ONLY message
  const linkingCourses = courses.filter(course => {
    // Find all lessons of this course
    const courseLessons = lessons.filter(l => l.courseId === course.id);
    // Check if any lesson contains this product ID in materialIds
    return courseLessons.some(l => l.materialIds?.includes(product.id));
  });

  // Calculate stats
  const fileCount = product.files?.length || 0;
  const totalSizeBytes = product.files?.reduce((acc, file) => acc + file.fileSize, 0) || 0;

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product-detail-page container" style={{ padding: '40px 24px' }}>
      {/* Top back breadcrumb */}
      <div className="product-breadcrumb font-mono">
        <Link to="/store">Cửa Hàng Học Liệu</Link>
        <span className="separator">/</span>
        <span className="current">{product.title}</span>
      </div>

      <div className="grid-asymmetric">
        {/* Main Details */}
        <div className="product-detail-main">
          <h1 className="product-detail-title">{product.title}</h1>

          <div className="product-detail-tags">
            <Badge text={product.accessType} />
            <span className="product-type-badge font-mono">{product.productType}</span>
            {productSpecialties.map(s => (
              <span key={s.id} className="detail-tag specialty-tag font-mono">{s.name}</span>
            ))}
            {productSoftware.map(s => (
              <span key={s.id} className="detail-tag software-tag font-mono">{s.name}</span>
            ))}
          </div>

          <div className="product-detail-desc">
            <h3>Mô tả học liệu</h3>
            <p>{product.description}</p>
          </div>

          {/* Files List Section */}
          <div className="product-files-section">
            <h3 className="files-section-title font-mono">DANH SÁCH FILE ĐÍNH KÈM ({fileCount} tệp)</h3>
            
            <div className="product-files-list">
              {product.files && product.files.map(file => (
                <div key={file.id} className="file-info-card glass font-mono">
                  <div className="file-card-left">
                    <span className="file-card-type-badge">{file.fileType}</span>
                    <div className="file-card-details">
                      <span className="file-card-name">{file.fileName}</span>
                      <span className="file-card-meta">
                        Dung lượng: {formatSize(file.fileSize)} | Phiên bản: {file.version}
                      </span>
                    </div>
                  </div>

                  <div className="file-card-right">
                    <span className="checksum-tag" title={`SHA-256 Checksum: ${file.checksum}`}>
                      SHA-256: {file.checksum.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Sidebar Card */}
        <aside className="purchase-card-sidebar glass">
          <div className="sidebar-purchase-header font-mono">
            THÔNG TIN TÀI LIỆU
          </div>

          <div className="sidebar-info-body">
            <div className="sidebar-price-container">
              <span className="price-label">Giá tải về</span>
              <span className="sidebar-price">{formatPrice(product.price)}</span>
            </div>

            <div className="sidebar-cta-group">
              {product.accessType === 'FREE' ? (
                <Button 
                  variant="primary" 
                  icon={Download} 
                  className="w-100"
                  onClick={() => alert(`[Phase 1 Placeholder] Đang bắt đầu tải gói tệp tin miễn phí: ${product.title}.\n(API sẽ gọi /api/download?productId=${product.id}&fileId=all).`)}
                >
                  Tải miễn phí ngay
                </Button>
              ) : product.accessType === 'PAID' ? (
                <Link to={`/checkout?targetId=${product.id}&targetType=product`} style={{ width: '100%' }}>
                  <Button variant="primary" className="w-100">Mua tệp tin nguồn</Button>
                </Link>
              ) : (
                /* COURSE_ONLY styling and warning */
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

            <div className="sidebar-highlights font-mono" style={{ marginTop: '16px' }}>
              <div className="highlight-item">✓ File CAD định dạng gốc</div>
              <div className="highlight-item">✓ Checksum mã hóa chống lỗi</div>
              <div className="highlight-item">✓ Tải về trực tiếp bảo mật</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
export const demo = true;
