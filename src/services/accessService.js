import { dataProvider } from './dataProvider';
import { entitlementService } from './entitlementService';

/**
 * Access Control Service — Kiểm soát quyền truy cập nội dung bảo mật
 * KHÔNG cho phép Client tự quyết định quyền
 */
export const accessService = {
  /**
   * Kiểm tra quyền truy cập một Khóa Học
   * @param {string|null} userId 
   * @param {string} courseId 
   * @returns {Promise<boolean>}
   */
  async canAccessCourse(userId, courseId) {
    if (!courseId) return false;

    try {
      const courses = await dataProvider.getCourses();
      const course = courses.find(c => c.id === courseId);
      if (!course) return false;

      // 1. Khóa học miễn phí -> Công khai cho tất cả mọi người
      if (course.accessType === 'FREE' || course.price === 0) {
        return true;
      }

      // 2. Khóa học trả phí -> Bắt buộc phải đăng nhập và có Entitlement còn active
      if (!userId) return false;

      return await entitlementService.hasEntitlement(userId, 'course', courseId);
    } catch (err) {
      console.warn('[AccessService] Lỗi kiểm tra canAccessCourse:', err);
      return false;
    }
  },

  /**
   * Kiểm tra quyền truy cập một Bài Học (Lesson)
   * @param {string|null} userId 
   * @param {string} lessonId 
   * @returns {Promise<boolean>}
   */
  async canAccessLesson(userId, lessonId) {
    if (!lessonId) return false;

    try {
      const lessons = await dataProvider.getLessons();
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return false;

      // 1. Nếu bài học được cấu hình Free Preview -> Công khai cho tất cả mọi người
      if (lesson.isFreePreview === true) {
        return true;
      }

      // 2. Nếu không phải Free Preview -> Kiểm tra quyền của Khóa học cha
      return await this.canAccessCourse(userId, lesson.courseId);
    } catch (err) {
      console.warn('[AccessService] Lỗi kiểm tra canAccessLesson:', err);
      return false;
    }
  },

  /**
   * Kiểm tra quyền truy cập một Học Liệu / Sản phẩm (Product)
   * @param {string|null} userId 
   * @param {string} productId 
   * @returns {Promise<boolean>}
   */
  async canAccessProduct(userId, productId) {
    if (!productId) return false;

    try {
      const products = await dataProvider.getProducts();
      const product = products.find(p => p.id === productId);
      if (!product) return false;

      // 1. Học liệu Miễn phí -> Công khai
      if (product.accessType === 'FREE' || product.price === 0) {
        return true;
      }

      if (!userId) return false;

      // 2. Học liệu Mua Lẻ (PAID) -> Kiểm tra Entitlement Product
      if (product.accessType === 'PAID') {
        return await entitlementService.hasEntitlement(userId, 'product', productId);
      }

      // 3. Học liệu Kèm Khóa Học (COURSE_ONLY) -> Kiểm tra xem user có quyền với Khóa học liên quan không
      if (product.accessType === 'COURSE_ONLY') {
        // Tìm bài học hoặc khóa học liên kết với học liệu này
        const lessons = await dataProvider.getLessons();
        const relatedLessons = lessons.filter(l => Array.isArray(l.materialIds) && l.materialIds.includes(productId));

        // Lấy danh sách courseIds
        const linkedCourseIds = [...new Set(relatedLessons.map(l => l.courseId).filter(Boolean))];

        for (const cId of linkedCourseIds) {
          const hasCourseAccess = await this.canAccessCourse(userId, cId);
          if (hasCourseAccess) return true;
        }

        // Hoặc kiểm tra xem có entitlement mua lẻ trực tiếp không (nếu được cấp riêng)
        return await entitlementService.hasEntitlement(userId, 'product', productId);
      }

      return false;
    } catch (err) {
      console.warn('[AccessService] Lỗi kiểm tra canAccessProduct:', err);
      return false;
    }
  },

  /**
   * Alias cho canAccessProduct
   */
  async canAccessMaterial(userId, productId) {
    return this.canAccessProduct(userId, productId);
  }
};

export default accessService;
