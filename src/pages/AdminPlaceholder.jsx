import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Terminal, Database, Users, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const AdminPlaceholder = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '850px', margin: '0 auto' }}>
      <div className="glass" style={{ padding: '36px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <ShieldCheck size={36} style={{ color: '#10B981' }} />
          <div>
            <span className="technical-label font-mono" style={{ color: '#10B981' }}>
              ADMIN ACCESS VERIFIED (CUSTOM CLAIMS)
            </span>
            <h1 style={{ fontSize: '26px', margin: 0 }}>Cổng Quản Trị Hệ Thống MechanicalBKA</h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '14px', marginBottom: '24px' }}>
          Phiên đăng nhập quản trị viên đã được xác thực thành công qua Firebase Auth Custom Claims <code className="font-mono" style={{ color: 'var(--primary)' }}>{'{ admin: true }'}</code>.
          Nền tảng Admin CMS đầy đủ sẽ được triển khai ở giai đoạn tiếp theo.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="glass" style={{ padding: '16px', borderRadius: '8px' }}>
            <Database size={20} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>DATABASE STATUS</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>Firestore Connected</div>
          </div>

          <div className="glass" style={{ padding: '16px', borderRadius: '8px' }}>
            <Layers size={20} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CONTENT MODULES</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>6 Courses / 8 Products</div>
          </div>

          <div className="glass" style={{ padding: '16px', borderRadius: '8px' }}>
            <Users size={20} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RBAC CLAIMS</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>Strict JWT Token</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/account">
            <Button variant="outline">
              <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Về Trang Cá Nhân
            </Button>
          </Link>
          <Link to="/">
            <Button variant="primary">
              Về Trang Chủ Public
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
