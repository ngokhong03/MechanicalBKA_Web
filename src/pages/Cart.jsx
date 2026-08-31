import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Layers, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (cartCount === 0) {
    return (
      <div className="container cart-page" style={{ padding: '60px 24px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
            DIGITAL MATERIALS CART
          </span>
          <h1 className="section-title">Giỏ Hàng File Kỹ Thuật</h1>
        </div>

        <div className="glass" style={{ padding: '60px 24px', textAlign: 'center', borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
          <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Giỏ hàng của bạn đang trống</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
            Bạn chưa chọn file kỹ thuật hoặc khóa học nào. Hãy khám phá kho file kỹ thuật chất lượng cao từ MechanicalBKA.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/store">
              <Button variant="primary">
                <Layers size={16} style={{ marginRight: '6px' }} /> Đến Kho File Kỹ Thuật
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline">
                <BookOpen size={16} style={{ marginRight: '6px' }} /> Xem Danh Sách Khóa Học
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label font-mono" style={{ color: 'var(--primary)' }}>
          DIGITAL MATERIALS CART ({cartCount} ITEMS)
        </span>
        <h1 className="section-title">Giỏ Hàng & Sản Phẩm Đã Chọn</h1>
        <p className="section-subtitle">
          Kiểm tra các tệp tin 3D CAD, bản vẽ kỹ thuật và lộ trình đào tạo trước khi tiến hành thanh toán.
        </p>
      </div>

      <div className="cart-grid-layout">
        {/* Items List */}
        <div className="cart-items-column">
          <div className="cart-items-header font-mono">
            <span>DANH SÁCH SẢN PHẨM ({cartCount})</span>
            <button type="button" onClick={clearCart} className="cart-clear-btn font-mono">
              <Trash2 size={13} style={{ marginRight: '4px' }} /> XÓA TOÀN BỘ
            </button>
          </div>

          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item-card glass">
                <div className="cart-item-info">
                  <div className="cart-item-meta-top">
                    <span className="cart-item-type font-mono">
                      <Layers size={12} style={{ marginRight: '4px' }} /> {item.productType || 'KHOÁ HỌC'}
                    </span>
                    <Badge text={item.accessType} />
                  </div>

                  <Link 
                    to={item.targetType === 'course' ? `/courses/${item.slug}` : `/store/${item.slug}`}
                    className="cart-item-title-link"
                  >
                    <h3 className="cart-item-title">{item.title}</h3>
                  </Link>

                  {item.fileTypes && item.fileTypes.length > 0 && (
                    <div className="cart-item-formats font-mono">
                      <span style={{ color: 'var(--text-muted)' }}>Định dạng:</span>
                      {item.fileTypes.map(f => (
                        <span key={f} className="format-tag">{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="cart-item-actions">
                  <span className="cart-item-price font-mono">{formatPrice(item.price)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="cart-remove-btn"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-bottom-nav">
            <Link to="/store" className="cart-continue-link font-mono">
              <ArrowLeft size={14} style={{ marginRight: '6px' }} /> TIẾP TỤC CHỌN SẢN PHẨM
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="cart-summary-sidebar glass">
          <h2 className="summary-title font-mono">TÓM TẮT ĐƠN HÀNG</h2>

          <div className="summary-rows-list font-mono">
            <div className="summary-row">
              <span className="summary-label">Số lượng sản phẩm:</span>
              <span className="summary-val">{cartCount} sản phẩm</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Tạm tính:</span>
              <span className="summary-val">{formatPrice(cartTotal)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Ưu đãi kỹ thuật:</span>
              <span className="summary-val" style={{ color: '#10B981' }}>0 ₫</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-row-total">
              <span className="total-label">TỔNG THANH TOÁN:</span>
              <span className="total-val">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="summary-checkout-box">
            <Link to="/checkout" style={{ width: '100%', textDecoration: 'none' }}>
              <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                TIẾN HÀNH THANH TOÁN <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </Button>
            </Link>
          </div>

          <div className="summary-security-notes font-mono">
            <div className="security-item">
              <ShieldCheck size={14} style={{ color: '#10B981', marginRight: '6px', flexShrink: 0 }} />
              <span>Giao dịch an toàn & Mã hóa checksum</span>
            </div>
            <div className="security-item">
              <ShieldCheck size={14} style={{ color: '#10B981', marginRight: '6px', flexShrink: 0 }} />
              <span>Cấp quyền tải về vĩnh viễn</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
