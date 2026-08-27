import React from 'react';
import { software } from '../mock/data';
import SoftwareCard from '../components/cards/SoftwareCard';

const Software = () => {
  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="section-header">
        <span className="technical-label" style={{ color: 'var(--info)' }}>Phần mềm cơ khí chuyên ngành</span>
        <h1 className="section-title">Phần Mềm Đào Tạo</h1>
        <p className="section-subtitle">
          Các công cụ đồ họa 3D CAD và mô phỏng số học CAE ứng dụng trong nghiên cứu kỹ thuật thực tế.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '32px' }}>
        {software.map(soft => (
          <SoftwareCard key={soft.id} software={soft} />
        ))}
      </div>
    </div>
  );
};

export default Software;
