import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ vertical = false, onItemClick }) => {
  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Đồ Án Chi Tiết Máy', path: '/projects', isHighlight: true, badge: 'HOT' },
    { name: 'Kho File', path: '/store' },
    { name: 'CAD', path: '/store?type=CAD_PROJECT' },
    { name: 'Bản Vẽ', path: '/store?type=DRAWING' },
    { name: 'Tính Toán', path: '/store?type=CALCULATION' },
    { name: 'Video', path: '/videos' },
    { name: 'Khóa Học', path: '/courses' }
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
          end={item.path === '/'}
        >
          {item.name}
          {item.badge && <span className="nav-item-badge">{item.badge}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
