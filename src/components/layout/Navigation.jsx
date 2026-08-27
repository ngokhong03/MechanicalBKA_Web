import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ vertical = false, onItemClick }) => {
  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Chuyên Ngành', path: '/specialties' },
    { name: 'Phần Mềm', path: '/software' },
    { name: 'Khóa Học', path: '/courses' },
    { name: 'Học Liệu', path: '/store' },
    { name: 'Thư Viện Videos', path: '/videos' }
  ];

  return (
    <nav className={`main-nav ${vertical ? 'nav-vertical' : 'nav-horizontal'}`}>
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path}
          onClick={onItemClick}
          className={({ isActive }) => `nav-link font-mono ${isActive ? 'nav-link-active' : ''}`}
          end={item.path === '/'}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
