import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page container">
      <div className="blueprint-404-box glass">
        <div className="blueprint-grid-background"></div>
        <div className="blueprint-content">
          <AlertTriangle size={64} className="blueprint-icon" />
          <h1 className="blueprint-title font-mono">ERROR 404: COMPONENT_NOT_FOUND</h1>
          <p className="blueprint-desc">
            Bản vẽ kỹ thuật hoặc cụm chi tiết máy bạn yêu cầu không khớp với bất kỳ tọa độ lưu trữ nào trên hệ thống. 
            Mã lỗi: <span className="font-mono error-code">STATUS_LIMIT_EXCEEDED</span>.
          </p>
          <div className="blueprint-ctas">
            <Link to="/">
              <Button variant="primary" icon={Home}>Về Trang Chủ</Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline">Tìm Khóa Học</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
