import { db, isFirebaseEnabled } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { dataProvider } from './dataProvider';
import { entitlementService } from './entitlementService';

const MOCK_ORDERS_KEY = 'mbka_mock_orders';
const processedIdempotencyKeys = new Set();

/**
 * Order Service — Xử lý nghiệp vụ Đơn Hàng & Giá bảo mật
 */
export const orderService = {
  /**
   * Tạo Đơn Hàng Mới (Server-side price computation & verification)
   * Tuyệt đối KHÔNG tin giá từ Client
   * 
   * @param {Object} params
   * @param {string} params.userId - Firebase UID của học viên
   * @param {Array<{targetId: string, targetType: 'course'|'product'}>} params.items - Danh sách items
   * @param {string} [params.idempotencyKey] - Khóa chống trùng lặp request
   * @returns {Promise<Object>} Đơn hàng hoàn chỉnh
   */
  async createOrder({ userId, items, idempotencyKey = null }) {
    if (!userId) {
      throw new Error('Yêu cầu đăng nhập tài khoản trước khi tạo đơn hàng.');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Đơn hàng phải chứa ít nhất một sản phẩm hoặc khóa học.');
    }

    // 1. Chống gửi trùng lặp request (Idempotency check)
    if (idempotencyKey) {
      if (processedIdempotencyKeys.has(idempotencyKey)) {
        throw new Error('Yêu cầu tạo đơn hàng đang được xử lý hoặc đã hoàn tất.');
      }
      processedIdempotencyKeys.add(idempotencyKey);
    }

    try {
      // 2. Truy vấn và xác thực giá thực tế từ Database / DataProvider
      const snapshotItems = [];
      let calculatedTotal = 0;

      for (const item of items) {
        if (!item.targetId || !item.targetType) {
          throw new Error('Thông tin sản phẩm trong đơn hàng không hợp lệ.');
        }

        let realEntity = null;
        if (item.targetType === 'course') {
          const allCourses = await dataProvider.getCourses();
          realEntity = allCourses.find(c => c.id === item.targetId);
        } else if (item.targetType === 'product') {
          const allProducts = await dataProvider.getProducts();
          realEntity = allProducts.find(p => p.id === item.targetId);
        } else {
          throw new Error(`Loại sản phẩm '${item.targetType}' không được hỗ trợ.`);
        }

        if (!realEntity) {
          throw new Error(`Sản phẩm [${item.targetId}] không tồn tại hoặc đã ngừng xuất bản.`);
        }

        if (realEntity.isPublished === false) {
          throw new Error(`Sản phẩm [${realEntity.title}] hiện không khả dụng.`);
        }

        // Lấy giá và tiêu đề thực tế từ Database
        const snapshotPrice = typeof realEntity.price === 'number' ? Math.max(0, realEntity.price) : 0;
        const snapshotTitle = realEntity.title || 'Sản phẩm MechanicalBKA';

        calculatedTotal += snapshotPrice;

        snapshotItems.push({
          targetId: realEntity.id,
          targetType: item.targetType,
          snapshotTitle,
          snapshotPrice
        });
      }

      const timestamp = new Date().toISOString();
      const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const orderData = {
        id: orderId,
        userId,
        items: snapshotItems,
        totalAmount: calculatedTotal,
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'bank_transfer',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // 3. Lưu trữ đơn hàng
      if (isFirebaseEnabled && db) {
        // Firebase Cloud Firestore
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, orderData);
      } else {
        // Mock Mode (LocalStorage persistence)
        try {
          const existingOrdersRaw = localStorage.getItem(MOCK_ORDERS_KEY);
          const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
          existingOrders.unshift(orderData);
          localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(existingOrders));
        } catch (storageErr) {
          console.warn('[OrderService] Lỗi lưu trữ mock order vào localStorage:', storageErr);
        }
      }

      return orderData;
    } finally {
      // Clear idempotency key after 5 seconds
      if (idempotencyKey) {
        setTimeout(() => processedIdempotencyKeys.delete(idempotencyKey), 5000);
      }
    }
  },

  /**
   * Lấy danh sách đơn hàng của một học viên
   * @param {string} userId - UID học viên
   * @returns {Promise<Array>} Danh sách đơn hàng
   */
  async getUserOrders(userId) {
    if (!userId) return [];

    if (isFirebaseEnabled && db) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return [];
      } catch (err) {
        console.warn('[OrderService] Lỗi tải orders từ Firestore, chuyển sang đọc local:', err.message);
      }
    }

    // Mock Mode fallback
    try {
      const existingOrdersRaw = localStorage.getItem(MOCK_ORDERS_KEY);
      if (existingOrdersRaw) {
        const parsed = JSON.parse(existingOrdersRaw);
        if (Array.isArray(parsed)) {
          return parsed.filter(o => o.userId === userId);
        }
      }
    } catch (err) {
      console.warn('[OrderService] Lỗi đọc mock orders:', err);
    }
    return [];
  },

  /**
   * Lấy thông tin một đơn hàng theo ID
   * @param {string} orderId 
   * @param {string} userId 
   * @param {boolean} isAdmin 
   * @returns {Promise<Object|null>}
   */
  async getOrderById(orderId, userId, isAdmin = false) {
    if (!orderId) return null;

    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          // Kiểm tra quyền sở hữu
          if (data.userId === userId || isAdmin) {
            return data;
          }
          throw new Error('Bạn không có quyền truy cập đơn hàng này.');
        }
        return null;
      } catch (err) {
        console.warn('[OrderService] Lỗi tải order từ Firestore:', err.message);
      }
    }

    // Mock Mode
    try {
      const raw = localStorage.getItem(MOCK_ORDERS_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        const found = list.find(o => o.id === orderId);
        if (found) {
          if (found.userId === userId || isAdmin) {
            return found;
          }
          throw new Error('Bạn không có quyền truy cập đơn hàng này.');
        }
      }
    } catch (err) {
      console.warn('[OrderService] Lỗi tìm mock order:', err);
    }
    return null;
  },

  /**
   * Admin xác nhận thanh toán thủ công (Chỉ dành cho Admin Custom Claim)
   * Tự động cấp phát deterministic Entitlements cho từng mục trong đơn hàng
   */
  async confirmOrderPayment(orderId, isAdmin = false) {
    if (!isAdmin) {
      throw new Error('Chỉ Quản trị viên mới có quyền duyệt thanh toán đơn hàng.');
    }

    const timestamp = new Date().toISOString();
    let targetOrder = null;

    if (isFirebaseEnabled && db) {
      const orderRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(orderRef);
      if (!docSnap.exists()) {
        throw new Error(`Đơn hàng [${orderId}] không tồn tại.`);
      }
      targetOrder = { id: docSnap.id, ...docSnap.data() };

      // Cập nhật trạng thái đơn hàng
      await setDoc(orderRef, {
        paymentStatus: 'paid',
        orderStatus: 'completed',
        updatedAt: timestamp
      }, { merge: true });
    } else {
      // Mock mode
      try {
        const raw = localStorage.getItem(MOCK_ORDERS_KEY);
        if (raw) {
          const list = JSON.parse(raw);
          targetOrder = list.find(o => o.id === orderId);
          if (!targetOrder) {
            throw new Error(`Đơn hàng [${orderId}] không tồn tại trong Mock Data.`);
          }
          const updated = list.map(o => o.id === orderId ? { ...o, paymentStatus: 'paid', orderStatus: 'completed', updatedAt: timestamp } : o);
          localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('[OrderService] Lỗi cập nhật mock order:', err);
        throw err;
      }
    }

    // Tự động cấp phát Entitlements từ Order
    const grantedEntitlements = await entitlementService.grantEntitlementsFromOrder(targetOrder, isAdmin);

    return {
      success: true,
      order: { ...targetOrder, paymentStatus: 'paid', orderStatus: 'completed' },
      entitlements: grantedEntitlements
    };
  }
};

export default orderService;
