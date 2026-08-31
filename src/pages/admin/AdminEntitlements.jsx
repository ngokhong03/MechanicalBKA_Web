import React, { useState, useEffect } from 'react';
import { KeyRound, Plus, ShieldCheck, ShieldAlert, X, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminEntitlements = () => {
  const [entitlements, setEntitlements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    targetType: 'course',
    targetId: ''
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resEnt, resCourses, resProds] = await Promise.all([
        adminService.getAdminEntitlements(),
        adminService.getCourses(),
        adminService.getProducts()
      ]);
      setEntitlements(resEnt);
      setCourses(resCourses);
      setProducts(resProds);
    } catch (err) {
      console.error('[AdminEntitlements] Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!formData.userId.trim() || !formData.targetId.trim()) {
      alert('Vui lòng nhập đầy đủ UID và chọn mục tiêu.');
      return;
    }
    setSaving(true);
    try {
      await adminService.grantEntitlement(formData.userId, formData.targetType, formData.targetId);
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`[Lỗi Cấp Quyền] ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (entId) => {
    if (window.confirm(`Bạn có chắc chắn muốn thu hồi quyền sở hữu ${entId}?`)) {
      try {
        await adminService.revokeEntitlement(entId);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="admin-entitlements-page font-mono">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">QUYỀN TRUY CẬP (ENTITLEMENTS)</h1>
          <p className="admin-page-desc">Danh sách quyền học và tải file gán theo User ID định danh</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Cấp Quyền Thủ Công
        </Button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Entitlement ID</th>
              <th>Học Viên (UID)</th>
              <th>Loại Quyền</th>
              <th>Mã Mục Tiêu (Target ID)</th>
              <th>Nguồn Cấp</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {entitlements.map(ent => (
              <tr key={ent.id}>
                <td><strong style={{ color: '#FFF', fontSize: '11px' }}>{ent.id}</strong></td>
                <td><span style={{ color: 'var(--text-muted)' }}>{ent.userId}</span></td>
                <td>
                  <span className="status-pill info">{ent.targetType?.toUpperCase()}</span>
                </td>
                <td><span style={{ color: '#38BDF8' }}>{ent.targetId}</span></td>
                <td><span style={{ fontSize: '11px', color: '#94A3B8' }}>{ent.sourceOrderId || 'ADMIN'}</span></td>
                <td>
                  <span className={`status-pill ${ent.status === 'active' ? 'success' : 'danger'}`}>
                    {ent.status?.toUpperCase()}
                  </span>
                </td>
                <td>
                  {ent.status === 'active' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleRevoke(ent.id)}
                      style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}
                    >
                      Thu Hồi
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grant Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <span className="admin-modal-title">CẤP QUYỀN TRUY CẬP THỦ CÔNG</span>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleGrant}>
              <div className="admin-form-group">
                <label className="admin-form-label">User ID (Học viên) *</label>
                <input 
                  type="text" 
                  className="admin-form-input" 
                  value={formData.userId}
                  onChange={e => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Ví dụ: uid_student_123"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Loại Mục Tiêu</label>
                <select 
                  className="admin-form-select"
                  value={formData.targetType}
                  onChange={e => setFormData({ ...formData, targetType: e.target.value, targetId: '' })}
                >
                  <option value="course">Khóa Học (Course)</option>
                  <option value="product">Học Liệu / File CAD (Product)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Mục Tiêu Cấp Quyền *</label>
                <select 
                  className="admin-form-select"
                  value={formData.targetId}
                  onChange={e => setFormData({ ...formData, targetId: e.target.value })}
                  required
                >
                  <option value="">-- Chọn mục tiêu --</option>
                  {formData.targetType === 'course' ? (
                    courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.id})</option>)
                  ) : (
                    products.map(p => <option key={p.id} value={p.id}>{p.title} ({p.id})</option>)
                  )}
                </select>
              </div>

              <div className="admin-modal-actions">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Đang cấp...' : 'Cấp Quyền'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEntitlements;
