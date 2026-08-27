import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ExternalLink, Video } from 'lucide-react';
import { videos, courses, lessons, software } from '../mock/data';
import Badge from '../components/common/Badge';
import './Videos.css';

const YoutubeIcon = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract categories for filter
  const categories = Array.from(new Set(videos.map(v => v.category)));

  // Filtered videos
  const filteredVideos = videos.filter(vid => {
    if (!selectedCategory) return true;
    return vid.category === selectedCategory;
  });

  return (
    <div className="container videos-page" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="technical-label" style={{ color: 'var(--primary)' }}>Video Tutorials</span>
        <h1 className="section-title">Thư Viện Videos</h1>
        <p className="section-subtitle">
          Danh sách các video hướng dẫn kỹ thuật cơ khí, thiết kế CAD và phân tích CAE trực quan sinh động.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="video-categories-tabs font-mono">
        <button 
          onClick={() => setSelectedCategory('')}
          className={`tab-btn ${selectedCategory === '' ? 'tab-btn-active' : ''}`}
        >
          TẤT CẢ
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`tab-btn ${selectedCategory === cat ? 'tab-btn-active' : ''}`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid-cols-3">
        {filteredVideos.map(vid => {
          // Find associated course & lesson
          const associatedCourse = courses.find(c => c.id === vid.courseId);
          const associatedLesson = lessons.find(l => l.id === vid.lessonId);
          const softNames = software.filter(s => vid.softwareIds.includes(s.id)).map(s => s.name);

          return (
            <div key={vid.id} className="video-page-card glass">
              <div className="video-thumb-wrapper">
                <img 
                  src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`} 
                  alt={vid.title} 
                  className="video-thumb-img"
                />
                <div className="video-card-play-overlay">
                  <PlayCircle size={36} className="play-icon-glow" />
                </div>
                <span className="video-page-duration font-mono">{vid.duration}</span>
              </div>

              <div className="video-page-card-body">
                <div className="video-card-meta-row font-mono">
                  <span className="video-cat-badge">{vid.category}</span>
                  {softNames.length > 0 && (
                    <span className="video-soft-tag">{softNames.join(', ')}</span>
                  )}
                </div>

                <h3 className="video-page-card-title">{vid.title}</h3>
                <p className="video-page-card-desc">{vid.description}</p>

                <div className="video-page-card-footer">
                  {associatedCourse && associatedLesson ? (
                    <Link 
                      to={`/courses/${associatedCourse.slug}/lessons/${associatedLesson.slug}`}
                      className="video-nav-btn font-mono"
                    >
                      <Video size={12} style={{ marginRight: '6px' }} /> HỌC TRONG BÀI GIẢNG →
                    </Link>
                  ) : (
                    <a 
                      href={`https://www.youtube.com/watch?v=${vid.youtubeVideoId}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="video-nav-btn font-mono youtube-link"
                    >
                      <YoutubeIcon size={12} style={{ marginRight: '6px' }} /> XEM TRÊN YOUTUBE <ExternalLink size={10} style={{ marginLeft: '4px' }} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Videos;
