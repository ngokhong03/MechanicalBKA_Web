import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  ShieldCheck,
  Building,
  User,
  Hash,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { dataProvider } from '../services/dataProvider';
import { orderService } from '../services/orderService';
import { paymentConfig, generateVietQRUrl } from '../config/payment';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './Checkout.css';

const Checkout = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart, cartCount, addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [directItem, setDirectItem] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [directError, setDirectError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  // Read URL query parameters
  const targetId = searchParams.get('targetId');
  const targetType = searchParams.get('targetType') || searchParams.get('cartType') || searchParams.get('type');

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return '0 ₫ (Miễn phí)';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Load item directly if targetId is provided in URL
  useEffect(() => {
    let isMounted = true;
    async function loadDirectItem() {
      if (!targetId) {
        setDirectItem(null);
        return;
      }

      setDirectLoading(true);
      setDirectError('');

      try {
        if (targetType === 'product') {
          const products = await dataProvider.getProducts();
          const found = products.find(p => p.id === targetId || p.slug === targetId);
          if (isMounted) {
            if (found) {
              setDirectItem({
                id: found.id,
                title: found.title,
                slug: found.slug,
                price: found.price,
                accessType: found.accessType,
                productType: found.productType || 'CAD_MODEL',
                targetType: 'product'
              });
            } else {
              setDirectError(`Không tìm thấy thông tin sản phẩm [${targetId}].`);
            }
          }
        } else {
          // Default to course
          const courses = await dataProvider.getCourses();
          const found = courses.find(c => c.id === targetId || c.slug === targetId);
          if (isMounted) {
            if (found) {
              setDirectItem({
                id: found.id,
                title: found.title,
                slug: found.slug,
                price: found.price,
                accessType: found.accessType,
                productType: 'KHÓA HỌC',
                targetType: 'course'
              });
            } else {
              setDirectError(`Không tìm thấy thông tin khóa học [${targetId}].`);
            }
          }
        }
      } catch (err) {
        console.error('[Checkout] Lỗi tải thông tin mục mua trực tiếp:', err);
        if (isMounted) setDirectError('Không thể tải thông tin mục cần thanh toán.');
      } finally {
        if (isMounted) setDirectLoading(false);
      }
    }

    loadDirectItem();
    return () => { isMounted = false; };
  }, [targetId, targetType]);

  // Determine active checkout items and total
  const checkoutItems = directItem ? [directItem] : cartItems;
  const totalAmountToPay = directItem ? (directItem.price || 0) : cartTotal;
  const totalItemCount = directItem ? 1 : cartCount;

  // 1. Check Guest state
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="container checkout-page" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '48px 24px', maxWidth: '540px', margin: '0 auto', borderRadius: '12px' }}>
          <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Yêu cầu đăng nhập</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
            Vui lòng đăng nhập hoặc đăng ký tài khoản học viên để tiến hành thanh toán và kích hoạt quyền học.
          </p>
          <Link to="/auth" state={{ from: location }}>
            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
              Đăng Nhập / Đăng Ký Ngay →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading direct item
  if (directLoading) {
    return (
      <div className="container checkout-page font-mono" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--primary)' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: '12px' }} />
        <div>ĐANG TRUY VẤN THÔNG TIN ĐƠN HÀNG...</div>
      </div>
    );
  }

  // 2. Handle Create Order
  const handleCreateOrder = async () => {
    if (totalItemCount === 0) {
      setErrorMsg('Đơn hàng trống. Vui lòng chọn sản phẩm kỹ thuật hoặc khóa học để thanh toán.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Chuẩn bị payload bảo mật: Chỉ gửi targetId và targetType
      const orderItems = checkoutItems.map(item => ({
        targetId: item.id,
        targetType: item.targetType || (item.productType === 'KHÓA HỌC' ? 'course' : 'product')
      }));

      const idempotencyKey = `req_${user.uid}_${Date.now()}`;
      const newOrder = await orderService.createOrder({
        userId: user.uid,
        items: orderItems,
        idempotencyKey
      });

      setCreatedOrder(newOrder);
      // Chỉ clear giỏ hàng nếu đặt từ giỏ hàng
      if (!directItem) {
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Render Order Confirmation & Payment Instructions
  if (createdOrder) {
    const transferContent = `${paymentConfig.transferPrefix} ${createdOrder.id}`;
    const qrUrl = generateVietQRUrl(createdOrder.totalAmount, createdOrder.id);

    return (
      <div className="container checkout-page" style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Success Header */}
        <div className="order-created-banner glass font-mono">
          <CheckCircle2 size={32} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>
            <span className="technical-label" style={{ color: '#10B981' }}>ORDER CREATED SUCCESSFULLY</span>
            <h1 style={{ fontSize: '22px', margin: '4px 0 6px 0', color: 'var(--text-main)' }}>
              Đơn Hàng Đã Được Tạo: <span style={{ color: 'var(--primary)' }}>{createdOrder.id}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              Trạng thái: <span className="status-badge-pending font-mono">CHỜ XÁC NHẬN THANH TOÁN</span>
            </p>
          </div>
        </div>

        <div className="payment-grid-layout" style={{ marginTop: '24px' }}>
          {/* Left: Bank Details */}
          <div className="payment-details-card glass">
            <h2 className="card-tech-heading font-mono">
              <Building size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> THÔNG TIN CHUYỂN KHOẢN NGÂN HÀNG
            </h2>

            <div className="bank-info-table font-mono">
              <div className="bank-info-row">
                <span className="b-label">NGÂN HÀNG:</span>
                <span className="b-val">{paymentConfig.bankName}</span>
              </div>

              <div className="bank-info-row">
                <span className="b-label">SỐ TÀI KHOẢN:</span>
                <div className="b-val-copy">
                  <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{paymentConfig.accountNumber}</strong>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.accountNumber, 'accountNo')}
                    className="copy-btn"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'accountNo' ? <CheckCircle2 size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                    <span>{copiedField === 'accountNo' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              <div className="bank-info-row">
                <span className="b-label">CHỦ TÀI KHOẢN:</span>
                <span className="b-val">{paymentConfig.accountName}</span>
              </div>

              <div className="bank-info-row">
                <span className="b-label">SỐ TIỀN THANH TOÁN:</span>
                <span className="b-val" style={{ color: '#10B981', fontSize: '18px', fontWeight: 800 }}>
                  {formatPrice(createdOrder.totalAmount)}
                </span>
              </div>

              <div className="bank-info-row transfer-content-row">
                <span className="b-label">NỘI DUNG CHUYỂN KHOẢN:</span>
                <div className="b-val-copy">
                  <code className="transfer-code">{transferContent}</code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'content')}
                    className="copy-btn"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedField === 'content' ? <CheckCircle2 size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                    <span>{copiedField === 'content' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="order-note-alert font-mono">
              <Clock size={16} style={{ color: '#F97316', flexShrink: 0 }} />
              <span>
                <strong>Lưu ý:</strong> Vui lòng điền chính xác nội dung chuyển khoản <code style={{ color: '#FB923C' }}>{transferContent}</code> để hệ thống tự động đối soát nhanh nhất.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <Link to="/account/orders">
                <Button variant="primary">
                  <Hash size={15} style={{ marginRight: '6px' }} /> Xem Lịch Sử Đơn Hàng
                </Button>
              </Link>
              <Link to="/store">
                <Button variant="outline">
                  Tiếp tục xem sản phẩm
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: VietQR Code Box */}
          <div className="payment-qr-card glass">
            <h2 className="card-tech-heading font-mono" style={{ textAlign: 'center' }}>
              <QrCode size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> QUÉT MÃ VIETQR NHANH
            </h2>
            
            <div className="qr-container">
              <img
                src={qrUrl}
                alt="VietQR Chuyển khoản MechanicalBKA"
                className="vietqr-image"
              />
            </div>

            <p className="qr-instruction font-mono">
              Sử dụng App Ngân hàng bất kỳ để quét mã. Số tiền và nội dung chuyển khoản sẽ được tự động điền chính xác.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Initial Step: Review Cart / Direct Item & Submit Order
  return (
    <div className="container checkout-page" style={{ padding: '40px 24px', maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          SECURE CHECKOUT & ORDER CONFIRMATION
        </span>
        <h1 className="section-title">Xác Nhận Đơn Hàng & Thanh Toán</h1>
        <p className="section-subtitle">
          Kiểm tra danh mục sản phẩm trước khi tiến hành khởi tạo đơn hàng và nhận thông tin chuyển khoản.
        </p>
      </div>

      {directError && (
        <div className="checkout-error-banner font-mono">
          <AlertCircle size={16} />
          <span>{directError}</span>
        </div>
      )}

      {errorMsg && (
        <div className="checkout-error-banner font-mono">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="checkout-review-card glass">
        <h2 className="card-tech-heading font-mono">
          <ShoppingBag size={16} style={{ marginRight: '8px', color: 'var(--primary)' }} /> DANH SÁCH MỤC THANH TOÁN ({totalItemCount})
        </h2>

        {totalItemCount > 0 ? (
          <div className="checkout-items-list font-mono">
            {checkoutItems.map(item => (
              <div key={item.id} className="checkout-item-row">
                <div className="checkout-item-name-box">
                  <span className="checkout-item-type">{item.productType || 'CAD'}</span>
                  <span className="checkout-item-title">{item.title}</span>
                </div>
                <span className="checkout-item-price">{formatPrice(item.price)}</span>
              </div>
            ))}

            <div className="checkout-divider"></div>

            <div className="checkout-total-row font-mono">
              <span className="checkout-total-label">TỔNG TIỀN THANH TOÁN:</span>
              <span className="checkout-total-val">{formatPrice(totalAmountToPay)}</span>
            </div>
          </div>
        ) : (
          <div className="font-mono" style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Giỏ hàng của bạn đang trống. Vui lòng chọn một khóa học hoặc sản phẩm kỹ thuật để thanh toán.
          </div>
        )}

        <div className="checkout-security-notice font-mono">
          <ShieldCheck size={16} style={{ color: '#10B981', marginRight: '8px', flexShrink: 0 }} />
          <span>
            Giá sản phẩm kỹ thuật và khóa học được kiểm tra và tính toán bảo mật trực tiếp từ cơ sở dữ liệu.
          </span>
        </div>

        <div className="checkout-actions-row">
          <Link to="/cart">
            <Button variant="outline" disabled={isSubmitting}>
              <ArrowLeft size={15} style={{ marginRight: '6px' }} /> Quay lại Giỏ hàng
            </Button>
          </Link>

          <Button
            variant="primary"
            onClick={handleCreateOrder}
            disabled={isSubmitting || totalItemCount === 0}
            style={{ minWidth: '220px', justifyContent: 'center' }}
          >
            {isSubmitting ? 'ĐANG TẠO ĐƠN HÀNG...' : 'XÁC NHẬN & TẠO ĐƠN HÀNG →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
