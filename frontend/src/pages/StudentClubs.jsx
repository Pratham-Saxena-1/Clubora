import { useState } from 'react';
import { Users, Calendar, ArrowLeft, Image as ImageIcon, Mail, ChevronRight, X, Search } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { allCampusClubs, clubInfo, teamMembers, pastEvents } from '../data/mockData';

function StudentClubs() {
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedEventPhotos, setSelectedEventPhotos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = allCampusClubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    club.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTree = (parentId = null) => {
    const children = teamMembers.filter(m => m.parentId === parentId);
    if (!children.length) return null;
    return (
      <ul style={{ paddingLeft: parentId ? '32px' : '0', margin: 0, listStyle: 'none', position: 'relative' }}>
        {children.map(member => (
          <li key={member.id} style={{ position: 'relative', paddingTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '12px 24px', 
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600,
              cursor: 'default', zIndex: 2
            }}>
              {member.name}
            </div>
            {renderTree(member.id)}
          </li>
        ))}
      </ul>
    );
  };

  if (selectedClub) {
    // Detailed Profile View (Matching Reference Image)
    return (
      <div className="host-dashboard">
        {selectedEventPhotos && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }} onClick={() => setSelectedEventPhotos(null)}>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '24px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedEventPhotos.title} Photos</h2>
                <button onClick={() => setSelectedEventPhotos(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {selectedEventPhotos.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Event photo ${idx+1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                ))}
              </div>
            </div>
          </div>
        )}
        
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
          subtitle={selectedClub.category}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeInUp 0.3s ease both' }}>
          
          {/* About Us & Mission */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>About Us</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '800px' }}>
              {clubInfo.description}
            </p>
            
            <div style={{ background: 'var(--bg-tertiary)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Our Mission</p>
              <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                "{clubInfo.mission}"
              </p>
            </div>
          </section>

          {/* Club Hierarchy */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '40px', letterSpacing: '-0.5px', textAlign: 'center' }}>Club Hierarchy</h2>
            <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', paddingBottom: '16px' }}>
              {/* Simplified Tree Structure */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* President */}
                <div style={{ background: 'var(--primary)', color: '#000', fontSize: '14px', fontWeight: 700, padding: '12px 32px', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                  {clubInfo.president.name}
                </div>
                {/* Vertical line down */}
                <div style={{ width: '2px', height: '32px', background: 'var(--border-light)' }}></div>
                {/* Horizontal line */}
                <div style={{ width: '400px', height: '2px', background: 'var(--border-light)' }}></div>
                {/* Children Container */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
                  {/* Child 1 Branch */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '2px', height: '16px', background: 'var(--border-light)' }}></div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, padding: '12px 24px' }}>
                      Jessica Wang
                    </div>
                    <div style={{ width: '2px', height: '32px', background: 'var(--border-light)' }}></div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', padding: '10px 24px' }}>
                      David Lee
                    </div>
                  </div>
                  {/* Child 2 Branch */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '2px', height: '16px', background: 'var(--border-light)' }}></div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600, padding: '12px 24px' }}>
                      Marcus Johnson
                    </div>
                    <div style={{ width: '2px', height: '32px', background: 'var(--border-light)' }}></div>
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', padding: '10px 24px' }}>
                      Priya Patel
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Past Events Showcase */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Past Events Showcase</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {pastEvents.map(evt => (
                <div key={evt.id} style={{ position: 'relative', height: '180px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', cursor: evt.images && evt.images.length > 0 ? 'pointer' : 'default', transition: 'transform 0.2s, box-shadow 0.2s' }} onClick={() => { if (evt.images && evt.images.length > 0) setSelectedEventPhotos(evt); }} onMouseOver={e => { if (evt.images && evt.images.length > 0) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)'; } }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {evt.images && evt.images.length > 0 ? (
                    <>
                      <img src={evt.images[0]} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '6px', lineHeight: 1.4 }}>{evt.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>{evt.images.length} Photos Gallery</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                      <ImageIcon size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{evt.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Connect Contacts */}
          <section style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Connect Contacts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <a href={`mailto:${clubInfo.contacts.gmail}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                <Mail size={18} style={{ color: 'var(--primary)' }} /> Gmail
              </a>
              <a href={`https://instagram.com/${clubInfo.contacts.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg> Instagram
              </a>
              <a href="tel:+15551234567" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg> Phone
              </a>
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

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredClubs.map((club) => (
          <div 
            key={club.id} 
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
                  {club.shortName}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{club.name}</h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>
                    {club.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}><Users size={12} style={{ display: 'inline', marginRight: '4px', position: 'relative', top: '1px' }}/>Members</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{club.memberCount}</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}><Calendar size={12} style={{ display: 'inline', marginRight: '4px', position: 'relative', top: '1px' }}/>Events</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{club.eventsHosted}</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🗓️ Est. Year</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>2021</span>
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
    </div>
  );
}

export default StudentClubs;
