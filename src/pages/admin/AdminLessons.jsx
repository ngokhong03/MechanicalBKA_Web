import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Video, 
  AlertTriangle, 
  X,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    slug: '',
    description: '',
    order: 1,
    youtubeVideoId: '',
    isFreePreview: false,
    materialIds: []
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resLessons, resCourses, resProducts] = await Promise.all([
        adminService.getLessons(),
        adminService.getCourses(),
        adminService.getProducts()
      ]);
      setLessons(resLessons);
      setCourses(resCourses);
      setProducts(resProducts);
    } catch (err) {
      console.error('[AdminLessons] Lỗi tải bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingLesson(null);
    setFormData({
      courseId: courses.length > 0 ? courses[0].id : '',
      title: '',
      slug: '',
      description: '',
      order: lessons.length + 1,
      youtubeVideoId: '',
      isFreePreview: false,
      materialIds: []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      courseId: lesson.courseId || '',
      title: lesson.title || '',
      slug: lesson.slug || '',
      description: lesson.description || '',
      order: lesson.order || 1,
      youtubeVideoId: lesson.youtubeVideoId || '',
      isFreePreview: lesson.isFreePreview ?? false,
      materialIds: lesson.materialIds || []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề bài học.');
      return;
    }
    if (!formData.courseId) {
      setFormError('Vui lòng chọn khóa học.');
      return;
    }
    if (!formData.youtubeVideoId.trim()) {
      setFormError('Vui lòng nhập YouTube Video ID.');
      return;
    }

    setSaving(true);
    try {
      if (editingLesson) {
        await adminService.updateLesson(editingLesson.id, formData);
      } else {
        await adminService.createLesson(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu bài học.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lesson) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?`)) {
      try {
        await adminService.deleteLesson(lesson.id);
        await loadData();
      } catch (err) {
        alert(`[Lỗi Xóa Bài Học] ${err.message}`);
      }
    }
  };

  // Filtered List
  const filteredLessons = lessons.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.slug.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === 'ALL' || l.courseId === filterCourse;
    return matchSearch && matchCourse;
  });

  return (
    <div className="admin-lessons-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">QUẢN LÝ BÀI GIẢNG</h1>
          <p className="admin-page-desc">Cấu hình thứ tự bài giảng, liên kết video YouTube và tài liệu CAD đính kèm</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Thêm Bài Học Mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="admin-table-toolbar glass font-mono">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên bài học..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className="admin-form-select"
            style={{ padding: '8px 12px' }}
          >
            <option value="ALL">Tất cả khóa học</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredLessons.length} bài học
        </span>
      </div>

      {/* Table */}
      <div className="admin-table-container font-mono">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thứ Tự</th>
              <th>Tiêu Đề Bài Học</th>
              <th>Khóa Học</th>
              <th>YouTube Video</th>
              <th>Xem Thử Miễn Phí</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.map(lesson => {
              const course = courses.find(c => c.id === lesson.courseId);
              return (
                <tr key={lesson.id}>
                  <td>
                    <span className="status-pill info">Bài {lesson.order}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#FFF' }}>{lesson.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>slug: {lesson.slug}</div>
                  </td>
                  <td>
                    <span style={{ color: '#CBD5E1', fontSize: '12px' }}>
                      {course ? course.title : lesson.courseId}
                    </span>
                  </td>
                  <td>
                    <a 
                      href={`https://youtube.com/watch?v=${lesson.youtubeVideoId}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <Video size={13} /> {lesson.youtubeVideoId}
                    </a>
                  </td>
                  <td>
                    <span className={`status-pill ${lesson.isFreePreview ? 'success' : 'warning'}`}>
                      {lesson.isFreePreview ? 'FREE PREVIEW' : 'LOCKED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" onClick={() => handleOpenEdit(lesson)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                        <Edit2 size={12} style={{ marginRight: '4px' }} /> Sửa
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(lesson)} style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lesson Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content font-mono">
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                {editingLesson ? 'CHỈNH SỬA BÀI HỌC' : 'TẠO MỚI BÀI HỌC'}
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
                <label className="admin-form-label">Thuộc Khóa Học *</label>
                <select 
                  className="admin-form-select"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  required
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu đề bài học *</label>
                <input 
                  type="text" 
                  className="admin-form-input" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Bài 01: Tổng quan kết cấu khuôn ép nhựa 3 tấm"
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
                    placeholder="bai-01-tong-quan-ket-cau-khuon"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Thứ tự bài giảng (Order)</label>
                  <input 
                    type="number" 
                    className="admin-form-input" 
                    value={formData.order} 
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">YouTube Video ID *</label>
                <input 
                  type="text" 
                  className="admin-form-input" 
                  value={formData.youtubeVideoId} 
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  placeholder="Ví dụ: dQw4w9WgXcQ (Chỉ lấy ID sau v=)"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Học liệu / CAD đính kèm (Material IDs)</label>
                <select 
                  multiple 
                  className="admin-form-select"
                  style={{ height: '90px' }}
                  value={formData.materialIds}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, materialIds: selected });
                  }}
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.accessType})</option>
                  ))}
                </select>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Giữ Ctrl (hoặc Cmd) để chọn nhiều học liệu đính kèm.
                </span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Mô tả bài học</label>
                <textarea 
                  className="admin-form-textarea" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isFreePreview}
                    onChange={(e) => setFormData({ ...formData, isFreePreview: e.target.checked })}
                  />
                  Cho phép học thử miễn phí (Free Preview)
                </label>
              </div>

              <div className="admin-modal-actions">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Hủy Bỏ
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu Bài Học'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessons;
