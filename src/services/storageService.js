import { storage, isFirebaseEnabled } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  calculateFileSha256,
  validateArtifactFile,
  validateThumbnailFile,
  getMimeType
} from '../utils/mediaUtils';

/**
 * Storage Service — Quản lý tải lên tệp tin và ảnh cho Admin Marketplace
 * 
 * Quy tắc bảo mật đường dẫn Storage:
 * - Public media:   `public/products/{productId}/thumbnail.{ext}`
 * - Private files:  `private/products/{productId}/{artifactId}/{fileName}`
 */
export const storageService = {
  /**
   * Tải lên ảnh Thumbnail sản phẩm (Public Storage)
   * 
   * @param {string} productId - ID sản phẩm
   * @param {File} file - File ảnh
   * @param {Function} [onProgress] - Callback nhận % tiến trình (0-100)
   * @returns {Promise<{success: boolean, url: string, storagePath: string, fileSize: number}>}
   */
  async uploadProductThumbnail(productId, file, onProgress = null) {
    if (!productId) {
      throw new Error('Yêu cầu cung cấp Product ID để lưu trữ thumbnail.');
    }

    const validation = validateThumbnailFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const ext = (file.name || 'thumbnail.webp').split('.').pop().toLowerCase();
    const storagePath = `public/products/${productId}/thumbnail.${ext}`;
    const contentType = validation.mimeType || getMimeType(file.name);

    if (isFirebaseEnabled && storage) {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0 && typeof onProgress === 'function') {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgress(progress);
            }
          },
          (error) => {
            console.error('[StorageService] Lỗi upload thumbnail:', error);
            reject(new Error(`Tải ảnh thumbnail thất bại: ${error.message}`));
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                success: true,
                url: downloadUrl,
                storagePath,
                fileSize: file.size
              });
            } catch (urlErr) {
              reject(new Error(`Không thể lấy URL ảnh: ${urlErr.message}`));
            }
          }
        );
      });
    }

    // Mock Mode (FileReader Base64 / Blob URL simulation)
    if (typeof onProgress === 'function') {
      onProgress(50);
      await new Promise(r => setTimeout(r, 150));
      onProgress(100);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target.result, // Data URL for instant mock preview
          storagePath,
          fileSize: file.size
        });
      };
      reader.onerror = () => {
        const blobUrl = URL.createObjectURL(file);
        resolve({
          success: true,
          url: blobUrl,
          storagePath,
          fileSize: file.size
        });
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Tải lên ảnh Gallery sản phẩm (Public Storage)
   * Lưu trữ tại: `public/products/{productId}/gallery/{imageId}.{ext}`
   */
  async uploadGalleryImage(productId, file, onProgress = null) {
    if (!productId) throw new Error('Yêu cầu cung cấp Product ID để lưu ảnh gallery.');
    const validation = validateThumbnailFile(file);
    if (!validation.isValid) throw new Error(validation.error);

    const ext = (file.name || 'image.webp').split('.').pop().toLowerCase();
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const storagePath = `public/products/${productId}/gallery/${imageId}.${ext}`;
    const contentType = validation.mimeType || getMimeType(file.name);

    if (isFirebaseEnabled && storage) {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0 && typeof onProgress === 'function') {
              onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            }
          },
          (error) => reject(new Error(`Tải ảnh gallery thất bại: ${error.message}`)),
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ success: true, url: downloadUrl, storagePath, fileSize: file.size });
            } catch (err) {
              reject(new Error(`Không thể lấy URL ảnh gallery: ${err.message}`));
            }
          }
        );
      });
    }

    // Mock Mode
    if (typeof onProgress === 'function') {
      onProgress(50);
      await new Promise(r => setTimeout(r, 100));
      onProgress(100);
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ success: true, url: e.target.result, storagePath, fileSize: file.size });
      };
      reader.onerror = () => {
        resolve({ success: true, url: URL.createObjectURL(file), storagePath, fileSize: file.size });
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Tải lên File thương mại kỹ thuật (Private Storage)
   * Tuyệt đối KHÔNG sinh URL công khai cho file trả phí.
   * 
   * @param {string} productId - ID sản phẩm
   * @param {File} file - Binary artifact file
   * @param {string} [version='1.0.0'] - Phiên bản artifact
   * @param {Function} [onProgress] - Callback % tiến trình (0-100)
   * @returns {Promise<Object>} Artifact metadata record
   */
  async uploadProductArtifact(productId, file, version = '1.0.0', onProgress = null) {
    if (!productId) {
      throw new Error('Yêu cầu cung cấp Product ID để lưu trữ artifact.');
    }

    const validation = validateArtifactFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 1. Tính toán mã băm SHA-256 thực tế từ dữ liệu nhị phân
    const checksum = await calculateFileSha256(file);
    const artifactId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const storagePath = `private/products/${productId}/${artifactId}/${file.name}`;
    const contentType = validation.mimeType || getMimeType(file.name);
    const timestamp = new Date().toISOString();

    const artifactMetadata = {
      id: artifactId,
      productId,
      fileName: file.name,
      storagePath,
      fileType: validation.fileType,
      fileSize: file.size,
      contentType,
      version: version.trim() || '1.0.0',
      checksum,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (isFirebaseEnabled && storage) {
      const storageRef = ref(storage, storagePath);
      const metadata = {
        contentType,
        customMetadata: {
          productId,
          artifactId,
          version: artifactMetadata.version,
          checksum,
          uploadedAt: timestamp
        }
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0 && typeof onProgress === 'function') {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgress(progress);
            }
          },
          (error) => {
            console.error('[StorageService] Lỗi upload private artifact:', error);
            reject(new Error(`Tải tệp tin kỹ thuật thất bại: ${error.message}`));
          },
          () => {
            // Private artifact: Do not generate public download URL
            resolve(artifactMetadata);
          }
        );
      });
    }

    // Mock Mode Simulation
    if (typeof onProgress === 'function') {
      onProgress(30);
      await new Promise(r => setTimeout(r, 100));
      onProgress(70);
      await new Promise(r => setTimeout(r, 100));
      onProgress(100);
    }

    return artifactMetadata;
  },

  /**
   * Xóa file khỏi Storage (Admin only)
   */
  async deleteFileByPath(storagePath) {
    if (!storagePath) return false;
    if (isFirebaseEnabled && storage) {
      try {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
        return true;
      } catch (err) {
        console.warn(`[StorageService] Lỗi xóa file [${storagePath}]:`, err.message);
        return false;
      }
    }
    return true;
  }
};

export default storageService;
