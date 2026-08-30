import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, UserCheck, Send, QrCode, Loader2, Award, Download } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regsRes, appsRes] = await Promise.all([
          api.get('/events/registrations/student/me'),
          api.get(`/applications/student/${user.id}`)
        ]);
        setRegistrations(regsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleViewAllEvents = () => {
    navigate('/student/discover');
  };

  const attendedEventsCount = registrations.filter(r => r.paymentVerified).length;
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;
  const certificatesCount = registrations.filter(r => r.certificate).length;
  
  const upcomingEvents = registrations
    .filter(r => r.eventId && new Date(r.eventId.dateTime) >= new Date())
    .sort((a, b) => new Date(a.eventId.dateTime) - new Date(b.eventId.dateTime));

  if (loading) {
    return (
      <div className="host-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="spin" size={48} style={{ color: 'var(--primary)' }} />
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}`}
        subtitle="Here is an overview of your campus activities, event registrations, and club engagements."
      />

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Registered Events</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{String(registrations.length).padStart(2, '0')}</span>
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <CalendarCheck size={20} strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Events Attended</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{String(attendedEventsCount).padStart(2, '0')}</span>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', marginBottom: '4px' }}>
              {registrations.length > 0 ? Math.round((attendedEventsCount / registrations.length) * 100) : 0}% Rate
            </span>
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <UserCheck size={20} strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Certificates</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{String(certificatesCount).padStart(2, '0')}</span>
            <span style={{ background: 'var(--accent-soft)', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', marginBottom: '4px' }}>Claimed</span>
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <Award size={20} strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Applications Sent</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{String(applications.length).padStart(2, '0')}</span>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '12px', marginBottom: '4px' }}>{pendingAppsCount} Pending</span>
          </div>
          <div style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
            <Send size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column: Upcoming Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section className="host-dashboard__section" style={{ animationDelay: '100ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', margin: 0 }}>Upcoming Registered Events</h2>
              <button onClick={handleViewAllEvents} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Browse More Events</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {upcomingEvents.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                  You don't have any upcoming registered events.
                </div>
              ) : upcomingEvents.slice(0, 4).map((reg) => {
                const event = reg.eventId;
                if (!event) return null;
                
                return (
                  <div key={reg._id} style={{ aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} className="hover-lift" onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
                        {event.title ? event.title.substring(0, 2).toUpperCase() : 'EV'}
                      </div>
                    </div>
                    <div style={{ flex: 1, marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>{event.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        <CalendarCheck size={14} />
                        <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {reg.qrTicket ? (
                      <a href={`http://localhost:5000${reg.qrTicket}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--accent-soft)', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseOver={e => e.currentTarget.style.opacity = 0.8} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                          <QrCode size={14} /> View QR Ticket
                        </button>
                      </a>
                    ) : (
                      <button style={{ width: '100%', padding: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', borderRadius: '8px', border: 'none', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        QR Pending
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Certificates Panel */}
          {registrations.filter(r => r.certificate).length > 0 && (
            <section className="host-dashboard__section" style={{ animationDelay: '200ms' }}>
              <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Earned Certificates</h2>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {registrations.filter(r => r.certificate).map(reg => (
                  <div key={reg._id} style={{ minWidth: '260px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} className="hover-lift">
                    <div>
                      <Award size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>{reg.eventId?.title || 'Unknown Event'}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{reg.eventId?.clubId?.name || 'Unknown Club'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{new Date(reg.updatedAt).toLocaleDateString()}</span>
                      {reg.certificate && (
                        <a href={`http://localhost:5000${reg.certificate}`} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <Download size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section className="host-dashboard__section" style={{ animationDelay: '150ms' }}>
            <h2 className="host-dashboard__section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>My Applications</h2>
            {applications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                You haven't applied to any recruitments yet.
              </div>
            ) : (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                {applications.map((app, idx) => (
                  <div key={app._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: idx !== applications.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {app.recruitmentId?.clubId?.name ? app.recruitmentId.clubId.name.substring(0, 2).toUpperCase() : 'CL'}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{app.recruitmentId?.clubId?.name || 'Unknown Club'}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{app.recruitmentId?.title || 'Unknown Role'}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: app.status === 'Accepted' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : 'var(--text-tertiary)' }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
