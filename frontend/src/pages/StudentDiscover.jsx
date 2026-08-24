import { useState } from 'react';
import { Search, MapPin, X, Calendar as CalendarIcon } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { upcomingEvents } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentDiscover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entryFilter, setEntryFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState({});
  const { addToast } = useToast();

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntry = entryFilter === 'All' ? true : entryFilter === 'Free' ? !event.isPaid : event.isPaid;
    return matchesSearch && matchesEntry;
  });

  const handleRegister = (eventId) => {
    setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    addToast('Successfully registered for the event!', 'success');
    setSelectedEvent(null);
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Discover Events"
        subtitle="Explore and register for upcoming events across the campus ecosystem."
      />

      <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
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
        <select 
          className="host-modal__input" 
          style={{ width: 'auto', padding: '10px 16px', cursor: 'pointer' }}
          value={entryFilter}
          onChange={(e) => setEntryFilter(e.target.value)}
        >
          <option value="All">All Entry Types</option>
          <option value="Free">Free Events</option>
          <option value="Paid">Paid Events</option>
        </select>
      </div>

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="host-event-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {event.club?.shortName || 'EV'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {event.club?.name || 'Organizer'}
                </span>
              </div>
              
              <div className="host-event-card__cover" style={{ height: '140px', background: 'var(--bg-tertiary)' }}>
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.title} className="host-event-card__cover-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="host-event-card__cover-placeholder" style={{ opacity: 0.2, fontSize: '3rem', fontWeight: 'bold' }}>
                    {event.club?.shortName || 'EV'}
                  </div>
                )}
              </div>

              <div className="host-event-card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="host-event-card__title" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{event.title}</h3>
                
                <p className="host-event-card__desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {event.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {event.isPaid ? 'Paid Entry' : 'FREE'}
                  </span>
                  
                  {registeredEvents[event.id] ? (
                    <button className="host-modal__btn" style={{ padding: '6px 16px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }} disabled>
                      Registered
                    </button>
                  ) : (
                    <button 
                      className="host-modal__btn host-modal__btn--primary" 
                      style={{ padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      Explore & Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            No events found matching your search and filters.
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="host-modal__overlay" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(5, 5, 5, 0.6)' }} onClick={() => setSelectedEvent(null)}>
          <div className="host-modal" style={{ maxWidth: '560px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header Gradient */}
            <div style={{ height: '140px', background: 'linear-gradient(135deg, rgba(179, 141, 69, 0.4) 0%, rgba(5, 5, 5, 0.8) 100%)', position: 'relative', padding: '24px', display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => setSelectedEvent(null)} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedEvent.club?.shortName || 'EV'}
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '12px' }}>
                    {selectedEvent.club?.name || 'Category'}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{selectedEvent.title}</h2>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Entry Fee</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedEvent.isPaid ? 'Paid' : 'FREE'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Organized By</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{selectedEvent.club?.name || 'University Partner'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Event Description</span>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedEvent.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <CalendarIcon size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '13px' }}>{selectedEvent.date} • {selectedEvent.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '13px' }}>{selectedEvent.location || 'Campus Main Venue'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="host-modal__btn host-modal__btn--secondary" style={{ flex: 1 }} onClick={() => setSelectedEvent(null)}>Close</button>
                <button className="host-modal__btn host-modal__btn--primary" style={{ flex: 1 }} onClick={() => handleRegister(selectedEvent.id)}>Register Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDiscover;
