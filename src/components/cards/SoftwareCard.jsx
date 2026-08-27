import React from 'react';
import { Link } from 'react-router-dom';
import './SoftwareCard.css';

const SoftwareCard = ({ software }) => {
  return (
    <div className="software-card glass">
      <div className="software-header">
        <img src={software.logoUrl} alt={software.name} className="software-logo" />
        <h3 className="software-name">{software.name}</h3>
      </div>
      <p className="software-desc">{software.description}</p>
      <div className="software-footer">
        <Link 
          to={`/courses?software=${software.id}`} 
          className="software-link technical-label"
        >
          Khóa học liên quan →
        </Link>
      </div>
    </div>
  );
};

export default SoftwareCard;
// 
