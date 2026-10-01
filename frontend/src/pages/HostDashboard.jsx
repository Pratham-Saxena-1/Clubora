import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowRight, X } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostEventCard from '../components/HostEventCard';
import HostModal from '../components/HostModal';
import FormBuilder from '../components/FormBuilder';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState(null);
  const [attachForm, setAttachForm] = useState(false);
  const [formFields, setFormFields] = useState([]);
  
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
    formData.append('clubId', club._id);
    
    const isPaid = formData.get('isPaid') === 'true';
    if (!isPaid) {
      formData.set('fee', 0);
    }
    
    const dateVal = formData.get('date');
    const timeVal = formData.get('time');
    const dateTime = new Date(dateVal + ' ' + timeVal).toISOString() || new Date().toISOString();
    formData.set('dateTime', dateTime);
    
    try {
      let createdFormId = null;
      if (attachForm && formFields.length > 0) {
        // Create or update form first
        const formPayload = {
          title: `${formData.get('title')} - Registration Form`,
          description: `Registration form for ${formData.get('title')}`,
          fields: formFields
        };
        if (editingEvent?.formId) {
          await api.put(`/forms/${editingEvent.formId._id || editingEvent.formId}`, formPayload);
          createdFormId = editingEvent.formId._id || editingEvent.formId;
        } else {
          const formRes = await api.post('/forms', formPayload);
          createdFormId = formRes.data._id;
        }
      }

      if (createdFormId) {
        formData.set('formId', createdFormId);
      }
      
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData);
        addToast('Event updated successfully!', 'success');
      } else {
        await api.post('/events', formData);
        addToast('Event created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchClubAndEvents();
    } catch (err) {
      addToast('Failed to save event', 'error');
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      await api.delete(`/events/${event._id}`);
      addToast('Event deleted successfully', 'success');
      fetchClubAndEvents();
    } catch (err) {
      addToast('Failed to delete event', 'error');
    }
  };

  const handleViewAll = () => {
    addToast('Showing all events in full view', 'info');
  };
  
  const openCreateModal = () => {
    setEditingEvent(null);
    setBannerFileName('No file chosen');
    setAttachForm(false);
    setFormFields([]);
    setIsModalOpen(true);
  };
  
  const openEditModal = (event) => {
    setEditingEvent(event);
    setBannerFileName('No file chosen');
    if (event.formId) {
      setAttachForm(true);
      setFormFields(event.formId.fields || []);
    } else {
      setAttachForm(false);
      setFormFields([]);
    }
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
            <HostEventCard key={event._id || event.id} event={event} onEdit={openEditModal} onDelete={handleDeleteEvent} />
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
                defaultValue={editingEvent?.dateTime ? new Date(new Date(editingEvent.dateTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''}
                required 
              />
            </div>
            <div className="host-modal__field" style={{ flex: 1 }}>
              <label className="host-modal__label">Time</label>
              <input 
                name="time"
                type="time" 
                className="host-modal__input" 
                defaultValue={editingEvent?.dateTime ? new Date(new Date(editingEvent.dateTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[1].slice(0, 5) : ''}
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
            <label className="host-modal__label">Event Type</label>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="isPaid" 
                  value="false" 
                  defaultChecked={!editingEvent?.isPaid}
                  onChange={(e) => {
                    const feeInput = document.getElementById('event-fee-input');
                    if (feeInput) feeInput.style.display = 'none';
                  }}
                />
                <span style={{ fontSize: '14px' }}>Free Event</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="isPaid" 
                  value="true" 
                  defaultChecked={editingEvent?.isPaid}
                  onChange={(e) => {
                    const feeInput = document.getElementById('event-fee-input');
                    if (feeInput) feeInput.style.display = 'block';
                  }}
                />
                <span style={{ fontSize: '14px' }}>Paid Event</span>
              </label>
            </div>
          </div>
          
          <div className="host-modal__field" id="event-fee-input" style={{ display: editingEvent?.isPaid ? 'block' : 'none' }}>
            <label className="host-modal__label">Event Fee Amount (₹)</label>
            <input 
              name="fee"
              type="number" 
              min="0"
              className="host-modal__input" 
              placeholder="e.g. 500"
              defaultValue={editingEvent?.fee || ''}
            />
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
                name="coverImage"
                ref={bannerInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg"
                onChange={(e) => setBannerFileName(e.target.files[0]?.name || 'No file chosen')}
              />
            </div>
          </div>
          
          <div className="host-modal__field" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label className="host-modal__label" style={{ marginBottom: 0 }}>Attach Registration Form</label>
              <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={attachForm}
                  onChange={e => setAttachForm(e.target.checked)}
                />
                <span style={{ fontSize: '14px' }}>{attachForm ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
            
            {attachForm && (
              <div style={{ marginTop: '16px' }}>
                <FormBuilder fields={formFields} setFields={setFormFields} />
              </div>
            )}
          </div>
        </form>
      </HostModal>
    </div>
  );
}

export default HostDashboard;
