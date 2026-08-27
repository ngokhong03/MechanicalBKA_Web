import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import './SpecialtyCard.css';

const SpecialtyCard = ({ specialty, courseCount }) => {
  return (
    <div className="specialty-card glass">
      <div className="specialty-top">
        <h3 className="specialty-name">{specialty.name}</h3>
        <span className="specialty-count badge badge-slate">
          <BookOpen size={12} style={{ marginRight: '4px' }} />
          {courseCount} Khóa học
        </span>
      </div>
      <p className="specialty-desc">{specialty.description}</p>
      <div className="specialty-footer">
        <Link 
          to={`/courses?specialty=${specialty.id}`} 
          className="specialty-link technical-label"
        >
          Khám phá chuyên ngành →
        </Link>
      </div>
    </div>
  );
};

export default SpecialtyCard;
