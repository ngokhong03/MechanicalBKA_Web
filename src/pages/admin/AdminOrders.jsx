import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  RefreshCw,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  HardDrive,
  Download,
  User,
  X,
  Wrench
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import './AdminCommon.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  // Diagnostic Modal State
  const [diagnosticsOrder, setDiagnosticsOrder] = useState(null);
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminOrders();
      setOrders(res);
    } catch (err) {
      console.error('[AdminOrders] Lỗi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenDiagnostics = async (order) => {
    setDiagnosticsOrder(order);
    setDiagnosticLoading(true);
    setDiagnosticError('');
    setDiagnosticData(null);

    try {
      const diag = await adminService.getOrderDiagnostics(order.id);
      setDiagnosticData(diag);
    } catch (err) {
      console.error('[AdminOrders] Lỗi truy vấn chẩn đoán đơn hàng:', err);
      setDiagnosticError(err.message || 'Không thể truy vấn thông tin chẩn đoán đơn hàng.');
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    if (window.confirm(`Xác nhận thanh toán cho đơn hàng ${orderId}? Hệ thống sẽ tự động kích hoạt quyền sở hữu cho học viên.`)) {
      setActionLoading(true);
      try {
        await adminService.confirmOrderPayment(orderId);
        await loadData();
        if (diagnosticsOrder && diagnosticsOrder.id === orderId) {
          const updatedDiag = await adminService.getOrderDiagnostics(orderId);
          setDiagnosticData(updatedDiag);
        }
      } catch (err) {
        alert(`[Lỗi xác nhận thanh toán] ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRepairEntitlements = async (orderId) => {
    if (window.confirm(`Khôi phục quyền sở hữu cho đơn hàng ${orderId}? Quyền tải sẽ được cấp lại cho tài khoản học viên.`)) {
      setActionLoading(true);
      try {
        const res = await adminService.repairOrderEntitlements(orderId);
        alert(`[Thành công] Đã khôi phục ${res.repairedCount} quyền sở hữu cho học viên.`);
        await loadData();
        const updatedDiag = await adminService.getOrderDiagnostics(orderId);
        setDiagnosticData(updatedDiag);
      } catch (err) {
        alert(`[Lỗi khôi phục quyền] ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Hủy đơn hàng ${orderId}?`)) {
      setActionLoading(true);
      try {
        await adminService.cancelOrder(orderId);
        await loadData();
      } catch (err) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.id || '').toLowerCase().includes(search.toLowerCase()) || 
      (o.userId || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.userEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchPayment = filterPayment === 'ALL' || o.paymentStatus === filterPayment;
    return matchSearch && matchPayment;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="admin-orders-page font-mono">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-heading">QUẢN LÝ ĐƠN HÀNG & CHẨN ĐOÁN GIAO DỊCH</h1>
          <p className="admin-page-desc">Kiểm tra thanh toán, đối soát quyền tải và chẩn đoán toàn diện quy trình đơn hàng</p>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={loadData}>
          Làm Mới
        </Button>
      </div>

      <div className="admin-table-toolbar glass">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, email hoặc UID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <select 
            value={filterPayment} 
            onChange={(e) => setFilterPayment(e.target.value)}
            className="admin-form-select"
            style={{ padding: '8px 12px' }}
          >
            <option value="ALL">Tất cả trạng thái thanh toán</option>
            <option value="unpaid">Chưa thanh toán (UNPAID)</option>
            <option value="paid">Đã thanh toán (PAID)</option>
          </select>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tổng số: {filteredOrders.length} đơn hàng
        </span>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Học Viên (UID)</th>
              <th>Số Món</th>
              <th>Tổng Tiền</th>
              <th>Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Thời Gian</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <strong style={{ color: '#FFF' }}>{order.id}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#E2E8F0', fontWeight: '500' }}>{order.userEmail || order.userId}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{order.userId}</span>
                  </div>
                </td>
                <td>{order.items?.length || 0} mục</td>
                <td><strong style={{ color: '#10B981' }}>{formatPrice(order.totalAmount)}</strong></td>
                <td>
                  <span className={`status-pill ${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${order.orderStatus === 'completed' ? 'success' : order.orderStatus === 'pending' ? 'warning' : 'danger'}`}>
                    {order.orderStatus?.toUpperCase()}
                  </span>
                </td>
                <td><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleString('vi-VN')}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button 
                      variant="outline" 
                      onClick={() => handleOpenDiagnostics(order)}
                      style={{ padding: '4px 8px', fontSize: '11px', color: '#38BDF8' }}
                      title="Xem chẩn đoán chi tiết đơn hàng"
                    >
                      <Eye size={12} style={{ marginRight: '4px' }} /> Chẩn Đoán
                    </Button>

                    {order.paymentStatus !== 'paid' && order.orderStatus !== 'cancelled' && (
                      <Button 
                        variant="primary" 
                        onClick={() => handleConfirmPayment(order.id)} 
                        disabled={actionLoading}
                        style={{ padding: '4px 8px', fontSize: '11px', background: '#10B981' }}
                      >
                        <CheckCircle size={12} style={{ marginRight: '4px' }} /> Duyệt Tiền
                      </Button>
                    )}
                    {order.orderStatus === 'pending' && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleCancelOrder(order.id)} 
                        disabled={actionLoading}
                        style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}
                      >
                        <XCircle size={12} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DIAGNOSTICS MODAL */}
      {diagnosticsOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content font-mono" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">
                CHẨN ĐOÁN TOÀN DIỆN ĐƠN HÀNG: {diagnosticsOrder.id}
              </span>
              <button onClick={() => setDiagnosticsOrder(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {diagnosticLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary)' }}>
                ĐANG TRUY VẤN DỮ LIỆU ĐỐI SOÁT ĐƠN HÀNG...
              </div>
            ) : diagnosticError ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '12px', borderRadius: '6px' }}>
                <AlertTriangle size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {diagnosticError}
              </div>
            ) : diagnosticData ? (
              <div>
                {/* Warning Banner if Paid but Missing Entitlements */}
                {diagnosticData.hasMissingEntitlements && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FCD34D', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} />
                      <span>CẢNH BÁO: Đơn hàng đã thanh toán nhưng thiếu {diagnosticData.missingEntitlementsCount} quyền sở hữu (Entitlement)!</span>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => handleRepairEntitlements(diagnosticsOrder.id)}
                      disabled={actionLoading}
                      style={{ padding: '6px 12px', fontSize: '11px', background: '#F59E0B' }}
                    >
                      <Wrench size={13} style={{ marginRight: '4px' }} /> Khôi Phục Quyền Tải
                    </Button>
                  </div>
                )}

                {/* Grid Overview: User & Order Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  {/* User Box */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} style={{ color: '#38BDF8' }} /> THÔNG TIN KHÁCH HÀNG
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFF' }}>{diagnosticData.user?.displayName || 'Khách hàng'}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{diagnosticData.user?.email}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>UID: {diagnosticData.user?.uid}</div>
                  </div>

                  {/* Order Box */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={13} style={{ color: '#10B981' }} /> TRẠNG THÁI GIAO DỊCH
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10B981' }}>{formatPrice(diagnosticData.order.totalAmount)}</span>
                      <span className={`status-pill ${diagnosticData.order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                        {diagnosticData.order.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Tạo lúc: {new Date(diagnosticData.order.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>

                {/* Items & Entitlements Diagnostic Table */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="admin-form-label" style={{ color: '#FFF', marginBottom: '10px', display: 'block' }}>
                    ĐỐI SOÁT SẢN PHẨM & QUYỀN SỞ HỮU ({diagnosticData.itemsDiagnostics.length} mục)
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {diagnosticData.itemsDiagnostics.map((itemDiag, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(0,0,0,0.4)', border: `1px solid ${itemDiag.hasActiveEntitlement ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        borderRadius: '8px', padding: '12px 14px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFF' }}>{itemDiag.item.title || itemDiag.product?.title || itemDiag.item.id}</span>
                            <span style={{ fontSize: '10px', color: '#38BDF8', marginLeft: '8px' }}>ID: {itemDiag.item.id}</span>
                          </div>

                          <span className={`status-pill ${itemDiag.hasActiveEntitlement ? 'success' : 'danger'}`}>
                            {itemDiag.hasActiveEntitlement ? 'ENTITLEMENT ACTIVE' : 'MISSING ENTITLEMENT'}
                          </span>
                        </div>

                        {/* Product Artifacts Summary */}
                        {itemDiag.product && itemDiag.product.files && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                            <div style={{ fontWeight: '600', color: '#E2E8F0', marginBottom: '4px' }}>
                              Tệp tin thương mại đính kèm ({itemDiag.product.files.length} tệp):
                            </div>
                            {itemDiag.product.files.map(f => (
                              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: '10px' }}>
                                <span>📁 {f.fileName} (v{f.version})</span>
                                <span style={{ color: '#FBBF24' }}>SHA: {f.checksum ? f.checksum.substring(0, 16) + '...' : 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Download stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>Số lượt tải thành công: <strong style={{ color: '#38BDF8' }}>{itemDiag.downloadsCount} lượt</strong></span>
                          {itemDiag.entitlement && (
                            <span>Cấp quyền lúc: {new Date(itemDiag.entitlement.grantedAt).toLocaleString('vi-VN')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  {diagnosticData.canRepair && (
                    <Button 
                      variant="primary" 
                      onClick={() => handleRepairEntitlements(diagnosticsOrder.id)}
                      disabled={actionLoading}
                      style={{ padding: '6px 14px', fontSize: '12px', background: '#F59E0B' }}
                    >
                      <Wrench size={14} style={{ marginRight: '4px' }} /> Khôi Phục Quyền Tải Ngay
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setDiagnosticsOrder(null)}>
                    Đóng
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
