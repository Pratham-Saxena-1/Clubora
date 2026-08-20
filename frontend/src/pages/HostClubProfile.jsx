import { useState } from 'react';
import { Plus, Mail, Camera, Pencil, ExternalLink, Image as ImageIcon } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { clubInfo, teamMembers, pastEvents } from '../data/mockData';

function HostClubProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    addToast('Team member added to hierarchy', 'success');
  };

  const handleContactClick = (platform) => {
    addToast(`Opening ${platform} in new tab...`, 'info');
  };

  const openGallery = (evt) => {
    if (evt.images && evt.images.length > 0) {
      setGalleryEvent(evt);
    } else {
      addToast('No images uploaded for this event yet.', 'info');
    }
  };

  return (
    <div className="host-club-profile">
      <HostPageHeader
        title="Club Profile"
        subtitle="Manage your club's public profile, team hierarchy, and contact information."
      />

      <div className="host-club-profile__grid">
        <div className="host-club-profile__main">
          {/* Team Hierarchy */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">Manage Club Team Hierarchy</h2>
            <div className="host-club-profile__hierarchy">
              
              <div className="host-club-profile__member-card">
                <span className="host-club-profile__role-tag">LEAD ORGANIZER</span>
                <div className="host-club-profile__member-avatar">
                  {clubInfo.president.photo ? (
                    <img src={clubInfo.president.photo} alt={clubInfo.president.name} className="host-club-profile__member-photo" />
                  ) : (
                    <span className="host-club-profile__member-initials">
                      {clubInfo.president.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <h3 className="host-club-profile__member-name">{clubInfo.president.name}</h3>
                <p className="host-club-profile__member-detail">{clubInfo.president.regNumber}</p>
                <p className="host-club-profile__member-detail">{clubInfo.president.email}</p>
                <p className="host-club-profile__member-detail">Est. {clubInfo.established}</p>
              </div>

              <div className="host-club-profile__connector">
                <div className="host-club-profile__connector-line" />
              </div>

              <div className="host-club-profile__team-members">
                {teamMembers.map(member => (
                  <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="host-club-profile__member-card" style={{ padding: 'var(--space-md)' }}>
                      <span className="host-club-profile__role-tag" style={{ background: 'var(--info-soft)', color: 'var(--info)' }}>{member.role.toUpperCase()}</span>
                      <h3 className="host-club-profile__member-name" style={{ fontSize: 'var(--font-sm)' }}>{member.name}</h3>
                      <p className="host-club-profile__member-detail">{member.regNumber}</p>
                    </div>
                    <div className="host-club-profile__connector">
                      <div className="host-club-profile__connector-line" style={{ height: '20px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <button className="host-club-profile__add-member" onClick={() => setIsModalOpen(true)}>
                <Plus size={20} strokeWidth={2} />
                <span>Add Team Member</span>
              </button>
            </div>
          </section>

          {/* Past Events Gallery View */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">Past Events Showcase</h2>
            {pastEvents.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                {pastEvents.map(evt => (
                  <div 
                    key={evt.id} 
                    style={{ 
                      position: 'relative', 
                      height: '140px', 
                      background: 'var(--bg-tertiary)', 
                      borderRadius: 'var(--radius-md)', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      transition: 'all var(--transition-fast)'
                    }}
                    onClick={() => openGallery(evt)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {evt.images && evt.images.length > 0 ? (
                      <>
                        <img src={evt.images[0]} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-sm)' }}>
                          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{evt.title}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{evt.images.length} Photos</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                        <ImageIcon size={24} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{evt.title}</span>
                        <span style={{ fontSize: '10px' }}>No photos</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="host-club-profile__empty-state">
                <Camera size={40} strokeWidth={1.2} />
                <p className="host-club-profile__empty-text">No past events to showcase yet.</p>
                <p className="host-club-profile__empty-hint">Events will appear here after they conclude.</p>
              </div>
            )}
          </section>
        </div>

        <div className="host-club-profile__sidebar">
          {/* About Us */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">About Us</h2>
            <p className="host-club-profile__about-text">{clubInfo.description}</p>
            <div className="host-club-profile__mission">
              <p className="host-club-profile__mission-label">Our Mission</p>
              <blockquote className="host-club-profile__mission-quote">
                &ldquo;{clubInfo.mission}&rdquo;
              </blockquote>
            </div>
            <span className="host-club-profile__category-tag">{clubInfo.category}</span>
          </section>

          {/* Connect Contacts */}
          <section className="host-club-profile__card">
            <div className="host-club-profile__card-header">
              <h2 className="host-club-profile__card-title">Connect Contacts</h2>
              <button className="host-club-profile__edit-btn" onClick={() => navigate('/host/settings')} aria-label="Edit contacts">
                <Pencil size={16} strokeWidth={1.8} />
              </button>
            </div>
            <div className="host-club-profile__contacts">
              <div className="host-club-profile__contact-tile" onClick={() => handleContactClick('Gmail')}>
                <Mail size={18} strokeWidth={1.8} />
                <span>Gmail</span>
              </div>
              <div className="host-club-profile__contact-tile" onClick={() => handleContactClick('Instagram')}>
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Member Modal */}
      <HostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Team Member"
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={handleAddMember}>Add Member</button>
          </>
        }
      >
        <form onSubmit={handleAddMember}>
          <div className="host-modal__field">
            <label className="host-modal__label">Full Name</label>
            <input type="text" className="host-modal__input" placeholder="e.g. Jessica Wang" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Role</label>
            <input type="text" className="host-modal__input" placeholder="e.g. Technical Lead" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Registration Number</label>
            <input type="text" className="host-modal__input" placeholder="e.g. REG-2024-045" required />
          </div>
        </form>
      </HostModal>

      {/* Gallery Modal */}
      <HostModal
        isOpen={!!galleryEvent}
        onClose={() => setGalleryEvent(null)}
        title={galleryEvent?.title}
      >
        {galleryEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {galleryEvent.images?.map((img, idx) => (
              <img key={idx} src={img} alt={`Event photo ${idx+1}`} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        )}
      </HostModal>
    </div>
  );
}

export default HostClubProfile;
