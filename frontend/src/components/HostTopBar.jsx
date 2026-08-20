import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { currentUser, mockNotifications } from '../data/mockData';

function HostTopBar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="host-topbar">
      <div className="host-topbar__search">
        <Search className="host-topbar__search-icon" size={18} strokeWidth={1.8} />
        <input
          type="text"
          className="host-topbar__search-input"
          placeholder="Search members, events, or vacancies..."
          id="global-search"
        />
      </div>

      <div className="host-topbar__actions">
        <button
          className="host-topbar__icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="host-topbar__icon-btn host-topbar__icon-btn--bell" 
            aria-label="Notifications" 
            id="notifications-btn"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && <span className="host-topbar__notification-dot" />}
          </button>
          
          {showNotifs && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '300px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {mockNotifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.text}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="host-topbar__user" 
          onClick={() => navigate('/host/settings')}
          style={{ cursor: 'pointer', border: 'none', background: 'var(--bg-tertiary)' }}
          aria-label="Go to settings"
        >
          <div className="host-topbar__avatar">{currentUser.initials}</div>
          <div className="host-topbar__user-info" style={{ textAlign: 'left' }}>
            <span className="host-topbar__user-name">{currentUser.name}</span>
            <span className="host-topbar__user-role">{currentUser.role}</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default HostTopBar;
