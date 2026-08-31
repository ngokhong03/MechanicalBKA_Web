import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Check, 
  X,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAccess, setFilterAccess] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnailUrl: '',
    price: 0,
    accessType: 'PAID',
    isPublished: true,
    isFeatured: false,
    specialtyIds: [],
    softwareIds: []
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resCourses, resSpecs, resSofts] = await Promise.all([
        adminService.getCourses(),
        adminService.getSpecialties(),
        adminService.getSoftware()
      ]);
      setCourses(resCourses);
      setSpecialties(resSpecs);
      setSoftware(resSofts);
    } catch (err) {
      console.error('[AdminCourses] Lỗi tải danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
      price: 0,
      accessType: 'FREE',
      isPublished: true,
      isFeatured: false,
      specialtyIds: specialties.length > 0 ? [specialties[0].id] : [],
      softwareIds: software.length > 0 ? [software[0].id] : []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
      price: course.price || 0,
      accessType: course.accessType || 'PAID',
      isPublished: course.isPublished ?? true,
      isFeatured: course.isFeatured ?? false,
      specialtyIds: course.specialtyIds || [],
      softwareIds: course.softwareIds || []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề khóa học.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('Vui lòng nhập slug URL khóa học.');
      return;
    }
    if (formData.price < 0) {
      setFormError('Giá khóa học không được âm.');
      return;
    }

    setSaving(true);
    try {
      if (editingCourse) {
        await adminService.updateCourse(editingCourse.id, formData);
      } else {
        await adminService.createCourse(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu khóa học.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}"?`)) {
      try {
        await adminService.deleteCourse(course.id);
        await loadData();
      } catch (err) {
        alert(`[Lỗi Xóa Khóa Học] ${err.message}`);
      }
    }
  };

  // Filtered List
  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase());
    const matchAccess = filterAccess === 'ALL' || c.accessType === filterAccess;
    return matchSearch && matchAccess;
  });

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="admin-courses-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">QUẢN LÝ KHÓA HỌC</h1>
          <p className="admin-page-desc">Tạo mới, chỉnh sửa giáo trình đào tạo và cấu hình quyền học</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Thêm Khóa Học Mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="admin-table-toolbar glass font-mono">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc slug..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select 
            value={filterAccess} 
            onChange={(e) => setFilterAccess(e.target.value)}
            className="admin-form-select"
            style={{ padding: '8px 12px' }}
          >
            <option value="ALL">Tất cả loại truy cập</option>
            <option value="FREE">Miễn phí (FREE)</option>
            <option value="PAID">Trả phí (PAID)</option>
          </select>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredCourses.length} khóa học
        </span>
      </div>

      {/* Table */}
      <div className="admin-table-container font-mono">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên Khóa Học</th>
              <th>Loại Quyền</th>
              <th>Giá Bán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.id}>
                <td>
                  <div style={{ fontWeight: '600', color: '#FFF' }}>{course.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>slug: {course.slug}</div>
                </td>
                <td>
                  <span className={`status-pill ${course.accessType === 'FREE' ? 'info' : 'warning'}`}>
                    {course.accessType}
                  </span>
                </td>
                <td>{formatPrice(course.price)}</td>
                <td>
                  <span className={`status-pill ${course.isPublished ? 'success' : 'danger'}`}>
                    {course.isPublished ? 'Đã Xuất Bản' : 'Bản Nháp'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" onClick={() => handleOpenEdit(course)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <Edit2 size={12} style={{ marginRight: '4px' }} /> Sửa
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(course)} style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Editor Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content font-mono">
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                {editingCourse ? 'CHỈNH SỬA KHÓA HỌC' : 'TẠO MỚI KHÓA HỌC'}
              </span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>
                <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {formError}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu đề khóa học *</label>
                <input 
                  type="text" 
                  className="admin-form-input" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Thiết Kế Khuôn Ép Nhựa SolidWorks Toàn Diện"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Slug URL *</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.slug} 
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="thiet-ke-khuon-ep-nhua"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Loại Truy Cập</label>
                  <select 
                    className="admin-form-select"
                    value={formData.accessType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      accessType: e.target.value,
                      price: e.target.value === 'FREE' ? 0 : formData.price
                    })}
                  >
                    <option value="FREE">Miễn Phí (FREE)</option>
                    <option value="PAID">Trả Phí (PAID)</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Giá bán (VNĐ)</label>
                  <input 
                    type="number" 
                    className="admin-form-input" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    disabled={formData.accessType === 'FREE'}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Ảnh Thumbnail (URL)</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.thumbnailUrl} 
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Mô tả khóa học</label>
                <textarea 
                  className="admin-form-textarea" 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="admin-form-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  Xuất bản công khai (Published)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Khóa học nổi bật (Featured)
                </label>
              </div>

              <div className="admin-modal-actions">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Hủy Bỏ
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu Khóa Học'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
