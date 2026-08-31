import { db, isFirebaseEnabled } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where
} from 'firebase/firestore';

const MOCK_ENTITLEMENTS_KEY = 'mbka_entitlements';

/**
 * Entitlement Service — Quản lý quyền sở hữu Khóa học và Học liệu
 * ID định dạng deterministic: ${userId}_${targetType}_${targetId}
 */
export const entitlementService = {
  /**
   * Tạo ID deterministic cho Entitlement
   */
  buildEntitlementId(userId, targetType, targetId) {
    if (!userId || !targetType || !targetId) return null;
    return `${userId}_${targetType}_${targetId}`;
  },

  /**
   * Kiểm tra xem user có quyền sở hữu hợp lệ (status === 'active') với target hay không
   * 
   * @param {string} userId - UID học viên
   * @param {'course'|'product'} targetType 
   * @param {string} targetId 
   * @returns {Promise<boolean>}
   */
  async hasEntitlement(userId, targetType, targetId) {
    if (!userId || !targetType || !targetId) return false;
    const entitlementId = this.buildEntitlementId(userId, targetType, targetId);

    if (isFirebaseEnabled && db) {
      try {
        const docRef = doc(db, 'entitlements', entitlementId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.status === 'active' && data.userId === userId;
        }
        return false;
      } catch (err) {
        console.warn('[EntitlementService] Lỗi kiểm tra Firestore entitlement:', err.message);
      }
    }

    // Mock Mode fallback
    try {
      const raw = localStorage.getItem(MOCK_ENTITLEMENTS_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        const found = list.find(e => e.id === entitlementId);
        return Boolean(found && found.status === 'active' && found.userId === userId);
      }
    } catch (err) {
      console.warn('[EntitlementService] Lỗi đọc mock entitlements:', err);
    }
    return false;
  },

  /**
   * Lấy danh sách toàn bộ Entitlement của một học viên
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getUserEntitlements(userId) {
    if (!userId) return [];

    if (isFirebaseEnabled && db) {
      try {
        const q = query(
          collection(db, 'entitlements'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return [];
      } catch (err) {
        console.warn('[EntitlementService] Lỗi lấy danh sách entitlements từ Firestore:', err.message);
      }
    }

    // Mock Mode
    try {
      const raw = localStorage.getItem(MOCK_ENTITLEMENTS_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          return list.filter(e => e.userId === userId);
        }
      }
    } catch (err) {
      console.warn('[EntitlementService] Lỗi đọc mock entitlements:', err);
    }
    return [];
  },

  /**
   * Cấp một Entitlement cho học viên (Admin only hoặc trong quá trình Order Confirmation)
   * 
   * @param {Object} params
   * @param {string} params.userId
   * @param {'course'|'product'} params.targetType
   * @param {string} params.targetId
   * @param {string} params.sourceOrderId
   * @param {boolean} [isAdmin=false]
   * @returns {Promise<Object>}
   */
  async grantEntitlement({ userId, targetType, targetId, sourceOrderId }, isAdmin = false) {
    if (!isAdmin) {
      throw new Error('Chỉ Quản trị viên mới có quyền cấp phát Entitlement.');
    }

    if (!userId || !targetType || !targetId || !sourceOrderId) {
      throw new Error('Thiếu thông tin bắt buộc để cấp phát Entitlement.');
    }

    const entitlementId = this.buildEntitlementId(userId, targetType, targetId);
    const timestamp = new Date().toISOString();

    const entitlementData = {
      id: entitlementId,
      userId,
      targetType,
      targetId,
      sourceOrderId,
      grantedAt: timestamp,
      status: 'active'
    };

    if (isFirebaseEnabled && db) {
      // Dùng setDoc với merge để bảo đảm tính IDEMPOTENCY
      const docRef = doc(db, 'entitlements', entitlementId);
      await setDoc(docRef, entitlementData, { merge: true });
    } else {
      // Mock Mode
      try {
        const raw = localStorage.getItem(MOCK_ENTITLEMENTS_KEY);
        let list = raw ? JSON.parse(raw) : [];
        // Xóa item cũ nếu có để tránh duplicate
        list = list.filter(e => e.id !== entitlementId);
        list.unshift(entitlementData);
        localStorage.setItem(MOCK_ENTITLEMENTS_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn('[EntitlementService] Lỗi ghi mock entitlement:', err);
      }
    }

    return entitlementData;
  },

  /**
   * Thu hồi Entitlement (Admin only)
   * Đổi status = 'revoked'
   */
  async revokeEntitlement(entitlementId, isAdmin = false) {
    if (!isAdmin) {
      throw new Error('Chỉ Quản trị viên mới có quyền thu hồi Entitlement.');
    }

    if (isFirebaseEnabled && db) {
      const docRef = doc(db, 'entitlements', entitlementId);
      await setDoc(docRef, { status: 'revoked' }, { merge: true });
    } else {
      try {
        const raw = localStorage.getItem(MOCK_ENTITLEMENTS_KEY);
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.map(e => e.id === entitlementId ? { ...e, status: 'revoked' } : e);
          localStorage.setItem(MOCK_ENTITLEMENTS_KEY, JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('[EntitlementService] Lỗi cập nhật mock revoke:', err);
      }
    }
    return true;
  },

  /**
   * Cấp phát tự động toàn bộ Entitlement từ một Order đã thanh toán
   * Đảm bảo tính Idempotency: xác nhận nhiều lần không sinh duplicate
   */
  async grantEntitlementsFromOrder(order, isAdmin = false) {
    if (!isAdmin) {
      throw new Error('Yêu cầu quyền Admin để kích hoạt Entitlement từ Order.');
    }

    if (!order || !order.userId || !Array.isArray(order.items)) {
      throw new Error('Đơn hàng không hợp lệ để cấp Entitlement.');
    }

    const grantedList = [];
    for (const item of order.items) {
      const granted = await this.grantEntitlement({
        userId: order.userId,
        targetType: item.targetType,
        targetId: item.targetId,
        sourceOrderId: order.id
      }, isAdmin);
      grantedList.push(granted);
    }

    return grantedList;
  }
};

export default entitlementService;
