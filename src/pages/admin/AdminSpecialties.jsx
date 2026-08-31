import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, AlertTriangle, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', order: 1 });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSpecialties();
      setSpecialties(res);
    } catch (err) {
      console.error('[AdminSpecialties] Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenCreate = () => {
    setEditingSpec(null);
    setFormData({ name: '', slug: '', description: '', order: specialties.length + 1 });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (spec) => {
    setEditingSpec(spec);
    setFormData({ name: spec.name, slug: spec.slug, description: spec.description || '', order: spec.order || 1 });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setFormError('Vui lòng nhập đầy đủ tên và slug.');
      return;
    }
    setSaving(true);
    try {
      if (editingSpec) {
        await adminService.updateSpecialty(editingSpec.id, formData);
      } else {
        await adminService.createSpecialty(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu chuyên ngành.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (spec) => {
    if (window.confirm(`Xóa chuyên ngành "${spec.name}"?`)) {
      try {
        await adminService.deleteSpecialty(spec.id);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="admin-specialties-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">CHUYÊN NGÀNH CƠ KHÍ</h1>
          <p className="admin-page-desc">Danh mục chuyên ngành đào tạo (Thiết Kế Máy, Khuôn Mẫu, Gia Công CNC...)</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Thêm Chuyên Ngành
        </Button>
      </div>

      <div className="admin-table-container font-mono">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thứ Tự</th>
              <th>Tên Chuyên Ngành</th>
              <th>Slug</th>
              <th>Mô Tả</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {specialties.map(spec => (
              <tr key={spec.id}>
                <td><span className="status-pill info">{spec.order || 1}</span></td>
                <td><strong style={{ color: '#FFF' }}>{spec.name}</strong></td>
                <td><span style={{ color: 'var(--text-muted)' }}>{spec.slug}</span></td>
                <td><span style={{ fontSize: '12px', color: '#94A3B8' }}>{spec.description?.substring(0, 60)}...</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" onClick={() => handleOpenEdit(spec)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <Edit2 size={12} style={{ marginRight: '4px' }} /> Sửa
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(spec)} style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay font-mono">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <span className="admin-modal-title">{editingSpec ? 'SỬA CHUYÊN NGÀNH' : 'TẠO CHUYÊN NGÀNH'}</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF' }}><X size={20} /></button>
            </div>
            {formError && <div style={{ color: '#FCA5A5', marginBottom: '12px' }}>{formError}</div>}
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tên chuyên ngành *</label>
                <input type="text" className="admin-form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug URL *</label>
                <input type="text" className="admin-form-input" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Mô tả</label>
                <textarea className="admin-form-textarea" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpecialties;
