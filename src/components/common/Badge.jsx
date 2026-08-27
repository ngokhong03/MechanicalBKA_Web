import React from 'react';
import './Badge.css';

const Badge = ({ text, type = 'slate', className = '' }) => {
  // Map certain metadata terms to their colors
  let badgeType = type;
  const upperText = text?.toUpperCase();
  
  if (upperText === 'FREE' || upperText === 'MIỄN PHÍ') {
    badgeType = 'success';
  } else if (upperText === 'PAID' || upperText === 'TRẢ PHÍ') {
    badgeType = 'primary';
  } else if (upperText === 'COURSE_ONLY' || upperText === 'KÈM KHÓA HỌC') {
    badgeType = 'info';
  } else if (upperText === 'CAD' || upperText === 'IPT' || upperText === 'IAM' || upperText === 'SLDPRT') {
    badgeType = 'info';
  } else if (upperText === 'PDF') {
    badgeType = 'pdf';
  } else if (upperText === 'ZIP') {
    badgeType = 'zip';
  }

  return (
    <span className={`badge badge-${badgeType} technical-label ${className}`}>
      {text}
    </span>
  );
};

export default Badge;
