import React from 'react';
import { Link } from 'react-router-dom';
import { Play, FileText, ArrowRight, Video } from 'lucide-react';
import { specialties, software, courses, products, videos, lessons } from '../mock/data';
import SpecialtyCard from '../components/cards/SpecialtyCard';
import SoftwareCard from '../components/cards/SoftwareCard';
import CourseCard from '../components/cards/CourseCard';
import ProductCard from '../components/cards/ProductCard';
import Button from '../components/common/Button';
import './Home.css';

const Home = () => {
  // Get featured courses
  const featuredCourses = courses.filter(c => c.isFeatured && c.isPublished);
  // Get featured materials (first 3 published products)
  const featuredProducts = products.filter(p => p.isPublished).slice(0, 3);
  // Get latest 3 videos
  const latestVideos = videos.slice(0, 3);

  // Helper: Count lessons in course
  const getLessonCount = (courseId) => {
    return lessons.filter(l => l.courseId === courseId).length;
  };

  // Helper: Count courses in specialty
  const getCourseCountBySpecialty = (specId) => {
    return courses.filter(c => c.specialtyIds.includes(specId)).length;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <div className="technical-grid-lines"></div>
          <span className="hero-tag technical-label">Mechanical Engineering Platform</span>
          <h1 className="hero-title">
            Nâng Cao Tay Nghề <span className="text-gradient">Thiết Kế Cơ Khí</span> & Khuôn Mẫu
          </h1>
          <p className="hero-description">
            Cung cấp lộ trình bài bản về thiết kế khuôn ép phun (Mold Design), lập trình gia công tiện phay CNC, khoa học chất dẻo Polymer và mô phỏng CAE dòng chảy nhựa nóng.
          </p>
          <div className="hero-ctas">
            <Link to="/courses">
              <Button variant="primary" icon={Play}>Khám phá Khóa học</Button>
            </Link>
            <Link to="/store">
              <Button variant="outline" icon={FileText}>Tải Học liệu CAD/PDF</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Chuyên Ngành Trọng Tâm</h2>
          <p className="section-subtitle">Chương trình học tập phân loại theo các nhóm chuyên môn cốt lõi của cơ khí chế tạo.</p>
        </div>
        <div className="grid-cols-4">
          {specialties.map(spec => (
            <SpecialtyCard 
              key={spec.id} 
              specialty={spec} 
              courseCount={getCourseCountBySpecialty(spec.id)} 
            />
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Khóa Học Nổi Bật</h2>
          <p className="section-subtitle">Học trực quan cùng các bài tập thực hành thiết kế lắp ráp cơ cấu thực tế.</p>
        </div>
        <div className="grid-cols-3">
          {featuredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              lessonCount={getLessonCount(course.id)} 
            />
          ))}
        </div>
        <div className="section-footer-link">
          <Link to="/courses" className="link-arrow">
            Xem tất cả khóa học <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Materials Section */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Học Liệu & Bản Vẽ CAD Mới Nhất</h2>
          <p className="section-subtitle">Tải tệp tin nguồn 3D (Autodesk Inventor, SolidWorks) và sổ tay kỹ thuật PDF.</p>
        </div>
        <div className="grid-cols-3">
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
        <div className="section-footer-link">
          <Link to="/store" className="link-arrow">
            Vào cửa hàng học liệu <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Software Section */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Phần Mềm Đào Tạo</h2>
          <p className="section-subtitle">Làm chủ các công cụ mô hình hóa 3D và mô phỏng CAE công nghiệp hiện nay.</p>
        </div>
        <div className="grid-cols-4">
          {software.map(soft => (
            <SoftwareCard key={soft.id} software={soft} />
          ))}
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Videos Hướng Dẫn Mới Nhất</h2>
          <p className="section-subtitle">Cập nhật nhanh từ kênh YouTube giảng dạy chính thức của tác giả.</p>
        </div>
        <div className="grid-cols-3">
          {latestVideos.map(vid => (
            <div key={vid.id} className="home-video-card glass">
              <div className="video-thumb-container">
                <img 
                  src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`} 
                  alt={vid.title} 
                  className="video-thumb"
                />
                <div className="video-play-overlay">
                  <Video size={24} className="video-play-icon" />
                </div>
              </div>
              <div className="video-card-info">
                <span className="video-duration font-mono">{vid.duration}</span>
                <h3 className="video-card-title">{vid.title}</h3>
                <p className="video-card-desc">{vid.description}</p>
                <div className="video-card-footer">
                  {vid.lessonId ? (
                    <Link 
                      to={`/courses/${videos.find(v => v.id === vid.id).courseId ? courses.find(c => c.id === vid.courseId).slug : 'slug'}/lessons/${lessons.find(l => l.id === vid.lessonId).slug}`} 
                      className="video-action-link font-mono"
                    >
                      Học Trong Bài Giảng →
                    </Link>
                  ) : (
                    <a 
                      href={`https://www.youtube.com/watch?v=${vid.youtubeVideoId}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="video-action-link font-mono"
                    >
                      Xem Trên YouTube →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer-link">
          <Link to="/videos" className="link-arrow">
            Xem toàn bộ thư viện video <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA Ecosystem Section */}
      <section className="home-cta-ecosystem container">
        <div className="cta-box glass">
          <h2 className="cta-box-title">Khám Phá Hệ Sinh Thái Học Tập Miễn Phí</h2>
          <p className="cta-box-desc">
            Chúng tôi chia sẻ hàng chục bài viết kỹ thuật, tài liệu hướng dẫn CAD và các file lắp ráp cụm chi tiết máy miễn phí. Phục vụ đắc lực cho sinh viên làm đồ án tốt nghiệp cơ khí.
          </p>
          <div className="cta-box-actions">
            <Link to="/store?price=free">
              <Button variant="primary">Tải tài liệu FREE</Button>
            </Link>
            <a href="https://youtube.com/@trongbka" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" icon={Video}>Kênh YouTube @trongbka</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
