import { db, isFirebaseEnabled } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  specialties as mockSpecialties,
  software as mockSoftware,
  courses as mockCourses,
  lessons as mockLessons,
  products as mockProducts,
  videos as mockVideos
} from '../mock/data';

// Export direct references for zero-latency synchronous reads in components
export {
  mockSpecialties as specialties,
  mockSoftware as software,
  mockCourses as courses,
  mockLessons as lessons,
  mockProducts as products,
  mockVideos as videos
};

/**
 * Data Provider Abstraction Layer
 * Cho phép chuyển đổi liền mạch giữa Mock Data và Cloud Firestore
 * Mặc định: VITE_USE_FIREBASE=false (dùng Mock Data)
 */
export const dataProvider = {
  // --- SPECIALTIES ---
  async getSpecialties() {
    if (!isFirebaseEnabled || !db) {
      return mockSpecialties;
    }
    try {
      const q = query(collection(db, 'specialties'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return mockSpecialties;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải specialties từ Firestore, sử dụng Mock Data:', err.message);
      return mockSpecialties;
    }
  },

  async getSpecialtyBySlug(slug) {
    if (!isFirebaseEnabled || !db) {
      return mockSpecialties.find(s => s.slug === slug) || null;
    }
    try {
      const q = query(collection(db, 'specialties'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return mockSpecialties.find(s => s.slug === slug) || null;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải specialty từ Firestore:', err.message);
      return mockSpecialties.find(s => s.slug === slug) || null;
    }
  },

  // --- SOFTWARE ---
  async getSoftware() {
    if (!isFirebaseEnabled || !db) {
      return mockSoftware;
    }
    try {
      const snapshot = await getDocs(collection(db, 'software'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return mockSoftware;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải software từ Firestore, sử dụng Mock Data:', err.message);
      return mockSoftware;
    }
  },

  async getSoftwareBySlug(slug) {
    if (!isFirebaseEnabled || !db) {
      return mockSoftware.find(s => s.slug === slug) || null;
    }
    try {
      const q = query(collection(db, 'software'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return mockSoftware.find(s => s.slug === slug) || null;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải software từ Firestore:', err.message);
      return mockSoftware.find(s => s.slug === slug) || null;
    }
  },

  // --- COURSES ---
  async getCourses() {
    if (!isFirebaseEnabled || !db) {
      return mockCourses.filter(c => c.isPublished);
    }
    try {
      const q = query(collection(db, 'courses'), where('isPublished', '==', true));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return mockCourses.filter(c => c.isPublished);
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải courses từ Firestore, sử dụng Mock Data:', err.message);
      return mockCourses.filter(c => c.isPublished);
    }
  },

  async getCourseBySlug(slug) {
    if (!isFirebaseEnabled || !db) {
      return mockCourses.find(c => c.slug === slug) || null;
    }
    try {
      const q = query(collection(db, 'courses'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return mockCourses.find(c => c.slug === slug) || null;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải course từ Firestore:', err.message);
      return mockCourses.find(c => c.slug === slug) || null;
    }
  },

  // --- LESSONS ---
  async getLessons(courseId = null) {
    if (!isFirebaseEnabled || !db) {
      if (courseId) {
        return mockLessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
      }
      return mockLessons.sort((a, b) => a.order - b.order);
    }
    try {
      let q = collection(db, 'lessons');
      if (courseId) {
        q = query(collection(db, 'lessons'), where('courseId', '==', courseId), orderBy('order', 'asc'));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return courseId ? mockLessons.filter(l => l.courseId === courseId) : mockLessons;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải lessons từ Firestore, sử dụng Mock Data:', err.message);
      return courseId ? mockLessons.filter(l => l.courseId === courseId) : mockLessons;
    }
  },

  async getLessonBySlug(courseId, lessonSlug) {
    if (!isFirebaseEnabled || !db) {
      return mockLessons.find(l => (courseId ? l.courseId === courseId : true) && l.slug === lessonSlug) || null;
    }
    try {
      const q = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        where('slug', '==', lessonSlug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return mockLessons.find(l => l.courseId === courseId && l.slug === lessonSlug) || null;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải lesson từ Firestore:', err.message);
      return mockLessons.find(l => l.courseId === courseId && l.slug === lessonSlug) || null;
    }
  },

  // --- PRODUCTS ---
  async getProducts() {
    if (!isFirebaseEnabled || !db) {
      return mockProducts.filter(p => p.isPublished);
    }
    try {
      const q = query(collection(db, 'products'), where('isPublished', '==', true));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return mockProducts.filter(p => p.isPublished);
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải products từ Firestore, sử dụng Mock Data:', err.message);
      return mockProducts.filter(p => p.isPublished);
    }
  },

  async getProductBySlug(slug) {
    if (!isFirebaseEnabled || !db) {
      return mockProducts.find(p => p.slug === slug) || null;
    }
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
      return mockProducts.find(p => p.slug === slug) || null;
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải product từ Firestore:', err.message);
      return mockProducts.find(p => p.slug === slug) || null;
    }
  },

  // --- PRODUCT FILES SUBCOLLECTION ---
  async getProductFiles(productId) {
    if (!isFirebaseEnabled || !db) {
      const prod = mockProducts.find(p => p.id === productId);
      return prod ? (prod.files || []) : [];
    }
    try {
      const snapshot = await getDocs(collection(db, 'products', productId, 'files'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      const prod = mockProducts.find(p => p.id === productId);
      return prod ? (prod.files || []) : [];
    } catch (err) {
      console.warn('[DataProvider] Lỗi tải product files từ Firestore:', err.message);
      const prod = mockProducts.find(p => p.id === productId);
      return prod ? (prod.files || []) : [];
    }
  },

  // --- VIDEOS ---
  async getVideos() {
    return mockVideos;
  }
};

export default dataProvider;
