import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';

import ZaloWidget from '../components/common/ZaloWidget';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <ZaloWidget />
    </div>
  );
};

export default MainLayout;
