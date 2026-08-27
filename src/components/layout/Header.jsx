import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Settings } from 'lucide-react';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
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
        <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="brand-accent">Mechanical</span>BKA
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-only">
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

          {/* Admin CMS Trigger (Link placeholder for CMS) */}
          <Link to="/search" className="action-icon" aria-label="Search" title="Tìm kiếm">
            <Settings size={20} />
          </Link>

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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
