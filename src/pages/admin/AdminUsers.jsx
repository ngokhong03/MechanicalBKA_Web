import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User, Mail, Calendar, Key } from 'lucide-react';
import { adminService } from '../../services/adminService';
import './AdminCommon.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await adminService.getAdminUsers();
        setUsers(res);
      } catch (err) {
        console.error('[AdminUsers] Lỗi:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.uid || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-page font-mono">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">TÀI KHOẢN HỌC VIÊN</h1>
          <p className="admin-page-desc">Danh sách tài khoản học viên và hồ sơ truy cập</p>
        </div>
      </div>

      <div className="admin-table-toolbar glass">
        <input 
          type="text" 
          placeholder="Tìm theo email, tên hoặc UID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng cộng: {filteredUsers.length} tài khoản
        </span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>UID</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Vai Trò (Profile)</th>
              <th>Ngày Tham Gia</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id || u.uid}>
                <td><span style={{ color: 'var(--text-muted)' }}>{u.uid || u.id}</span></td>
                <td><strong style={{ color: '#FFF' }}>{u.displayName || 'Chưa cập nhật'}</strong></td>
                <td><span style={{ color: '#38BDF8' }}>{u.email}</span></td>
                <td>
                  <span className={`status-pill ${u.role === 'admin' ? 'danger' : 'info'}`}>
                    {u.role === 'admin' ? 'ADMINISTRATOR' : 'STUDENT'}
                  </span>
                </td>
                <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(u.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
