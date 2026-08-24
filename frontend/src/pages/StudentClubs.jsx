import { useState } from 'react';
import { Users, Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { allCampusClubs, clubInfo, teamMembers, pastEvents } from '../data/mockData';

function StudentClubs() {
  const [selectedClub, setSelectedClub] = useState(null);

  const renderTree = (parentId = null) => {
    const children = teamMembers.filter(m => m.parentId === parentId);
    if (!children.length) return null;
    return (
      <ul>
        {children.map(member => (
          <li key={member.id}>
            <div className="hierarchy-tree__content" style={{ cursor: 'default' }}>
              {member.name}
            </div>
            {renderTree(member.id)}
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
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', transition: 'color 0.2s' }}
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

        <div className="host-club-profile__grid" style={{ animation: 'fadeInUp var(--transition-slow) ease both' }}>
          <div className="host-club-profile__main">
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
            </section>

            {/* Team Hierarchy */}
            <section className="host-club-profile__card">
              <h2 className="host-club-profile__card-title">Club Hierarchy</h2>
              <div className="host-club-profile__hierarchy">
                <div className="hierarchy-tree">
                  <ul>
                    <li>
                      <div className="hierarchy-tree__content hierarchy-tree__content--root" style={{ cursor: 'default' }}>
                        {clubInfo.president.name}
                      </div>
                      {renderTree(null)}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Past Events Gallery */}
            <section className="host-club-profile__card">
              <h2 className="host-club-profile__card-title">Past Events Showcase</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                {pastEvents.map(evt => (
                  <div key={evt.id} style={{ position: 'relative', height: '140px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
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
                        <ImageIcon size={24} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{evt.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="host-club-profile__sidebar">
            {/* Connect Contacts */}
            <section className="host-club-profile__card">
              <div className="host-club-profile__card-header">
                <h2 className="host-club-profile__card-title">Connect</h2>
              </div>
              <div className="host-club-profile__contacts">
                <a href={`mailto:${clubInfo.contacts.gmail}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>Gmail</span>
                </a>
                <a href={`https://instagram.com/${clubInfo.contacts.instagram.replace('@', '')}`} className="host-club-profile__contact-tile" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </section>
          </div>
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

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {allCampusClubs.map((club) => (
          <div 
            key={club.id} 
            className="host-event-card" 
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer' }}
            onClick={() => setSelectedClub(club)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {club.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{club.name}</h3>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'var(--accent-soft)', textTransform: 'uppercase', color: 'var(--primary)' }}>
                  {club.category}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Users size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{club.memberCount}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Members</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{club.eventsHosted}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Events</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-tertiary)' }}>🗓️</div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>2021</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Est. Year</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentClubs;
