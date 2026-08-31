import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Play, Download, ShieldCheck, AlertCircle, Clock, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { entitlementService } from '../services/entitlementService';
import { dataProvider } from '../services/dataProvider';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import './Library.css';

const Library = () => {
  const { user } = useAuth();
  const [entitlements, setEntitlements] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLibraryData() {
      if (!user) return;
      setLoading(true);
      try {
        const [userEnts, allCourses, allProducts] = await Promise.all([
          entitlementService.getUserEntitlements(user.uid),
          dataProvider.getCourses(),
          dataProvider.getProducts()
        ]);

        const cMap = {};
        (allCourses || []).forEach(c => { cMap[c.id] = c; });

        const pMap = {};
        (allProducts || []).forEach(p => { pMap[p.id] = p; });

        if (isMounted) {
          setEntitlements(userEnts || []);
          setCoursesMap(cMap);
          setProductsMap(pMap);
        }
      } catch (err) {
        console.error('[Library] Lỗi tải thư viện học viên:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLibraryData();
    return () => { isMounted = false; };
  }, [user]);

  const courseEntitlements = entitlements.filter(e => e.targetType === 'course');
  const productEntitlements = entitlements.filter(e => e.targetType === 'product');

  return (
    <div className="container library-page" style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div className="library-breadcrumb font-mono">
        <Link to="/account">Hồ Sơ Cá Nhân</Link>
        <span className="separator">/</span>
        <span className="current">Thư Viện Của Tôi</span>
      </div>

      {/* Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          OWNED ENGINEERING FILES & COURSES
        </span>
        <h1 className="section-title">File Đã Mua & Thư Viện</h1>
        <p className="section-subtitle">
          Danh mục tất cả bộ file kỹ thuật và khóa học mà bạn đã được cấp quyền sở hữu. Tải file trực tiếp qua Secure Download.
        </p>
      </div>

      {/* Tabs */}
      <div className="library-tabs font-mono">
        <button
          type="button"
          className={`library-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FileText size={15} style={{ marginRight: '6px' }} />
          FILE ĐÃ MUA ({productEntitlements.length})
        </button>

        <button
          type="button"
          className={`library-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={15} style={{ marginRight: '6px' }} />
          Khóa Học ({courseEntitlements.length})
        </button>
      </div>

      {loading ? (
        <div className="font-mono" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--primary)' }}>
          ĐANG TẢI THƯ VIỆN CÁ NHÂN...
        </div>
      ) : activeTab === 'courses' ? (
        courseEntitlements.length === 0 ? (
          <EmptyState
            message="Bạn chưa sở hữu khóa học trả phí nào."
            description="Đăng ký các lộ trình đào tạo chuyên sâu về Khuôn Mẫu, CNC, Sheet Metal của MechanicalBKA."
          />
        ) : (
          <div className="library-grid">
            {courseEntitlements.map(ent => {
              const course = coursesMap[ent.targetId];
              const isActive = ent.status === 'active';

              if (!course) {
                return (
                  <div key={ent.id} className="library-item-card glass font-mono">
                    <span style={{ color: 'var(--text-muted)' }}>Khóa học ID: {ent.targetId} (Đang cập nhật)</span>
                  </div>
                );
              }

              return (
                <div key={ent.id} className="library-item-card glass">
                  <div className="item-thumbnail-container">
                    <img src={course.thumbnailUrl} alt={course.title} className="item-thumbnail" />
                    <span className={`status-ent-pill font-mono ${isActive ? 'ent-active' : 'ent-revoked'}`}>
                      {isActive ? 'ACTIVE' : 'REVOKED'}
                    </span>
                  </div>

                  <div className="item-card-body">
                    <h3 className="item-title">{course.title}</h3>
                    <p className="item-desc">{course.description ? course.description.substring(0, 100) + '...' : ''}</p>

                    <div className="item-meta-row font-mono">
                      <span className="granted-date">
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        Cấp ngày: {ent.grantedAt ? new Date(ent.grantedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </div>

                    <div className="item-action-footer">
                      {isActive ? (
                        <Link to={`/courses/${course.slug}`} style={{ width: '100%' }}>
                          <Button variant="primary" icon={Play} style={{ width: '100%', justifyContent: 'center' }}>
                            Vào Học Ngay
                          </Button>
                        </Link>
                      ) : (
                        <span className="font-mono text-danger" style={{ fontSize: '12px', color: '#F87171' }}>
                          Quyền truy cập đã bị thu hồi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        productEntitlements.length === 0 ? (
          <EmptyState
            message="Bạn chưa mua bộ file kỹ thuật nào."
            description="Khám phá đồ án Chi tiết máy, file CAD và bản vẽ kỹ thuật tại Kho File Kỹ Thuật."
          />
        ) : (
          <div className="library-grid">
            {productEntitlements.map(ent => {
              const product = productsMap[ent.targetId];
              const isActive = ent.status === 'active';

              if (!product) {
                return (
                  <div key={ent.id} className="library-item-card glass font-mono">
                    <span style={{ color: 'var(--text-muted)' }}>Sản phẩm ID: {ent.targetId} (Đang cập nhật)</span>
                  </div>
                );
              }

              const thumbUrl = product.media?.thumbnailUrl || product.thumbnailUrl || product.thumbnail || null;

              const isEpxyz = product.productType === 'EPXYZ_FILE' || (product.fileTypes || []).includes('EPXYZ');
              const displayTypeLabel = product.productType === 'EPXYZ_FILE' ? 'ENGINEERING PAPER XYZ' : (product.productType || 'FILE KỸ THUẬT');

              return (
                <div key={ent.id} className="library-item-card glass">
                  <div className="item-thumbnail-container">
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={product.title} className="item-thumbnail" />
                    ) : (
                      <div className="item-product-placeholder font-mono">
                        <FileText size={40} style={{ color: 'var(--primary)' }} />
                        <span className="prod-badge-mini">{displayTypeLabel}</span>
                      </div>
                    )}
                    <span className={`status-ent-pill font-mono ${isActive ? 'ent-active' : 'ent-revoked'}`}>
                      {isActive ? 'ACTIVE' : 'REVOKED'}
                    </span>
                  </div>

                  <div className="item-card-body">
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="font-mono" style={{ fontSize: '11px', color: isEpxyz ? '#A78BFA' : 'var(--primary)', fontWeight: 700 }}>
                        {displayTypeLabel}
                      </span>
                      {product.version && (
                        <span className="font-mono" style={{ fontSize: '11px', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                          v{product.version}
                        </span>
                      )}
                    </div>
                    <h3 className="item-title">{product.title}</h3>
                    <p className="item-desc">{product.description ? product.description.substring(0, 100) + '...' : ''}</p>

                    <div className="item-meta-row font-mono">
                      <span className="granted-date">
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        Cấp ngày: {ent.grantedAt ? new Date(ent.grantedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </div>

                    <div className="item-action-footer">
                      {isActive ? (
                        <Link to={`/store/${product.slug}`} style={{ width: '100%' }}>
                          <Button variant={isEpxyz ? "primary" : "outline"} icon={Download} style={{ width: '100%', justifyContent: 'center' }}>
                            {isEpxyz ? 'TẢI FILE .EPXYZ' : 'Xem Chi Tiết & Tải File'}
                          </Button>
                        </Link>
                      ) : (
                        <span className="font-mono text-danger" style={{ fontSize: '12px', color: '#F87171' }}>
                          Quyền truy cập đã bị thu hồi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default Library;
