import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './Auth.css';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const Auth = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, login, register, loginWithGoogle, logout, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setFormError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    clearError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="container auth-page" style={{ padding: '60px 24px', maxWidth: '520px', margin: '0 auto' }}>
        <div className="auth-card glass">
          <div className="auth-header">
            <ShieldCheck size={48} style={{ color: 'var(--primary)', margin: '0 auto 12px auto' }} />
            <h2 className="auth-title">Đã Đăng Nhập</h2>
            <p className="auth-subtitle">
              Bạn đang đăng nhập với tài khoản <strong style={{ color: '#fff' }}>{user.email || user.displayName}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <Link to="/account">
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                Đến Trang Cá Nhân <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </Button>
            </Link>
            <Button variant="outline" onClick={logout} style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={16} style={{ marginRight: '6px' }} /> Đăng Xuất
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container auth-page" style={{ padding: '60px 24px', maxWidth: '480px', margin: '0 auto' }}>
      <div className="auth-card glass">
        {/* Header */}
        <div className="auth-header">
          <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
            ENGINEERING PLATFORM AUTH
          </span>
          <h1 className="auth-title">{isRegisterMode ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}</h1>
          <p className="auth-subtitle">
            {isRegisterMode
              ? 'Tạo tài khoản để quản lý file kỹ thuật và theo dõi đơn hàng.'
              : 'Đăng nhập vào hệ thống học tập kỹ thuật cơ khí MechanicalBKA.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs font-mono">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegisterMode ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setIsRegisterMode(false);
              setFormError('');
              clearError();
            }}
          >
            ĐĂNG NHẬP
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegisterMode ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setIsRegisterMode(true);
              setFormError('');
              clearError();
            }}
          >
            ĐĂNG KÝ
          </button>
        </div>

        {/* Error Banner */}
        {(formError || authError) && (
          <div className="auth-error-banner font-mono">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{formError || authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label font-mono">
                <User size={14} style={{ marginRight: '6px' }} /> HỌ VÀ TÊN
              </label>
              <input
                type="text"
                className="form-input font-mono"
                placeholder="Nguyễn Văn A"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label font-mono">
              <Mail size={14} style={{ marginRight: '6px' }} /> EMAIL
            </label>
            <input
              type="email"
              className="form-input font-mono"
              placeholder="engineer@bka.edu.vn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label font-mono">
              <Lock size={14} style={{ marginRight: '6px' }} /> MẬT KHẨU
            </label>
            <input
              type="password"
              className="form-input font-mono"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {isSubmitting
              ? 'ĐANG XỬ LÝ...'
              : isRegisterMode
              ? 'TẠO TÀI KHOẢN →'
              : 'ĐĂNG NHẬP VÀO HỆ THỐNG →'}
          </Button>
        </form>

        {/* Divider */}
        <div className="auth-divider font-mono">
          <span>HOẶC TIẾP TỤC VỚI</span>
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          className="google-btn font-mono"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          <GoogleIcon /> Đăng nhập bằng Google
        </button>

        {/* Footer info */}
        <div className="auth-footer font-mono">
          <span>
            {isRegisterMode ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <button
              type="button"
              className="auth-link-inline"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setFormError('');
                clearError();
              }}
            >
              {isRegisterMode ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
