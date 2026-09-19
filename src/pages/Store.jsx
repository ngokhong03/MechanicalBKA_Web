import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw } from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import ProductCard from '../components/cards/ProductCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import './Store.css';

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data states from dataProvider
  const [productsList, setProductsList] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for search and filters
  const [searchVal, setSearchVal] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');

  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Load data from dataProvider
  useEffect(() => {
    let isMounted = true;
    async function loadStoreData() {
      setLoading(true);
      try {
        const [prods, specs, softs] = await Promise.all([
          dataProvider.getProducts(),
          dataProvider.getSpecialties(),
          dataProvider.getSoftware()
        ]);
        if (isMounted) {
          setProductsList(prods || []);
          setSpecialtiesList(specs || []);
          setSoftwareList(softs || []);
        }
      } catch (err) {
        console.error('[Store] Lỗi tải sản phẩm từ dataProvider:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStoreData();
    return () => { isMounted = false; };
  }, []);

  // Sync state with URL search params (e.g. from footer or home link)
  useEffect(() => {
    const spec = searchParams.get('specialty');
    const typeParam = searchParams.get('type');
    if (spec) setSelectedSpecialty(spec);
    if (typeParam) setSelectedProductType(typeParam);
  }, [searchParams]);

  // Handle resets
  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedSpecialty('');
    setSelectedSoftware('');
    setSelectedProductType('');
    setIsFeaturedOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Filtered and Sorted products
  const filteredProducts = productsList
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
      return (p.specialtyIds || []).includes(selectedSpecialty);
    })
    .filter(p => {
      // Software match
      if (!selectedSoftware) return true;
      return (p.softwareIds || []).includes(selectedSoftware);
    })
    .filter(p => {
      // Product Type match
      if (!selectedProductType) return true;
      return p.productType === selectedProductType;
    })
    .filter(p => {
      // Featured filter
      if (!isFeaturedOnly) return true;
      return p.isFeatured === true;
    })
    .sort((a, b) => {
      // 'newest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="container store-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          DIGITAL ENGINEERING FILE STORE
        </span>
        <h1 className="section-title">Kho File Kỹ Thuật</h1>
        <p className="section-subtitle">
          Đồ án Chi tiết máy, CAD, bản vẽ, tính toán và công cụ kỹ thuật cho thiết kế cơ khí.
        </p>
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
              {specialtiesList.map(spec => (
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
              {softwareList.map(soft => (
                <option key={soft.id} value={soft.id}>{soft.name}</option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">LOẠI SẢN PHẨM</label>
            <select 
              value={selectedProductType} 
              onChange={(e) => setSelectedProductType(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả loại</option>
              <option value="EPXYZ_FILE">Engineering Paper XYZ</option>
              <option value="PROJECT">Đồ Án Chi Tiết Máy</option>
              <option value="CAD_PROJECT">Bộ File CAD 3D</option>
              <option value="CAD_PACKAGE">Bộ File CAD 3D Tham Số Hóa</option>
              <option value="DRAWING">Bản Vẽ Kỹ Thuật</option>
              <option value="CALCULATION">Bảng Tính Toán</option>
              <option value="PYTHON_TOOL">Tool Tự Động Hóa Python</option>
              <option value="EXCEL_TOOL">Bảng Tính Tự Động Hóa Excel</option>
              <option value="TOOL">Tool Kỹ Thuật</option>
              <option value="TEMPLATE">Template Đồ Án</option>
              <option value="DOCUMENT">Tài Liệu Kỹ Thuật</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>


          {/* Featured Toggle */}
          <div className="filter-group">
            <label className="filter-label font-mono">NỔI BẬT</label>
            <label className="filter-radio-label" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={isFeaturedOnly} onChange={(e) => setIsFeaturedOnly(e.target.checked)} />
              <span>Chỉ hiện sản phẩm nổi bật</span>
            </label>
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
            </select>
          </div>
        </aside>

        {/* Content Area */}
        <div className="store-main-content">
          {/* Top Search Bar */}
          <SearchBar 
            value={searchVal} 
            onChange={setSearchVal} 
            placeholder="Tìm đồ án, CAD, bản vẽ, tính toán..." 
            onClear={() => setSearchVal('')}
            className="store-search-bar"
          />

          {/* Results count */}
          <div className="store-results-info font-mono">
            Kết quả: <span>{filteredProducts.length}</span> sản phẩm kỹ thuật phù hợp
          </div>

          {/* Grid list of products */}
          {loading ? (
            <div className="font-mono" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--primary)' }}>
              ĐANG TẢI DANH MỤC SẢN PHẨM KỸ THUẬT...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid-cols-2">
              {filteredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="Không tìm thấy sản phẩm kỹ thuật nào phù hợp."
              description="Thử điều chỉnh bộ lọc hoặc tìm kiếm bằng từ khóa khác."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
