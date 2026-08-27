import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function HostTopBar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  useEffect(() => {
    if (user?.id) {
      api.get('/notifications/me').then(res => setNotifications(res.data)).catch(console.error);
      api.get('/events').then(res => {
        const events = res.data.map(event => ({
          id: event._id,
          title: event.title,
          date: event.date ? new Date(event.date).toISOString().split('T')[0] : null,
          time: event.time,
          venue: event.venue
        })).filter(e => e.date);
        setUpcomingEvents(events);
      }).catch(console.error);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };
  
  const notifRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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

        <div style={{ position: 'relative' }} ref={calendarRef}>
          <button 
            className="host-topbar__icon-btn" 
            aria-label="Calendar" 
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar size={20} strokeWidth={1.8} />
          </button>
          
          {showCalendar && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
              padding: 'var(--space-md)'
            }}>
              <div className="host-calendar" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none', animation: 'none' }}>
                <div className="host-calendar__header" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h3 className="host-calendar__month" style={{ fontSize: 'var(--font-sm)', margin: 0 }}>
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="host-calendar__weekdays" style={{ gap: '2px', marginBottom: '4px' }}>
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="host-calendar__grid" style={{ gap: '2px' }}>
                  {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="host-calendar__day host-calendar__day--empty" style={{ padding: '2px', minHeight: '30px' }}></div>
                  ))}
                  {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = upcomingEvents.filter(e => e.date === dateStr);
                    const isSelected = selectedDate === dateStr;
                    return (
                      <div 
                        key={day} 
                        className={`host-calendar__day`} 
                        style={{ 
                          padding: '4px', minHeight: '30px', justifyContent: 'center', alignItems: 'center', cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                          border: dayEvents.length > 0 ? (isSelected ? '2px solid var(--primary)' : '2px solid var(--primary)') : '1px solid transparent',
                          borderRadius: dayEvents.length > 0 ? '50%' : 'var(--radius-md)',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#fff' : 'inherit'
                        }} 
                        title={dayEvents.map(e => e.title).join(', ')}
                        onClick={() => {
                          if (dayEvents.length > 0) {
                            setSelectedDate(isSelected ? null : dateStr);
                          }
                        }}
                      >
                        <span className="host-calendar__date" style={{ fontSize: '12px', color: isSelected ? '#fff' : 'inherit' }}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {selectedDate && (
                <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {`Events on ${new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                  </h4>
                  <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      const displayEvents = upcomingEvents.filter(e => e.date === selectedDate);
                      if (displayEvents.length === 0) {
                        return <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>No events scheduled.</div>;
                      }
                      return displayEvents.map(evt => (
                        <div key={evt.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{evt.time}{evt.venue ? ` • ${evt.venue}` : ''}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
                {notifications.map(n => (
                  <div key={n._id} onClick={() => !n.read && markAsRead(n._id)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'var(--bg-tertiary)', cursor: n.read ? 'default' : 'pointer' }}>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.text}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
                {notifications.length === 0 && <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>No notifications</div>}
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
          <div className="host-topbar__avatar">{user?.name ? user.name.substring(0,2).toUpperCase() : 'HO'}</div>
          <div className="host-topbar__user-info" style={{ textAlign: 'left' }}>
            <span className="host-topbar__user-name">{user?.name || 'Host'}</span>
            <span className="host-topbar__user-role">{user?.role || 'Host'}</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default HostTopBar;
