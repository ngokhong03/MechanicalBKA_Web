import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Key, Calendar, Clock, LogOut, BookOpen, ShoppingBag, Terminal, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseEnabled } from '../firebase/config';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './Account.css';

const Account = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();

  if (!user) return null;

  const displayName = user.displayName || userProfile?.displayName || 'Học viên MechanicalBKA';
  const email = user.email || userProfile?.email || 'N/A';
  const uid = user.uid || userProfile?.uid || 'N/A';
  const role = userProfile?.role || 'student';
  const createdAt = userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('vi-VN') : 'Mới';
  const lastLoginAt = userProfile?.lastLoginAt ? new Date(userProfile.lastLoginAt).toLocaleString('vi-VN') : 'Vừa xong';

  return (
    <div className="container account-page" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          STUDENT PROFILE & CREDENTIALS
        </span>
        <h1 className="section-title">Hồ Sơ Cá Nhân</h1>
        <p className="section-subtitle">
          Quản lý tài khoản học viên, phiên xác thực bảo mật và các lộ trình học tập kỹ thuật.
        </p>
      </div>

      <div className="account-grid">
        {/* Main Profile Card */}
        <div className="account-card glass">
          <div className="account-user-banner">
            <div className="account-avatar font-mono">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="account-user-meta">
              <div className="account-name-row">
                <h2 className="account-display-name">{displayName}</h2>
                <span className={`role-badge font-mono ${isAdmin ? 'role-badge-admin' : 'role-badge-student'}`}>
                  {isAdmin ? 'ADMIN' : 'STUDENT'}
                </span>
              </div>
              <p className="account-email font-mono">
                <Mail size={13} style={{ marginRight: '6px' }} /> {email}
              </p>
            </div>
          </div>

          <div className="account-divider"></div>

          {/* Details Table */}
          <div className="account-details-list font-mono">
            <div className="account-detail-item">
              <span className="detail-label">
                <Key size={13} style={{ marginRight: '6px' }} /> USER ID (UID)
              </span>
              <span className="detail-value text-truncate">{uid}</span>
            </div>

            <div className="account-detail-item">
              <span className="detail-label">
                <Shield size={13} style={{ marginRight: '6px' }} /> XÁC THỰC ADMIN CLAIM
              </span>
              <span className="detail-value">
                {isAdmin ? (
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center' }}>
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> {`{ admin: true } Verified`}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Học viên thông thường</span>
                )}
              </span>
            </div>

            <div className="account-detail-item">
              <span className="detail-label">
                <Terminal size={13} style={{ marginRight: '6px' }} /> CHẾ ĐỘ HOẠT ĐỘNG
              </span>
              <span className="detail-value">
                {isFirebaseEnabled ? (
                  <span style={{ color: '#10B981' }}>Firebase Mode (Production Auth)</span>
                ) : (
                  <span style={{ color: '#F97316' }}>Mock Auth Mode (Development Session)</span>
                )}
              </span>
            </div>

            <div className="account-detail-item">
              <span className="detail-label">
                <Calendar size={13} style={{ marginRight: '6px' }} /> NGÀY THAM GIA
              </span>
              <span className="detail-value">{createdAt}</span>
            </div>

            <div className="account-detail-item">
              <span className="detail-label">
                <Clock size={13} style={{ marginRight: '6px' }} /> ĐĂNG NHẬP GẦN NHẤT
              </span>
              <span className="detail-value">{lastLoginAt}</span>
            </div>
          </div>

          <div className="account-footer-actions">
            <Button variant="outline" onClick={logout}>
              <LogOut size={15} style={{ marginRight: '6px' }} /> Đăng Xuất
            </Button>

            {isAdmin && (
              <Link to="/admin">
                <Button variant="primary">
                  <Terminal size={15} style={{ marginRight: '6px' }} /> Bảng Điều Khiển Admin
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Shortcuts Side Column */}
        <div className="account-side-column">
          <div className="account-card glass">
            <h3 className="card-subheading font-mono">
              <BookOpen size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> TRUNG TÂM HỌC TẬP
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Khám phá toàn bộ 6 lộ trình đào tạo chuyên sâu và 30 video bài giảng kỹ thuật miễn phí.
            </p>
            <Link to="/courses">
              <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }}>
                Xem Danh Sách Khóa Học →
              </Button>
            </Link>
          </div>

          <div className="account-card glass" style={{ marginTop: '16px' }}>
            <h3 className="card-subheading font-mono">
              <ShoppingBag size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> KHO FILE KỸ THUẬT
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Tải miễn phí các thư viện khuôn 3D, sổ tay mã lệnh CNC và tài liệu mô phỏng CAE.
            </p>
            <Link to="/store">
              <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }}>
                Đến Kho File Kỹ Thuật →
              </Button>
            </Link>
          </div>

          <div className="account-card glass" style={{ marginTop: '16px' }}>
            <h3 className="card-subheading font-mono">
              <Shield size={16} style={{ marginRight: '8px', color: '#60A5FA' }} /> THƯ VIỆN CỦA TÔI
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Truy cập nhanh danh sách khóa học và gói file kỹ thuật bạn đã được cấp quyền sở hữu.
            </p>
            <Link to="/account/library">
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                Đến Thư Viện Của Tôi →
              </Button>
            </Link>
          </div>

          <div className="account-card glass" style={{ marginTop: '16px' }}>
            <h3 className="card-subheading font-mono">
              <Key size={16} style={{ marginRight: '8px', color: '#10B981' }} /> LỊCH SỬ ĐƠN HÀNG
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Xem lại các đơn đăng ký khóa học, file kỹ thuật và thông tin thanh toán chuyển khoản.
            </p>
            <Link to="/account/orders">
              <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }}>
                Xem Lịch Sử Đơn Hàng →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
