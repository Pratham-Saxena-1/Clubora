import { useState, useEffect } from 'react';
import { Users, Calendar, ArrowLeft, Image as ImageIcon, Mail, ChevronRight, Search, Loader2 } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (selectedClub) {
      api.get(`/events?clubId=${selectedClub._id}`).then(res => {
        const past = res.data.filter(e => new Date(e.date) < new Date());
        setPastEvents(past.map(evt => ({
          id: evt._id,
          title: evt.title,
          images: evt.galleryImages?.map(img => `http://localhost:5000${img}`) || []
        })));
      }).catch(console.error);
    }
  }, [selectedClub]);

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeInUp 0.3s ease both' }}>
          
          {/* About Us & Mission */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>About Us</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '800px' }}>
              {selectedClub.description || 'No description available for this club.'}
            </p>
          </section>

          {/* Team Hierarchy */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Club Hierarchy</h2>
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
                    style={{ position: 'relative', height: '140px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}
                  >
                    {evt.images && evt.images.length > 0 ? (
                      <>
                        <img src={evt.images[0]} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-sm)' }}>
                          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#fff' }}>{evt.title}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>{evt.images.length} Photos</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                        <ImageIcon size={24} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{evt.title}</span>
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

          {/* Connect Contacts */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Connect Contacts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {selectedClub.hostId?.email && (
                <a href={`mailto:${selectedClub.hostId.email}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                  <Mail size={18} style={{ color: 'var(--primary)' }} /> {selectedClub.hostId.email}
                </a>
              )}
              {selectedClub.contactNumber && (
                <a href={`tel:${selectedClub.contactNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg> Phone
                </a>
              )}
            </div>
          </section>

        </div>
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
