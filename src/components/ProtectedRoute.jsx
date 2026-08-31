import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';

/**
 * ProtectedRoute: Yêu cầu đăng nhập tài khoản (Student hoặc Admin)
 * Nếu chưa đăng nhập: Chuyển hướng sang /auth và lưu lại location trước đó
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="font-mono" style={{ color: 'var(--primary)', marginBottom: '12px' }}>
          ĐANG XÁC THỰC PHIÊN ĐĂNG NHẬP...
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Vui lòng đợi trong giây lát.</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * AdminRoute: Yêu cầu đăng nhập và có Firebase Auth Custom Claim { admin: true }
 * Tuyệt đối không dựa vào user.role hoặc Firestore field
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="font-mono" style={{ color: 'var(--primary)', marginBottom: '12px' }}>
          ĐANG KIỂM TRA QUYỀN QUẢN TRỊ VIÊN (ADMIN CLAIM)...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Chặn nếu không có Auth Custom Claim { admin: true }
  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '40px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <ShieldAlert size={56} style={{ color: '#EF4444', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Không có quyền truy cập</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            Khu vực này dành riêng cho Quản trị viên hệ thống có <strong>Firebase Auth Custom Claim</strong> <code className="font-mono" style={{ color: '#F97316' }}>{'{ admin: true }'}</code>. Tài khoản của bạn hiện tại là Học viên.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/account">
              <Button variant="outline">
                <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Về trang cá nhân
              </Button>
            </Link>
            <Link to="/">
              <Button variant="primary">Về Trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
