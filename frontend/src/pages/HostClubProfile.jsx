import { useState, useEffect } from 'react';
import { Plus, Camera, Pencil, Image as ImageIcon, X, Loader2, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isPastEventModalOpen, setIsPastEventModalOpen] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [expandedPhotoIndex, setExpandedPhotoIndex] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [eventThumbnailPreview, setEventThumbnailPreview] = useState(null);
  const [eventPhotos, setEventPhotos] = useState([]);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClub();
  }, []);

  const fetchClub = async () => {
    try {
      const { data } = await api.get('/clubs/my-club');
      setClubInfo(data);
      
      const past = data.galleries || [];
      setPastEvents(past.map(g => ({
        id: g._id,
        title: g.title,
        date: g.date,
        thumbnailUrl: g.thumbnailUrl,
        images: g.images || []
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

  const handleRemoveMember = async (memberId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      const { data } = await api.delete(`/clubs/${clubInfo._id}/team-members/${memberId}`);
      setClubInfo(data);
      if (memberDetails && memberDetails._id === memberId) setMemberDetails(null);
      addToast('Team member removed', 'success');
    } catch (err) {
      addToast('Failed to remove member', 'error');
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

  const handleEventThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setEventThumbnailPreview(URL.createObjectURL(file));
    } else {
      setEventThumbnailPreview(null);
    }
  };

  const handleEventPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length > 0) {
      setEventPhotos(prev => [...prev, ...validFiles]);
    }
    e.target.value = null;
  };
  
  const removeEventPhoto = (index) => {
    setEventPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const openGallery = (evt) => {
    setGalleryEvent(evt);
    setExpandedPhotoIndex(null);
  };

  const handleUploadMore = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('galleryImages', file));
    try {
      const { data } = await api.post(`/clubs/${clubInfo._id}/galleries/${galleryEvent.id || galleryEvent._id}/images`, formData);
      setClubInfo(data);
      const updatedGallery = data.galleries.find(g => g._id === (galleryEvent.id || galleryEvent._id));
      setGalleryEvent(updatedGallery);
      fetchClub();
      addToast('Photos uploaded successfully', 'success');
    } catch (err) {
      addToast('Failed to upload photos', 'error');
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    if (!window.confirm('Are you sure you want to permanently delete this photo?')) return;
    try {
      const { data } = await api.delete(`/clubs/${clubInfo._id}/galleries/${galleryEvent.id || galleryEvent._id}/images`, { data: { imageUrl: photoUrl } });
      setClubInfo(data);
      const updatedGallery = data.galleries.find(g => g._id === (galleryEvent.id || galleryEvent._id));
      setGalleryEvent(updatedGallery);
      fetchClub();
      
      if (updatedGallery.images.length === 0) {
        setExpandedPhotoIndex(null);
      } else if (expandedPhotoIndex >= updatedGallery.images.length) {
        setExpandedPhotoIndex(updatedGallery.images.length - 1);
      }
      addToast('Photo deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete photo', 'error');
    }
  };

  const handleCreatePastEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    formData.delete('galleryImages');
    eventPhotos.forEach(file => {
      formData.append('galleryImages', file);
    });
    
    try {
      await api.post(`/clubs/${clubInfo._id}/galleries`, formData);
      
      addToast('Gallery created successfully!', 'success');
      setIsPastEventModalOpen(false);
      setEventPhotos([]);
      setEventThumbnailPreview(null);
      fetchClub(); // Refresh list
    } catch (err) {
      addToast('Failed to create gallery', 'error');
    }
  };

  const handleRemoveGallery = async (evtId) => {
    if (!window.confirm('Are you sure you want to permanently delete this past event showcase?')) return;
    try {
      await api.delete(`/clubs/${clubInfo._id}/galleries/${evtId}`);
      addToast('Past event deleted successfully!', 'success');
      fetchClub(); // Refresh list
    } catch (err) {
      addToast('Failed to delete past event', 'error');
    }
  };

  const getMembersByLevel = () => {
    const levels = {};
    (clubInfo?.teamMembers || []).forEach(m => {
      const lvl = m.level || 1;
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(m);
    });
    return Object.keys(levels).sort((a,b) => parseInt(a) - parseInt(b)).map(k => levels[k]);
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
            <div className="host-modal__field" style={{ marginBottom: 0 }}>
              <label className="host-modal__label">Instagram Handle (Optional)</label>
              <input name="instagram" type="text" className="host-modal__input" placeholder="e.g. @chessclub" />
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
              <div className="hierarchy-levels" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <div className="hierarchy-tree__content" onClick={() => setMemberDetails({ _id: clubInfo.hostId?._id, name: clubInfo.hostId?.name || 'You', role: 'President', isHost: true, photo: clubInfo.hostId?.profilePic ? `http://localhost:5000${clubInfo.hostId.profilePic}` : null })} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', minWidth: '180px' }}>
                    {clubInfo.hostId?.profilePic ? (
                      <img src={`http://localhost:5000${clubInfo.hostId.profilePic}`} alt="President" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {(clubInfo.hostId?.name || 'Y')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{clubInfo.hostId?.name || 'You'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>President</div>
                    </div>
                  </div>
                </div>
                {getMembersByLevel().map((levelMembers, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ width: '2px', height: '24px', background: 'var(--border)' }}></div>
                    
                    <div style={{ display: 'flex', position: 'relative', paddingTop: levelMembers.length > 1 ? '16px' : '0', justifyContent: 'center', width: '100%' }}>
                      {levelMembers.length > 1 && (
                        <div style={{ position: 'absolute', top: 0, left: '50%', width: `calc(100% - ${100 / levelMembers.length}%)`, transform: 'translateX(-50%)', height: '2px', background: 'var(--border)' }}></div>
                      )}
                      
                      {levelMembers.map((member, mIdx) => (
                        <div key={member._id} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', minWidth: '160px', maxWidth: '240px' }}>
                          {levelMembers.length > 1 && (
                            <div style={{ position: 'absolute', top: 0, width: '2px', height: '16px', background: 'var(--border)' }}></div>
                          )}
                          <div className="hierarchy-tree__content" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', width: '100%' }} onClick={() => setMemberDetails({ ...member, photo: member.photoUrl ? `http://localhost:5000${member.photoUrl}` : null })}>
                            <div 
                               style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#000', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--bg-primary)', zIndex: 10 }}
                               onClick={(e) => handleRemoveMember(member._id, e)}
                               title="Remove Member"
                            >
                               <X size={12} strokeWidth={3} />
                            </div>
                            {member.photoUrl ? (
                              <img src={`http://localhost:5000${member.photoUrl}`} alt={member.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                {member.name[0].toUpperCase()}
                              </div>
                            )}
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="host-club-profile__add-member" onClick={() => setIsModalOpen(true)} style={{ marginTop: 'var(--space-xl)' }}>
                <Plus size={20} strokeWidth={2} />
                <span>Add Team Member</span>
              </button>
            </div>
          </section>

          {/* Past Events Gallery View */}
          <section className="host-club-profile__card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="host-club-profile__card-title" style={{ marginBottom: 0 }}>Past Events Showcase</h2>
              <button className="host-modal__btn host-modal__btn--primary" style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center' }} onClick={() => setIsPastEventModalOpen(true)}>
                <Plus size={14} /> Add Past Event
              </button>
            </div>
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
                    {(evt.thumbnailUrl || (evt.images && evt.images.length > 0)) ? (
                      <>
                        <img src={`http://localhost:5000${evt.thumbnailUrl || evt.images[0]}`} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    
                    {/* Delete button (X) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening gallery modal
                        handleRemoveGallery(evt._id || evt.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'var(--danger)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                      aria-label="Remove Event"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
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
            <div className="host-club-profile__contacts" style={{ display: 'flex', gap: '16px' }}>
              <a href={`mailto:${clubInfo.hostId?.settings?.presidentEmail || clubInfo.hostId?.email || 'contact@' + clubInfo.name.replace(/\s+/g, '').toLowerCase() + '.edu'}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Mail size={18} strokeWidth={1.8} />
                <span>Email</span>
              </a>
              {(clubInfo.hostId?.contactNumber || clubInfo.contactNumber) && (
                <a href={`tel:${clubInfo.hostId?.contactNumber || clubInfo.contactNumber}`} className="host-club-profile__contact-tile" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Phone size={18} strokeWidth={1.8} />
                  <span>Phone</span>
                </a>
              )}
              {(clubInfo.hostId?.settings?.instagramUrl || clubInfo.instagram) && (
                <a href={clubInfo.hostId?.settings?.instagramUrl?.startsWith('http') ? clubInfo.hostId?.settings?.instagramUrl : `https://instagram.com/${(clubInfo.hostId?.settings?.instagramUrl || clubInfo.instagram)?.replace('@', '')}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
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
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={() => document.getElementById('add-member-form').requestSubmit()}>Add Member</button>
          </>
        }
      >
        <form id="add-member-form" onSubmit={handleAddMember}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Full Name</label>
              <input type="text" name="name" className="host-modal__input" placeholder="e.g. Jessica Wang" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Designation / Role</label>
              <input type="text" name="role" className="host-modal__input" placeholder="e.g. Technical Lead" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Registration No.</label>
              <input type="text" name="registrationNumber" className="host-modal__input" placeholder="e.g. 21BCE0001" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Email Address</label>
              <input type="email" name="email" className="host-modal__input" placeholder="e.g. member@clubora.com" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Contact No.</label>
              <input type="text" name="contactNumber" className="host-modal__input" placeholder="e.g. 9876543210" required />
            </div>
            <div className="host-modal__field" style={{ marginBottom: '0' }}>
              <label className="host-modal__label">Hierarchy Level</label>
              <input type="number" name="level" className="host-modal__input" placeholder="e.g. 1" min="1" required />
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
        onClose={() => { setGalleryEvent(null); setExpandedPhotoIndex(null); }}
        title={galleryEvent?.title}
      >
        {galleryEvent && (
          <div className="arc-gallery-wrapper">
            {expandedPhotoIndex !== null ? (
              <div className="arc-gallery-expanded" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative', height: '100%' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={`http://localhost:5000${galleryEvent.images[expandedPhotoIndex]}`} alt="Expanded view" className="arc-gallery-expanded-img" style={{ maxHeight: '80vh', maxWidth: '100%', display: 'block', objectFit: 'contain' }} />
                  
                  {/* Left Arrow */}
                  <button className="arc-gallery-nav-btn" onClick={(e) => { e.stopPropagation(); setExpandedPhotoIndex(prev => prev > 0 ? prev - 1 : galleryEvent.images.length - 1); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', color: '#000', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 20 }}>
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>

                  {/* Right Arrow */}
                  <button className="arc-gallery-nav-btn" onClick={(e) => { e.stopPropagation(); setExpandedPhotoIndex(prev => prev < galleryEvent.images.length - 1 ? prev + 1 : 0); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', color: '#000', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 20 }}>
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                  
                  {/* Close Cross */}
                  <button className="arc-gallery-close-btn" onClick={() => setExpandedPhotoIndex(null)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px', marginBottom: '16px' }}>
                  <label className="host-modal__btn host-modal__btn--primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '13px' }}>
                    <Plus size={14} /> Upload More Photos
                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleUploadMore} />
                  </label>
                </div>
                {(galleryEvent.images?.length > 0) ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', padding: '16px', overflowY: 'auto', flex: 1, minHeight: '300px' }}>
                    {(galleryEvent.images || []).filter(Boolean).map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                        <img 
                          src={`http://localhost:5000${img}`} 
                          alt={`Event photo ${idx+1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onClick={() => setExpandedPhotoIndex(idx)}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePhoto(img); }}
                          style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.8)', border: 'none', color: '#000', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Remove Photo"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', minHeight: '200px' }}>
                    No photos uploaded yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </HostModal>

      {/* Create Past Event Modal */}
      <HostModal
        isOpen={isPastEventModalOpen}
        onClose={() => {
          setIsPastEventModalOpen(false);
          setEventPhotos([]);
          setEventThumbnailPreview(null);
        }}
        title="Add Past Event"
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => {
              setIsPastEventModalOpen(false);
              setEventPhotos([]);
              setEventThumbnailPreview(null);
            }}>Cancel</button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={() => document.getElementById('past-event-form').requestSubmit()}>Create Folder</button>
          </>
        }
      >
        <form id="past-event-form" onSubmit={handleCreatePastEvent} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="host-modal__field" style={{ marginBottom: 0 }}>
            <label className="host-modal__label">Event Title</label>
            <input type="text" name="title" className="host-modal__input" placeholder="e.g. Summer Festival 2023" required />
          </div>
          <div className="host-modal__field" style={{ marginBottom: 0 }}>
            <label className="host-modal__label">Date (Must be in the past)</label>
            <input type="date" name="date" className="host-modal__input" max={new Date().toISOString().split('T')[0]} required />
          </div>
          <div className="host-modal__field" style={{ marginBottom: 0 }}>
            <label className="host-modal__label">Description</label>
            <textarea name="description" className="host-modal__textarea" placeholder="Describe the event..." rows={3} required />
          </div>
          <div className="host-modal__field" style={{ marginBottom: 0 }}>
            <label className="host-modal__label">Event Thumbnail</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              {eventThumbnailPreview && (
                <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={eventThumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input type="file" name="thumbnailImage" className="host-modal__input" accept="image/jpeg, image/jpg, image/png" required style={{ padding: '8px' }} onChange={handleEventThumbnailChange} />
              </div>
            </div>
          </div>
          <div className="host-modal__field" style={{ marginBottom: 0 }}>
            <label className="host-modal__label">Event Photos</label>
            <input type="file" name="galleryImages" className="host-modal__input" multiple accept="image/jpeg, image/jpg, image/png" style={{ padding: '8px' }} onChange={handleEventPhotosChange} required={eventPhotos.length === 0} />
            {eventPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {eventPhotos.map((file, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={URL.createObjectURL(file)} alt="Event Photo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeEventPhoto(idx)} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '0 0 0 4px', cursor: 'pointer', padding: '2px' }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input type="hidden" name="location" value="Past Event" />
        </form>
      </HostModal>

      {/* Member Details Modal */}
      <HostModal
        isOpen={!!memberDetails}
        onClose={() => setMemberDetails(null)}
        title="Member Details"
      >
        {memberDetails && (
          <div className="host-club-profile__member-detail-modal" style={{ position: 'relative' }}>
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
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px', marginTop: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                   <Mail size={16} />
                   <span>{memberDetails.email ? memberDetails.email : (memberDetails.isHost ? (clubInfo.hostId?.name ? `${clubInfo.hostId.name.split(' ')[0].toLowerCase()}@clubora.com` : 'you@clubora.com') : `${memberDetails.name.split(' ')[0].toLowerCase()}.${memberDetails.name.split(' ')[1] ? memberDetails.name.split(' ')[1].charAt(0).toLowerCase() : ''}@eventx.edu`)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                   <Phone size={16} />
                   <span>{memberDetails.contactNumber || 'No contact number provided'}</span>
                </div>
             </div>
          </div>
        )}
      </HostModal>
    </div>
  );
}

export default HostClubProfile;
