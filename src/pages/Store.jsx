import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw } from 'lucide-react';
import { specialties, software, products } from '../mock/data';
import ProductCard from '../components/cards/ProductCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import './Store.css';

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for search and filters
  const [searchVal, setSearchVal] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedAccessType, setSelectedAccessType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Sync state with URL search params (e.g. from footer or home link)
  useEffect(() => {
    const spec = searchParams.get('specialty');
    const priceParam = searchParams.get('price'); // 'free'
    if (spec) setSelectedSpecialty(spec);
    if (priceParam === 'free') setSelectedAccessType('FREE');
  }, [searchParams]);

  // Handle resets
  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedSpecialty('');
    setSelectedSoftware('');
    setSelectedProductType('');
    setSelectedAccessType('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Filtered and Sorted products
  const filteredProducts = products
    .filter(p => p.isPublished)
    .filter(p => {
      // Search match
      if (!searchVal.trim()) return true;
      const lowerSearch = searchVal.toLowerCase();
      return (
        p.title.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch)
      );
    })
    .filter(p => {
      // Specialty match
      if (!selectedSpecialty) return true;
      return p.specialtyIds.includes(selectedSpecialty);
    })
    .filter(p => {
      // Software match
      if (!selectedSoftware) return true;
      return p.softwareIds.includes(selectedSoftware);
    })
    .filter(p => {
      // Product Type match
      if (!selectedProductType) return true;
      return p.productType === selectedProductType;
    })
    .filter(p => {
      // Access Type match (FREE / PAID / COURSE_ONLY)
      if (!selectedAccessType) return true;
      return p.accessType === selectedAccessType;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      // 'newest' default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="container store-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label" style={{ color: 'var(--primary)' }}>Mechanical Parts Store</span>
        <h1 className="section-title">Cửa Hàng Học Liệu</h1>
        <p className="section-subtitle">Tải các cụm chi tiết lắp ráp khuôn ép nhựa 3D CAD, bản vẽ 2D PDF và slide bài giảng kỹ thuật.</p>
      </div>

      <div className="store-grid-layout">
        {/* Sidebar Filters */}
        <aside className="store-filters-sidebar glass">
          <div className="filter-sidebar-header">
            <span className="filter-header-title font-mono"><Filter size={14} style={{ marginRight: '6px' }} />BỘ LỌC</span>
            <button onClick={handleResetFilters} className="filter-reset-btn font-mono" title="Reset Filters">
              <RotateCcw size={12} /> LÀM MỚI
            </button>
          </div>

          {/* Specialty Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">CHUYÊN NGÀNH</label>
            <select 
              value={selectedSpecialty} 
              onChange={(e) => setSelectedSpecialty(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả chuyên ngành</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>

          {/* Software Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">PHẦN MỀM HỖ TRỢ</label>
            <select 
              value={selectedSoftware} 
              onChange={(e) => setSelectedSoftware(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả phần mềm</option>
              {software.map(soft => (
                <option key={soft.id} value={soft.id}>{soft.name}</option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">LOẠI TÀI LIỆU</label>
            <select 
              value={selectedProductType} 
              onChange={(e) => setSelectedProductType(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả tài liệu</option>
              <option value="CAD">Mẫu 3D CAD</option>
              <option value="PDF">Giáo trình PDF</option>
              <option value="ZIP">Tệp tin nén (ZIP)</option>
              <option value="MULTIPLE">Tổng hợp nhiều file</option>
            </select>
          </div>

          {/* Price/Access Type Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">HÌNH THỨC SỞ HỮU</label>
            <div className="filter-radio-group">
              <label className="filter-radio-label">
                <input 
                  type="radio" 
                  name="accessType" 
                  checked={selectedAccessType === ''} 
                  onChange={() => setSelectedAccessType('')} 
                />
                <span>Tất cả</span>
              </label>
              <label className="filter-radio-label">
                <input 
                  type="radio" 
                  name="accessType" 
                  checked={selectedAccessType === 'FREE'} 
                  onChange={() => setSelectedAccessType('FREE')} 
                />
                <span>Tải miễn phí</span>
              </label>
              <label className="filter-radio-label">
                <input 
                  type="radio" 
                  name="accessType" 
                  checked={selectedAccessType === 'PAID'} 
                  onChange={() => setSelectedAccessType('PAID')} 
                />
                <span>Mua lẻ lẻ (Paid)</span>
              </label>
              <label className="filter-radio-label">
                <input 
                  type="radio" 
                  name="accessType" 
                  checked={selectedAccessType === 'COURSE_ONLY'} 
                  onChange={() => setSelectedAccessType('COURSE_ONLY')} 
                />
                <span>Chỉ kèm khóa học</span>
              </label>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">SẮP XẾP THEO</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="filter-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </aside>

        {/* Content Area */}
        <div className="store-main-content">
          {/* Top Search Bar */}
          <SearchBar 
            value={searchVal} 
            onChange={setSearchVal} 
            placeholder="Tìm theo tên học liệu, bản vẽ CAD..." 
            onClear={() => setSearchVal('')}
            className="store-search-bar"
          />

          {/* Results count */}
          <div className="store-results-info font-mono">
            Kết quả: <span>{filteredProducts.length}</span> học liệu phù hợp
          </div>

          {/* Grid list of products */}
          {filteredProducts.length > 0 ? (
            <div className="grid-cols-2">
              {filteredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="Không tìm thấy học liệu nào phù hợp."
              description="Vui lòng thử bỏ bớt các bộ lọc hoặc kiểm tra lại từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
export const demo = true;
