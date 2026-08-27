import React from 'react';
import { specialties, courses } from '../mock/data';
import SpecialtyCard from '../components/cards/SpecialtyCard';

const Specialties = () => {
  // Helper: Count courses in specialty
  const getCourseCountBySpecialty = (specId) => {
    return courses.filter(c => c.specialtyIds.includes(specId)).length;
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="section-header">
        <span className="technical-label" style={{ color: 'var(--primary)' }}>Chuyên ngành trọng tâm</span>
        <h1 className="section-title">Danh Mục Chuyên Ngành</h1>
        <p className="section-subtitle">
          Tìm hiểu các học phần kỹ thuật chuyên sâu được phân tích kỹ lưỡng và trực quan hóa.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '32px' }}>
        {specialties.map(spec => (
          <SpecialtyCard 
            key={spec.id} 
            specialty={spec} 
            courseCount={getCourseCountBySpecialty(spec.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Specialties;
