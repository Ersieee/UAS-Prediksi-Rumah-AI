import React from 'react';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 1. Sidebar Terkunci (Fixed) */}
      <Sidebar />

      {/* 2. Konten Utama digeser sejauh lebar sidebar (marginLeft: 260px) */}
      <main style={{
        marginLeft: '260px',
        minHeight: '100vh',
        padding: '28px',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;