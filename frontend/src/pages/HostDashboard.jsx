import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowRight, X } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostEventCard from '../components/HostEventCard';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  
  // File inputs state
  const [bannerFileName, setBannerFileName] = useState('No file chosen');
  const bannerInputRef = useRef(null);
  
  const { addToast } = useToast();

  useEffect(() => {
    fetchClubAndEvents();
  }, []);

  const fetchClubAndEvents = async () => {
    try {
      const clubRes = await api.get('/clubs/my-club');
      setClub(clubRes.data);
      if (clubRes.data) {
        const eventsRes = await api.get(`/events?clubId=${clubRes.data._id}`);
        setEvents(eventsRes.data);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        addToast('Error fetching data', 'error');
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!club) {
      addToast('Please create a club profile first', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    payload.clubId = club._id;
    payload.questions = questions; // the custom questions array

    // Basic datetime parsing for the mock input format
    payload.dateTime = new Date(payload.date + ' ' + payload.time).toISOString() || new Date().toISOString();
    
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload);
        addToast('Event updated successfully!', 'success');
      } else {
        await api.post('/events', payload);
        addToast('Event created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchClubAndEvents();
    } catch (err) {
      addToast('Failed to save event', 'error');
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleViewAll = () => {
    addToast('Showing all events in full view', 'info');
  };
  
  const openCreateModal = () => {
    setEditingEvent(null);
    setBannerFileName('No file chosen');
    setQuestions([]);
    setIsModalOpen(true);
  };
  
  const openEditModal = (event) => {
    setEditingEvent(event);
    setBannerFileName('No file chosen');
    setQuestions(event.questions || []);
    setIsModalOpen(true);
  };

  return (
    <div className="host-dashboard">
      <HostPageHeader
        title="Organizer Overview"
        subtitle={`Welcome back to ${club?.name || 'your'} management workspace. Monitor events, track registrations, and manage your club operations.`}
        action={
          <button className="host-dashboard__create-btn" onClick={openCreateModal}>
            <Plus size={18} strokeWidth={2} />
            <span>Create Event</span>
          </button>
        }
      />

      <section className="host-dashboard__section">
        <h2 className="host-dashboard__section-title">Upcoming Club Events</h2>
        <div className="host-dashboard__events-grid">
          {events.length > 0 ? events.map((event) => (
            <HostEventCard key={event._id || event.id} event={event} onEdit={openEditModal} />
          )) : (
            <div style={{ color: 'var(--text-secondary)' }}>No events created yet.</div>
          )}
        </div>
        {events.length > 0 && (
          <div className="host-dashboard__view-all">
            <button className="host-dashboard__view-all-btn" onClick={handleViewAll}>
              <span>View All Events</span>
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}
      </section>

      <HostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Create New Event'}
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={() => document.getElementById('event-form').requestSubmit()}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </>
        }
      >
        <form id="event-form" onSubmit={handleCreateSubmit}>
          <div className="host-modal__field">
            <label className="host-modal__label">Event Title</label>
            <input 
              name="title"
              type="text" 
              className="host-modal__input" 
              placeholder="e.g. Winter Gala 2024" 
              defaultValue={editingEvent?.title || ''}
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="host-modal__field" style={{ flex: 1 }}>
              <label className="host-modal__label">Date</label>
              <input 
                name="date"
                type="date" 
                className="host-modal__input" 
                required 
              />
            </div>
            <div className="host-modal__field" style={{ flex: 1 }}>
              <label className="host-modal__label">Time</label>
              <input 
                name="time"
                type="time" 
                className="host-modal__input" 
                required 
              />
            </div>
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Venue</label>
            <input 
              name="location"
              type="text" 
              className="host-modal__input" 
              placeholder="e.g. Main Auditorium"
              defaultValue={editingEvent?.location || ''}
              required 
            />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Description</label>
            <textarea 
              name="description"
              className="host-modal__textarea" 
              placeholder="Summarize the activities..." 
              defaultValue={editingEvent?.description || ''}
              required 
            />
          </div>
          
          <div className="host-modal__field">
            <label className="host-modal__label">Custom Registration Questions (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                className="host-modal__input" 
                placeholder="e.g. Dietary preferences?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuestion(); } }}
              />
              <button type="button" onClick={handleAddQuestion} style={{ padding: '0 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {questions.map((q, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '14px' }}>{q}</span>
                  <button type="button" onClick={() => handleRemoveQuestion(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="host-modal__field" style={{ marginTop: '16px' }}>
            <label className="host-modal__label" style={{ textTransform: 'none', color: 'var(--text-secondary)' }}>Event Banner (JPEG/JPG only)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button 
                type="button" 
                onClick={() => bannerInputRef.current?.click()}
                style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 'var(--font-sm)', fontWeight: 600 }}
              >
                Choose file
              </button>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{bannerFileName}</span>
              <input 
                type="file" 
                ref={bannerInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg"
                onChange={(e) => setBannerFileName(e.target.files[0]?.name || 'No file chosen')}
              />
            </div>
          </div>
        </form>
      </HostModal>
    </div>
  );
}

export default HostDashboard;
