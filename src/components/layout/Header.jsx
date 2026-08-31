import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogIn, Shield, ShoppingBag } from 'lucide-react';
import Navigation from './Navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  return (
    <header className="site-header glass">
      <div className="container header-container">
        {/* Brand Logo */}
        <div className="header-logo-wrap">
          <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="brand-accent">Mechanical</span>BKA
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-only header-navigation">
          <Navigation />
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Header Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="header-search-form desktop-only">
            <input
              type="text"
              placeholder="Tìm nhanh..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn">
              <Search size={16} />
            </button>
          </form>

          {/* Search Icon for Mobile */}
          <Link to="/search" className="action-icon mobile-only" aria-label="Tìm kiếm">
            <Search size={20} />
          </Link>

          {/* Cart Icon Button */}
          <Link 
            to="/cart" 
            className="action-icon cart-action-link" 
            aria-label="Giỏ hàng" 
            title="Giỏ Hàng File Kỹ Thuật"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge-count font-mono">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account / Auth Button */}
          {isAuthenticated ? (
            <Link
              to="/account"
              className="action-icon"
              aria-label="Tài khoản"
              title={isAdmin ? 'Tài khoản Quản trị viên' : 'Tài khoản cá nhân'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isAdmin ? '#F87171' : 'var(--primary)' }}
            >
              {isAdmin ? <Shield size={18} /> : <User size={18} />}
              <span className="desktop-only font-mono" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {user.displayName ? user.displayName.split(' ').pop() : 'Tài khoản'}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="action-icon"
              aria-label="Đăng nhập"
              title="Đăng nhập / Đăng ký"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogIn size={18} />
              <span className="desktop-only font-mono" style={{ fontSize: '12px' }}>
                Đăng nhập
              </span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="mobile-menu-toggle mobile-only" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer glass">
          <div className="mobile-drawer-header">
            <span className="brand-logo"><span className="brand-accent">Mechanical</span>BKA</span>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="mobile-drawer-body">
            <Navigation vertical onItemClick={() => setIsMobileMenuOpen(false)} />
            
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-main)', textDecoration: 'none' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--primary)' }} /> Giỏ Hàng File Kỹ Thuật
                </span>
                {cartCount > 0 && (
                  <span className="cart-badge-count font-mono" style={{ position: 'static' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  <User size={18} /> Hồ Sơ ({user.displayName || user.email})
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  <LogIn size={18} /> Đăng Nhập / Đăng Ký
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
