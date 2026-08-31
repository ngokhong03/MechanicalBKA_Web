import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages — eager loaded (public/user pages)
import Home from './pages/Home';
import Specialties from './pages/Specialties';
import Software from './pages/Software';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonViewer from './pages/LessonViewer';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import Videos from './pages/Videos';
import Search from './pages/Search';
import Auth from './pages/Auth';
import Account from './pages/Account';
import OrderHistory from './pages/OrderHistory';
import Library from './pages/Library';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

// Admin Pages — lazy loaded (code splitting)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminLessons = lazy(() => import('./pages/admin/AdminLessons'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminSpecialties = lazy(() => import('./pages/admin/AdminSpecialties'));
const AdminSoftware = lazy(() => import('./pages/admin/AdminSoftware'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminEntitlements = lazy(() => import('./pages/admin/AdminEntitlements'));
const AdminDownloads = lazy(() => import('./pages/admin/AdminDownloads'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));

// CSS Imports
import './App.css';

// Title updater component
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo(0, 0);

    // Dynamic document title selection
    const path = location.pathname;
    let title = 'MechanicalBKA — File Đồ Án Chi Tiết Máy & Kho File Kỹ Thuật Cơ Khí';

    if (path === '/') {
      title = 'MechanicalBKA — Tài liệu & Công cụ Kỹ thuật Cơ khí';
    } else if (path === '/projects') {
      title = 'Đồ Án Chi Tiết Máy — Hộp Giảm Tốc, Bản Vẽ, Tính Toán | MechanicalBKA';
    } else if (path === '/specialties') {
      title = 'Chuyên Ngành Cơ Khí — MechanicalBKA';
    } else if (path === '/software') {
      title = 'Phần Mềm Thiết Kế Cơ Khí — MechanicalBKA';
    } else if (path === '/courses') {
      title = 'Khóa Học Thiết Kế Cơ Khí — MechanicalBKA';
    } else if (path.startsWith('/courses/')) {
      title = 'Chi Tiết Khóa Học — MechanicalBKA';
    } else if (path === '/store') {
      title = 'Kho File Kỹ Thuật — CAD, Bản Vẽ, Tính Toán, Tool | MechanicalBKA';
    } else if (path.startsWith('/store/')) {
      title = 'Chi Tiết Sản Phẩm Kỹ Thuật — MechanicalBKA';
    } else if (path === '/cart') {
      title = 'Giỏ Hàng File Kỹ Thuật — MechanicalBKA';
    } else if (path === '/checkout') {
      title = 'Thanh Toán & Kích Hoạt Bộ File — MechanicalBKA';
    } else if (path === '/videos') {
      title = 'Thư Viện Videos Cơ Khí — MechanicalBKA';
    } else if (path === '/search') {
      title = 'Tìm Kiếm — MechanicalBKA';
    } else if (path === '/auth') {
      title = 'Đăng Nhập / Đăng Ký — MechanicalBKA';
    } else if (path === '/account/orders') {
      title = 'Lịch Sử Đơn Hàng — MechanicalBKA';
    } else if (path === '/account/library') {
      title = 'File Đã Mua & Thư Viện — MechanicalBKA';
    } else if (path === '/account') {
      title = 'Hồ Sơ Cá Nhân — MechanicalBKA';
    } else if (path.startsWith('/admin')) {
      title = 'Quản Trị CMS — MechanicalBKA';
    }

    document.title = title;
  }, [location]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TitleUpdater />
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/specialties" element={<Specialties />} />
              <Route path="/software" element={<Software />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonViewer />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:slug" element={<ProductDetail />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin CMS Sub-Routes — lazy loaded with Suspense */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="font-mono" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--primary)', fontSize: '13px', letterSpacing: '1px' }}>
                        ĐANG TẢI ADMIN CMS...
                      </div>
                    }>
                      <AdminLayout />
                    </Suspense>
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="lessons" element={<AdminLessons />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="specialties" element={<AdminSpecialties />} />
                <Route path="software" element={<AdminSoftware />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="entitlements" element={<AdminEntitlements />} />
                <Route path="downloads" element={<AdminDownloads />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

