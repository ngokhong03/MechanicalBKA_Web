import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs();
      setLogs(res);
    } catch (err) {
      console.error('[AdminAuditLogs] Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const filteredLogs = logs.filter(l => 
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.targetType || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.targetId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-audit-page font-mono">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">NHẬT KÝ THAO TÁC QUẢN TRỊ (AUDIT LOGS)</h1>
          <p className="admin-page-desc">Theo dõi mọi thay đổi cấu hình, tạo mới, chỉnh sửa và phê duyệt đơn hàng</p>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={loadLogs}>Làm Mới</Button>
      </div>

      <div className="admin-table-toolbar glass">
        <input 
          type="text" 
          placeholder="Tìm theo hành động hoặc đối tượng..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredLogs.length} bản ghi
        </span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hành Động (Action)</th>
              <th>Admin UID</th>
              <th>Loại Đối Tượng</th>
              <th>Mã ID</th>
              <th>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <span className="status-pill info">{log.action}</span>
                </td>
                <td><span style={{ color: 'var(--text-muted)' }}>{log.adminUid}</span></td>
                <td><strong style={{ color: '#FFF' }}>{log.targetType}</strong></td>
                <td><span style={{ color: '#38BDF8' }}>{log.targetId}</span></td>
                <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(log.createdAt).toLocaleString('vi-VN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
