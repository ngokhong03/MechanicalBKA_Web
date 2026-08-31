import React, { useState, useEffect } from 'react';
import { Download, Search, HardDrive, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminDownloads = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDownloadLogs();
      setLogs(res);
    } catch (err) {
      console.error('[AdminDownloads] Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const filteredLogs = logs.filter(l => 
    (l.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.userId || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.productId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-downloads-page font-mono">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">LỊCH SỬ TẢI FILE (DOWNLOAD LOGS)</h1>
          <p className="admin-page-desc">Nhật ký truy xuất Private Storage và phát sinh Signed URL</p>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={loadLogs}>Làm Mới</Button>
      </div>

      <div className="admin-table-toolbar glass">
        <input 
          type="text" 
          placeholder="Tìm theo tên file, user hoặc product..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredLogs.length} lượt tải
        </span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên Tệp Tin</th>
              <th>Học Viên (UID)</th>
              <th>Mã Học Liệu</th>
              <th>Phương Thức</th>
              <th>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td><strong style={{ color: '#FFF' }}>{log.fileName}</strong></td>
                <td><span style={{ color: 'var(--text-muted)' }}>{log.userId}</span></td>
                <td><span style={{ color: '#38BDF8' }}>{log.productId}</span></td>
                <td>
                  <span className="status-pill info">{log.method}</span>
                </td>
                <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(log.createdAt).toLocaleString('vi-VN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDownloads;
