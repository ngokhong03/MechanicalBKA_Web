import fs from 'fs';
import path from 'path';

// 1. Parse .env safely without printing secrets
const loadEnv = () => {
  try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const firstEqual = trimmed.indexOf('=');
          if (firstEqual > 0) {
            const key = trimmed.substring(0, firstEqual).trim();
            const value = trimmed.substring(firstEqual + 1).trim();
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error('Lỗi khi đọc file .env:', err.message);
  }
};

loadEnv();

const API_KEY = process.env.YOUTUBE_API_KEY ? process.env.YOUTUBE_API_KEY.trim() : '';
const CHANNEL_HANDLE = '@trongbka';
const KNOWN_CHANNEL_ID = 'UC7a7bW6NjlOC1_V6y-MuqqA';
const OUTPUT_FILE = path.resolve('src/mock/syncedVideos.json');

// Helper to convert title to slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace
    .replace(/-+/g, '-'); // collapse dashes
};

// Helper to parse ISO 8601 duration (e.g., PT15M20S, PT1H2M3S, PT45S)
const parseIsoDuration = (isoStr) => {
  if (!isoStr || typeof isoStr !== 'string') return '';
  const match = isoStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoStr;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

// Detect category based on title heuristics
const detectCategory = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('cfd') || t.includes('simulation') || t.includes('mô phỏng') || t.includes('ansys')) return 'Simulation';
  if (t.includes('clo') || t.includes('theory') || t.includes('fundamentals') || t.includes('lý thuyết') || t.includes('bài giảng')) return 'Lecture';
  if (t.includes('cnc') || t.includes('g-code') || t.includes('gia công') || t.includes('cutting tool')) return 'CNC Machining';
  if (t.includes('mold') || t.includes('khuôn') || t.includes('injection')) return 'Mold Design';
  if (t.includes('extrusion') || t.includes('đùn')) return 'Manufacturing';
  if (t.includes('composite') || t.includes('polymer')) return 'Materials';
  return 'Tutorial';
};

// Fetch via official YouTube Data API v3
async function fetchViaApi(apiKey) {
  console.log('📡 Đang sử dụng YouTube Data API v3...');
  
  // 1. Get channel & uploads playlist
  let channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}&key=${apiKey}`;
  let response = await fetch(channelUrl);
  let data = await response.json();
  let channelItem = data.items?.[0];

  if (!channelItem) {
    channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${KNOWN_CHANNEL_ID}&key=${apiKey}`;
    response = await fetch(channelUrl);
    data = await response.json();
    channelItem = data.items?.[0];
  }

  if (!channelItem) {
    throw new Error(`Không tìm thấy kênh YouTube ${CHANNEL_HANDLE}`);
  }

  const channelTitle = channelItem.snippet?.title || 'MechanicalBKA';
  const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads || `UU${channelItem.id.substring(2)}`;

  console.log(`✅ Đã nhận diện kênh: "${channelTitle}"`);
  console.log(`   - Uploads Playlist ID: ${uploadsPlaylistId}`);

  // 2. Fetch all playlist items with pagination
  let playlistItems = [];
  let nextPageToken = '';
  let page = 0;

  do {
    page++;
    const plUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
    const plRes = await fetch(plUrl);
    const plData = await plRes.json();

    if (plData.error) {
      throw new Error(`YouTube API Error: ${plData.error.message}`);
    }

    if (plData.items && plData.items.length > 0) {
      playlistItems = playlistItems.concat(plData.items);
      console.log(`   - Trang ${page}: +${plData.items.length} videos`);
    }

    nextPageToken = plData.nextPageToken || '';
  } while (nextPageToken);

  console.log(`👉 Tổng số playlist items: ${playlistItems.length}`);

  // 3. Batch fetch duration and details using videos.list
  const videoIds = playlistItems.map(item => item.snippet?.resourceId?.videoId || item.contentDetails?.videoId).filter(Boolean);
  const videoDetailsMap = new Map();

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${chunk.join(',')}&key=${apiKey}`;
    const vRes = await fetch(vUrl);
    const vData = await vRes.json();
    if (vData.items) {
      vData.items.forEach(v => {
        videoDetailsMap.set(v.id, {
          duration: parseIsoDuration(v.contentDetails?.duration),
          description: v.snippet?.description || '',
          publishedAt: v.snippet?.publishedAt || '',
          title: v.snippet?.title || '',
          thumbnails: v.snippet?.thumbnails
        });
      });
    }
  }

  // 4. Return normalized raw list
  return playlistItems.map(item => {
    const videoId = item.snippet?.resourceId?.videoId || item.contentDetails?.videoId;
    const detail = videoDetailsMap.get(videoId) || {};
    const title = detail.title || item.snippet?.title || '';
    const description = detail.description || item.snippet?.description || '';
    const publishedAt = detail.publishedAt || item.snippet?.publishedAt || new Date().toISOString();
    const thumbs = detail.thumbnails || item.snippet?.thumbnails;
    const thumbnailUrl = thumbs?.maxres?.url || thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const duration = detail.duration || '';

    return {
      youtubeVideoId: videoId,
      title,
      description,
      publishedAt,
      thumbnailUrl,
      duration,
      channelTitle
    };
  });
}

// Fallback: Fetch via direct YouTube public scraper & RSS
async function fetchViaPublicScraper() {
  console.log('📡 Đang truy xuất danh sách video PUBLIC từ kênh YouTube @trongbka...');

  // 1. Fetch channel videos page
  const res = await fetch('https://www.youtube.com/@trongbka/videos', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });

  if (!res.ok) {
    throw new Error(`Không thể kết nối đến YouTube (HTTP ${res.status})`);
  }

  const html = await res.text();
  const m = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/) || html.match(/var ytInitialData = ({.+?});<\/script>/);
  if (!m) {
    throw new Error('Không tìm thấy ytInitialData trên trang YouTube');
  }

  const data = JSON.parse(m[1]);
  const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs;
  const videoTab = tabs?.find(t => t.tabRenderer?.selected || t.tabRenderer?.title === 'Video' || t.tabRenderer?.title === 'Videos');
  let contents = videoTab?.tabRenderer?.content?.richGridRenderer?.contents || [];

  const rawVideos = [];

  // Helper to extract video from grid item
  const extractVideo = (c) => {
    const item = c.richItemRenderer?.content?.lockupViewModel || c.richItemRenderer?.content?.videoRenderer;
    if (!item) return null;

    const videoId = item.contentId || item.videoId;
    if (!videoId) return null;

    const title = item.metadata?.lockupMetadataViewModel?.title?.content || item.title?.runs?.[0]?.text || '';
    
    // Duration
    let duration = '';
    const badgeText = item.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
    const timeStatusText = item.lengthText?.simpleText;
    const accessibilityLabel = item.rendererContext?.accessibilityContext?.label || '';
    
    if (badgeText) {
      duration = badgeText;
    } else if (timeStatusText) {
      duration = timeStatusText;
    } else if (accessibilityLabel) {
      // e.g. "8 phút, 13 giây" or "8 minutes, 13 seconds"
      const timeMatch = accessibilityLabel.match(/(\d+)\s*(?:phút|min|m)[\s,]*(\d+)?\s*(?:giây|sec|s)?/i);
      if (timeMatch) {
        const mins = timeMatch[1] || '0';
        const secs = timeMatch[2] || '0';
        duration = `${mins}:${secs.padStart(2, '0')}`;
      }
    }

    const thumbs = item.contentImage?.thumbnailViewModel?.image?.sources || item.thumbnails || [];
    const thumbnailUrl = thumbs.length > 0 ? thumbs[thumbs.length - 1].url : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      youtubeVideoId: videoId,
      title,
      description: '',
      publishedAt: new Date().toISOString(),
      thumbnailUrl,
      duration,
      channelTitle: 'MechanicalBKA'
    };
  };

  contents.forEach(c => {
    const v = extractVideo(c);
    if (v) rawVideos.push(v);
  });

  // 2. Enrich with RSS Feed for exact timestamps & descriptions where available
  try {
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${KNOWN_CHANNEL_ID}`);
    if (rssRes.ok) {
      const xml = await rssRes.text();
      const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      const rssMap = new Map();

      entries.forEach(entry => {
        const vidMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
        const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);

        if (vidMatch) {
          rssMap.set(vidMatch[1], {
            publishedAt: pubMatch ? pubMatch[1] : null,
            description: descMatch ? descMatch[1].trim() : '',
            title: titleMatch ? titleMatch[1] : null
          });
        }
      });

      rawVideos.forEach((v, index) => {
        const rss = rssMap.get(v.youtubeVideoId);
        if (rss) {
          if (rss.publishedAt) v.publishedAt = rss.publishedAt;
          if (rss.description) v.description = rss.description;
          if (rss.title && !v.title) v.title = rss.title;
        } else {
          // Approximate order for older items not in top 15 RSS
          const date = new Date(Date.now() - (index * 86400000 * 2));
          v.publishedAt = date.toISOString();
        }
      });
    }
  } catch (rssErr) {
    console.warn('Lưu ý: Không thể lấy RSS bổ sung, tiếp tục với dữ liệu trang chính.', rssErr.message);
  }

  return rawVideos;
}

async function run() {
  console.log('====================================================');
  console.log('   MECHANICALBKA — YOUTUBE REAL DATA SYNC SCRIPT   ');
  console.log('====================================================\n');

  // Load existing videos to preserve manual relations
  let existingVideos = [];
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      existingVideos = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`📂 Đã đọc ${existingVideos.length} video hiện có trong file syncedVideos.json`);
    }
  } catch (err) {
    console.warn('Không đọc được file syncedVideos.json cũ. Sẽ tạo mới hoàn toàn.', err.message);
  }

  const existingMap = new Map();
  let maxVidNum = 0;
  existingVideos.forEach(v => {
    if (v.youtubeVideoId) {
      existingMap.set(v.youtubeVideoId, v);
    }
    const numPart = (v.id || '').replace('vid_', '');
    const num = parseInt(numPart, 10);
    if (!isNaN(num) && num > maxVidNum) {
      maxVidNum = num;
    }
  });

  // Fetch videos
  let fetchedVideos = [];
  if (API_KEY) {
    try {
      fetchedVideos = await fetchViaApi(API_KEY);
    } catch (apiErr) {
      console.warn(`⚠️ API Key gặp lỗi (${apiErr.message}). Chuyển sang Public Channel Scraper...`);
      fetchedVideos = await fetchViaPublicScraper();
    }
  } else {
    console.log('ℹ️ YOUTUBE_API_KEY trống trong .env. Sử dụng cơ chế Public Scraper tự động.');
    fetchedVideos = await fetchViaPublicScraper();
  }

  if (!fetchedVideos || fetchedVideos.length === 0) {
    throw new Error('Không lấy được video nào từ kênh YouTube!');
  }

  console.log(`\n🔍 Đã phát hiện tổng cộng ${fetchedVideos.length} video từ kênh ${CHANNEL_HANDLE}`);

  // Deduplicate fetched list by youtubeVideoId
  const uniqueFetched = [];
  const seenIds = new Set();
  fetchedVideos.forEach(v => {
    if (v.youtubeVideoId && !seenIds.has(v.youtubeVideoId)) {
      seenIds.add(v.youtubeVideoId);
      uniqueFetched.push(v);
    }
  });

  const duplicatesCount = fetchedVideos.length - uniqueFetched.length;

  // Merge and transform
  const syncedVideos = [];
  let newCount = 0;
  let updatedCount = 0;
  let preservedCount = 0;

  uniqueFetched.forEach(item => {
    const videoId = item.youtubeVideoId;
    const title = item.title;
    const description = item.description || '';
    const publishedAt = item.publishedAt || new Date().toISOString();
    const duration = item.duration || '';
    const thumbnailUrl = item.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const channelTitle = item.channelTitle || 'MechanicalBKA';

    const existing = existingMap.get(videoId);

    if (existing) {
      // Preserve existing relations
      preservedCount++;
      const isContentChanged = existing.title !== title || (description && existing.description !== description) || (duration && existing.duration !== duration);
      if (isContentChanged) updatedCount++;

      syncedVideos.push({
        id: existing.id,
        title: title || existing.title,
        slug: existing.slug || slugify(title),
        description: description || existing.description || 'Video bài giảng kỹ thuật cơ khí MechanicalBKA.',
        youtubeVideoId: videoId,
        channelTitle,
        channelUrl: `https://youtube.com/${CHANNEL_HANDLE}`,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: thumbnailUrl || existing.thumbnailUrl,
        duration: duration || existing.duration || '',
        category: existing.category || detectCategory(title),
        specialtyIds: existing.specialtyIds || [],
        softwareIds: existing.softwareIds || [],
        courseId: existing.courseId || null,
        lessonId: existing.lessonId || null,
        isPublished: existing.isPublished !== undefined ? existing.isPublished : true,
        publishedAt: publishedAt || existing.publishedAt || existing.createdAt,
        createdAt: existing.createdAt || publishedAt
      });
    } else {
      // New Video
      newCount++;
      maxVidNum++;
      const paddedNum = String(maxVidNum).padStart(3, '0');
      const slug = slugify(title) || `video-${videoId}`;

      syncedVideos.push({
        id: `vid_${paddedNum}`,
        title,
        slug,
        description: description || 'Video bài giảng kỹ thuật cơ khí MechanicalBKA.',
        youtubeVideoId: videoId,
        channelTitle,
        channelUrl: `https://youtube.com/${CHANNEL_HANDLE}`,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl,
        duration,
        category: detectCategory(title),
        specialtyIds: [],
        softwareIds: [],
        courseId: null,
        lessonId: null,
        isPublished: true,
        publishedAt,
        createdAt: publishedAt
      });
    }
  });

  // Sort newest first
  syncedVideos.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

  // Save to syncedVideos.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(syncedVideos, null, 2), 'utf8');

  // Verify file write
  const savedContent = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  const testIds = new Set();
  let hasDup = false;
  savedContent.forEach(v => {
    if (testIds.has(v.youtubeVideoId)) hasDup = true;
    testIds.add(v.youtubeVideoId);
  });

  console.log('\n====================================================');
  console.log('✅ ĐỒNG BỘ YOUTUBE HOÀN TẤT THÀNH CÔNG');
  console.log('====================================================');
  console.log(`Channel:       ${CHANNEL_HANDLE}`);
  console.log(`Total videos:  ${savedContent.length}`);
  console.log(`New:           ${newCount}`);
  console.log(`Updated:       ${updatedCount}`);
  console.log(`Preserved:     ${preservedCount}`);
  console.log(`Duplicates:    ${duplicatesCount}`);
  console.log(`Duration check:${savedContent.filter(v => v.duration).length}/${savedContent.length} videos có duration`);
  console.log(`File:          ${OUTPUT_FILE}`);
  console.log(`JSON Valid:    ✅ (0 duplicate IDs: ${!hasDup})`);
  console.log('====================================================\n');

  // Clean scratch files if any
  const testScript = path.resolve('scripts/testChannel.js');
  if (fs.existsSync(testScript)) {
    fs.unlinkSync(testScript);
  }
}

run().catch(err => {
  console.error('❌ LỖI ĐỒNG BỘ:', err.message);
  process.exit(1);
});
