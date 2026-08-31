import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Building,
  Copy,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentConfig, generateVietQRUrl } from '../config/payment';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const list = await orderService.getUserOrders(user.uid);
        if (isMounted) {
          setOrders(list || []);
        }
      } catch (err) {
        console.error('[OrderHistory] Lỗi tải lịch sử đơn hàng:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    return () => { isMounted = false; };
  }, [user]);

  const formatPrice = (price) => {
    if (price === 0) return '0 ₫ (Miễn phí)';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  return (
    <div className="container order-history-page" style={{ padding: '40px 24px', maxWidth: '950px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div className="order-breadcrumb font-mono">
        <Link to="/account">Hồ Sơ Cá Nhân</Link>
        <span className="separator">/</span>
        <span className="current">Lịch Sử Đơn Hàng</span>
      </div>

      {/* Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          STUDENT ORDER HISTORY & INVOICES
        </span>
        <h1 className="section-title">Lịch Sử Đơn Hàng</h1>
        <p className="section-subtitle">
          Theo dõi trạng thái duyệt thanh toán và thông tin các đơn đăng ký sản phẩm kỹ thuật, khóa học.
        </p>
      </div>

      {loading ? (
        <div className="font-mono" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--primary)' }}>
          ĐANG TẢI LỊCH SỬ ĐƠN HÀNG...
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          message="Bạn chưa có đơn hàng nào."
          description="Khám phá các khóa học thiết kế cơ khí và kho file kỹ thuật 3D CAD chuyên sâu của MechanicalBKA."
        />
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const transferContent = `${paymentConfig.transferPrefix} ${order.id}`;
            const qrUrl = generateVietQRUrl(order.totalAmount, order.id);
            const isPending = order.orderStatus === 'pending' || order.paymentStatus === 'unpaid';

            return (
              <div key={order.id} className="order-card glass">
                {/* Top Info Bar */}
                <div className="order-card-header font-mono">
                  <div className="order-header-left">
                    <span className="order-id-label">MÃ ĐƠN: <strong style={{ color: 'var(--text-main)' }}>{order.id}</strong></span>
                    <span className="order-date font-mono">
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </span>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-pill ${order.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                      {order.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                    </span>
                    <span className={`status-pill ${order.orderStatus === 'completed' ? 'status-completed' : 'status-pending'}`}>
                      {order.orderStatus === 'completed' ? 'HOÀN TẤT' : 'CHỜ DUYỆT'}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="order-items-table font-mono">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="order-item-line">
                      <div className="item-name-col">
                        <span className="item-type-tag">{item.targetType === 'course' ? 'KHÓA HỌC' : 'FILE KỸ THUẬT'}</span>
                        <span className="item-title-text">{item.snapshotTitle}</span>
                      </div>
                      <span className="item-price-col">{formatPrice(item.snapshotPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Bar */}
                <div className="order-card-footer font-mono">
                  <div className="order-total-col">
                    <span className="total-label-text">TỔNG ĐƠN HÀNG:</span>
                    <span className="total-price-text">{formatPrice(order.totalAmount)}</span>
                  </div>

                  <div className="order-actions-col">
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="view-qr-toggle-btn font-mono"
                      >
                        <QrCode size={14} style={{ marginRight: '6px' }} />
                        {isExpanded ? 'Ẩn thông tin chuyển khoản' : 'Xem mã VietQR chuyển khoản'}
                        {isExpanded ? <ChevronUp size={14} style={{ marginLeft: '4px' }} /> : <ChevronDown size={14} style={{ marginLeft: '4px' }} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Payment Transfer Card */}
                {isExpanded && isPending && (
                  <div className="expanded-payment-box glass font-mono">
                    <div className="expanded-grid">
                      <div className="expanded-bank-info">
                        <h4 className="expanded-heading">
                          <Building size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} /> THÔNG TIN CHUYỂN KHOẢN
                        </h4>
                        
                        <div className="bank-detail-line">
                          <span>Ngân hàng:</span>
                          <strong>{paymentConfig.bankName}</strong>
                        </div>

                        <div className="bank-detail-line">
                          <span>Số tài khoản:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: 'var(--primary)' }}>{paymentConfig.accountNumber}</strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentConfig.accountNumber, `${order.id}-acc`)}
                              className="copy-mini-btn"
                            >
                              {copiedField === `${order.id}-acc` ? 'Đã chép' : 'Chép'}
                            </button>
                          </div>
                        </div>

                        <div className="bank-detail-line">
                          <span>Chủ tài khoản:</span>
                          <strong>{paymentConfig.accountName}</strong>
                        </div>

                        <div className="bank-detail-line">
                          <span>Nội dung chuyển khoản:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <code className="transfer-code-text">{transferContent}</code>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(transferContent, `${order.id}-cnt`)}
                              className="copy-mini-btn"
                            >
                              {copiedField === `${order.id}-cnt` ? 'Đã chép' : 'Chép'}
                            </button>
                          </div>
                        </div>

                        <div className="bank-detail-line">
                          <span>Số tiền:</span>
                          <strong style={{ color: '#10B981', fontSize: '15px' }}>{formatPrice(order.totalAmount)}</strong>
                        </div>
                      </div>

                      <div className="expanded-qr-box">
                        <img src={qrUrl} alt="VietQR" className="expanded-qr-img" />
                        <span className="qr-mini-hint">Quét mã bằng app ngân hàng</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
