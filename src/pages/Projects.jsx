import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Cpu, FileCode, Calculator, Layers } from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import ProductCard from '../components/cards/ProductCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import './Projects.css';

const PROJECT_TYPES = [
  { value: '', label: 'Tất cả đồ án' },
  { value: 'Hộp giảm tốc', label: 'Hộp giảm tốc' },
  { value: 'Hệ dẫn động', label: 'Hệ dẫn động' },
  { value: 'Bộ truyền bánh răng', label: 'Bộ truyền bánh răng' },
  { value: 'Thiết kế trục', label: 'Thiết kế trục' },
  { value: 'Bản vẽ kỹ thuật', label: 'Bản vẽ kỹ thuật' },
  { value: 'Khuôn mẫu', label: 'Khuôn mẫu' },
  { value: 'Dụng cụ cắt', label: 'Dụng cụ cắt' }
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [productsList, setProductsList] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchVal, setSearchVal] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [selectedAccessType, setSelectedAccessType] = useState('');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
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
        console.error('[Projects] Lỗi tải dữ liệu đồ án:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Sync from URL
  useEffect(() => {
    const pt = searchParams.get('projectType');
    const spec = searchParams.get('specialty');
    const soft = searchParams.get('software');
    const feat = searchParams.get('featured');
    if (pt) setSelectedProjectType(pt);
    if (spec) setSelectedSpecialty(spec);
    if (soft) setSelectedSoftware(soft);
    if (feat === 'true') setIsFeaturedOnly(true);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedProjectType('');
    setSelectedSpecialty('');
    setSelectedSoftware('');
    setSelectedAccessType('');
    setIsFeaturedOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Compute statistics for the stats bar
  const catalogStats = useMemo(() => {
    const published = productsList.filter(p => p.isPublished);
    return {
      projects: published.filter(p => p.productType === 'PROJECT').length,
      total: published.filter(p => p.productType === 'PROJECT').length,
    };
  }, [productsList]);

  // Filter only project/engineering types for this page
  const projectProducts = productsList
    .filter(p => p.isPublished)
    .filter(p => p.productType === 'PROJECT')
    .filter(p => {
      if (!searchVal.trim()) return true;
      const lowerSearch = searchVal.toLowerCase();
      return (
        p.title.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch)
      );
    })
    .filter(p => {
      if (!selectedProjectType) return true;
      return p.projectType === selectedProjectType;
    })
    .filter(p => {
      if (!selectedSpecialty) return true;
      return (p.specialtyIds || []).includes(selectedSpecialty);
    })
    .filter(p => {
      if (!selectedSoftware) return true;
      return (p.softwareIds || []).includes(selectedSoftware);
    })
    .filter(p => {
      if (!selectedAccessType) return true;
      return p.accessType === selectedAccessType;
    })
    .filter(p => {
      if (!isFeaturedOnly) return true;
      return p.isFeatured === true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="container projects-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          <Cpu size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          MACHINE ELEMENTS DESIGN PROJECTS
        </span>
        <h1 className="section-title">Đồ Án Chi Tiết Máy</h1>
        <p className="section-subtitle">
          Bộ hồ sơ đồ án thiết kế cơ khí hoàn chỉnh: mô hình 3D CAD, bảng tính Excel, bản vẽ kỹ thuật 2D và thuyết minh chuẩn Đại học Bách Khoa.
        </p>
      </div>

      {/* Catalog Statistics Bar */}
      {!loading && catalogStats.total > 0 && (
        <div className="projects-stats-bar">
          <div className="projects-stat-item">
            <Cpu size={16} style={{ color: 'var(--primary)' }} />
            <span className="stat-value">{catalogStats.projects}</span>
            <span className="stat-label">Đồ án</span>
          </div>
        </div>
      )}

      <div className="store-grid-layout">
        {/* Sidebar Filters */}
        <aside className="store-filters-sidebar glass">
          <div className="filter-sidebar-header">
            <span className="filter-header-title font-mono"><Filter size={14} style={{ marginRight: '6px' }} />BỘ LỌC ĐỒ ÁN</span>
            <button onClick={handleResetFilters} className="filter-reset-btn font-mono" title="Reset Filters">
              <RotateCcw size={12} /> LÀM MỚI
            </button>
          </div>

          {/* Project Type Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">LOẠI ĐỒ ÁN</label>
            <select 
              value={selectedProjectType} 
              onChange={(e) => setSelectedProjectType(e.target.value)} 
              className="filter-select"
            >
              {PROJECT_TYPES.map(pt => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
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
            <label className="filter-label font-mono">PHẦN MỀM</label>
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

          {/* Access Type Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">HÌNH THỨC</label>
            <div className="filter-radio-group">
              <label className="filter-radio-label">
                <input type="radio" name="accessType" checked={selectedAccessType === ''} onChange={() => setSelectedAccessType('')} />
                <span>Tất cả</span>
              </label>
              <label className="filter-radio-label">
                <input type="radio" name="accessType" checked={selectedAccessType === 'FREE'} onChange={() => setSelectedAccessType('FREE')} />
                <span>Miễn phí</span>
              </label>
              <label className="filter-radio-label">
                <input type="radio" name="accessType" checked={selectedAccessType === 'PAID'} onChange={() => setSelectedAccessType('PAID')} />
                <span>Trả phí</span>
              </label>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="filter-group">
            <label className="filter-label font-mono">NỔI BẬT</label>
            <label className="filter-radio-label" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={isFeaturedOnly} onChange={(e) => setIsFeaturedOnly(e.target.checked)} />
              <span>Chỉ hiện sản phẩm nổi bật</span>
            </label>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label font-mono">SẮP XẾP</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá: Thấp → Cao</option>
              <option value="price-high">Giá: Cao → Thấp</option>
            </select>
          </div>
        </aside>

        {/* Content */}
        <div className="store-main-content">
          <SearchBar 
            value={searchVal} 
            onChange={setSearchVal} 
            placeholder="Tìm đồ án, hộp giảm tốc, bản vẽ trục, bánh răng..." 
            onClear={() => setSearchVal('')}
            className="store-search-bar"
          />

          <div className="store-results-info font-mono">
            Kết quả: <span>{projectProducts.length}</span> đồ án phù hợp
          </div>

          {loading ? (
            <div className="font-mono" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--primary)' }}>
              ĐANG TẢI DANH MỤC ĐỒ ÁN CHI TIẾT MÁY...
            </div>
          ) : projectProducts.length > 0 ? (
            <div className="grid-cols-2">
              {projectProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="Không tìm thấy đồ án nào phù hợp."
              description="Thử điều chỉnh bộ lọc hoặc tìm kiếm bằng từ khóa khác."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
