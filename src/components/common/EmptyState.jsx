import React from 'react';
import { AlertCircle } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
  message = 'Không tìm thấy kết quả phù hợp.', 
  description = 'Vui lòng thử lại với từ khóa hoặc bộ lọc khác.' 
}) => {
  return (
    <div className="empty-state-container glass">
      <AlertCircle className="empty-state-icon" size={40} />
      <h3 className="empty-state-title">{message}</h3>
      <p className="empty-state-description">{description}</p>
    </div>
  );
};

export default EmptyState;
