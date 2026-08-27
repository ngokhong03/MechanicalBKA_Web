import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, PlayCircle, Lock, BookOpen, AlertCircle } from 'lucide-react';
import { specialties, software, courses, lessons } from '../mock/data';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './CourseDetail.css';

const CourseDetail = () => {
  const { slug } = useParams();
  
  // Find course
  const course = courses.find(c => c.slug === slug);

  if (!course) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h2>Không tìm thấy khóa học</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px 0' }}>
          Đường dẫn khóa học không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/courses">
          <Button variant="primary">Quay lại danh sách khóa học</Button>
        </Link>
      </div>
    );
  }

  // Get lessons belonging to course, sorted by order
  const courseLessons = lessons
    .filter(l => l.courseId === course.id)
    .sort((a, b) => a.order - b.order);

  // Find first lesson for CTA
  const firstLesson = courseLessons[0];
  // Find first free preview lesson
  const firstFreeLesson = courseLessons.find(l => l.isFreePreview);

  // Resolve specialty & software names
  const courseSpecialties = specialties.filter(spec => course.specialtyIds.includes(spec.id));
  const courseSoftware = software.filter(soft => course.softwareIds.includes(soft.id));

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="course-detail-page container" style={{ padding: '40px 24px' }}>
      <div className="grid-asymmetric">
        {/* Course Info Column */}
        <div className="course-detail-main">
          {/* Breadcrumb / Specialty */}
          <div className="course-breadcrumb font-mono">
            <Link to="/courses">Khóa Học</Link>
            <span className="separator">/</span>
            <span className="current">{course.title}</span>
          </div>

          <h1 className="course-detail-title">{course.title}</h1>
          
          <div className="course-detail-tags">
            <Badge text={course.accessType} />
            {courseSpecialties.map(s => (
              <span key={s.id} className="detail-tag specialty-tag font-mono">{s.name}</span>
            ))}
            {courseSoftware.map(s => (
              <span key={s.id} className="detail-tag software-tag font-mono">{s.name}</span>
            ))}
          </div>

          {/* Large image for mobile, hidden on desktop if card covers it */}
          <div className="course-detail-banner mobile-only">
            <img src={course.thumbnailUrl} alt={course.title} />
          </div>

          <div className="course-detail-desc">
            <h3>Giới thiệu khóa học</h3>
            <p>{course.description}</p>
          </div>

          {/* Lessons Outline list */}
          <div className="course-outline-section">
            <h3 className="outline-title font-mono">
              <BookOpen size={18} style={{ marginRight: '8px' }} /> ĐỀ CƯƠNG CHI TIẾT ({courseLessons.length} bài học)
            </h3>

            <div className="lessons-outline-list">
              {courseLessons.map((les, idx) => (
                <div key={les.id} className="lesson-outline-item glass">
                  <div className="lesson-item-left">
                    <span className="lesson-number font-mono">Bài {idx + 1}</span>
                    <div className="lesson-item-title-desc">
                      <h4 className="lesson-item-title">{les.title}</h4>
                      <p className="lesson-item-desc">{les.description}</p>
                    </div>
                  </div>
                  
                  <div className="lesson-item-right">
                    {les.isFreePreview || course.accessType === 'FREE' ? (
                      <Link 
                        to={`/courses/${course.slug}/lessons/${les.slug}`} 
                        className="lesson-preview-btn font-mono"
                      >
                        <PlayCircle size={14} /> XEM THỬ
                      </Link>
                    ) : (
                      <span className="lesson-lock font-mono">
                        <Lock size={12} /> KHÓA
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Purchase Card (desktop only) */}
        <aside className="purchase-card-sidebar glass">
          <div className="sidebar-thumbnail-container">
            <img src={course.thumbnailUrl} alt={course.title} className="sidebar-thumbnail" />
          </div>
          
          <div className="sidebar-info-body">
            <div className="sidebar-price-container">
              <span className="price-label">Học phí trọn đời</span>
              <span className="sidebar-price">{formatPrice(course.price)}</span>
            </div>

            <div className="sidebar-cta-group">
              {course.accessType === 'FREE' ? (
                firstLesson && (
                  <Link to={`/courses/${course.slug}/lessons/${firstLesson.slug}`} style={{ width: '100%' }}>
                    <Button variant="primary" icon={Play} className="w-100">Bắt đầu học ngay</Button>
                  </Link>
                )
              ) : (
                <>
                  <Link to={`/checkout?targetId=${course.id}&targetType=course`} style={{ width: '100%' }}>
                    <Button variant="primary" className="w-100">Đăng ký khóa học</Button>
                  </Link>
                  {firstFreeLesson && (
                    <Link to={`/courses/${course.slug}/lessons/${firstFreeLesson.slug}`} style={{ width: '100%', marginTop: '12px', display: 'block' }}>
                      <Button variant="outline" icon={Play} className="w-100">Học thử bài giảng</Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="sidebar-highlights font-mono">
              <div className="highlight-item">✓ Truy cập không giới hạn</div>
              <div className="highlight-item">✓ File CAD bài tập đi kèm</div>
              <div className="highlight-item">✓ Hỗ trợ giải đáp chuyên môn</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
