import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  ShoppingBag, 
  PlaySquare, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Download, 
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [storageHealth, setStorageHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAudit, setRecentAudit] = useState([]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [resStats, resAudit, resHealth] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAuditLogs(),
        adminService.getStorageHealthSummary()
      ]);
      setStats(resStats);
      setRecentAudit(resAudit.slice(0, 5));
      setStorageHealth(resHealth);
    } catch (err) {
      console.error('[AdminDashboard] Lỗi tải thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="font-mono" style={{ padding: '60px', textAlign: 'center', color: 'var(--primary)' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: '12px' }} />
        <div>ĐANG TRUY VẤN DỮ LIỆU THỐNG KÊ QUẢN TRỊ...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header-row font-mono">
        <div>
          <h1 className="admin-page-heading">BẢNG ĐIỀU KHIỂN HỆ THỐNG</h1>
          <p className="admin-page-desc">Tổng quan các chỉ số đào tạo, doanh thu, quyền sở hữu và sức khỏe lưu trữ MechanicalBKA</p>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={loadStats} style={{ fontSize: '12px' }}>
          Làm mới số liệu
        </Button>
      </div>

      {/* Top Critical Metrics */}
      <div className="admin-stats-grid font-mono">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>DOANH THU ĐÃ THU</span>
            <DollarSign size={18} style={{ color: '#10B981' }} />
          </div>
          <div className="admin-stat-value" style={{ color: '#10B981' }}>
            {formatPrice(stats?.totalRevenue)}
          </div>
          <div className="admin-stat-meta">
            Từ {stats?.paidOrdersCount || 0} đơn hàng hoàn tất
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>ĐƠN HÀNG CHỜ DUYỆT</span>
            <Clock size={18} style={{ color: stats?.pendingOrders > 0 ? '#F59E0B' : 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value" style={{ color: stats?.pendingOrders > 0 ? '#F59E0B' : '#FFF' }}>
            {stats?.pendingOrders || 0}
          </div>
          <div className="admin-stat-meta">
            <Link to="/admin/orders" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Xử lý đơn ngay <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>QUYỀN TRUY CẬP (ACTIVE)</span>
            <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="admin-stat-value">
            {stats?.activeEntitlements || 0}
          </div>
          <div className="admin-stat-meta">
            Entitlements cấp cho học viên
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>LƯỢT TẢI FILE (LOGS)</span>
            <Download size={18} style={{ color: '#38BDF8' }} />
          </div>
          <div className="admin-stat-value">
            {stats?.recentDownloadsCount || 0}
          </div>
          <div className="admin-stat-meta">
            Bảo mật qua Private Storage
          </div>
        </div>
      </div>

      {/* Storage Health Summary Card */}
      {storageHealth && (
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px', padding: '16px 20px', marginBottom: '24px'
        }} className="font-mono">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: '#38BDF8' }} />
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF' }}>
                TRẠNG THÁI LƯU TRỮ & TOÀN VẸN ARTIFACT (STORAGE HEALTH)
              </span>
            </div>
            <span className={`status-pill ${storageHealth.overallStatus === 'EXCELLENT' ? 'success' : storageHealth.overallStatus === 'GOOD' ? 'info' : 'warning'}`}>
              {storageHealth.overallStatus}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Sản phẩm:</span>{' '}
              <strong style={{ color: '#FFF' }}>{storageHealth.totalProducts}</strong> ({storageHealth.publishedCount} Đã đăng, {storageHealth.draftCount} Nháp)
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Tổng Artifacts:</span>{' '}
              <strong style={{ color: '#38BDF8' }}>{storageHealth.totalArtifacts} tệp</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Thiếu Thumbnail:</span>{' '}
              <strong style={{ color: storageHealth.missingThumbnails > 0 ? '#F59E0B' : '#10B981' }}>
                {storageHealth.missingThumbnails}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Toàn vẹn Checksum:</span>{' '}
              <strong style={{ color: storageHealth.missingChecksums > 0 ? '#EF4444' : '#10B981' }}>
                {storageHealth.missingChecksums === 0 ? '100% Khớp' : `${storageHealth.missingChecksums} lỗi`}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Content Counts Grid */}
      <h3 className="font-mono" style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '14px' }}>
        KHO FILE KỸ THUẬT & NỘI DUNG ĐÀO TẠO
      </h3>

      <div className="admin-stats-grid font-mono">
        <Link to="/admin/courses" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
            <div className="admin-stat-top">
              <span>KHÓA HỌC</span>
              <BookOpen size={16} />
            </div>
            <div className="admin-stat-value">{stats?.coursesCount || 0}</div>
            <div className="admin-stat-meta">Xem danh sách khóa học →</div>
          </div>
        </Link>

        <Link to="/admin/lessons" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
            <div className="admin-stat-top">
              <span>BÀI HỌC</span>
              <Video size={16} />
            </div>
            <div className="admin-stat-value">{stats?.lessonsCount || 0}</div>
            <div className="admin-stat-meta">Quản lý bài giảng & video →</div>
          </div>
        </Link>

        <Link to="/admin/products" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
            <div className="admin-stat-top">
              <span>FILE KỸ THUẬT / CAD</span>
              <ShoppingBag size={16} />
            </div>
            <div className="admin-stat-value">{stats?.productsCount || 0}</div>
            <div className="admin-stat-meta">File đính kèm & bộ mô hình →</div>
          </div>
        </Link>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span>VIDEO YOUTUBE</span>
            <PlaySquare size={16} />
          </div>
          <div className="admin-stat-value">{stats?.videosCount || 0}</div>
          <div className="admin-stat-meta">Kênh @trongbka đồng bộ</div>
        </div>
      </div>

      {/* Recent Audit Activities */}
      <div className="admin-table-container font-mono" style={{ marginTop: '28px' }}>
        <div className="admin-table-toolbar">
          <span style={{ fontWeight: '700', color: '#FFF' }}>NHẬT KÝ QUẢN TRỊ GẦN ĐÂY (AUDIT LOGS)</span>
          <Link to="/admin/audit-logs" style={{ fontSize: '12px', color: 'var(--primary)' }}>
            Xem toàn bộ nhật ký →
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Hành Động</th>
              <th>Đối Tượng</th>
              <th>Mã ID</th>
              <th>Thời Gian</th>
            </tr>
          </thead>
          <tbody>
            {recentAudit.map(log => (
              <tr key={log.id}>
                <td>
                  <span className="status-pill info">{log.action}</span>
                </td>
                <td>{log.targetType}</td>
                <td><span style={{ color: 'var(--text-muted)' }}>{log.targetId}</span></td>
                <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
