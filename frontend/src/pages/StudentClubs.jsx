import { useState, useEffect } from 'react';
import { Users, Calendar, ArrowLeft, Image as ImageIcon, Mail, ChevronRight, ChevronLeft, Search, Loader2, Phone, X } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [expandedPhotoIndex, setExpandedPhotoIndex] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const { addToast } = useToast();



  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/clubs');
      setClubs(data);
    } catch (err) {
      addToast('Failed to load clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = clubs.filter(club => {
    const search = searchQuery.toLowerCase();
    const nameMatch = club.name?.toLowerCase().includes(search);
    const catMatch = club.categories?.some(c => c.toLowerCase().includes(search));
    return nameMatch || catMatch;
  });

  const getMembersByLevel = () => {
    const levels = {};
    (selectedClub?.teamMembers || []).forEach(m => {
      const lvl = m.level || 1;
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(m);
    });
    return Object.keys(levels).sort((a,b) => parseInt(a) - parseInt(b)).map(k => levels[k]);
  };

  if (selectedClub) {
    const pastEvents = (selectedClub.galleries || []).map(g => ({
      id: g._id,
      title: g.title,
      date: g.date,
      thumbnailUrl: g.thumbnailUrl,
      images: g.images || []
    }));

    // Detailed Profile View
    return (
      <div className="host-dashboard">
        <button 
          onClick={() => setSelectedClub(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', transition: 'color 0.2s', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={18} />
          Back to Directory
        </button>
        
        <StudentPageHeader
          title={selectedClub.name}
          subtitle={selectedClub.categories?.join(', ') || 'No categories'}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', animation: 'fadeInUp 0.3s ease both' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Team Hierarchy */}
            <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Club Team Hierarchy</h2>
              <div className="hierarchy-tree">
                <div className="hierarchy-levels" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflowX: 'auto', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div className="hierarchy-tree__content" onClick={() => setMemberDetails({ _id: selectedClub.hostId?._id, name: selectedClub.hostId?.name || 'President', role: 'President', isHost: true, photo: selectedClub.hostId?.profilePic ? `http://localhost:5000${selectedClub.hostId.profilePic}` : null })} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', minWidth: '180px', cursor: 'pointer' }}>
                      {selectedClub.hostId?.profilePic ? (
                        <img src={`http://localhost:5000${selectedClub.hostId.profilePic}`} alt="President" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {(selectedClub.hostId?.name || 'P')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{selectedClub.hostId?.name || 'President'}</div>
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
                            <div className="hierarchy-tree__content" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', width: '100%', cursor: 'pointer' }} onClick={() => setMemberDetails({ ...member, photo: member.photoUrl ? `http://localhost:5000${member.photoUrl}` : null })}>
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
              </div>
            </section>

            {/* Past Events Showcase */}
            <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Past Events Showcase</h2>
              {pastEvents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                  {pastEvents.map(evt => (
                    <div 
                      key={evt.id} 
                      style={{ position: 'relative', height: '140px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => setGalleryEvent(evt)}
                    >
                      {(evt.thumbnailUrl || (evt.images && evt.images.length > 0)) ? (
                        <>
                          <img src={`http://localhost:5000${evt.thumbnailUrl || evt.images[0]}`} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-sm)' }}>
                            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#fff' }}>{evt.title}</span>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{evt.images ? evt.images.length : 0} Photos</span>
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
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No past events to showcase.
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* About Us & Mission */}
            <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>About {selectedClub.name}</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px' }}>
                {selectedClub.description || 'No description available for this club.'}
              </p>
              {selectedClub.categories && selectedClub.categories.length > 0 && (
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)' }}>
                  {selectedClub.categories[0]}
                </span>
              )}
            </section>

            {/* Connect Contacts */}
            <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Connect Contacts</h2>
              <div style={{ display: 'flex', gap: '16px' }}>
                {selectedClub.hostId?.email && (
                  <a href={`mailto:${selectedClub.hostId.email}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                    <Mail size={16} /> Email
                  </a>
                )}
                {selectedClub.contactNumber && (
                  <a href={`tel:${selectedClub.contactNumber}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                    <Phone size={16} /> Phone
                  </a>
                )}
                {selectedClub.instagram && (
                  <a href={`https://instagram.com/${selectedClub.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg> Instagram
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>

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
                  {(galleryEvent.images?.length > 0) ? (
                    <div className="arc-gallery" style={{ flex: 1, minHeight: '300px' }}>
                      {(galleryEvent.images || []).filter(Boolean).map((img, idx, arr) => {
                        const total = arr.length;
                        const middle = (total - 1) / 2;
                        const offset = idx - middle;
                        const rotation = offset * 15;
                        const translationY = Math.abs(offset) * 15;
                        
                        return (
                          <img 
                            key={idx} 
                            src={`http://localhost:5000${img}`} 
                            alt={`Event photo ${idx+1}`} 
                            className="arc-gallery__item"
                            style={{
                              '--rot': `${rotation}deg`,
                              '--transY': `${translationY}px`,
                              zIndex: total - Math.abs(offset)
                            }}
                            onClick={() => setExpandedPhotoIndex(idx)}
                          />
                        );
                      })}
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
                     <span>{memberDetails.email ? memberDetails.email : (memberDetails.isHost ? (selectedClub.hostId?.name ? `${selectedClub.hostId.name.split(' ')[0].toLowerCase()}@clubora.com` : 'president@clubora.com') : `${memberDetails.name.split(' ')[0].toLowerCase()}.${memberDetails.name.split(' ')[1] ? memberDetails.name.split(' ')[1].charAt(0).toLowerCase() : ''}@eventx.edu`)}</span>
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

  // Directory View
  return (
    <div className="host-dashboard" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none', filter: 'blur(60px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none', filter: 'blur(60px)' }}></div>

      <StudentPageHeader
        title="Campus Clubs Directory"
        subtitle="Discover student-run clubs, browse their profiles, and find your community."
      />

      <div style={{ marginBottom: '40px', position: 'relative', maxWidth: '480px' }}>
        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input 
          type="text" 
          placeholder="Search clubs by name or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', padding: '16px 20px 16px 56px', background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '30px', color: 'var(--text-primary)', 
            fontSize: '15px', outline: 'none', backdropFilter: 'blur(10px)', transition: 'all 0.3s'
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)'; e.target.style.background = 'rgba(255, 255, 255, 0.05)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255, 255, 255, 0.03)'; }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
          <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filteredClubs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No clubs found.</div>
      ) : (
        <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {filteredClubs.map((club, idx) => (
            <div 
              key={club._id} 
              className="club-glass-card hover-lift"
              style={{ animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s forwards`, opacity: 0, transform: 'translateY(20px)' }}
              onClick={() => setSelectedClub(club)}
            >
              {/* Header Area */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="club-avatar-glow">
                    {club.name ? club.name.substring(0, 2).toUpperCase() : 'CL'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.2 }}>{club.name}</h3>
                    {club.categories && club.categories.length > 0 && (
                      <span className="club-category-badge">
                        {club.categories[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                    <Users size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {club.memberCount || 0}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Events</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                    <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {club.eventsHosted || 0}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                    {club.establishedYear || new Date().getFullYear()}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'flex-end', background: 'linear-gradient(0deg, rgba(212, 175, 55, 0.02) 0%, transparent 100%)' }}>
                <span className="club-view-btn">
                  View Profile <ChevronRight size={16} className="club-view-btn-icon" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .hover-lift:hover {
          transform: translateY(-6px);
        }

        .club-glass-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }
        
        .club-glass-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .club-avatar-glow {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
          box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.1), 0 0 15px rgba(212, 175, 55, 0.15);
        }

        .club-category-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: inline-block;
        }

        .club-view-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .club-glass-card:hover .club-view-btn {
          color: #fff;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .club-view-btn-icon {
          transition: transform 0.2s;
        }
        
        .club-glass-card:hover .club-view-btn-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}

export default StudentClubs;
