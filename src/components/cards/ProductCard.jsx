import React from 'react';
import { Link } from 'react-router-dom';
import { FileCode2, Package, Layers } from 'lucide-react';
import Badge from '../common/Badge';
import { specialties, software } from '../../mock/data';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Resolve specialties & software
  const productSpecialties = specialties.filter(spec => product.specialtyIds.includes(spec.id));
  const productSoftware = software.filter(soft => product.softwareIds.includes(soft.id));

  // Calculate file sizes & counts
  const fileCount = product.files?.length || 0;
  const totalSizeBytes = product.files?.reduce((acc, file) => acc + file.fileSize, 0) || 0;

  // Format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product-card glass">
      <div className="product-card-header">
        <div className="product-type-container font-mono">
          <Layers size={14} className="product-type-icon" />
          <span>{product.productType}</span>
        </div>
        <Badge text={product.accessType} />
      </div>

      <div className="product-card-body">
        <Link to={`/store/${product.slug}`}>
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        
        <p className="product-card-desc">
          {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
        </p>

        <div className="product-card-specs font-mono">
          <div className="product-spec-row">
            <span className="spec-label">Hồ sơ:</span>
            <span className="spec-val">{fileCount} tệp tin ({formatSize(totalSizeBytes)})</span>
          </div>
          <div className="product-spec-row">
            <span className="spec-label">Phần mềm:</span>
            <span className="spec-val">
              {productSoftware.length > 0 ? productSoftware.map(s => s.name).join(', ') : 'Tất cả'}
            </span>
          </div>
          <div className="product-spec-row">
            <span className="spec-label">Định dạng:</span>
            <div className="product-formats">
              {product.fileTypes.map(f => (
                <Badge key={f} text={f} className="format-badge" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="product-card-footer">
        <span className="product-card-price">{formatPrice(product.price)}</span>
        <Link to={`/store/${product.slug}`} className="product-card-btn font-mono">
          CHI TIẾT
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
