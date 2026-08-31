import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Cpu, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminSoftware = () => {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoft, setEditingSoft] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', logoUrl: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSoftware();
      setSoftware(res);
    } catch (err) {
      console.error('[AdminSoftware] Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenCreate = () => {
    setEditingSoft(null);
    setFormData({ name: '', slug: '', description: '', logoUrl: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (soft) => {
    setEditingSoft(soft);
    setFormData({ name: soft.name, slug: soft.slug, description: soft.description || '', logoUrl: soft.logoUrl || '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setFormError('Vui lòng nhập tên và slug.');
      return;
    }
    setSaving(true);
    try {
      if (editingSoft) {
        await adminService.updateSoftware(editingSoft.id, formData);
      } else {
        await adminService.createSoftware(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu phần mềm.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (soft) => {
    if (window.confirm(`Xóa phần mềm "${soft.name}"?`)) {
      try {
        await adminService.deleteSoftware(soft.id);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="admin-software-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">PHẦN MỀM CAD / CAE / CAM</h1>
          <p className="admin-page-desc">Quản lý danh mục phần mềm kỹ thuật (Inventor, SolidWorks, NX, Mastercam...)</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          Thêm Phần Mềm
        </Button>
      </div>

      <div className="admin-table-container font-mono">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên Phần Mềm</th>
              <th>Slug</th>
              <th>Mô Tả</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {software.map(soft => (
              <tr key={soft.id}>
                <td><strong style={{ color: '#FFF' }}>{soft.name}</strong></td>
                <td><span style={{ color: 'var(--text-muted)' }}>{soft.slug}</span></td>
                <td><span style={{ fontSize: '12px', color: '#94A3B8' }}>{soft.description?.substring(0, 60)}...</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" onClick={() => handleOpenEdit(soft)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                      <Edit2 size={12} style={{ marginRight: '4px' }} /> Sửa
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(soft)} style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}>
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
              <span className="admin-modal-title">{editingSoft ? 'SỬA PHẦN MỀM' : 'TẠO PHẦN MỀM'}</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF' }}><X size={20} /></button>
            </div>
            {formError && <div style={{ color: '#FCA5A5', marginBottom: '12px' }}>{formError}</div>}
            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-form-label">Tên phần mềm *</label>
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

export default AdminSoftware;
