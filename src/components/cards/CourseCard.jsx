import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { specialties, software } from '../../mock/data';
import './CourseCard.css';

const CourseCard = ({ course, lessonCount }) => {
  // Resolve specialty names
  const courseSpecialties = specialties.filter(spec => course.specialtyIds.includes(spec.id));
  // Resolve software names
  const courseSoftware = software.filter(soft => course.softwareIds.includes(soft.id));

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className={`course-card glass ${course.isFeatured ? 'featured-card' : ''}`}>
      <Link to={`/courses/${course.slug}`} className="course-thumb-link">
        <div className="course-thumb-container">
          <img src={course.thumbnailUrl} alt={course.title} className="course-thumbnail" />
          <div className="course-badge-overlay">
            <Badge text={course.accessType === 'FREE' ? 'FREE' : 'PAID'} />
          </div>
        </div>
      </Link>

      <div className="course-info">
        <div className="course-meta-top">
          {courseSpecialties.map(spec => (
            <span key={spec.id} className="course-meta-tag specialty-tag">{spec.name}</span>
          ))}
        </div>

        <Link to={`/courses/${course.slug}`}>
          <h3 className="course-title">{course.title}</h3>
        </Link>

        <p className="course-description-short">
          {course.description.length > 90 ? `${course.description.substring(0, 90)}...` : course.description}
        </p>

        <div className="course-specs font-mono">
          <div className="course-spec-item">
            <PlayCircle size={14} />
            <span>{lessonCount} Bài giảng</span>
          </div>
          {courseSoftware.length > 0 && (
            <div className="course-spec-item">
              <span className="software-indicator">CAD/CAE</span>
              <span>{courseSoftware.map(s => s.name).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="course-footer">
          <span className="course-price">{formatPrice(course.price)}</span>
          <Link to={`/courses/${course.slug}`} className="course-view-btn font-mono">
            CHI TIẾT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
