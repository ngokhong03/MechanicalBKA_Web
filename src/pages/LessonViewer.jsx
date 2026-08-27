import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, ArrowLeft, Download, CheckCircle, HelpCircle } from 'lucide-react';
import { courses, lessons, products } from '../mock/data';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './LessonViewer.css';

const LessonViewer = () => {
  const { courseSlug, lessonSlug } = useParams();

  // Find course
  const course = courses.find(c => c.slug === courseSlug);
  if (!course) {
    return <div className="container" style={{ padding: '80px 24px' }}>Không tìm thấy khóa học.</div>;
  }

  // Get all lessons of this course, sorted
  const courseLessons = lessons
    .filter(l => l.courseId === course.id)
    .sort((a, b) => a.order - b.order);

  // Find active lesson
  const activeLesson = courseLessons.find(l => l.slug === lessonSlug);
  if (!activeLesson) {
    return <div className="container" style={{ padding: '80px 24px' }}>Không tìm thấy bài học.</div>;
  }

  // Find associated products (materials)
  const attachedProducts = products.filter(p => activeLesson.materialIds?.includes(p.id));

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
            {/* Video Player */}
            <div className="video-player-wrapper">
              <iframe
                title={activeLesson.title}
                src={`https://www.youtube.com/embed/${activeLesson.youtubeVideoId}?rel=0&autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              ></iframe>
            </div>

            {/* Lesson details */}
            <div className="lesson-details-card glass">
              <div className="lesson-details-header">
                <span className="lesson-index-badge font-mono">Bài {activeLesson.order}</span>
                <h1 className="viewer-lesson-title">{activeLesson.title}</h1>
              </div>
              <p className="viewer-lesson-desc">{activeLesson.description}</p>
            </div>

            {/* Attached Materials / Downloads */}
            <div className="attached-materials-section">
              <h3 className="section-subtitle-tech font-mono">
                <FileText size={16} style={{ marginRight: '6px' }} /> TÀI LIỆU VÀ FILE CAD ĐÍNH KÈM
              </h3>

              {attachedProducts.length > 0 ? (
                <div className="attached-products-list">
                  {attachedProducts.map(prod => (
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
                        {prod.files && prod.files.map(file => (
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
                              {/* Phase 1 Download Button Placeholder */}
                              <Button 
                                variant="outline" 
                                className="download-placeholder-btn"
                                onClick={() => alert(`[Phase 1 Placeholder] Đang tải xuống tệp: ${file.fileName}\n(Ở các phase sau, nút này sẽ gọi API /api/download?productId=${prod.id}&fileId=${file.id} để xác minh quyền sở hữu).`)}
                              >
                                <Download size={14} /> TẢI FILE
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-materials-box font-mono glass">
                  Bài học này không đính kèm học liệu tải về.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Playlist */}
          <aside className="viewer-playlist-sidebar glass">
            <div className="playlist-header font-mono">
              Danh Sách Bài Học
            </div>
            <div className="playlist-body">
              {courseLessons.map((les, idx) => {
                const isActive = les.id === activeLesson.id;
                // A lesson is unlocked if course is FREE or lesson is free preview
                const isUnlocked = course.accessType === 'FREE' || les.isFreePreview;

                return (
                  <Link 
                    key={les.id} 
                    to={isUnlocked ? `/courses/${course.slug}/lessons/${les.slug}` : '#'}
                    onClick={(e) => {
                      if (!isUnlocked) {
                        e.preventDefault();
                        alert(`Bài giảng này đã khóa. Vui lòng đăng ký khóa học để học tiếp.`);
                      }
                    }}
                    className={`playlist-item ${isActive ? 'playlist-item-active' : ''} ${!isUnlocked ? 'playlist-item-locked' : ''}`}
                  >
                    <div className="playlist-item-left">
                      <span className="playlist-idx font-mono">{idx + 1}</span>
                      <div className="playlist-title-container">
                        <span className="playlist-title">{les.title}</span>
                        {les.isFreePreview && course.accessType === 'PAID' && (
                          <Badge text="HỌC THỬ" className="preview-badge" />
                        )}
                      </div>
                    </div>
                    <div className="playlist-item-right">
                      {isActive ? (
                        <PlayCircle size={16} className="active-icon" />
                      ) : !isUnlocked ? (
                        <span className="lock-icon-span">🔒</span>
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
