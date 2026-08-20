import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { currentUser } from '../data/mockData';
import './HostTopBar.css';

function HostTopBar() {
  const { theme, toggleTheme } = useTheme();

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
          {theme === 'dark' ? (
            <Sun size={20} strokeWidth={1.8} />
          ) : (
            <Moon size={20} strokeWidth={1.8} />
          )}
        </button>

        <button className="host-topbar__icon-btn host-topbar__icon-btn--bell" aria-label="Notifications" id="notifications-btn">
          <Bell size={20} strokeWidth={1.8} />
          <span className="host-topbar__notification-dot" />
        </button>

        <div className="host-topbar__user">
          <div className="host-topbar__avatar">{currentUser.initials}</div>
          <div className="host-topbar__user-info">
            <span className="host-topbar__user-name">{currentUser.name}</span>
            <span className="host-topbar__user-role">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HostTopBar;
