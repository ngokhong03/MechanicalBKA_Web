import React from 'react';
import './ZaloWidget.css';

const ZaloWidget = () => {
  return (
    <div className="zalo-widget">
      <a
        href="https://zalo.me/0862990403"
        target="_blank"
        rel="noopener noreferrer"
        className="zalo-link"
        title="Liên hệ Zalo"
      >
        <div className="zalo-icon-container">
          <div className="zalo-pulse"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png" 
            alt="Zalo Icon" 
            className="zalo-icon" 
          />
        </div>
        <span className="zalo-tooltip">Hỗ trợ Zalo</span>
      </a>
    </div>
  );
};

export default ZaloWidget;
