import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';
import './Footer.css';

const YoutubeIcon = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col brand-col">
          <span className="brand-logo"><span className="brand-accent">Mechanical</span>BKA</span>
          <p className="brand-slogan">
            Cổng thông tin và học liệu cơ khí chuyên sâu tại Việt Nam. Đồng hành cùng kỹ sư và sinh viên cơ khí chế tạo máy, thiết kế khuôn mẫu.
          </p>
          <div className="social-links">
            <a href="https://youtube.com/@trongbka" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube Channel">
              <YoutubeIcon size={18} />
            </a>
            <a href="http://www.vertanux1.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Vertanux1 Reference Website">
              <Globe size={18} />
            </a>
            <a href="mailto:contact@mechanicalbka.com" className="social-icon" title="Email Contact">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title font-mono">ĐƯỜNG DẪN NHANH</h4>
          <ul className="footer-links">
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/courses">Tất Cả Khóa Học</Link></li>
            <li><Link to="/store">Cửa Hàng Học Liệu</Link></li>
            <li><Link to="/videos">Thư Viện Videos</Link></li>
          </ul>
        </div>

        {/* Specialties Links */}
        <div className="footer-col">
          <h4 className="footer-col-title font-mono">CHUYÊN NGÀNH CHÍNH</h4>
          <ul className="footer-links">
            <li><Link to="/courses?specialty=spec_polymer_composite">Polymer & Composite</Link></li>
            <li><Link to="/courses?specialty=spec_mold_design">Mold Design (Thiết Kế Khuôn)</Link></li>
            <li><Link to="/courses?specialty=spec_manufacturing">Mechanical Manufacturing</Link></li>
            <li><Link to="/courses?specialty=spec_cad_cae">CAD / CAE Mechanics</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom font-mono">
        <p>© 2026 MechanicalBKA. All rights reserved. Designed for Mechanical Engineers.</p>
        <div className="footer-bottom-links">
          <a href="http://www.vertanux1.com" target="_blank" rel="noopener noreferrer">Vertanux1 Reference</a>
          <span className="divider">|</span>
          <a href="https://youtube.com/@trongbka" target="_blank" rel="noopener noreferrer">TrongBKA Channel</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
