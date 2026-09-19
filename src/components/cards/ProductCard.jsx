import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  ShoppingBag, 
  Check, 
  FileCode, 
  Cpu, 
  Calculator, 
  FileText, 
  Eye, 
  Video, 
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import Badge from '../common/Badge';
import { specialties, software } from '../../services/dataProvider';
import { useCart } from '../../context/CartContext';
import { normalizeProductData, formatFileSize } from '../../utils/mediaUtils';
import './ProductCard.css';

const formatProductTypeLabel = (type) => {
  switch (type) {
    case 'EPXYZ_FILE':
      return 'ENGINEERING PAPER XYZ';
    case 'PYTHON_TOOL':
      return 'TOOL PYTHON';
    case 'EXCEL_TOOL':
      return 'BẢNG TÍNH EXCEL';
    case 'CAD_PACKAGE':
    case 'CAD_PROJECT':
    case 'CAD':
      return 'BỘ FILE CAD 3D';
    case 'PROJECT':
      return 'ĐỒ ÁN CHI TIẾT MÁY';
    case 'CALCULATION':
      return 'BẢNG TÍNH TOÁN';
    case 'DRAWING':
      return 'BẢN VẼ KỸ THUẬT';
    case 'TOOL':
      return 'TOOL KỸ THUẬT';
    case 'TEMPLATE':
      return 'TEMPLATE ĐỒ ÁN';
    case 'DOCUMENT':
    case 'PDF':
      return 'TÀI LIỆU KỸ THUẬT';
    default:
      return type || 'FILE KỸ THUẬT';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'EPXYZ_FILE':
      return <Sparkles size={14} className="product-type-icon text-purple" />;
    case 'PYTHON_TOOL':
      return <FileCode size={14} className="product-type-icon text-sky" />;
    case 'EXCEL_TOOL':
    case 'CALCULATION':
      return <Calculator size={14} className="product-type-icon text-emerald" />;
    case 'CAD_PACKAGE':
    case 'CAD_PROJECT':
    case 'CAD':
      return <Layers size={14} className="product-type-icon text-amber" />;
    case 'PROJECT':
      return <Cpu size={14} className="product-type-icon" />;
    default:
      return <FileText size={14} className="product-type-icon" />;
  }
};

const ProductCard = ({ product: rawProduct }) => {
  const product = normalizeProductData(rawProduct) || rawProduct;
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  // Resolve specialties & software
  const productSpecialties = specialties.filter(spec => (product.specialtyIds || []).includes(spec.id));
  const productSoftware = software.filter(soft => (product.softwareIds || []).includes(soft.id));

  // Calculate file sizes & counts
  const fileCount = product.files?.length || product.fileCount || 1;
  const totalSizeBytes = product.files?.reduce((acc, file) => acc + (file.fileSize || 0), 0) || product.totalFileSize || 0;

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const isProject = product.productType === 'PROJECT';
  const hasThumbnail = Boolean(product.media?.thumbnailUrl);
  const hasVideo = Boolean(product.media?.youtubeVideoId);

  return (
    <div className={`product-card glass ${isProject ? 'product-card-project-highlight' : ''}`}>
      {/* Card Header Media / Thumbnail */}
      {hasThumbnail && (
        <Link to={`/store/${product.slug}`} className="product-card-thumbnail-container">
          <img 
            src={product.media.thumbnailUrl} 
            alt={product.title}
            className="product-card-thumbnail-img"
            loading="lazy"
          />
          {hasVideo && (
            <span className="card-video-pill font-mono" title="Có video demo thực tế">
              <Video size={11} /> DEMO
            </span>
          )}
        </Link>
      )}

      <div className="product-card-header">
        <div className="product-type-container font-mono">
          {getTypeIcon(product.productType)}
          <span>{formatProductTypeLabel(product.productType)}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="card-version-pill font-mono">v{product.version}</span>
        </div>
      </div>

      <div className="product-card-body">
        <Link to={`/store/${product.slug}`} className="product-card-title-link">
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        
        <p className="product-card-desc">
          {product.shortDescription || product.description || 'Bộ tài liệu kỹ thuật & tool tự động hóa cơ khí.'}
        </p>

        <div className="product-card-specs font-mono">
          <div className="product-spec-row">
            <span className="spec-label">Bộ hồ sơ:</span>
            <span className="spec-val font-bold text-primary">
              {fileCount} tệp ({formatFileSize(totalSizeBytes)})
            </span>
          </div>
          <div className="product-spec-row">
            <span className="spec-label">Phần mềm:</span>
            <span className="spec-val">
              {productSoftware.length > 0
                ? productSoftware.map(s => s.name).join(', ')
                : (product.productType === 'EPXYZ_FILE' 
                    ? 'Engineering Paper XYZ' 
                    : (product.technical?.compatibility?.join(', ') || 'Inventor / SolidWorks / AutoCAD'))}
            </span>
          </div>
          <div className="product-spec-row">
            <span className="spec-label">Định dạng:</span>
            <div className="product-formats">
              {(product.fileTypes || ['ZIP']).slice(0, 4).map(f => (
                <Badge key={f} text={f} className="format-badge" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="product-card-footer">

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {product.accessType === 'PAID' && (
            <button
              type="button"
              className={`product-cart-quick-btn ${inCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
              disabled={inCart}
              title={inCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
            >
              {inCart ? <Check size={14} /> : <ShoppingBag size={14} />}
            </button>
          )}

          <Link to={`/store/${product.slug}`} className="product-card-btn font-mono" title="Xem chi tiết bộ file">
            <Eye size={13} style={{ marginRight: '4px' }} />
            XEM CHI TIẾT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
