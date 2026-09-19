import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, PlayCircle, Lock, BookOpen, AlertCircle, Layers, Clock, Award } from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import { accessService } from '../services/accessService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './CourseDetail.css';

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [allSoftware, setAllSoftware] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [foundCourse, specs, softs, vids] = await Promise.all([
          dataProvider.getCourseBySlug(slug),
          dataProvider.getSpecialties(),
          dataProvider.getSoftware(),
          dataProvider.getVideos()
        ]);

        if (isMounted && foundCourse) {
          setCourse(foundCourse);
          const [lessonsList, accessResult] = await Promise.all([
            dataProvider.getLessons(foundCourse.id),
            accessService.canAccessCourse(user?.uid, foundCourse.id)
          ]);
          if (isMounted) {
            setCourseLessons(lessonsList || []);
            setHasAccess(accessResult);
          }
        }
        if (isMounted) {
          setAllSpecialties(specs || []);
          setAllSoftware(softs || []);
          setAllVideos(vids || []);
        }
      } catch (err) {
        console.error('[CourseDetail] Lỗi tải dữ liệu:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [slug, user]);

  if (loading) {
    return (
      <div className="container font-mono" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--primary)' }}>
        ĐANG TẢI THÔNG TIN KHÓA HỌC...
      </div>
    );
  }

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

  // Find first lesson for CTA
  const firstLesson = courseLessons[0];
  // Find first free preview lesson
  const firstFreeLesson = courseLessons.find(l => l.isFreePreview);

  // Resolve specialty & software names
  const courseSpecialties = allSpecialties.filter(spec => (course.specialtyIds || []).includes(spec.id));
  const courseSoftware = allSoftware.filter(soft => (course.softwareIds || []).includes(soft.id));



  return (
    <div className="course-detail-page container" style={{ padding: '40px 24px' }}>
      <div className="grid-asymmetric">
        {/* Course Info Column */}
        <div className="course-detail-main">
          {/* Breadcrumb */}
          <div className="course-breadcrumb font-mono">
            <Link to="/courses">Khóa Học</Link>
            <span className="separator">/</span>
            <span className="current">{course.title}</span>
          </div>

          <h1 className="course-detail-title">{course.title}</h1>
          
          <div className="course-detail-tags">
            <Badge text="Miễn phí" />
            {course.level && (
              <span className="detail-tag font-mono" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <Award size={12} style={{ marginRight: '4px' }} /> {course.level}
              </span>
            )}
            {courseSpecialties.map(s => (
              <span key={s.id} className="detail-tag specialty-tag font-mono">{s.name}</span>
            ))}
            {courseSoftware.map(s => (
              <span key={s.id} className="detail-tag software-tag font-mono">{s.name}</span>
            ))}
          </div>

          {/* Large image for mobile */}
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
              <BookOpen size={18} style={{ marginRight: '8px' }} /> ĐỀ CƯƠNG CHI TIẾT ({courseLessons.length} bài giảng)
            </h3>

            <div className="lessons-outline-list">
              {courseLessons.map((les, idx) => {
                const duration = getLessonDuration(les.youtubeVideoId);
                const isPreview = les.isFreePreview || course.accessType === 'FREE';

                return (
                  <div key={les.id} className="lesson-outline-item glass">
                    <div className="lesson-item-left">
                      <span className="lesson-number font-mono">Bài {idx + 1}</span>
                      <div className="lesson-item-title-desc">
                        <h4 className="lesson-item-title">{les.title}</h4>
                        <p className="lesson-item-desc">{les.description}</p>
                        {duration && (
                          <span className="lesson-duration font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', marginTop: '4px' }}>
                            <Clock size={11} style={{ marginRight: '4px' }} /> Thời lượng: {duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="lesson-item-right">
                      {isPreview ? (
                        <Link 
                          to={`/courses/${course.slug}/lessons/${les.slug}`} 
                          className="lesson-preview-btn font-mono"
                        >
                          <PlayCircle size={14} /> HỌC THỬ
                        </Link>
                      ) : (
                        <span className="lesson-lock font-mono">
                          <Lock size={12} /> KHÓA
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Purchase Card */}
        <aside className="purchase-card-sidebar glass">
          <div className="sidebar-thumbnail-container">
            <img src={course.thumbnailUrl} alt={course.title} className="sidebar-thumbnail" />
          </div>
          
          <div className="sidebar-info-body">
            <div className="sidebar-price-container">
              <span className="price-label">Trạng thái khóa học</span>
              <span className="sidebar-price">
                {hasAccess ? (
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                    <Check size={18} style={{ marginRight: '6px' }} /> ĐÃ SỞ HỮU
                  </span>
                ) : (
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', fontSize: '18px' }}>Miễn phí</span>
                )}
              </span>
            </div>

            <div className="sidebar-cta-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {firstLesson && (
                <Link to={`/courses/${course.slug}/lessons/${firstLesson.slug}`} style={{ width: '100%' }}>
                  <Button variant="primary" icon={Play} className="w-100" style={{ justifyContent: 'center' }}>
                    BẮT ĐẦU HỌC →
                  </Button>
                </Link>
              )}
            </div>

            <div className="sidebar-highlights font-mono">
              <div className="highlight-item">✓ Truy cập {courseLessons.length} bài giảng kỹ thuật</div>
              <div className="highlight-item">✓ File CAD bài tập đi kèm</div>
              <div className="highlight-item">✓ Xem trên mọi thiết bị máy tính / điện thoại</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
