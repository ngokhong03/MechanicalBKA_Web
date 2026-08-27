import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Specialties from './pages/Specialties';
import Software from './pages/Software';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonViewer from './pages/LessonViewer';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Videos from './pages/Videos';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

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
    let title = 'MechanicalBKA - Engineering Learning Platform';

    if (path === '/') {
      title = 'MechanicalBKA - Cổng Học Tập & Thiết Kế Cơ Khí';
    } else if (path === '/specialties') {
      title = 'Chuyên Ngành Cơ Khí - MechanicalBKA';
    } else if (path === '/software') {
      title = 'Phần Mềm Cơ Khí Đào Tạo - MechanicalBKA';
    } else if (path === '/courses') {
      title = 'Danh Sách Khóa Học - MechanicalBKA';
    } else if (path.startsWith('/courses/')) {
      title = 'Chi Tiết Khóa Học - MechanicalBKA';
    } else if (path === '/store') {
      title = 'Cửa Hàng Học Liệu CAD/PDF - MechanicalBKA';
    } else if (path.startsWith('/store/')) {
      title = 'Chi Tiết Học Liệu - MechanicalBKA';
    } else if (path === '/videos') {
      title = 'Thư Viện Videos Cơ Khí - MechanicalBKA';
    } else if (path === '/search') {
      title = 'Tìm Kiếm Kết Quả - MechanicalBKA';
    }

    document.title = title;
  }, [location]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <TitleUpdater />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/software" element={<Software />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonViewer />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/:slug" element={<ProductDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
