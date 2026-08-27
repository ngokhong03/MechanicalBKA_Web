import fs from 'fs';
import path from 'path';

// 1. Simple helper to parse .env file
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

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = '@trongbka';
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

async function run() {
  console.log('=== KHỞI CHẠY ĐỒNG BỘ YOUTUBE VIDEOS ===');
  
  if (!API_KEY) {
    console.error('❌ THẤT BẠI: YOUTUBE_API_KEY chưa được cấu hình trong file .env.');
    console.log('👉 Hướng dẫn: Sao chép tệp .env.example thành .env và điền khóa API của bạn.');
    process.exit(1);
  }

  // Load existing videos for merging
  let existingVideos = [];
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      existingVideos = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`Đã đọc ${existingVideos.length} video hiện tại từ file local.`);
    }
  } catch (err) {
    console.warn('Không thể đọc file syncedVideos.json hiện tại. Sẽ tạo mới hoàn toàn.', err.message);
  }

  const existingMap = new Map();
  let maxVidNum = 0;
  existingVideos.forEach(v => {
    existingMap.set(v.youtubeVideoId, v);
    const numPart = v.id.replace('vid_', '');
    const num = parseInt(numPart, 10);
    if (!isNaN(num) && num > maxVidNum) {
      maxVidNum = num;
    }
  });

  try {
    // 2. Discover Channel ID & uploads playlist
    console.log(`Đang tìm kiếm thông tin kênh cho handle: ${CHANNEL_HANDLE}...`);
    
    // First, try direct channels query by handle
    let channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(CHANNEL_HANDLE)}&key=${API_KEY}`;
    let response = await fetch(channelUrl);
    let data = await response.json();
    
    let channelItem = data.items?.[0];
    
    // Fallback: search for channel if forHandle returns empty list
    if (!channelItem) {
      console.log(`Không thể phân giải handle trực tiếp. Đang dùng cơ chế Tìm kiếm kênh (Channel Discovery)...`);
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&key=${API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      const channelId = searchData.items?.[0]?.snippet?.channelId;
      
      if (!channelId) {
        throw new Error(`Không tìm thấy kênh YouTube nào khớp với handle ${CHANNEL_HANDLE}`);
      }
      
      console.log(`Đã tìm thấy Channel ID thông qua Search API: ${channelId}. Đang lấy chi tiết...`);
      channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${API_KEY}`;
      response = await fetch(channelUrl);
      data = await response.json();
      channelItem = data.items?.[0];
    }
    
    if (!channelItem) {
      throw new Error(`Không thể truy xuất thông tin chi tiết cho kênh ${CHANNEL_HANDLE}`);
    }

    const channelId = channelItem.id;
    const channelTitle = channelItem.snippet.title;
    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    
    console.log(`✅ Đã tìm thấy kênh: "${channelTitle}"`);
    console.log(`   - Channel ID: ${channelId}`);
    console.log(`   - Playlist tải lên (Uploads Playlist ID): ${uploadsPlaylistId}`);

    if (!uploadsPlaylistId) {
      throw new Error('Kênh này không có danh sách phát uploads.');
    }

    // 3. Paginate uploads playlist to fetch videos
    console.log(`Đang tải danh sách video từ playlist tải lên...`);
    let playlistItems = [];
    let nextPageToken = '';
    let pageCount = 0;

    do {
      pageCount++;
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`;
      const plResponse = await fetch(playlistUrl);
      const plData = await plResponse.json();
      
      if (plData.error) {
        throw new Error(`Lỗi YouTube API: ${plData.error.message}`);
      }

      if (plData.items && plData.items.length > 0) {
        playlistItems = playlistItems.concat(plData.items);
        console.log(`   - Trang ${pageCount}: Đã tải thêm ${plData.items.length} video.`);
      }
      
      nextPageToken = plData.nextPageToken || '';
    } while (nextPageToken);

    console.log(`Tổng số video lấy được từ YouTube: ${playlistItems.length}`);

    // 4. Transform and merge
    const syncedVideos = [];
    let newCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;

    playlistItems.forEach(item => {
      const snippet = item.snippet;
      const videoId = snippet.resourceId?.videoId;
      if (!videoId) return;

      const title = snippet.title;
      const description = snippet.description || '';
      const publishedAt = snippet.publishedAt;
      const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '';
      
      const existing = existingMap.get(videoId);
      
      if (existing) {
        // Check if content changed
        const isUnchanged = 
          existing.title === title && 
          existing.description === description &&
          existing.thumbnailUrl === thumbnailUrl;

        if (isUnchanged) {
          unchangedCount++;
        } else {
          updatedCount++;
        }

        // Merge keeping local relations intact
        syncedVideos.push({
          ...existing,
          title,
          description,
          thumbnailUrl,
          publishedAt,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          channelUrl: `https://youtube.com/${CHANNEL_HANDLE}`
        });
      } else {
        newCount++;
        maxVidNum++;
        const paddedNum = String(maxVidNum).padStart(3, '0');
        
        // Create new item
        syncedVideos.push({
          id: `vid_${paddedNum}`,
          title,
          slug: slugify(title) || `video-${videoId}`,
          description,
          youtubeVideoId: videoId,
          category: 'Upload',
          softwareIds: [],
          specialtyIds: [],
          lessonId: null,
          courseId: null,
          duration: '',
          isPublished: true,
          createdAt: publishedAt,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          channelUrl: `https://youtube.com/${CHANNEL_HANDLE}`,
          thumbnailUrl
        });
      }
    });

    // Sort: Newest videos first
    syncedVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 5. Save output JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(syncedVideos, null, 2), 'utf8');
    
    console.log('\n=== KẾT QUẢ ĐỒNG BỘ THÀNH CÔNG ===');
    console.log(`- Kênh tìm thấy: ${channelTitle}`);
    console.log(`- Tổng số video đã phát hiện: ${playlistItems.length}`);
    console.log(`- Số video mới thêm: ${newCount}`);
    console.log(`- Số video cập nhật nội dung: ${updatedCount}`);
    console.log(`- Số video giữ nguyên: ${unchangedCount}`);
    console.log(`- File kết quả đầu ra: ${OUTPUT_FILE}`);
    console.log('=================================');

  } catch (err) {
    console.error('\n❌ XẢY RA LỖI TRONG QUÁ TRÌNH ĐỒNG BỘ:');
    console.error(err.message);
    process.exit(1);
  }
}

run();
