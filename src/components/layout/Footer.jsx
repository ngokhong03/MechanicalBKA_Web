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
    <footer className="site-footer" id="contact-footer">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col brand-col">
          <span className="brand-logo"><span className="brand-accent">Mechanical</span>BKA</span>
          <p className="brand-slogan">
            Kho file kỹ thuật và công cụ cơ khí chuyên sâu tại Việt Nam. Đồng hành cùng kỹ sư và sinh viên cơ khí chế tạo máy, thiết kế khuôn mẫu.
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
          <div className="contact-info" style={{ marginTop: '16px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
            <div><strong style={{ color: '#fff' }}>Hotline / Zalo:</strong> 0333.xxx.xxx</div>
            <div><strong style={{ color: '#fff' }}>Email:</strong> contact@mechanicalbka.com</div>
            <div><strong style={{ color: '#fff' }}>Giờ làm việc:</strong> 8:00 - 22:00 (Thứ 2 - CN)</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title font-mono">ĐƯỜNG DẪN CHÍNH</h4>
          <ul className="footer-links">
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/store">Kho Tài Liệu</Link></li>
            <li><Link to="/store?type=EPXYZ_FILE">Engineering Paper XYZ</Link></li>
            <li><Link to="/account">Tài Khoản</Link></li>
          </ul>
        </div>

        {/* Resources & Support Links */}
        <div className="footer-col">
          <h4 className="footer-col-title font-mono">DỰ ÁN & ĐỒNG HÀNH</h4>
          <ul className="footer-links">
            <li><Link to="/projects">Đồ Án Chi Tiết Máy</Link></li>
            <li><Link to="/courses">Khóa Học & Video</Link></li>
            <li><a href="/#support-coffee">Ủng Hộ Một Ly Cà Phê ☕</a></li>
            <li><a href="https://youtube.com/@trongbka" target="_blank" rel="noopener noreferrer">Kênh YouTube</a></li>
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
