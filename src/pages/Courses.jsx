import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw } from 'lucide-react';
import { specialties, software, courses, lessons } from '../mock/data';
import CourseCard from '../components/cards/CourseCard';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import './Courses.css';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for search and filters
  const [searchVal, setSearchVal] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Sync state with URL Search Params (e.g. from Home links)
  useEffect(() => {
    const spec = searchParams.get('specialty');
    const soft = searchParams.get('software');
    const query = searchParams.get('q');
    
    if (spec) setSelectedSpecialty(spec);
    if (soft) setSelectedSoftware(soft);
    if (query) setSearchVal(query);
  }, [searchParams]);

  // Handle resets
  const handleResetFilters = () => {
    setSearchVal('');
    setSelectedSpecialty('');
    setSelectedSoftware('');
    setSelectedLevel('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Helper: Count lessons in course
  const getLessonCount = (courseId) => {
    return lessons.filter(l => l.courseId === courseId).length;
  };

  // Filtered and Sorted courses
  const filteredCourses = courses
    .filter(c => c.isPublished)
    .filter(c => {
      // Search match
      if (!searchVal.trim()) return true;
      const lowerSearch = searchVal.toLowerCase();
      return (
        c.title.toLowerCase().includes(lowerSearch) ||
        c.description.toLowerCase().includes(lowerSearch)
      );
    })
    .filter(c => {
      // Specialty match
      if (!selectedSpecialty) return true;
      return c.specialtyIds.includes(selectedSpecialty);
    })
    .filter(c => {
      // Software match
      if (!selectedSoftware) return true;
      return c.softwareIds.includes(selectedSoftware);
    })
    .filter(c => {
      // Level match
      if (!selectedLevel) return true;
      return c.level === selectedLevel;
    })
    .sort((a, b) => {
      // newest default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="container courses-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label" style={{ color: 'var(--primary)' }}>Engineering learning path</span>
        <h1 className="section-title">Danh Sách Khóa Học</h1>
        <p className="section-subtitle">Lựa chọn lộ trình học tập để bắt đầu làm chủ thiết kế cơ khí và mô phỏng CAE.</p>
      </div>

      <div className="courses-grid-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass">
          <div className="filter-sidebar-header">
            <span className="filter-header-title font-mono"><Filter size={14} style={{ marginRight: '6px' }} />BỘ LỌC</span>
            <button onClick={handleResetFilters} className="filter-reset-btn font-mono" title="Reset Filters">
              <RotateCcw size={12} /> LÀM MỚI
            </button>
          </div>

          {/* Specialty Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">CHUYÊN NGÀNH</label>
            <select 
              value={selectedSpecialty} 
              onChange={(e) => setSelectedSpecialty(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả chuyên ngành</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>

          {/* Software Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">PHẦN MỀM</label>
            <select 
              value={selectedSoftware} 
              onChange={(e) => setSelectedSoftware(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả phần mềm</option>
              {software.map(soft => (
                <option key={soft.id} value={soft.id}>{soft.name}</option>
              ))}
            </select>
          </div>



          {/* Level Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">CẤP ĐỘ</label>
            <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)} 
              className="filter-select"
            >
              <option value="">Tất cả cấp độ</option>
              <option value="Cơ bản">Cơ bản (Beginner)</option>
              <option value="Trung cấp">Trung cấp (Intermediate)</option>
              <option value="Nâng cao">Nâng cao (Advanced)</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label font-mono">SẮP XẾP THEO</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="filter-select"
            >
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </aside>

        {/* Content Area */}
        <div className="courses-main-content">
          {/* Top Search Bar */}
          <SearchBar 
            value={searchVal} 
            onChange={setSearchVal} 
            placeholder="Tìm tên khóa học hoặc nội dung chi tiết..." 
            onClear={() => setSearchVal('')}
            className="courses-search-bar"
          />

          {/* Results count */}
          <div className="results-info font-mono">
            Kết quả: <span>{filteredCourses.length}</span> khóa học phù hợp
          </div>

          {/* Grid list of courses */}
          {filteredCourses.length > 0 ? (
            <div className="grid-cols-2">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  lessonCount={getLessonCount(course.id)} 
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="Không tìm thấy khóa học nào phù hợp."
              description="Vui lòng thử bỏ bớt các bộ lọc hoặc kiểm tra lại từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
