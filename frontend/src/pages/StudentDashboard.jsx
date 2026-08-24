import { CalendarCheck, Download, Award, ArrowRight, Bell } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { currentStudent, studentRegisteredEvents, studentCertificates, studentApplications } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();

  const handleViewAllEvents = () => {
    navigate('/student/discover');
  };

  const latestUpdates = [
    { id: 1, text: 'Venue changed for Web3 Hackathon 2026 to Innovation Lab.', time: '2 hours ago' },
    { id: 2, text: 'TechVerse Club accepted your application for Technical Lead.', time: '5 hours ago' },
    { id: 3, text: 'Entry passes are now available for AI & Machine Learning Workshop.', time: '1 day ago' }
  ];

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title={`Welcome back, ${currentStudent.name.split(' ')[0]}`}
        subtitle="Here is an overview of your campus activities, event registrations, and club engagements."
      />

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column: Certificates & Updates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Certificates Panel */}
          <section className="host-dashboard__section" style={{ animationDelay: '100ms' }}>
            <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Certificates</h2>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {studentCertificates.map(cert => (
                <div key={cert.id} style={{ minWidth: '260px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} className="hover-lift">
                  <div>
                    <Award size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>{cert.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cert.club}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{cert.date}</span>
                    <button style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ minWidth: '260px', background: 'transparent', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <span style={{ fontSize: '24px', marginBottom: '8px' }}>+</span>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Complete more events<br />to earn certificates</span>
              </div>
            </div>
          </section>

          {/* Latest Updates */}
          <section className="host-dashboard__section" style={{ animationDelay: '200ms' }}>
            <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Latest Updates</h2>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {latestUpdates.map((update, idx) => (
                <div key={update.id} style={{ display: 'flex', gap: '16px', padding: '16px 20px', borderBottom: idx !== latestUpdates.length - 1 ? '1px solid var(--border)' : 'none', background: idx === 0 ? 'rgba(179, 141, 69, 0.05)' : 'transparent' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 0 ? 'var(--primary)' : 'var(--text-secondary)', flexShrink: 0 }}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.5 }}>{update.text}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{update.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Applications & Upcoming Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Applications Panel */}
          <section className="host-dashboard__section" style={{ animationDelay: '150ms' }}>
            <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Applications</h2>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              {studentApplications.map((app, idx) => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: idx !== studentApplications.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {app.club.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{app.club}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.role}</span>
                    </div>
                  </div>
                  <button style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', padding: '6px 12px', background: 'var(--accent-soft)', borderRadius: '4px' }}>
                    View
                  </button>
                </div>
              ))}
              <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <button style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} onClick={() => navigate('/student/recruitments')}>
                  View All Applications <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* Upcoming Registered Events (Mini List) */}
          <section className="host-dashboard__section" style={{ animationDelay: '250ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', margin: 0 }}>Upcoming Events</h2>
              <button style={{ fontSize: '12px', color: 'var(--primary)' }} onClick={handleViewAllEvents}>See all</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {studentRegisteredEvents.slice(0, 2).map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {event.clubLogo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{event.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      <CalendarCheck size={12} />
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border-color: var(--border-light) !important;
        }
      `}</style>
    </div>
  );
}

export default StudentDashboard;
