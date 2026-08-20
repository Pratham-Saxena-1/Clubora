import { useState, useRef } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostEventCard from '../components/HostEventCard';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { clubInfo, upcomingEvents } from '../data/mockData';

function HostDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // File inputs state
  const [bannerFileName, setBannerFileName] = useState('No file chosen');
  const [logoFileName, setLogoFileName] = useState('No file chosen');
  
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);
  
  const { addToast } = useToast();

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    addToast(editingEvent ? 'Event updated successfully!' : 'Event created successfully!', 'success');
  };

  const handleViewAll = () => {
    addToast('Showing all events in full view', 'info');
  };
  
  const openCreateModal = () => {
    setEditingEvent(null);
    setBannerFileName('No file chosen');
    setLogoFileName('No file chosen');
    setIsModalOpen(true);
  };
  
  const openEditModal = (event) => {
    setEditingEvent(event);
    setBannerFileName('No file chosen');
    setLogoFileName('No file chosen');
    setIsModalOpen(true);
  };

  return (
    <div className="host-dashboard">
      <HostPageHeader
        title="Organizer Overview"
        subtitle={`Welcome back to ${clubInfo.name} management workspace. Monitor events, track registrations, and manage your club operations.`}
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
          {upcomingEvents.map((event) => (
            <HostEventCard key={event.id} event={event} onEdit={openEditModal} />
          ))}
        </div>
        <div className="host-dashboard__view-all">
          <button className="host-dashboard__view-all-btn" onClick={handleViewAll}>
            <span>View All Events</span>
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
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
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={handleCreateSubmit}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="host-modal__field">
            <label className="host-modal__label">Event Title</label>
            <input 
              type="text" 
              className="host-modal__input" 
              placeholder="e.g. Winter Gala 2024" 
              defaultValue={editingEvent?.title || ''}
              required 
            />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Date & Time</label>
            <input 
              type="text" 
              className="host-modal__input" 
              placeholder="e.g. Nov 15, 2024 • 6:00 PM"
              defaultValue={editingEvent ? `${editingEvent.date} • ${editingEvent.time}` : ''}
              required 
            />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Description</label>
            <textarea 
              className="host-modal__textarea" 
              placeholder="Summarize the activities..." 
              defaultValue={editingEvent?.description || ''}
              required 
            />
          </div>
          
          <div className="host-modal__field">
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
          
          <div className="host-modal__field">
            <label className="host-modal__label" style={{ textTransform: 'none', color: 'var(--text-secondary)' }}>Club Logo / Club Image (JPEG/JPG only)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <button 
                type="button" 
                onClick={() => logoInputRef.current?.click()}
                style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 'var(--font-sm)', fontWeight: 600 }}
              >
                Choose file
              </button>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{logoFileName}</span>
              <input 
                type="file" 
                ref={logoInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg"
                onChange={(e) => setLogoFileName(e.target.files[0]?.name || 'No file chosen')}
              />
            </div>
          </div>
        </form>
      </HostModal>
    </div>
  );
}

export default HostDashboard;
