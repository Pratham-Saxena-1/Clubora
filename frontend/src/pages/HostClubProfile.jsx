import { useState } from 'react';
import { Plus, Camera, Pencil, Image as ImageIcon, X } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { clubInfo, teamMembers, pastEvents } from '../data/mockData';

function HostClubProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.preventDefault();
    if (photoError) {
      addToast('Please resolve photo errors before submitting.', 'error');
      return;
    }
    setIsModalOpen(false);
    setPhotoPreview(null);
    setPhotoError('');
    addToast('Team member added to hierarchy', 'success');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        setPhotoPreview(URL.createObjectURL(file));
        setPhotoError('');
      } else {
        setPhotoPreview(null);
        setPhotoError('Invalid format. Only JPEG/JPG allowed.');
      }
    } else {
      setPhotoPreview(null);
      setPhotoError('');
    }
  };

  const handleContactClick = (platform) => {
    addToast(`Opening ${platform} in new tab...`, 'info');
  };

  const openGallery = (evt) => {
    if (evt.images && evt.images.length > 0) {
      setGalleryEvent(evt);
      setExpandedPhoto(null);
    } else {
      addToast('No images uploaded for this event yet.', 'info');
    }
  };

  const renderTree = (parentId = null) => {
    const children = teamMembers.filter(m => m.parentId === parentId);
    if (!children.length) return null;
    return (
      <ul>
        {children.map(member => (
          <li key={member.id}>
            <div className="hierarchy-tree__content" onClick={() => setMemberDetails(member)}>
              {member.name}
            </div>
            {renderTree(member.id)}
          </li>
        ))}
      </ul>
    );
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
              <div className="hierarchy-tree">
                <ul>
                  <li>
                    <div className="hierarchy-tree__content hierarchy-tree__content--root" onClick={() => setMemberDetails(clubInfo.president)}>
                      {clubInfo.president.name}
                    </div>
                    {renderTree(null)}
                  </li>
                </ul>
              </div>
              <button className="host-club-profile__add-member" onClick={() => setIsModalOpen(true)} style={{ marginTop: 'var(--space-xl)' }}>
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
            </div>
            <div className="host-club-profile__contacts">
              <a href={`mailto:${clubInfo.contacts.gmail}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer">
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Gmail</span>
              </a>
              <a href={`https://instagram.com/${clubInfo.contacts.instagram.replace('@', '')}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer">
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
              <a href="tel:+15551234567" className="host-club-profile__contact-tile">
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Phone</span>
              </a>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Full Name</label>
              <input type="text" className="host-modal__input" placeholder="e.g. Jessica Wang" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Designation / Role</label>
              <input type="text" className="host-modal__input" placeholder="e.g. Technical Lead" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Registration Number</label>
              <input type="text" className="host-modal__input" placeholder="e.g. REG-2024-045" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Email ID</label>
              <input type="email" className="host-modal__input" placeholder="e.g. email@university.edu" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Date of Joining</label>
              <input type="date" className="host-modal__input" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Gender</label>
              <select className="host-modal__input" required style={{ background: 'var(--bg-tertiary)' }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Contact Number</label>
              <input type="tel" className="host-modal__input" placeholder="e.g. +1 555-0123" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Hierarchy Level</label>
              <input type="number" min="1" max="10" className="host-modal__input" placeholder="e.g. 2" required />
            </div>
          </div>
          <div className="host-modal__field" style={{ marginTop: 'var(--space-md)' }}>
            <label className="host-modal__label">Photo Upload (JPEG/JPG only, Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              {photoPreview && (
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  className="host-modal__input" 
                  accept="image/jpeg, image/jpg"
                  onChange={handlePhotoChange}
                  style={{ padding: '8px' }}
                />
                {photoError && <div style={{ color: 'var(--danger)', fontSize: 'var(--font-xs)', marginTop: '4px' }}>{photoError}</div>}
              </div>
            </div>
          </div>
        </form>
      </HostModal>

      {/* Gallery Modal */}
      <HostModal
        isOpen={!!galleryEvent}
        onClose={() => { setGalleryEvent(null); setExpandedPhoto(null); }}
        title={galleryEvent?.title}
      >
        {galleryEvent && (
          <div className="arc-gallery-wrapper">
            {expandedPhoto ? (
              <div className="arc-gallery-expanded">
                <button className="arc-gallery-close-btn" onClick={() => setExpandedPhoto(null)}>
                  <X size={24} color="#fff" />
                </button>
                <img src={expandedPhoto} alt="Expanded view" className="arc-gallery-expanded-img" />
              </div>
            ) : (
              <div className="arc-gallery">
                {galleryEvent.images?.map((img, idx) => {
                  const total = galleryEvent.images.length;
                  const middle = (total - 1) / 2;
                  const offset = idx - middle;
                  const rotation = offset * 15;
                  const translationY = Math.abs(offset) * 15;
                  
                  return (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Event photo ${idx+1}`} 
                      className="arc-gallery__item"
                      style={{
                        '--rot': `${rotation}deg`,
                        '--transY': `${translationY}px`,
                        zIndex: total - Math.abs(offset)
                      }}
                      onClick={() => setExpandedPhoto(img)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </HostModal>

      {/* Member Details Modal */}
      <HostModal
        isOpen={!!memberDetails}
        onClose={() => setMemberDetails(null)}
        title="Member Details"
      >
        {memberDetails && (
          <div className="host-club-profile__member-detail-modal">
             <div className="host-club-profile__member-avatar" style={{ width: '100px', height: '100px', margin: '0 auto var(--space-md)' }}>
               {memberDetails.photo ? (
                 <img src={memberDetails.photo} alt={memberDetails.name} className="host-club-profile__member-photo" />
               ) : (
                 <span className="host-club-profile__member-initials" style={{ fontSize: 'var(--font-3xl)' }}>
                   {memberDetails.initials || memberDetails.name.split(' ').map(n => n[0]).join('')}
                 </span>
               )}
             </div>
             <h3 className="host-club-profile__member-name" style={{ textAlign: 'center', fontSize: 'var(--font-lg)' }}>{memberDetails.name}</h3>
             <span className="host-club-profile__role-tag" style={{ display: 'block', width: 'fit-content', margin: '0 auto var(--space-lg)' }}>{memberDetails.role}</span>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> <p>{memberDetails.email}</p></div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Reg Number:</strong> <p>{memberDetails.regNumber}</p></div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Date of Joining:</strong> <p>{memberDetails.dateOfJoining || 'N/A'}</p></div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Gender:</strong> <p>{memberDetails.gender || 'N/A'}</p></div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Contact:</strong> <p>{memberDetails.contact || 'N/A'}</p></div>
             </div>
          </div>
        )}
      </HostModal>
    </div>
  );
}

export default HostClubProfile;
