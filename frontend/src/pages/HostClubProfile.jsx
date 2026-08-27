import { useState, useEffect } from 'react';
import { Plus, Camera, Pencil, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
const teamMembers = [];
const pastEvents = [];

function HostClubProfile() {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClub();
  }, []);

  const fetchClub = async () => {
    try {
      const { data } = await api.get('/clubs/my-club');
      setClubInfo(data);
      
      const eventsRes = await api.get(`/events?clubId=${data._id}`);
      const past = eventsRes.data.filter(e => new Date(e.date) < new Date());
      setPastEvents(past.map(evt => ({
        id: evt._id,
        title: evt.title,
        images: evt.galleryImages?.map(img => `http://localhost:5000${img}`) || []
      })));
      
    } catch (err) {
      if (err.response?.status === 404) {
        setClubInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    payload.categories = payload.categories ? [payload.categories] : [];

    try {
      const { data } = await api.post('/clubs', payload);
      setClubInfo(data);
      addToast('Club registered successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Error creating club', 'error');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (photoError) {
      addToast('Please resolve photo errors before submitting.', 'error');
      return;
    }
    
    const formData = new FormData(e.target);
    try {
      const { data } = await api.post(`/clubs/${clubInfo._id}/team-members`, formData);
      setClubInfo(data);
      setIsModalOpen(false);
      setPhotoPreview(null);
      setPhotoError('');
      addToast('Team member added to hierarchy', 'success');
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Failed to add member', 'error');
    }
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

  const openGallery = (evt) => {
    if (evt.images && evt.images.length > 0) {
      setGalleryEvent(evt);
      setExpandedPhoto(null);
    } else {
      addToast('No images uploaded for this event yet.', 'info');
    }
  };

  const renderTree = (parentId = null) => {
    const children = (clubInfo.teamMembers || []).filter(m => {
      if (parentId === null) {
        return !m.parentId;
      }
      return m.parentId === parentId;
    });
    if (!children.length) return null;
    return (
      <ul>
        {children.map(member => (
          <li key={member._id}>
            <div className="hierarchy-tree__content" onClick={() => setMemberDetails({ ...member, photo: member.photoUrl ? `http://localhost:5000${member.photoUrl}` : null })}>
              {member.name}
            </div>
            {renderTree(member._id)}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // CREATE CLUB VIEW
  if (!clubInfo) {
    return (
      <div className="host-club-profile">
        <HostPageHeader
          title="Register Your Club"
          subtitle="Before you can publish events and vacancies, you must register your club details."
        />
        <section className="host-club-profile__card" style={{ maxWidth: '600px', margin: '32px auto' }}>
          <form onSubmit={handleCreateClub} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="host-modal__field" style={{ marginBottom: 0 }}>
              <label className="host-modal__label">Club Name</label>
              <input name="name" type="text" className="host-modal__input" placeholder="e.g. University Chess Club" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: 0 }}>
              <label className="host-modal__label">Description</label>
              <textarea name="description" className="host-modal__textarea" placeholder="Describe the club's mission and purpose..." rows={4} required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: 0 }}>
              <label className="host-modal__label">Category</label>
              <input name="categories" type="text" className="host-modal__input" placeholder="e.g. Sports, Technical, Arts" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: 0 }}>
              <label className="host-modal__label">Contact Number (Optional)</label>
              <input name="contactNumber" type="tel" className="host-modal__input" placeholder="e.g. +1 555-0123" />
            </div>
            <button type="submit" className="host-modal__btn host-modal__btn--primary" style={{ marginTop: '16px' }}>
              Register Club
            </button>
          </form>
        </section>
      </div>
    );
  }

  // CLUB PROFILE VIEW
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
                    <div className="hierarchy-tree__content hierarchy-tree__content--root" onClick={() => setMemberDetails({ name: clubInfo.hostId?.name || 'You', role: 'President' })}>
                      {clubInfo.hostId?.name || 'You (President)'}
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
            <h2 className="host-club-profile__card-title">About {clubInfo.name}</h2>
            <p className="host-club-profile__about-text">{clubInfo.description}</p>
            {clubInfo.categories && clubInfo.categories.length > 0 && (
               <span className="host-club-profile__category-tag" style={{ marginTop: '16px', display: 'inline-block' }}>{clubInfo.categories[0]}</span>
            )}
          </section>

          {/* Connect Contacts */}
          <section className="host-club-profile__card">
            <div className="host-club-profile__card-header">
              <h2 className="host-club-profile__card-title">Connect Contacts</h2>
            </div>
            <div className="host-club-profile__contacts">
              <a href={`mailto:contact@${clubInfo.name.replace(/\s+/g, '').toLowerCase()}.edu`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer">
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </a>
              {clubInfo.contactNumber && (
                <a href={`tel:${clubInfo.contactNumber}`} className="host-club-profile__contact-tile">
                  <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>Phone</span>
                </a>
              )}
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
              <input type="text" name="name" className="host-modal__input" placeholder="e.g. Jessica Wang" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Designation / Role</label>
              <input type="text" name="role" className="host-modal__input" placeholder="e.g. Technical Lead" required />
            </div>
          </div>
          <div className="host-modal__field" style={{ marginTop: 'var(--space-md)' }}>
            <label className="host-modal__label">Reports To (Optional)</label>
            <select name="parentId" className="host-modal__input">
              <option value="">President (Top Level)</option>
              {(clubInfo?.teamMembers || []).map(m => (
                <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
              ))}
            </select>
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
                  name="teamMemberPhoto"
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
          </div>
        )}
      </HostModal>
    </div>
  );
}

export default HostClubProfile;
