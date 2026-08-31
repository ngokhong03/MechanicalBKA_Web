import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  ShoppingBag, 
  Layers, 
  Cpu, 
  FileCheck, 
  Users, 
  KeyRound, 
  Download, 
  History,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { isFirebaseEnabled } from '../../firebase/config';
import './AdminLayout.css';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Bảng Điều Khiển', icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: 'Quản Lý Khóa Học', icon: BookOpen },
    { to: '/admin/lessons', label: 'Quản Lý Bài Giảng', icon: Video },
    { to: '/admin/products', label: 'File Kỹ Thuật & CAD', icon: ShoppingBag },
    { to: '/admin/specialties', label: 'Chuyên Ngành', icon: Layers },
    { to: '/admin/software', label: 'Phần Mềm CAD', icon: Cpu },
    { to: '/admin/orders', label: 'Quản Lý Đơn Hàng', icon: FileCheck },
    { to: '/admin/users', label: 'Tài Khoản Học Viên', icon: Users },
    { to: '/admin/entitlements', label: 'Cấp Quyền Truy Cập', icon: KeyRound },
    { to: '/admin/downloads', label: 'Lịch Sử Tải File', icon: Download },
    { to: '/admin/audit-logs', label: 'Nhật Ký Quản Trị', icon: History }
  ];

  return (
    <div className="admin-layout">
      {/* Mock Mode Banner */}
      {!isFirebaseEnabled && (
        <div className="admin-mock-banner font-mono" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <AlertTriangle size={15} /> CHẾ ĐỘ MÔ PHỎNG (MOCK MODE) — DỮ LIỆU ĐƯỢC LƯU CỤC BỘ ĐỂ KIỂM THỬ GIAO DIỆN
        </div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`} style={!isFirebaseEnabled ? { marginTop: '34px' } : {}}>
        <div className="admin-sidebar-header">
          <div className="admin-badge-title font-mono">
            <ShieldCheck size={14} /> ADMIN CONSOLE
          </div>
          <div className="admin-app-name">MechanicalBKA CMS</div>
        </div>

        <nav className="admin-nav font-mono">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer font-mono">
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ExternalLink size={13} /> Xem trang chủ Web
          </Link>
          <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
            MechanicalBKA Security v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main" style={!isFirebaseEnabled ? { marginTop: '34px' } : {}}>
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="mobile-admin-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="admin-topbar-title font-mono">HỆ THỐNG QUẢN TRỊ NỘI DUNG</span>
          </div>

          <div className="font-mono" style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            AUTH: ADMIN CLAIM VERIFIED
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
