import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlayCircle, FileText, ArrowLeft, ArrowRight, Download, Lock, CheckCircle, ShieldAlert, ShoppingBag } from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import { accessService } from '../services/accessService';
import { downloadService } from '../services/downloadService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './LessonViewer.css';

const LessonViewer = () => {
  const { courseSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [attachedProducts, setAttachedProducts] = useState([]);
  const [isAccessible, setIsAccessible] = useState(false);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadLessonData() {
      setLoading(true);
      try {
        const foundCourse = await dataProvider.getCourseBySlug(courseSlug);
        if (!foundCourse) {
          if (isMounted) setLoading(false);
          return;
        }

        const lessonsList = await dataProvider.getLessons(foundCourse.id);
        const currentLesson = lessonsList?.find(l => l.slug === lessonSlug);

        let materials = [];
        if (currentLesson?.materialIds?.length > 0) {
          const allProds = await dataProvider.getProducts();
          materials = allProds.filter(p => currentLesson.materialIds.includes(p.id));
        }

        let accessOk = false;
        let cAccess = false;
        if (currentLesson) {
          [accessOk, cAccess] = await Promise.all([
            accessService.canAccessLesson(user?.uid, currentLesson.id),
            accessService.canAccessCourse(user?.uid, foundCourse.id)
          ]);
        }

        if (isMounted) {
          setCourse(foundCourse);
          setCourseLessons(lessonsList || []);
          setActiveLesson(currentLesson || null);
          setAttachedProducts(materials);
          setIsAccessible(accessOk);
          setHasCourseAccess(cAccess);
        }
      } catch (err) {
        console.error('[LessonViewer] Lỗi tải bài học:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLessonData();
    return () => { isMounted = false; };
  }, [courseSlug, lessonSlug, user]);

  if (loading) {
    return (
      <div className="container font-mono" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--primary)' }}>
        ĐANG TẢI NỘI DUNG BÀI HỌC...
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ color: '#EF4444', marginBottom: '16px' }} />
        <h2>Không tìm thấy bài giảng</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px 0' }}>
          Đường dẫn bài học không tồn tại trong khóa học này.
        </p>
        <Link to="/courses">
          <Button variant="primary">Quay lại danh mục khóa học</Button>
        </Link>
      </div>
    );
  }

  // Determine active lesson index, previous and next lessons
  const currentIndex = courseLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const inCart = isInCart(course.id);

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSecureDownload = async (productId, fileId, fileName) => {
    setDownloadingFileId(fileId);
    setDownloadError('');
    try {
      await downloadService.downloadProductFile(productId, fileId, fileName);
    } catch (err) {
      setDownloadError(err.message || 'Không thể tải tệp tin lúc này.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleAddToCartCourse = () => {
    addToCart({
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      accessType: course.accessType,
      productType: 'KHÓA HỌC',
      thumbnailUrl: course.thumbnailUrl
    });
  };

  return (
    <div className="lesson-viewer-page">
      <div className="container lesson-viewer-container">
        {/* Top bar back link */}
        <div className="viewer-top-bar font-mono">
          <Link to={`/courses/${course.slug}`} className="back-link">
            <ArrowLeft size={14} /> QUAY LẠI KHÓA HỌC
          </Link>
          <span className="course-breadcrumb-title">{course.title}</span>
        </div>

        <div className="viewer-grid-layout">
          {/* Main player & details */}
          <div className="viewer-main-column">
            {/* Video Player or Locked Overlay */}
            <div className="video-player-wrapper">
              {isAccessible ? (
                <iframe
                  title={activeLesson.title}
                  src={`https://www.youtube.com/embed/${activeLesson.youtubeVideoId}?rel=0&autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                ></iframe>
              ) : (
                <div className="video-locked-overlay glass font-mono">
                  <div className="locked-card">
                    <Lock size={44} style={{ color: '#F97316', marginBottom: '14px' }} />
                    <h3 className="locked-title">BÀI GIẢNG THUỘC KHÓA HỌC TRẢ PHÍ</h3>
                    <p className="locked-desc">
                      Bài học này không nằm trong danh mục học thử miễn phí. Vui lòng đăng ký khóa học để mở khóa toàn bộ lộ trình đào tạo và file bài tập.
                    </p>
                    <div className="locked-actions">
                      <Button
                        variant={inCart ? "secondary" : "primary"}
                        onClick={handleAddToCartCourse}
                        disabled={inCart}
                      >
                        <ShoppingBag size={15} style={{ marginRight: '6px' }} />
                        {inCart ? 'Đã thêm khóa học vào giỏ' : 'Thêm khóa học vào giỏ hàng'}
                      </Button>

                      <Link to="/cart">
                        <Button variant="outline">Đến Giỏ Hàng</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Navigation Buttons */}
            <div className="viewer-lesson-nav font-mono">
              {prevLesson ? (
                <Link
                  to={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="lesson-nav-btn prev-btn"
                >
                  <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Bài Trước: {prevLesson.title.substring(0, 24)}...
                </Link>
              ) : (
                <div className="lesson-nav-btn disabled">
                  <ArrowLeft size={14} style={{ marginRight: '6px' }} /> Đầu danh sách
                </div>
              )}

              {nextLesson ? (
                <Link
                  to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="lesson-nav-btn next-btn"
                >
                  Bài Kế Tiếp: {nextLesson.title.substring(0, 24)}... <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                </Link>
              ) : (
                <div className="lesson-nav-btn disabled">
                  Hết danh sách bài giảng <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                </div>
              )}
            </div>

            {/* Lesson details card */}
            <div className="lesson-details-card glass">
              <div className="lesson-details-header">
                <span className="lesson-index-badge font-mono">Bài {activeLesson.order}</span>
                {activeLesson.isFreePreview && course.accessType === 'PAID' && (
                  <Badge text="HỌC THỬ MIỄN PHÍ" />
                )}
                <h1 className="viewer-lesson-title">{activeLesson.title}</h1>
              </div>
              <p className="viewer-lesson-desc">{activeLesson.description}</p>
            </div>

            {/* Attached Materials / Downloads */}
            <div className="attached-materials-section">
              <h3 className="section-subtitle-tech font-mono">
                <FileText size={16} style={{ marginRight: '6px' }} /> TÀI LIỆU VÀ FILE CAD ĐÍNH KÈM ({attachedProducts.length})
              </h3>

              {downloadError && (
                <div className="font-mono" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>
                  {downloadError}
                </div>
              )}

              {attachedProducts.length > 0 ? (
                <div className="attached-products-list">
                  {attachedProducts.map(prod => {
                    const isProdUnlocked = hasCourseAccess || prod.accessType === 'FREE';

                    return (
                      <div key={prod.id} className="attached-product-box glass">
                        <div className="product-box-top">
                          <div>
                            <Link to={`/store/${prod.slug}`} className="product-box-title-link">
                              <h4 className="product-box-title">{prod.title}</h4>
                            </Link>
                            <div className="product-box-meta">
                              <Badge text={prod.accessType} />
                              <span className="product-box-type font-mono">{prod.productType}</span>
                            </div>
                          </div>
                        </div>

                        {/* Files list */}
                        <div className="product-box-files">
                          {prod.files && prod.files.map(file => {
                            const isDownloading = downloadingFileId === file.id;

                            return (
                              <div key={file.id} className="file-download-row font-mono">
                                <div className="file-row-left">
                                  <span className="file-icon-badge">{file.fileType}</span>
                                  <div className="file-info-text">
                                    <span className="file-name-text">{file.fileName}</span>
                                    <span className="file-size-ver">
                                      Dung lượng: {formatSize(file.fileSize)} | Phiên bản: {file.version}
                                    </span>
                                  </div>
                                </div>

                                <div className="file-row-right">
                                  {isProdUnlocked ? (
                                    <Button 
                                      variant="outline" 
                                      className="download-placeholder-btn"
                                      onClick={() => handleSecureDownload(prod.id, file.id, file.fileName)}
                                      disabled={isDownloading}
                                    >
                                      <Download size={14} style={{ marginRight: '4px' }} />
                                      {isDownloading ? 'ĐANG TẢI...' : 'TẢI FILE'}
                                    </Button>
                                  ) : (
                                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                      <Lock size={12} style={{ marginRight: '4px' }} /> Cần mua khóa học
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-materials-box font-mono glass">
                  Bài học này không đính kèm học liệu tải về riêng biệt.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Playlist */}
          <aside className="viewer-playlist-sidebar glass">
            <div className="playlist-header font-mono">
              DANH SÁCH BÀI HỌC ({courseLessons.length})
            </div>
            <div className="playlist-body">
              {courseLessons.map((les, idx) => {
                const isActive = les.id === activeLesson.id;
                const isLessonUnlocked = course.accessType === 'FREE' || les.isFreePreview || hasCourseAccess;

                return (
                  <Link 
                    key={les.id} 
                    to={`/courses/${course.slug}/lessons/${les.slug}`}
                    className={`playlist-item ${isActive ? 'playlist-item-active' : ''} ${!isLessonUnlocked ? 'playlist-item-locked' : ''}`}
                  >
                    <div className="playlist-item-left">
                      <span className="playlist-idx font-mono">{idx + 1}</span>
                      <div className="playlist-title-container">
                        <span className="playlist-title">{les.title}</span>
                        {les.isFreePreview && course.accessType === 'PAID' && (
                          <span className="preview-indicator font-mono">FREE PREVIEW</span>
                        )}
                      </div>
                    </div>
                    <div className="playlist-item-right">
                      {isActive ? (
                        <PlayCircle size={16} className="active-icon" />
                      ) : !isLessonUnlocked ? (
                        <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <PlayCircle size={16} className="play-icon-muted" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
