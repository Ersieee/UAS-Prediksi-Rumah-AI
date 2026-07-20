import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Jalur URL saat ini
  const currentPath = location.pathname;

  // Cek menu mana yang sedang aktif
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside style={{
      position: 'fixed', // ✅ Terkunci rapat di layar browser
      top: 0,
      left: 0,
      bottom: 0,
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      boxSizing: 'border-box',
      borderRight: '1px solid #1e293b',
      zIndex: 1000,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      userSelect: 'none'
    }}>
      
      {/* BRAND & LOGO */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid #1e293b' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', color: '#ffffff' }}>
              Prediksi Rumah <span style={{ color: '#3b82f6' }}>AI</span>
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Smart Real Estate Mining</span>
          </div>
        </div>

        {/* GRUP MENU 1: NAVIGATION UTAMA */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 12px 10px 12px' }}>
            Main Menu
          </div>

          {/* Item 1: Dashboard */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={getNavItemStyle(isActive('/'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            <span>Dashboard</span>
          </button>

          {/* Item 2: Prediksi Harga */}
          <button
            type="button"
            onClick={() => navigate('/prediction')}
            style={getNavItemStyle(isActive('/prediction'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Prediksi Harga</span>
          </button>

          {/* Item 3: Dataset */}
          <button
            type="button"
            onClick={() => navigate('/dataset')}
            style={getNavItemStyle(isActive('/dataset'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
              <path d="M3 12A9 3 0 0 0 21 12"/>
            </svg>
            <span>Kelola Dataset</span>
          </button>
        </div>

        {/* GRUP MENU 2: FITUR & MODEL AI */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 12px 10px 12px' }}>
            Model & History
          </div>

          {/* Item 4: Training AI */}
          <button
            type="button"
            onClick={() => navigate('/training')}
            style={getNavItemStyle(isActive('/training'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4"/>
              <path d="m4.93 10.93 1.41 1.41"/>
              <path d="M2 18h2"/>
              <path d="M20 18h2"/>
              <path d="m19.07 10.93-1.41 1.41"/>
              <path d="M22 22H2"/>
              <path d="m8 6 4-4 4 4"/>
              <path d="M16 18a4 4 0 0 0-8 0"/>
            </svg>
            <span>Training AI</span>
          </button>

          {/* Item 5: History */}
          <button
            type="button"
            onClick={() => navigate('/history')}
            style={getNavItemStyle(isActive('/history'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>History Prediksi</span>
          </button>

          {/* Item 6: Assistant */}
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            style={getNavItemStyle(isActive('/assistant'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2"/>
              <path d="M9 13v2"/>
            </svg>
            <span>AI Assistant</span>
          </button>
        </div>

        {/* GRUP MENU 3: FITUR LANJUTAN */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 12px 10px 12px' }}>
            Fitur Lanjutan (Advanced)
          </div>

          <button
            type="button"
            onClick={() => navigate('/enterprise-agents')}
            style={getNavItemStyle(isActive('/enterprise-agents'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Multi-Agent Simulation</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/evaluation')}
            style={getNavItemStyle(isActive('/evaluation'))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>AI Evaluator</span>
          </button>
        </div>
      </div>

      {/* FOOTER STATUS SISTEM */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '12px 14px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '1px solid #334155'
      }}>
        <div style={{ position: 'relative', width: '10px', height: '10px' }}>
          <span style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            opacity: 0.75
          }}></span>
          <span style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#16a34a'
          }}></span>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>MySQL & Flask API</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Connected Port 5000</div>
        </div>
      </div>

    </aside>
  );
};

// HELPER STYLING TOMBOL
function getNavItemStyle(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    marginBottom: '6px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: active ? '700' : '500',
    color: active ? '#ffffff' : '#94a3b8',
    backgroundColor: active ? '#2563eb' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease-in-out',
    boxShadow: active ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
    outline: 'none'
  };
}

export default Sidebar;