import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, CheckCircle } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { upcomingEvents } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentDiscover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState({});
  const { addToast } = useToast();

  const filteredEvents = upcomingEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegister = (eventId) => {
    setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    addToast('Successfully registered for the event!', 'success');
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Discover Events"
        subtitle="Explore and register for upcoming events across the campus ecosystem."
      />

      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div className="host-topbar__search" style={{ flex: 1, maxWidth: '400px', margin: 0 }}>
          <Search className="host-topbar__search-icon" size={18} strokeWidth={1.8} />
          <input
            type="text"
            className="host-topbar__search-input"
            placeholder="Search events by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="host-modal__btn host-modal__btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="host-dashboard__events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="host-event-card">
              <div className="host-event-card__cover" style={{ height: '120px', background: 'var(--bg-tertiary)' }}>
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.title} className="host-event-card__cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="host-event-card__cover-placeholder" style={{ opacity: 0.5, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-tertiary)' }}>
                    {event.club?.shortName || 'EV'}
                  </div>
                )}
              </div>

              <div className="host-event-card__body">
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', width: 'fit-content', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {event.club?.name || 'Organizer'}
                </span>
                
                <h3 className="host-event-card__title">{event.title}</h3>
                
                <div className="host-event-card__date" style={{ marginTop: '8px' }}>
                  <Calendar size={14} strokeWidth={1.8} />
                  <span>{event.date} · {event.time}</span>
                </div>
                
                <p className="host-event-card__desc" style={{ marginTop: '8px', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>

                <div className="host-event-card__footer" style={{ justifyContent: 'space-between', marginTop: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                    {event.isPaid ? 'Paid Entry' : 'Free Entry'}
                  </span>
                  
                  {registeredEvents[event.id] ? (
                    <button className="host-modal__btn" style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '4px' }} disabled>
                      <CheckCircle size={14} /> Registered
                    </button>
                  ) : (
                    <button 
                      className="host-modal__btn host-modal__btn--primary" 
                      style={{ padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No events found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDiscover;
