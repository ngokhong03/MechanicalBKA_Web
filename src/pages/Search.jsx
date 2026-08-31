import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, FileText, Video, Award, HardDrive } from 'lucide-react';
import { courses, products, videos, specialties, software, lessons } from '../mock/data';
import SearchBar from '../components/common/SearchBar';
import CourseCard from '../components/cards/CourseCard';
import ProductCard from '../components/cards/ProductCard';
import EmptyState from '../components/common/EmptyState';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  // Sync state with URL parameter `?q=...`
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (value) => {
    setQuery(value);
    setSearchParams({ q: value });
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  // Helper: Count lessons in course
  const getLessonCount = (courseId) => {
    return lessons.filter(l => l.courseId === courseId).length;
  };

  // Perform search across entities
  const lowerQuery = query.toLowerCase().trim();
  const searchResults = {
    courses: [],
    products: [],
    videos: [],
    specialties: [],
    software: []
  };

  if (lowerQuery) {
    // Search courses
    searchResults.courses = courses.filter(c => 
      c.isPublished && (
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
      )
    );

    // Search products (materials)
    searchResults.products = products.filter(p => 
      p.isPublished && (
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      )
    );

    // Search videos
    searchResults.videos = videos.filter(v => 
      v.isPublished && (
        v.title.toLowerCase().includes(lowerQuery) ||
        v.description.toLowerCase().includes(lowerQuery)
      )
    );

    // Search specialties
    searchResults.specialties = specialties.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    );

    // Search software
    searchResults.software = software.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    );
  }

  const totalResults = 
    searchResults.courses.length + 
    searchResults.products.length + 
    searchResults.videos.length + 
    searchResults.specialties.length + 
    searchResults.software.length;

  return (
    <div className="container search-page" style={{ padding: '40px 24px' }}>
      {/* Search Input Box */}
      <div className="search-header-box">
        <SearchBar 
          value={query}
          onChange={handleSearchSubmit}
          onClear={handleClear}
          placeholder="Nhập tên phần mềm, tệp tin CAD, video hoặc chuyên ngành cần tìm..."
          className="main-search-input-field"
        />
      </div>

      {query ? (
        <div className="search-results-section">
          {/* Results count info */}
          <div className="results-count-title font-mono">
            TÌM THẤY <span>{totalResults}</span> KẾT QUẢ CHO TỪ KHÓA "{query.toUpperCase()}"
          </div>

          {totalResults > 0 ? (
            <div className="results-groups-list">
              {/* Specialty & Software matched */}
              {(searchResults.specialties.length > 0 || searchResults.software.length > 0) && (
                <div className="result-group glass">
                  <h3 className="group-title font-mono"><Award size={16} /> DANH MỤC LIÊN QUAN</h3>
                  <div className="category-results-list">
                    {searchResults.specialties.map(spec => (
                      <Link key={spec.id} to={`/courses?specialty=${spec.id}`} className="category-result-item font-mono">
                        <span className="cat-badge specialty-type">Chuyên ngành</span>
                        <span className="cat-name">{spec.name}</span>
                      </Link>
                    ))}
                    {searchResults.software.map(soft => (
                      <Link key={soft.id} to={`/courses?software=${soft.id}`} className="category-result-item font-mono">
                        <span className="cat-badge software-type">Phần mềm</span>
                        <span className="cat-name">{soft.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Matched */}
              {searchResults.courses.length > 0 && (
                <div className="result-group">
                  <h3 className="group-title font-mono"><BookOpen size={16} /> KHÓA HỌC PHÙ HỢP ({searchResults.courses.length})</h3>
                  <div className="grid-cols-2">
                    {searchResults.courses.map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        lessonCount={getLessonCount(course.id)} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Products Matched */}
              {searchResults.products.length > 0 && (
                <div className="result-group">
                  <h3 className="group-title font-mono"><FileText size={16} /> FILE KỸ THUẬT & SẢN PHẨM ({searchResults.products.length})</h3>
                  <div className="grid-cols-2">
                    {searchResults.products.map(prod => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Matched */}
              {searchResults.videos.length > 0 && (
                <div className="result-group">
                  <h3 className="group-title font-mono"><Video size={16} /> VIDEOS BÀI GIẢNG ({searchResults.videos.length})</h3>
                  <div className="videos-inline-list">
                    {searchResults.videos.map(vid => (
                      <div key={vid.id} className="video-search-row glass font-mono">
                        <div className="video-row-left">
                          <span className="video-time">{vid.duration}</span>
                          <span className="video-title-txt">{vid.title}</span>
                        </div>
                        {vid.lessonId && courses.find(c => c.id === vid.courseId) && lessons.find(l => l.id === vid.lessonId) ? (
                          <Link 
                            to={`/courses/${courses.find(c => c.id === vid.courseId).slug}/lessons/${lessons.find(l => l.id === vid.lessonId).slug}`}
                            className="video-row-action"
                          >
                            HỌC BÀI GIẢNG →
                          </Link>
                        ) : (
                          <a 
                            href={`https://www.youtube.com/watch?v=${vid.youtubeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-row-action youtube-color"
                          >
                            YOUTUBE →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState 
              message="Không tìm thấy nội dung phù hợp."
              description="Vui lòng thử gõ từ khóa khác (ví dụ: khuôn, inventor, solidworks, polymer, composite...)"
            />
          )}
        </div>
      ) : (
        <div className="search-welcome-box text-center">
          <SearchIcon size={48} className="search-welcome-icon" />
          <h2 className="welcome-title">Nhập Từ Khóa Tìm Kiếm</h2>
          <p className="welcome-desc">
            Nhập thông tin khóa học, file CAD khuôn mẫu hoặc video bài giảng bạn đang quan tâm để tìm nhanh kết quả liên quan.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
