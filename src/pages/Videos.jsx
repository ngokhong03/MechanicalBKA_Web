import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ExternalLink, Video, X, Sparkles } from 'lucide-react';
import { videos, courses, lessons, software } from '../mock/data';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { initializeApp, getApps, getApp } from 'firebase/app';
import YoutubeIcon from '../components/common/YoutubeIcon';
import Badge from '../components/common/Badge';
import './Videos.css';

const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@trongbka';
const YOUTUBE_SUBSCRIBE_URL = 'https://youtube.com/@trongbka?sub_confirmation=1';

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  
  // AI Summary State
  const [aiSummary, setAiSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Extract categories for filter
  const categories = Array.from(new Set(videos.map(v => v.category)));

  // Filtered videos
  const filteredVideos = videos.filter(vid => {
    if (!selectedCategory) return true;
    return vid.category === selectedCategory;
  });

  const handlePlayVideo = (youtubeVideoId) => {
    setActiveVideoId(youtubeVideoId);
    setAiSummary(null);
    setAiError(null);
  };

  const closeModal = () => {
    setActiveVideoId(null);
    setAiSummary(null);
    setAiError(null);
  };

  const handleSummarize = async () => {
    if (!activeVideoId) return;
    setIsSummarizing(true);
    setAiError(null);
    try {
      let app;
      if (!getApps().length) {
        app = initializeApp({ projectId: 'mechanicalbka-prod' });
      } else {
        app = getApp();
      }
      
      const functions = getFunctions(app, 'asia-southeast1');
      
      // Tự động kết nối emulator khi test trên localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        try {
          connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        } catch(e) {
          // ignore if already connected
        }
      }

      const summarizeVideo = httpsCallable(functions, 'summarizeVideo');
      const result = await summarizeVideo({ videoId: activeVideoId });
      setAiSummary(result.data.summary);
    } catch (err) {
      console.error(err);
      setAiError(err.message || 'Lỗi khi kết nối với AI. Vui lòng thử lại.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="container videos-page" style={{ padding: '40px 24px' }}>
      {/* YouTube Channel Banner */}
      <div className="videos-channel-banner">
        <div className="vcb-left">
          <div className="vcb-avatar">
            <YoutubeIcon size={24} />
          </div>
          <div className="vcb-info">
            <h2 className="vcb-name">MechanicalBKA</h2>
            <span className="vcb-handle font-mono">@trongbka</span>
          </div>
        </div>
        <div className="vcb-actions">
          <a 
            href={YOUTUBE_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="vcb-subscribe-btn"
          >
            <YoutubeIcon size={14} />
            <span>ĐĂNG KÝ KÊNH</span>
          </a>
          <a 
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="vcb-channel-link font-mono"
          >
            <span>XEM KÊNH YOUTUBE</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

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

      {/* Results count */}
      <div className="videos-result-count font-mono">
        {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
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
              <div 
                className="video-thumb-wrapper"
                onClick={() => handlePlayVideo(vid.youtubeVideoId)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={`Phát video: ${vid.title}`}
                onKeyDown={(e) => e.key === 'Enter' && handlePlayVideo(vid.youtubeVideoId)}
              >
                <img 
                  src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`} 
                  alt={vid.title} 
                  className="video-thumb-img"
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`; }}
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
                  <button 
                    onClick={() => handlePlayVideo(vid.youtubeVideoId)}
                    className="video-nav-btn font-mono video-play-btn"
                  >
                    <PlayCircle size={12} style={{ marginRight: '6px' }} /> PHÁT VIDEO
                  </button>
                  {associatedCourse && associatedLesson ? (
                    <Link 
                      to={`/courses/${associatedCourse.slug}/lessons/${associatedLesson.slug}`}
                      className="video-nav-btn font-mono"
                    >
                      <Video size={12} style={{ marginRight: '6px' }} /> BÀI GIẢNG →
                    </Link>
                  ) : (
                    <a 
                      href={`https://www.youtube.com/watch?v=${vid.youtubeVideoId}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="video-nav-btn font-mono youtube-link"
                    >
                      <YoutubeIcon size={12} style={{ marginRight: '6px' }} /> YOUTUBE <ExternalLink size={10} style={{ marginLeft: '4px' }} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All on YouTube CTA */}
      <div className="videos-yt-cta">
        <a 
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="videos-yt-btn"
        >
          <YoutubeIcon size={18} />
          <span>XEM TẤT CẢ TRÊN YOUTUBE</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* YouTube Video Player Modal */}
      {activeVideoId && (
        <div className="video-modal-backdrop" onClick={closeModal}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="video-modal-close" 
              onClick={closeModal}
              aria-label="Đóng trình phát video"
            >
              <X size={24} />
            </button>
            <div className="video-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="ai-summary-container font-mono">
              {!aiSummary && !isSummarizing && (
                 <button className="ai-summarize-btn" onClick={handleSummarize}>
                   <Sparkles size={16} className="ai-sparkles" /> TÓM TẮT VIDEO BẰNG AI
                 </button>
              )}
              {isSummarizing && (
                 <div className="ai-loading">
                   <div className="ai-pulse"></div> Đang phân tích nội dung...
                 </div>
              )}
              {aiError && (
                 <div className="ai-error">❌ {aiError}</div>
              )}
              {aiSummary && (
                 <div className="ai-summary-content">
                    <h4 className="ai-title"><Sparkles size={16}/> TÓM TẮT TỪ GEMINI AI</h4>
                    <div className="ai-text">{aiSummary}</div>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
