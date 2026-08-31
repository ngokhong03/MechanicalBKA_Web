import { auth, isFirebaseEnabled } from '../firebase/config';
import { accessService } from './accessService';
import { dataProvider } from './dataProvider';

/**
 * Download Service — Xử lý yêu cầu Tải File Bảo Mật phía Frontend
 * Tuyệt đối KHÔNG truyền hoặc lưu đường dẫn lưu trữ vật lý ở client
 */
export const downloadService = {
  /**
   * Tải tệp tin học liệu an toàn
   * 
   * @param {string} productId - ID học liệu
   * @param {string} fileId - ID tệp tin
   * @param {string} [suggestedFileName] - Tên tệp tin gợi ý hiển thị
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async downloadProductFile(productId, fileId, suggestedFileName = null) {
    if (!productId || !fileId) {
      throw new Error('Yêu cầu cung cấp đầy đủ thông tin sản phẩm và tệp tin.');
    }

    const currentUser = auth?.currentUser || null;
    const userId = currentUser ? currentUser.uid : null;

    // 1. Chế độ Mock Mode
    if (!isFirebaseEnabled) {
      // Kiểm tra quyền qua accessService
      const hasAccess = await accessService.canAccessProduct(userId, productId);
      if (!hasAccess) {
        throw new Error('Bạn chưa có quyền tải tài liệu này. Vui lòng mua hoặc đăng ký khóa học liên quan.');
      }

      // Mô phỏng tải file (Tạo Blob CAD/PDF mẫu tải trực tiếp về máy tính người dùng)
      const products = await dataProvider.getProducts();
      const product = products.find(p => p.id === productId);
      const fileRecord = product?.files?.find(f => f.id === fileId);
      const fileName = fileRecord?.fileName || suggestedFileName || 'MechanicalBKA_CAD_Package.zip';

      const mockContent = `[MechanicalBKA CAD File Package]\nProduct: ${product?.title || productId}\nFile: ${fileName}\nChecksum SHA-256: ${fileRecord?.checksum || 'N/A'}\nDownloaded At: ${new Date().toISOString()}\nLicense: MechanicalBKA Engineering Education Access.`;
      const blob = new Blob([mockContent], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);

      return { success: true, fileName };
    }

    // 2. Chế độ Firebase Production Mode (Gọi Cloud Functions Secure Download API)
    try {
      let idToken = null;
      if (currentUser) {
        idToken = await currentUser.getIdToken();
      }

      const functionUrl = import.meta.env.VITE_DOWNLOAD_API_URL || `/api/download`;
      const url = `${functionUrl}?productId=${encodeURIComponent(productId)}&fileId=${encodeURIComponent(fileId)}`;

      const headers = {
        'Accept': 'application/json'
      };

      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Bạn cần đăng nhập để tải tài liệu.');
        } else if (response.status === 403) {
          throw new Error('Bạn chưa có quyền tải tài liệu này. Vui lòng mua hoặc đăng ký khóa học liên quan.');
        } else if (response.status === 404) {
          throw new Error('Không tìm thấy tệp tin trong hệ thống lưu trữ.');
        } else {
          throw new Error('Không thể tải tệp lúc này. Vui lòng thử lại sau.');
        }
      }

      // Xử lý kết quả trả về: Signed URL JSON hoặc Stream trực tiếp
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.downloadUrl) {
          window.location.href = data.downloadUrl;
          return { success: true, fileName: data.fileName };
        }
      }

      // Fallback nếu server trả về binary stream trực tiếp
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') || '';
      let filename = suggestedFileName || 'downloaded_file';
      if (disposition.includes('filename=')) {
        filename = decodeURIComponent(disposition.split('filename=')[1].replace(/["']/g, '').trim());
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      return { success: true, fileName: filename };
    } catch (err) {
      console.error('[DownloadService] Lỗi khi tải tệp tin:', err);
      throw err;
    }
  }
};

export default downloadService;
