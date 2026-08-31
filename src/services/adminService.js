import { db, isFirebaseEnabled, auth } from '../firebase/config';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy, limit 
} from 'firebase/firestore';
import { dataProvider } from './dataProvider';
import { orderService } from './orderService';
import { entitlementService } from './entitlementService';

const MOCK_STORAGE_KEYS = {
  COURSES: 'mbka_admin_courses',
  LESSONS: 'mbka_admin_lessons',
  PRODUCTS: 'mbka_admin_products',
  SPECIALTIES: 'mbka_admin_specialties',
  SOFTWARE: 'mbka_admin_software',
  ORDERS: 'mbka_orders',
  ENTITLEMENTS: 'mbka_entitlements',
  DOWNLOAD_LOGS: 'mbka_download_logs',
  AUDIT_LOGS: 'mbka_audit_logs'
};

// Helper for local mock storage
const getLocalData = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`[AdminService] Lỗi ghi LocalStorage [${key}]:`, err);
  }
};

/**
 * Admin Service — Quản lý toàn bộ chức năng CMS Admin cho MechanicalBKA
 */
export const adminService = {
  /**
   * Ghi nhật ký thao tác quản trị (Audit Log)
   */
  async logAdminAction(action, targetType, targetId, metadata = {}) {
    const adminUid = auth?.currentUser?.uid || 'admin_mock';
    const auditRecord = {
      adminUid,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      try {
        await addDoc(collection(db, 'adminAuditLogs'), auditRecord);
      } catch (err) {
        console.warn('[AdminService] Lỗi ghi Firestore audit log:', err.message);
      }
    } else {
      const logs = getLocalData(MOCK_STORAGE_KEYS.AUDIT_LOGS, []);
      logs.unshift({ id: `audit_${Date.now()}`, ...auditRecord });
      setLocalData(MOCK_STORAGE_KEYS.AUDIT_LOGS, logs);
    }
  },

  /**
   * Lấy tổng hợp thống kê Dashboard
   */
  async getAdminStats() {
    const [courses, lessons, products, specialties, software, orders, entitlements, downloadLogs] = await Promise.all([
      this.getCourses(),
      this.getLessons(),
      this.getProducts(),
      this.getSpecialties(),
      this.getSoftware(),
      this.getAdminOrders(),
      this.getAdminEntitlements(),
      this.getDownloadLogs()
    ]);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeEntitlements = entitlements.filter(e => e.status === 'active').length;

    // Get videos count
    const videos = await dataProvider.getVideos();

    return {
      coursesCount: courses.length,
      lessonsCount: lessons.length,
      productsCount: products.length,
      videosCount: videos.length,
      specialtiesCount: specialties.length,
      softwareCount: software.length,
      usersCount: 15, // Active student accounts
      pendingOrders,
      paidOrdersCount: paidOrders.length,
      totalRevenue,
      activeEntitlements,
      recentDownloadsCount: downloadLogs.length
    };
  },

  // ================= COURSES =================
  async getCourses() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'courses'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const local = getLocalData(MOCK_STORAGE_KEYS.COURSES, null);
    if (local) return local;
    const initial = await dataProvider.getCourses();
    setLocalData(MOCK_STORAGE_KEYS.COURSES, initial);
    return initial;
  },

  async getCourseById(id) {
    const list = await this.getCourses();
    return list.find(c => c.id === id) || null;
  },

  async createCourse(data) {
    const id = data.id || `course_${Date.now()}`;
    const newCourse = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'courses', id), newCourse);
    } else {
      const list = await this.getCourses();
      list.push(newCourse);
      setLocalData(MOCK_STORAGE_KEYS.COURSES, list);
    }

    await this.logAdminAction('CREATE_COURSE', 'course', id, { title: data.title });
    return newCourse;
  },

  async updateCourse(id, data) {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'courses', id), updated);
    } else {
      let list = await this.getCourses();
      list = list.map(c => c.id === id ? { ...c, ...updated } : c);
      setLocalData(MOCK_STORAGE_KEYS.COURSES, list);
    }

    await this.logAdminAction('UPDATE_COURSE', 'course', id, { title: data.title });
    return updated;
  },

  async deleteCourse(id) {
    // Safety check: Lessons attached
    const lessons = await this.getLessons();
    const attachedLessons = lessons.filter(l => l.courseId === id);
    if (attachedLessons.length > 0) {
      throw new Error(`Không thể xóa khóa học vì vẫn còn ${attachedLessons.length} bài học liên kết.`);
    }

    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'courses', id));
    } else {
      let list = await this.getCourses();
      list = list.filter(c => c.id !== id);
      setLocalData(MOCK_STORAGE_KEYS.COURSES, list);
    }

    await this.logAdminAction('DELETE_COURSE', 'course', id);
    return true;
  },

  // ================= LESSONS =================
  async getLessons() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'lessons'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const local = getLocalData(MOCK_STORAGE_KEYS.LESSONS, null);
    if (local) return local;
    const initial = await dataProvider.getLessons();
    setLocalData(MOCK_STORAGE_KEYS.LESSONS, initial);
    return initial;
  },

  async getLessonById(id) {
    const list = await this.getLessons();
    return list.find(l => l.id === id) || null;
  },

  async createLesson(data) {
    const id = data.id || `lesson_${Date.now()}`;
    const newLesson = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'lessons', id), newLesson);
    } else {
      const list = await this.getLessons();
      list.push(newLesson);
      setLocalData(MOCK_STORAGE_KEYS.LESSONS, list);
    }

    await this.logAdminAction('CREATE_LESSON', 'lesson', id, { title: data.title });
    return newLesson;
  },

  async updateLesson(id, data) {
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'lessons', id), updated);
    } else {
      let list = await this.getLessons();
      list = list.map(l => l.id === id ? { ...l, ...updated } : l);
      setLocalData(MOCK_STORAGE_KEYS.LESSONS, list);
    }

    await this.logAdminAction('UPDATE_LESSON', 'lesson', id, { title: data.title });
    return updated;
  },

  async deleteLesson(id) {
    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'lessons', id));
    } else {
      let list = await this.getLessons();
      list = list.filter(l => l.id !== id);
      setLocalData(MOCK_STORAGE_KEYS.LESSONS, list);
    }

    await this.logAdminAction('DELETE_LESSON', 'lesson', id);
    return true;
  },

  // ================= PRODUCTS =================
  async getProducts() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'products'));
      const prods = [];
      for (const docSnap of snap.docs) {
        const pData = { id: docSnap.id, ...docSnap.data() };
        const filesSnap = await getDocs(collection(db, 'products', docSnap.id, 'files'));
        pData.files = filesSnap.docs.map(f => ({ id: f.id, ...f.data() }));
        // Backward-compatible media resolution
        if (!pData.media) {
          pData.media = {
            thumbnailUrl: pData.thumbnailUrl || pData.thumbnail || null,
            gallery: pData.gallery || pData.images || [],
            youtubeVideoId: pData.youtubeVideoId || null
          };
        }
        prods.push(pData);
      }
      return prods;
    }
    const local = getLocalData(MOCK_STORAGE_KEYS.PRODUCTS, null);
    const initial = await dataProvider.getProducts();
    if (local && Array.isArray(local)) {
      // Merge any new seed product (e.g. EPXYZ product) that wasn't in cached local storage
      const localIds = new Set(local.map(p => p.id));
      const missingFromLocal = initial.filter(p => !localIds.has(p.id));
      if (missingFromLocal.length > 0) {
        const merged = [...local, ...missingFromLocal];
        setLocalData(MOCK_STORAGE_KEYS.PRODUCTS, merged);
        return merged;
      }
      return local;
    }
    setLocalData(MOCK_STORAGE_KEYS.PRODUCTS, initial);
    return initial;
  },

  async getProductById(id) {
    const list = await this.getProducts();
    return list.find(p => p.id === id) || null;
  },

  async createProduct(data) {
    const id = data.id || `product_${Date.now()}`;
    const files = data.files || [];
    const timestamp = new Date().toISOString();

    // Normalize media object
    const media = {
      thumbnailUrl: data.media?.thumbnailUrl || data.thumbnailUrl || null,
      gallery: data.media?.gallery || data.gallery || [],
      youtubeVideoId: data.media?.youtubeVideoId || data.youtubeVideoId || null
    };

    const newProduct = {
      ...data,
      id,
      version: data.version || (files[0]?.version) || '1.0.0',
      media,
      thumbnailUrl: media.thumbnailUrl, // Backward-compatibility
      youtubeVideoId: media.youtubeVideoId, // Backward-compatibility
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      includedFiles: Array.isArray(data.includedFiles) ? data.includedFiles : [],
      technical: data.technical || {
        version: data.version || '1.0.0',
        systemRequirements: data.systemRequirements || '',
        compatibility: data.compatibility || [],
        standards: data.standards || []
      },
      files,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (isFirebaseEnabled && db) {
      const { files: _, ...prodData } = newProduct;
      await setDoc(doc(db, 'products', id), prodData);
      for (const file of files) {
        await setDoc(doc(db, 'products', id, 'files', file.id), file);
      }
    } else {
      const list = await this.getProducts();
      list.push(newProduct);
      setLocalData(MOCK_STORAGE_KEYS.PRODUCTS, list);
    }

    await this.logAdminAction('CREATE_PRODUCT', 'product', id, { title: data.title });
    return newProduct;
  },

  async updateProduct(id, data) {
    const files = data.files || [];
    const timestamp = new Date().toISOString();

    // Normalize media object
    const media = {
      thumbnailUrl: data.media?.thumbnailUrl || data.thumbnailUrl || null,
      gallery: data.media?.gallery || data.gallery || [],
      youtubeVideoId: data.media?.youtubeVideoId || data.youtubeVideoId || null
    };

    const updated = {
      ...data,
      id,
      version: data.version || (files[0]?.version) || '1.0.0',
      media,
      thumbnailUrl: media.thumbnailUrl,
      youtubeVideoId: media.youtubeVideoId,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      includedFiles: Array.isArray(data.includedFiles) ? data.includedFiles : [],
      technical: data.technical || {
        version: data.version || '1.0.0',
        systemRequirements: data.systemRequirements || '',
        compatibility: data.compatibility || [],
        standards: data.standards || []
      },
      files,
      updatedAt: timestamp
    };

    if (isFirebaseEnabled && db) {
      const { files: _, ...prodData } = updated;
      await updateDoc(doc(db, 'products', id), prodData);
      for (const file of files) {
        await setDoc(doc(db, 'products', id, 'files', file.id), file);
      }
    } else {
      let list = await this.getProducts();
      list = list.map(p => p.id === id ? { ...p, ...updated } : p);
      setLocalData(MOCK_STORAGE_KEYS.PRODUCTS, list);
    }

    await this.logAdminAction('UPDATE_PRODUCT', 'product', id, { title: data.title });
    return updated;
  },

  async replaceProductArtifact(productId, oldFileId, newArtifactData) {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new Error(`Sản phẩm [${productId}] không tồn tại.`);
    }

    const currentFiles = product.files || [];
    const updatedFiles = currentFiles.map(f => f.id === oldFileId ? newArtifactData : f);

    // If old file was not found, append new artifact
    if (!currentFiles.some(f => f.id === oldFileId)) {
      updatedFiles.push(newArtifactData);
    }

    return await this.updateProduct(productId, {
      ...product,
      version: newArtifactData.version || product.version,
      files: updatedFiles
    });
  },

  async deleteProduct(id) {
    // Safety check: Lessons referencing this product
    const lessons = await this.getLessons();
    const referencing = lessons.filter(l => (l.materialIds || []).includes(id));
    if (referencing.length > 0) {
      throw new Error(`Không thể xóa học liệu vì đang được đính kèm trong ${referencing.length} bài học.`);
    }

    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'products', id));
    } else {
      let list = await this.getProducts();
      list = list.filter(p => p.id !== id);
      setLocalData(MOCK_STORAGE_KEYS.PRODUCTS, list);
    }

    await this.logAdminAction('DELETE_PRODUCT', 'product', id);
    return true;
  },

  // ================= SPECIALTIES =================
  async getSpecialties() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'specialties'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const local = getLocalData(MOCK_STORAGE_KEYS.SPECIALTIES, null);
    if (local) return local;
    const initial = await dataProvider.getSpecialties();
    setLocalData(MOCK_STORAGE_KEYS.SPECIALTIES, initial);
    return initial;
  },

  async createSpecialty(data) {
    const id = data.id || `spec_${Date.now()}`;
    const newSpec = { ...data, id };
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'specialties', id), newSpec);
    } else {
      const list = await this.getSpecialties();
      list.push(newSpec);
      setLocalData(MOCK_STORAGE_KEYS.SPECIALTIES, list);
    }
    await this.logAdminAction('CREATE_SPECIALTY', 'specialty', id, { name: data.name });
    return newSpec;
  },

  async updateSpecialty(id, data) {
    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'specialties', id), data);
    } else {
      let list = await this.getSpecialties();
      list = list.map(s => s.id === id ? { ...s, ...data } : s);
      setLocalData(MOCK_STORAGE_KEYS.SPECIALTIES, list);
    }
    await this.logAdminAction('UPDATE_SPECIALTY', 'specialty', id, { name: data.name });
    return { ...data, id };
  },

  async deleteSpecialty(id) {
    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'specialties', id));
    } else {
      let list = await this.getSpecialties();
      list = list.filter(s => s.id !== id);
      setLocalData(MOCK_STORAGE_KEYS.SPECIALTIES, list);
    }
    await this.logAdminAction('DELETE_SPECIALTY', 'specialty', id);
    return true;
  },

  // ================= SOFTWARE =================
  async getSoftware() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'software'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const local = getLocalData(MOCK_STORAGE_KEYS.SOFTWARE, null);
    if (local) return local;
    const initial = await dataProvider.getSoftware();
    setLocalData(MOCK_STORAGE_KEYS.SOFTWARE, initial);
    return initial;
  },

  async createSoftware(data) {
    const id = data.id || `soft_${Date.now()}`;
    const newSoft = { ...data, id };
    if (isFirebaseEnabled && db) {
      await setDoc(doc(db, 'software', id), newSoft);
    } else {
      const list = await this.getSoftware();
      list.push(newSoft);
      setLocalData(MOCK_STORAGE_KEYS.SOFTWARE, list);
    }
    await this.logAdminAction('CREATE_SOFTWARE', 'software', id, { name: data.name });
    return newSoft;
  },

  async updateSoftware(id, data) {
    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'software', id), data);
    } else {
      let list = await this.getSoftware();
      list = list.map(s => s.id === id ? { ...s, ...data } : s);
      setLocalData(MOCK_STORAGE_KEYS.SOFTWARE, list);
    }
    await this.logAdminAction('UPDATE_SOFTWARE', 'software', id, { name: data.name });
    return { ...data, id };
  },

  async deleteSoftware(id) {
    if (isFirebaseEnabled && db) {
      await deleteDoc(doc(db, 'software', id));
    } else {
      let list = await this.getSoftware();
      list = list.filter(s => s.id !== id);
      setLocalData(MOCK_STORAGE_KEYS.SOFTWARE, list);
    }
    await this.logAdminAction('DELETE_SOFTWARE', 'software', id);
    return true;
  },

  // ================= ORDERS =================
  async getAdminOrders() {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return getLocalData(MOCK_STORAGE_KEYS.ORDERS, []);
  },

  async confirmOrderPayment(orderId) {
    const result = await orderService.confirmOrderPayment(orderId, true);
    await this.logAdminAction('CONFIRM_ORDER', 'order', orderId);
    return result;
  },

  async cancelOrder(orderId) {
    if (isFirebaseEnabled && db) {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: 'cancelled',
        updatedAt: new Date().toISOString()
      });
    } else {
      let orders = getLocalData(MOCK_STORAGE_KEYS.ORDERS, []);
      orders = orders.map(o => o.id === orderId ? { ...o, orderStatus: 'cancelled' } : o);
      setLocalData(MOCK_STORAGE_KEYS.ORDERS, orders);
    }
    await this.logAdminAction('CANCEL_ORDER', 'order', orderId);
    return true;
  },

  // ================= USERS =================
  async getAdminUsers() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    // Mock user dataset
    return [
      { id: 'user_01', uid: 'user_01', email: 'admin@mechanicalbka.vn', displayName: 'Admin MechanicalBKA', role: 'admin', createdAt: '2026-01-01T08:00:00.000Z' },
      { id: 'user_02', uid: 'user_02', email: 'student_cad@gmail.com', displayName: 'Nguyễn Văn An (K65)', role: 'student', createdAt: '2026-02-10T09:30:00.000Z' },
      { id: 'user_03', uid: 'user_03', email: 'designer_mold@gmail.com', displayName: 'Trần Đình Trọng', role: 'student', createdAt: '2026-02-15T14:15:00.000Z' }
    ];
  },

  // ================= ENTITLEMENTS =================
  async getAdminEntitlements() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'entitlements'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return getLocalData(MOCK_STORAGE_KEYS.ENTITLEMENTS, []);
  },

  async grantEntitlement(userId, targetType, targetId, sourceOrderId = 'ADMIN_MANUAL') {
    const result = await entitlementService.grantEntitlement(userId, targetType, targetId, sourceOrderId, true);
    await this.logAdminAction('GRANT_ENTITLEMENT', targetType, targetId, { userId, sourceOrderId });
    return result;
  },

  async revokeEntitlement(entitlementId) {
    const result = await entitlementService.revokeEntitlement(entitlementId, true);
    await this.logAdminAction('REVOKE_ENTITLEMENT', 'entitlement', entitlementId);
    return result;
  },

  // ================= DOWNLOAD LOGS =================
  async getDownloadLogs() {
    if (isFirebaseEnabled && db) {
      const snap = await getDocs(collection(db, 'downloadLogs'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return getLocalData(MOCK_STORAGE_KEYS.DOWNLOAD_LOGS, [
      { id: 'log_01', userId: 'user_02', productId: 'product_001', fileId: 'file_001', fileName: 'MechanicalBKA_Gearbox_CAD_Package.zip', createdAt: '2026-02-26T10:00:00.000Z', method: 'signed_url' },
      { id: 'log_02', userId: 'user_03', productId: 'product_002', fileId: 'file_002', fileName: 'Injection_Mold_CAD_Dataset.zip', createdAt: '2026-02-26T14:30:00.000Z', method: 'signed_url' }
    ]);
  },

  // ================= AUDIT LOGS =================
  async getAuditLogs() {
    if (isFirebaseEnabled && db) {
      const q = query(collection(db, 'adminAuditLogs'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return getLocalData(MOCK_STORAGE_KEYS.AUDIT_LOGS, [
      { id: 'audit_init', adminUid: 'admin_master', action: 'SYSTEM_BOOT', targetType: 'system', targetId: 'main', createdAt: new Date().toISOString() }
    ]);
  },

  // ================= PHASE 15C: DIAGNOSTICS & RECONCILIATION =================
  /**
   * Truy vấn chẩn đoán toàn diện đơn hàng (User → Order → Entitlement → Artifacts → Downloads)
   */
  async getOrderDiagnostics(orderId) {
    const orders = await this.getAdminOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Đơn hàng [${orderId}] không tồn tại.`);
    }

    const [allUsers, allEntitlements, allProducts, allDownloads] = await Promise.all([
      this.getAdminUsers(),
      this.getAdminEntitlements(),
      this.getProducts(),
      this.getDownloadLogs()
    ]);

    const user = allUsers.find(u => u.id === order.userId || u.uid === order.userId) || {
      id: order.userId,
      uid: order.userId,
      displayName: 'Khách hàng',
      email: order.userEmail || `${order.userId}@customer.local`
    };

    const itemsDiagnostics = (order.items || []).map(item => {
      const product = allProducts.find(p => p.id === item.id) || null;
      const entitlement = allEntitlements.find(e => 
        e.userId === order.userId && 
        e.targetId === item.id && 
        e.status === 'active'
      ) || null;

      const itemDownloads = allDownloads.filter(d => 
        d.userId === order.userId && 
        d.productId === item.id
      );

      return {
        item,
        product,
        hasActiveEntitlement: Boolean(entitlement),
        entitlement,
        downloadsCount: itemDownloads.length,
        downloadLogs: itemDownloads
      };
    });

    const isPaid = order.paymentStatus === 'paid';
    const missingEntitlements = itemsDiagnostics.filter(i => isPaid && !i.hasActiveEntitlement);

    return {
      order,
      user,
      isPaid,
      itemsDiagnostics,
      hasMissingEntitlements: missingEntitlements.length > 0,
      missingEntitlementsCount: missingEntitlements.length,
      canRepair: isPaid && missingEntitlements.length > 0
    };
  },

  /**
   * Khôi phục / Cấp quyền sở hữu bị thiếu cho đơn hàng đã thanh toán
   */
  async repairOrderEntitlements(orderId) {
    const diagnostics = await this.getOrderDiagnostics(orderId);
    if (!diagnostics.isPaid) {
      throw new Error(`Không thể khôi phục quyền: Đơn hàng [${orderId}] chưa được xác nhận thanh toán.`);
    }

    const granted = [];
    for (const itemDiag of diagnostics.itemsDiagnostics) {
      if (!itemDiag.hasActiveEntitlement) {
        const res = await entitlementService.grantEntitlement(
          diagnostics.order.userId,
          itemDiag.item.type || 'product',
          itemDiag.item.id,
          orderId,
          true
        );
        granted.push(res);
      }
    }

    await this.logAdminAction('REPAIR_ORDER_ENTITLEMENTS', 'order', orderId, {
      repairedCount: granted.length,
      userId: diagnostics.order.userId
    });

    return {
      success: true,
      repairedCount: granted.length,
      granted
    };
  },

  /**
   * Báo cáo sức khỏe lưu trữ & toàn vẹn dữ liệu Storage
   */
  async getStorageHealthSummary() {
    const products = await this.getProducts();

    let totalArtifacts = 0;
    let missingThumbnails = 0;
    let missingChecksums = 0;
    let missingFiles = 0;
    const productHealthList = [];

    for (const p of products) {
      const hasThumb = Boolean(p.media?.thumbnailUrl || p.thumbnailUrl || p.thumbnail);
      if (!hasThumb) missingThumbnails++;

      const files = p.files || [];
      totalArtifacts += files.length;

      let productChecksumMissing = 0;
      let productInvalidFiles = 0;

      for (const f of files) {
        if (!f.checksum || f.checksum.length < 32) {
          missingChecksums++;
          productChecksumMissing++;
        }
        if (!f.fileName || (f.fileSize || 0) <= 0) {
          missingFiles++;
          productInvalidFiles++;
        }
      }

      productHealthList.push({
        productId: p.id,
        title: p.title,
        isPublished: p.isPublished ?? true,
        version: p.version || '1.0.0',
        hasThumbnail: hasThumb,
        artifactCount: files.length,
        checksumMissing: productChecksumMissing,
        invalidFiles: productInvalidFiles,
        status: (productChecksumMissing === 0 && productInvalidFiles === 0 && hasThumb) ? 'HEALTHY' : 'WARNING'
      });
    }

    const publishedCount = products.filter(p => p.isPublished).length;
    const draftCount = products.filter(p => !p.isPublished).length;

    const overallStatus = (missingChecksums === 0 && missingFiles === 0) 
      ? (missingThumbnails === 0 ? 'EXCELLENT' : 'GOOD') 
      : 'ACTION_REQUIRED';

    return {
      totalProducts: products.length,
      publishedCount,
      draftCount,
      totalArtifacts,
      missingThumbnails,
      missingChecksums,
      missingFiles,
      overallStatus,
      productHealthList
    };
  },

  /**
   * Kiểm tra tính toàn vẹn của một artifact
   */
  async verifyArtifactIntegrity(productId, fileId) {
    const product = await this.getProductById(productId);
    if (!product) throw new Error(`Sản phẩm [${productId}] không tồn tại.`);

    const file = (product.files || []).find(f => f.id === fileId);
    if (!file) throw new Error(`Tệp tin [${fileId}] không tồn tại trong sản phẩm.`);

    const isChecksumValid = Boolean(file.checksum && file.checksum.length === 64);
    const isSizeValid = Boolean(file.fileSize && file.fileSize > 0);

    const result = {
      productId,
      fileId,
      fileName: file.fileName,
      version: file.version || product.version,
      checksum: file.checksum,
      fileSize: file.fileSize,
      isChecksumValid,
      isSizeValid,
      status: (isChecksumValid && isSizeValid) ? 'VERIFIED' : 'INTEGRITY_WARNING',
      checkedAt: new Date().toISOString()
    };

    await this.logAdminAction('VERIFY_ARTIFACT', 'artifact', fileId, result);
    return result;
  }
};

export default adminService;
