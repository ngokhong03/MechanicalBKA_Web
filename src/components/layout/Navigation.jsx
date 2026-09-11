import React from 'react';
import { NavLink } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ vertical = false, onItemClick }) => {
  const navItems = [
    { name: 'Trang Chủ', path: '/', end: true },
    { name: 'Đồ Án Chi Tiết Máy', path: '/projects', isHighlight: true, badge: 'HOT' },
    { name: 'Kho File', path: '/store' },
    { name: 'Khóa Học', path: '/courses' },
    { name: 'Video', path: '/videos' }
  ];

  return (
    <nav className={`main-nav ${vertical ? 'nav-vertical' : 'nav-horizontal'}`}>
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) => 
            `nav-link font-mono ${item.isHighlight ? 'nav-link-highlight' : ''} ${isActive ? 'nav-link-active' : ''}`
          }
          end={item.end || false}
        >
          {item.name}
          {item.badge && <span className="nav-item-badge">{item.badge}</span>}
        </NavLink>
      ))}
      <a 
        href="https://youtube.com/@trongbka" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={onItemClick}
        className="nav-link nav-link-youtube font-mono"
      >
        YouTube
        <ExternalLink size={11} style={{ marginLeft: '4px', opacity: 0.6 }} />
      </a>
    </nav>
  );
};

export default Navigation;
