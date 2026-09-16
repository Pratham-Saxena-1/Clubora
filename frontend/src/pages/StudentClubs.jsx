import { useState, useEffect } from 'react';
import { Users, Calendar, ArrowLeft, Image as ImageIcon, Mail, ChevronRight, Search, Loader2, Phone, X } from 'lucide-react';
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
  const [expandedPhoto, setExpandedPhoto] = useState(null);
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

  const renderTree = (parentId = null) => {
    const children = (selectedClub?.teamMembers || []).filter(m => {
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
            <div className="hierarchy-tree__content">
              {member.name} - {member.role}
            </div>
            {renderTree(member._id)}
          </li>
        ))}
      </ul>
    );
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
                <ul>
                  <li>
                    <div className="hierarchy-tree__content hierarchy-tree__content--root">
                      {selectedClub.hostId?.name || 'President'} (President)
                    </div>
                    {renderTree(null)}
                  </li>
                </ul>
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
                            onClick={() => setExpandedPhoto(`http://localhost:5000${img}`)}
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
      </div>
    );
  }

  // Directory View
  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Campus Clubs Directory"
        subtitle="Discover student-run clubs, browse their profiles, and find your community."
      />

      <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input 
          type="text" 
          placeholder="Search clubs by name or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', padding: '12px 16px 12px 44px', background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', 
            fontSize: '14px', outline: 'none' 
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
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
        <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredClubs.map((club) => (
            <div 
              key={club._id} 
              className="host-event-card" 
              style={{ 
                padding: '0', display: 'flex', flexDirection: 'column', cursor: 'pointer',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => setSelectedClub(club)}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {/* Header Area */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 24px 16px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                    {club.name ? club.name.substring(0, 2).toUpperCase() : 'CL'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{club.name}</h3>
                    {club.categories && club.categories.length > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>
                        {club.categories[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                    <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                    {club.memberCount || 0}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Events</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                    <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
                    {club.eventsHosted || 0}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                    {club.establishedYear || new Date().getFullYear()}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Profile <ChevronRight size={16} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentClubs;
