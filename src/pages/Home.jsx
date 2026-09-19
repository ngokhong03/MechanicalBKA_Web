import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coffee, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Layers, 
  Wrench, 
  Terminal,
  ExternalLink,
  Heart,
  FileCode,
  ShieldAlert,
  GraduationCap,
  Share2,
  Mail,
  PlayCircle,
  Phone,
  Users,
  Video
} from 'lucide-react';
import { dataProvider } from '../services/dataProvider';
import { videos as allVideos } from '../mock/data';
import Button from '../components/common/Button';
import YoutubeIcon from '../components/common/YoutubeIcon';
import './Home.css';

// Contact configuration for Software Support / Educational License Inquiry
const SUPPORT_CONTACT = {
  email: 'trongme2bka@gmail.com',
  subject: 'MechanicalBKA — Software Support / Educational License Inquiry',
  body: 'Xin chào EngineeringPaper.pro Team,\n\nTôi là người sáng lập dự án MechanicalBKA tại Việt Nam. Tôi viết thư này để giới thiệu về dự án và xin được xem xét cấp một Educational / Project License nhằm phục vụ xây dựng tài liệu tính toán kỹ thuật cho cộng đồng sinh viên và kỹ sư cơ khí Việt Nam.\n\nThông tin dự án: https://mechanicalbka.web.app\n\nTrân trọng,\nNguyễn Ngọc Trong'
};

// YouTube Channel Configuration
const YOUTUBE_CHANNEL = {
  handle: '@trongbka',
  name: 'MechanicalBKA',
  url: 'https://youtube.com/@trongbka',
  subscribeUrl: 'https://youtube.com/@trongbka?sub_confirmation=1',
  description: 'Kênh YouTube chuyên về đào tạo kỹ thuật cơ khí: Polymer & Composite, Thiết kế Khuôn, CAD/CAE, Gia công cơ khí và Chế tạo máy.',
  playlists: [
    {
      id: 'pl_01',
      title: 'Chế tạo máy & CNC',
      slug: 'che-tao-may',
      videoCount: 6,
      thumbnail: 'https://i.ytimg.com/vi/8GAm-l7FwtE/hq720.jpg',
      tag: 'MODULE 1'
    },
    {
      id: 'pl_02',
      title: 'Công nghệ Dập tạo hình',
      slug: 'dap-tao-hinh',
      videoCount: 2,
      thumbnail: 'https://i.ytimg.com/vi/kXwo9FqaEGY/hq720.jpg',
      tag: 'MODULE 2'
    },
    {
      id: 'pl_03',
      title: 'Polymer & Composite Materials',
      slug: 'polymer-composite',
      videoCount: 8,
      thumbnail: 'https://i.ytimg.com/vi/hPP477VSGis/hq720.jpg',
      tag: 'MODULE 5'
    },
    {
      id: 'pl_04',
      title: 'Injection Molding & Mold Design',
      slug: 'injection-molding',
      videoCount: 5,
      thumbnail: 'https://i.ytimg.com/vi/kXwo9FqaEGY/hq720.jpg',
      tag: 'MODULE 5.5'
    }
  ]
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load existing products for live statistics and resource links
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const prods = await dataProvider.getProducts();
        if (isMounted) {
          setProducts(prods || []);
        }
      } catch (err) {
        console.error('[Home] Lỗi tải dữ liệu sản phẩm:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Filter products by type (preserving catalog metadata & compatibility)
  const publishedProducts = useMemo(() => products.filter(p => p.isPublished), [products]);
  const epxyzProducts = useMemo(() => publishedProducts.filter(p => p.productType === 'EPXYZ_FILE'), [publishedProducts]);
  const calculationProducts = useMemo(() => publishedProducts.filter(p => ['EPXYZ_FILE', 'CALCULATION'].includes(p.productType)), [publishedProducts]);

  // Featured videos from synced data
  const featuredVideos = useMemo(() => {
    return allVideos.filter(v => v.isPublished).slice(0, 3);
  }, []);

  // Account details for Coffee Support (Preserved strictly)
  const bankDetails = {
    accountName: 'NGUYỄN NGỌC TRONG',
    bankName: 'ViettelPay (MB Bank)',
    accountNumber: '9704 2292 0140 3709 105',
    rawAccountNumber: '9704229201403709105',
    memo: 'Ung ho MechanicalBKA'
  };

  const handleCopyAccountNumber = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(bankDetails.rawAccountNumber);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = bankDetails.rawAccountNumber;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Không thể sao chép số tài khoản:', err);
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mailtoLink = `mailto:${SUPPORT_CONTACT.email}?subject=${encodeURIComponent(SUPPORT_CONTACT.subject)}&body=${encodeURIComponent(SUPPORT_CONTACT.body)}`;

  return (
    <div className="home-page engineering-landing">
      {/* ============================================================ */}
      {/* 1. HERO SECTION — Engineering / Independent Project Landing   */}
      {/* ============================================================ */}
      <section className="hero-landing-section">
        <div className="blueprint-grid-overlay" aria-hidden="true"></div>
        <div className="container hero-landing-container">
          
          {/* Status Badge */}
          <div className="dev-status-pill font-mono">
            <span className="live-status-dot"></span>
            <span>WE ARE BUILDING — DỰ ÁN KỸ THUẬT ĐỘC LẬP</span>
          </div>

          <h1 className="hero-landing-title">
            <span className="brand-highlight">MECHANICALBKA</span>
            <span className="hero-subhead">Nền Tảng Tài Liệu & Công Cụ Kỹ Thuật Cơ Khí</span>
          </h1>

          <p className="hero-landing-description">
            MechanicalBKA là một dự án độc lập tại Việt Nam, tập trung xây dựng kho tài liệu, đồ án, CAD và các tài liệu tính toán kỹ thuật dạng <strong className="text-white">Engineering Paper (.epxyz)</strong> phục vụ sinh viên và kỹ sư cơ khí.
          </p>

          {/* Hero CTAs */}
          <div className="hero-landing-actions">
            <Link to="/store">
              <Button variant="primary" size="large" icon={ArrowRight}>
                KHÁM PHÁ KHO TÀI LIỆU
              </Button>
            </Link>
            <a 
              href={YOUTUBE_CHANNEL.subscribeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-hero-youtube"
            >
              <YoutubeIcon size={18} />
              <span>KÊNH YOUTUBE</span>
              <ExternalLink size={12} />
            </a>
            <Button 
              variant="outline" 
              size="large" 
              icon={ArrowDown}
              onClick={() => scrollToSection('dev-roadmap')}
            >
              XEM TIẾN TRÌNH DỰ ÁN
            </Button>
          </div>

          {/* Technical Blueprint Key Metrics */}
          <div className="hero-technical-specs font-mono">
            <div className="spec-item">
              <span className="spec-label">PROJECT_TYPE:</span>
              <span className="spec-val text-accent">INDEPENDENT_PROJECT</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">CORE_FORMAT:</span>
              <span className="spec-val">EPXYZ_FILE (.epxyz)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">YOUTUBE_CHANNEL:</span>
              <span className="spec-val spec-val-yt">{YOUTUBE_CHANNEL.handle}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">ARTIFACTS_READY:</span>
              <span className="spec-val">{publishedProducts.length || 3}+ ITEMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. DEVELOPMENT STATUS — Project Progress & Roadmap           */}
      {/* ============================================================ */}
      <section id="dev-roadmap" className="home-section dev-status-section">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-pre-tag font-mono">ROADMAP / TIẾN ĐỘ</span>
            <h2 className="section-title-minimal">ĐANG XÂY DỰNG</h2>
            <p className="section-desc-minimal">
              MechanicalBKA được xây dựng nghiêm túc với quy trình chuẩn hóa từ tài liệu, định dạng file tính toán đến phương thức lưu trữ và phân phối.
            </p>
          </div>

          <div className="roadmap-grid">
            <div className="roadmap-item completed">
              <div className="roadmap-status-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono">HOÀN TẤT</span>
                <h3 className="roadmap-title">Nền tảng Marketplace & Thư viện</h3>
                <p className="roadmap-desc">Hệ thống danh mục kỹ thuật, tìm kiếm nhanh và giao diện tương thích đa thiết bị.</p>
              </div>
            </div>

            <div className="roadmap-item completed">
              <div className="roadmap-status-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono">HOÀN TẤT</span>
                <h3 className="roadmap-title">Hệ thống tài khoản & Entitlements</h3>
                <p className="roadmap-desc">Quản lý hồ sơ, lịch sử mua hàng và quyền sở hữu tệp tin độc lập cho từng người dùng.</p>
              </div>
            </div>

            <div className="roadmap-item completed">
              <div className="roadmap-status-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono">HOÀN TẤT</span>
                <h3 className="roadmap-title">Kho tài liệu kỹ thuật & Đồ án mẫu</h3>
                <p className="roadmap-desc">Bộ hồ sơ thiết kế chi tiết máy, bản vẽ 2D AutoCAD và mô hình 3D tham số hóa.</p>
              </div>
            </div>

            <div className="roadmap-item completed">
              <div className="roadmap-status-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono">HOÀN TẤT</span>
                <h3 className="roadmap-title">Engineering Paper XYZ (.epxyz)</h3>
                <p className="roadmap-desc">Định vị tài liệu tính toán kỹ thuật minh bạch công thức, hỗ trợ mở trực tiếp trên Engineering Paper XYZ.</p>
              </div>
            </div>

            <div className="roadmap-item completed">
              <div className="roadmap-status-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono">HOÀN TẤT</span>
                <h3 className="roadmap-title">Hệ thống mua và tải file an toàn</h3>
                <p className="roadmap-desc">Private Cloud Storage, cấp signed URL có thời hạn và kiểm tra toàn vẹn mã băm SHA-256.</p>
              </div>
            </div>

            <div className="roadmap-item in-progress">
              <div className="roadmap-status-icon pulse-in-progress">
                <Terminal size={20} />
              </div>
              <div className="roadmap-content">
                <span className="roadmap-phase font-mono in-progress-tag">ĐANG THỰC HIỆN</span>
                <h3 className="roadmap-title">Mở rộng thư viện tài liệu & công cụ tính toán Cơ khí</h3>
                <p className="roadmap-desc">Liên tục biên soạn và bổ sung các bộ tài liệu tính toán mới, thư viện chi tiết tiêu chuẩn và công cụ thiết kế.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. WHAT IS MECHANICALBKA — Core Resource Pillars             */}
      {/* ============================================================ */}
      <section className="home-section about-section">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-pre-tag font-mono">VỀ DỰ ÁN</span>
            <h2 className="section-title-minimal">MechanicalBKA là gì?</h2>
            <p className="section-desc-minimal">
              MechanicalBKA là nền tảng tập trung vào tài liệu, công cụ và tài nguyên kỹ thuật phục vụ lĩnh vực Cơ khí.
            </p>
          </div>

          <div className="resource-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-index font-mono">01</div>
              <div className="pillar-icon-box">
                <FileText size={24} />
              </div>
              <h3 className="pillar-title">TÀI LIỆU KỸ THUẬT</h3>
              <p className="pillar-desc">
                Giáo trình, tài liệu tham khảo, sổ tay và tài liệu chuyên ngành cơ khí chế tạo máy, công nghệ kim loại.
              </p>
            </div>

            <div className="pillar-card highlighted-pillar">
              <div className="pillar-index font-mono">02</div>
              <div className="pillar-icon-box">
                <Sparkles size={24} />
              </div>
              <h3 className="pillar-title">ENGINEERING PAPER XYZ</h3>
              <p className="pillar-desc">
                Các tài liệu tính toán kỹ thuật dạng <strong className="text-white">.epxyz</strong>, trình bày công thức, dữ liệu đầu vào, quá trình tính toán và kết quả một cách minh bạch.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-index font-mono">03</div>
              <div className="pillar-icon-box">
                <Layers size={24} />
              </div>
              <h3 className="pillar-title">ĐỒ ÁN & CAD</h3>
              <p className="pillar-desc">
                Đồ án thiết kế cơ khí, mô hình 3D (Autodesk Inventor, SolidWorks), bản vẽ 2D tiêu chuẩn và tài nguyên CAD phục vụ học tập.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-index font-mono">04</div>
              <div className="pillar-icon-box">
                <Wrench size={24} />
              </div>
              <h3 className="pillar-title">CÔNG CỤ KỸ THUẬT</h3>
              <p className="pillar-desc">
                Các công cụ hỗ trợ học tập, thiết kế và tính toán kỹ thuật, tối ưu hóa quy trình thiết kế cơ khí chính xác.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. YOUTUBE CHANNEL SHOWCASE — Drive Traffic & Subscribers     */}
      {/* ============================================================ */}
      <section id="youtube-channel" className="home-section youtube-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-header-minimal">
            <span className="section-pre-tag font-mono yt-pre-tag">
              <YoutubeIcon size={14} style={{ marginRight: '6px' }} />
              YOUTUBE CHANNEL
            </span>
            <h2 className="section-title-minimal">Kênh YouTube MechanicalBKA</h2>
            <p className="section-desc-minimal">
              {YOUTUBE_CHANNEL.description}
            </p>
          </div>

          {/* Channel Banner Card */}
          <div className="yt-channel-banner">
            <div className="yt-banner-left">
              <div className="yt-avatar">
                <YoutubeIcon size={28} />
              </div>
              <div className="yt-banner-info">
                <h3 className="yt-channel-name">{YOUTUBE_CHANNEL.name}</h3>
                <span className="yt-channel-handle font-mono">{YOUTUBE_CHANNEL.handle}</span>
                <span className="yt-video-count font-mono">{allVideos.length} videos • {YOUTUBE_CHANNEL.playlists.length} playlists</span>
              </div>
            </div>
            <a 
              href={YOUTUBE_CHANNEL.subscribeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-yt-subscribe"
            >
              <YoutubeIcon size={16} />
              <span>ĐĂNG KÝ KÊNH</span>
            </a>
          </div>

          {/* Featured Playlists */}
          <div className="yt-playlists-grid">
            {YOUTUBE_CHANNEL.playlists.map(pl => (
              <a 
                key={pl.id}
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="yt-playlist-card glass"
              >
                <div className="yt-playlist-thumb">
                  <img 
                    src={pl.thumbnail} 
                    alt={pl.title} 
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://img.youtube.com/vi/default/hqdefault.jpg'; }}
                  />
                  <div className="yt-playlist-overlay">
                    <PlayCircle size={32} />
                  </div>
                  <span className="yt-playlist-count font-mono">{pl.videoCount} videos</span>
                </div>
                <div className="yt-playlist-body">
                  <span className="yt-playlist-tag font-mono">{pl.tag}</span>
                  <h4 className="yt-playlist-title">{pl.title}</h4>
                </div>
              </a>
            ))}
          </div>

          {/* Featured Videos Row */}
          {featuredVideos.length > 0 && (
            <div className="yt-featured-videos">
              <h3 className="yt-featured-heading font-mono">
                <Video size={16} />
                <span>VIDEO MỚI NHẤT</span>
              </h3>
              <div className="yt-featured-grid">
                {featuredVideos.map(vid => (
                  <a
                    key={vid.id}
                    href={vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="yt-featured-card"
                  >
                    <div className="yt-featured-thumb">
                      <img 
                        src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                      />
                      <div className="yt-featured-play">
                        <PlayCircle size={28} />
                      </div>
                      <span className="yt-featured-duration font-mono">{vid.duration}</span>
                    </div>
                    <div className="yt-featured-body">
                      <span className="yt-featured-cat font-mono">{vid.category}</span>
                      <h4 className="yt-featured-title">{vid.title}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* CTA: View All on YouTube */}
          <div className="yt-cta-row">
            <a 
              href={YOUTUBE_CHANNEL.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-yt-view-all"
            >
              <YoutubeIcon size={16} />
              <span>XEM TẤT CẢ TRÊN YOUTUBE</span>
              <ExternalLink size={12} />
            </a>
            <Link to="/videos" className="btn-yt-library">
              <span>THƯ VIỆN VIDEO TRÊN WEBSITE</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SOFTWARE SUPPORT / ENGINEERINGPAPER                       */}
      {/* ============================================================ */}
      <section id="software-support" className="home-section software-support-section">
        <div className="container">
          <div className="software-support-card">
            
            {/* Eyebrow & Main Heading */}
            <div className="support-card-header">
              <div className="support-badge font-mono">
                <FileCode size={16} />
                <span>SOFTWARE SUPPORT / EDUCATIONAL LICENSE</span>
              </div>
              <h2 className="support-main-title">Hỗ trợ phần mềm cho dự án kỹ thuật độc lập</h2>
            </div>

            {/* Main Narrative */}
            <div className="support-narrative">
              <p className="support-lead-p">
                MechanicalBKA là một dự án kỹ thuật độc lập đang được xây dựng tại Việt Nam, với mục tiêu tạo ra một không gian chia sẻ tài liệu, đồ án, CAD và các tài liệu tính toán kỹ thuật cho cộng đồng cơ khí.
              </p>
              <p className="support-lead-p">
                Trong quá trình phát triển các tài liệu tính toán, MechanicalBKA mong muốn sử dụng <strong className="text-white">EngineeringPaper.pro</strong> như một môi trường chuyên nghiệp để xây dựng và trình bày các Engineering Paper một cách rõ ràng, minh bạch và dễ kiểm chứng.
              </p>
              <p className="support-lead-p">
                Chúng tôi hiện đang tìm kiếm sự hỗ trợ từ các nhà phát triển phần mềm kỹ thuật dưới hình thức <strong className="text-accent">Educational / Project License</strong> để có thể tiếp tục phát triển dự án.
              </p>
            </div>

            {/* Highlighted Callout Box: Requested Support */}
            <div className="requested-support-box">
              <div className="requested-box-header font-mono">
                <span className="req-label">REQUESTED SUPPORT</span>
                <span className="req-target">EngineeringPaper.pro</span>
              </div>
              
              <h3 className="requested-title">Complimentary Educational / Project License</h3>
              
              <div className="requested-purposes">
                <span className="purposes-heading font-mono">MỤC ĐÍCH SỬ DỤNG:</span>
                <ul className="purposes-list">
                  <li>Phát triển các mẫu tính toán kỹ thuật cơ khí.</li>
                  <li>Xây dựng tài liệu Engineering Paper phục vụ học tập và tham khảo.</li>
                  <li>Trình bày quá trình tính toán rõ ràng, có thể kiểm tra.</li>
                  <li>Phát triển kho tài nguyên kỹ thuật cho cộng đồng cơ khí Việt Nam.</li>
                  <li>Giới thiệu các workflow tính toán hiện đại đến sinh viên và kỹ sư trẻ.</li>
                </ul>
              </div>
            </div>

            {/* Subsection: Why EngineeringPaper */}
            <div className="why-engineering-paper">
              <div className="why-header">
                <span className="section-pre-tag font-mono">WHY ENGINEERINGPAPER?</span>
                <h4 className="why-title">Vì sao MechanicalBKA chọn EngineeringPaper.pro?</h4>
                <p className="why-desc">
                  EngineeringPaper.pro phù hợp với định hướng của MechanicalBKA vì cho phép trình bày các phép tính kỹ thuật theo cách trực quan, có cấu trúc và dễ theo dõi.
                </p>
              </div>

              <div className="why-cards-grid">
                <div className="why-card">
                  <div className="why-index font-mono">01</div>
                  <div className="why-icon-wrap">
                    <GraduationCap size={22} />
                  </div>
                  <h5 className="why-card-title">ENGINEERING EDUCATION</h5>
                  <p className="why-card-desc">
                    Hỗ trợ tạo tài liệu tính toán dễ đọc cho sinh viên kỹ thuật.
                  </p>
                </div>

                <div className="why-card">
                  <div className="why-index font-mono">02</div>
                  <div className="why-icon-wrap">
                    <FileText size={22} />
                  </div>
                  <h5 className="why-card-title">TECHNICAL CONTENT</h5>
                  <p className="why-card-desc">
                    Phát triển các ví dụ tính toán cơ khí thực tế.
                  </p>
                </div>

                <div className="why-card">
                  <div className="why-index font-mono">03</div>
                  <div className="why-icon-wrap">
                    <Share2 size={22} />
                  </div>
                  <h5 className="why-card-title">COMMUNITY SHARING</h5>
                  <p className="why-card-desc">
                    Chia sẻ kiến thức và workflow kỹ thuật với cộng đồng Việt Nam.
                  </p>
                </div>
              </div>
            </div>

            {/* Transparent Project Status Disclaimer */}
            <div className="independent-disclaimer-box font-mono">
              <div className="disclaimer-badge">
                <ShieldAlert size={14} />
                <span>INDEPENDENT PROJECT</span>
              </div>
              <p className="disclaimer-text">
                MechanicalBKA là dự án độc lập và hiện không trực thuộc, không được tài trợ hoặc chứng nhận chính thức bởi EngineeringPaper LLC.
                <br />
                <span className="disclaimer-en">
                  MechanicalBKA is an independent project and is not affiliated with, sponsored by, or officially endorsed by EngineeringPaper LLC.
                </span>
              </p>
            </div>

            {/* Software Support Action CTAs */}
            <div className="support-actions-row">
              <a href={mailtoLink} className="btn-support-contact">
                <Mail size={16} />
                <span>LIÊN HỆ HỖ TRỢ / REQUEST SUPPORT</span>
              </a>
              <Link to="/store?type=EPXYZ_FILE" className="btn-support-view">
                <span>XEM TÀI LIỆU ENGINEERING PAPER</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. COFFEE SUPPORT SECTION (PRESERVED)                        */}
      {/* ============================================================ */}
      <section id="support-coffee" className="home-section coffee-support-section">
        <div className="container">
          <div className="coffee-support-card">
            
            {/* Header Badge */}
            <div className="coffee-card-header">
              <div className="coffee-badge font-mono">
                <Coffee size={16} />
                <span>ỦNG HỘ DỰ ÁN CÁ NHÂN / BUY ME A COFFEE</span>
              </div>
              <h2 className="coffee-main-title">Ủng hộ một ly cà phê ☕</h2>
            </div>

            <div className="coffee-content-grid">
              {/* Left Column: Sincere Message & Bank Information */}
              <div className="coffee-info-column">
                <p className="coffee-message-paragraph">
                  MechanicalBKA vẫn đang được xây dựng.
                </p>
                <p className="coffee-message-paragraph">
                  Nếu bạn thấy dự án này hữu ích, bạn có thể ủng hộ một ly cà phê để mình có thêm thời gian và động lực tiếp tục phát triển.
                </p>

                <div className="coffee-quote-box">
                  <Heart size={18} className="quote-heart-icon" />
                  <p className="quote-text">
                    "Một ly cà phê của bạn có thể không lớn, nhưng nó giúp MechanicalBKA có thêm thời gian để tiếp tục xây dựng. Cảm ơn bạn đã ủng hộ dự án."
                  </p>
                </div>

                {/* Transfer Info Details Box */}
                <div className="transfer-details-box">
                  <div className="transfer-info-header font-mono">
                    <span>THÔNG TIN CHUYỂN KHOẢN TRỰC TIẾP</span>
                  </div>

                  <div className="transfer-row">
                    <span className="transfer-label">Chủ tài khoản:</span>
                    <span className="transfer-value text-white font-bold">{bankDetails.accountName}</span>
                  </div>

                  <div className="transfer-row">
                    <span className="transfer-label">Ngân hàng / Ví:</span>
                    <span className="transfer-value">{bankDetails.bankName}</span>
                  </div>

                  <div className="transfer-row account-number-row">
                    <div>
                      <span className="transfer-label">Số tài khoản / Thẻ:</span>
                      <div className="transfer-acc-number font-mono">{bankDetails.accountNumber}</div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleCopyAccountNumber}
                      className={`btn-copy-acc font-mono ${copied ? 'copied' : ''}`}
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>ĐÃ SAO CHÉP</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>SAO CHÉP</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="transfer-row">
                    <span className="transfer-label">Nội dung (tùy chọn):</span>
                    <span className="transfer-value font-mono text-muted">{bankDetails.memo}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Resolution VietQR */}
              <div className="coffee-qr-column">
                <div className="qr-card-container">
                  <div className="qr-card-tag font-mono">
                    <span>QUÉT MÃ VIETQR / VIETTELPAY</span>
                  </div>

                  <div className="qr-image-wrapper">
                    <img 
                      src="/assets/vietqr_viettelpay.png" 
                      alt="VietQR ViettelPay - Nguyễn Ngọc Trong - 9704229201403709105" 
                      className="vietqr-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://img.vietqr.io/image/970422-9704229201403709105-compact2.png?accountName=NGUYEN%20NGOC%20TRONG&addInfo=Ung%20ho%20MechanicalBKA`;
                      }}
                    />
                  </div>

                  <p className="qr-scan-guide font-mono">
                    Quét mã QR để ủng hộ một ly cà phê qua bất kỳ ứng dụng ngân hàng hoặc Viettel Money
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. CURRENT PROJECTS — Categories Being Built                 */}
      {/* ============================================================ */}
      <section className="home-section current-projects-section">
        <div className="container">
          <div className="section-header-minimal">
            <span className="section-pre-tag font-mono">DANH MỤC TÀI NGUYÊN</span>
            <h2 className="section-title-minimal">MechanicalBKA đang xây dựng</h2>
            <p className="section-desc-minimal">
              Các tài nguyên và công cụ kỹ thuật đang được phân loại và cập nhật liên tục.
            </p>
          </div>

          <div className="current-projects-grid">
            <Link to="/store?type=EPXYZ_FILE" className="project-category-card">
              <div className="card-top font-mono">
                <span className="cat-badge">EPXYZ_FILE</span>
                <ArrowRight size={16} className="card-arrow" />
              </div>
              <h3 className="project-card-title">Engineering Paper XYZ</h3>
              <p className="project-card-desc">
                Tài liệu tính toán kỹ thuật <strong className="text-white">.epxyz</strong> tương tác, hiển thị công thức rõ ràng, dễ dàng kiểm tra và tái sử dụng.
              </p>
              <div className="card-footer-meta font-mono">
                Khám phá file tính toán →
              </div>
            </Link>

            <Link to="/store?type=CAD_PROJECT" className="project-category-card">
              <div className="card-top font-mono">
                <span className="cat-badge">CAD_PROJECT</span>
                <ArrowRight size={16} className="card-arrow" />
              </div>
              <h3 className="project-card-title">Mechanical CAD</h3>
              <p className="project-card-desc">
                Bản vẽ 2D tiêu chuẩn kỹ thuật và tài nguyên mô hình 3D tham số hóa phục vụ học tập, đồ án và sản xuất.
              </p>
              <div className="card-footer-meta font-mono">
                Xem bản vẽ & mô hình CAD →
              </div>
            </Link>

            <Link to="/store?type=PROJECT" className="project-category-card">
              <div className="card-top font-mono">
                <span className="cat-badge">DOCUMENTS</span>
                <ArrowRight size={16} className="card-arrow" />
              </div>
              <h3 className="project-card-title">Engineering Documents</h3>
              <p className="project-card-desc">
                Tài liệu đồ án chi tiết máy, thuyết minh tính toán và tài liệu chuyên ngành Cơ khí chế tạo máy chuẩn đại học.
              </p>
              <div className="card-footer-meta font-mono">
                Khám phá hồ sơ đồ án →
              </div>
            </Link>

            <Link to="/store" className="project-category-card">
              <div className="card-top font-mono">
                <span className="cat-badge">TOOLS</span>
                <ArrowRight size={16} className="card-arrow" />
              </div>
              <h3 className="project-card-title">Engineering Tools</h3>
              <p className="project-card-desc">
                Công cụ hỗ trợ kỹ thuật, script tự động hóa và bảng tra cứu thông số phục vụ sinh viên và kỹ sư thiết kế.
              </p>
              <div className="card-footer-meta font-mono">
                Xem công cụ kỹ thuật →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. STORE CTA BANNER                                          */}
      {/* ============================================================ */}
      <section className="home-section store-cta-section">
        <div className="container">
          <div className="store-cta-box">
            <div className="store-cta-content">
              <span className="store-cta-tag font-mono">THƯ VIỆN SỐ CƠ KHÍ</span>
              <h2 className="store-cta-heading">Kho tài liệu đang được xây dựng từng ngày.</h2>
              <p className="store-cta-subheading">
                Khám phá những tài nguyên, bản vẽ kỹ thuật và tài liệu tính toán hiện có trên MechanicalBKA.
              </p>
            </div>
            <div className="store-cta-btn-wrap">
              <Link to="/store">
                <Button variant="primary" size="large" icon={ArrowRight}>
                  KHÁM PHÁ KHO TÀI LIỆU
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
