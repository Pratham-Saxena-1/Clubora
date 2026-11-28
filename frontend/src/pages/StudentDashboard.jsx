import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, UserCheck, Send, QrCode, Award, Download, ArrowRight, Telescope, Building2 } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import LatticeLoader from '../components/LatticeLoader';
import InteractiveGreetingEmblem from '../components/InteractiveGreetingEmblem';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regsRes, appsRes, certsRes] = await Promise.all([
          api.get('/events/registrations/student/me'),
          api.get(`/applications/student/${user.id}`),
          api.get('/certificates/student/me').catch(() => ({ data: [] }))
        ]);
        setRegistrations(regsRes.data);
        setApplications(appsRes.data);
        setCertificates(certsRes.data || []);
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

  const attendedEventsCount = registrations.filter(r => r.attended).length;
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;

  const earnedCertificates = useMemo(() => {
    const list = [];
    const seenCerts = new Set();

    // From registrations
    for (const reg of registrations) {
      if (reg.certificate) {
        const key = reg.eventId?._id ? reg.eventId._id.toString() : reg._id;
        seenCerts.add(key);
        list.push({
          _id: reg._id,
          eventId: reg.eventId?._id,
          title: reg.eventId?.title || 'Unknown Event',
          clubName: reg.eventId?.clubId?.name || 'Campus Club',
          date: reg.updatedAt || new Date(),
          certificate: reg.certificate,
          certDocId: null
        });
      }
    }

    // From Certificate collection (if any not already in list)
    for (const cert of certificates) {
      const key = cert.eventId?._id ? cert.eventId._id.toString() : (cert.eventId ? cert.eventId.toString() : cert._id);
      if (seenCerts.has(key)) continue;
      list.push({
        _id: cert._id,
        eventId: cert.eventId?._id || cert.eventId,
        title: cert.title || cert.eventId?.title || 'Certificate of Participation',
        clubName: cert.clubId?.name || 'Campus Club',
        date: cert.issueDate || cert.createdAt || new Date(),
        certificate: cert.fileUrl,
        certDocId: cert._id
      });
    }

    return list;
  }, [registrations, certificates]);

  const certificatesCount = earnedCertificates.length;

  const upcomingEvents = registrations
    .filter(r => r.eventId && new Date(r.eventId.dateTime) >= new Date())
    .sort((a, b) => new Date(a.eventId.dateTime) - new Date(b.eventId.dateTime));

  if (loading) {
    return (
      <div className="host-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <LatticeLoader
          status="working"
          label="Loading"
          doneLabel="Done in"
          errorLabel="Failed after"
          pattern="orbit"
          grid={3}
          shape="round"
          doneColor="#22c55e"
          errorColor="#ef4444"
          cellSize={6}
          gap={2}
          fontSize={14}
          step={90}
          idleOpacity={0.15}
          glow={false}
          glowColor=""
          showTimer
          color="#f5f5f5"
        />
      </div>
    );
  }

  // Animation delay utility
  const stagger = (idx) => ({ animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s forwards`, opacity: 0, transform: 'translateY(20px)' });

  return (
    <div className="student-dashboard" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(109, 1, 26, 0.3) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none', filter: 'blur(60px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(109, 1, 26, 0.15) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none', filter: 'blur(60px)' }}></div>

      <StudentPageHeader
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Welcome back, {user?.name?.split(' ')[0] || 'Student'}</span>
            <InteractiveGreetingEmblem />
          </div>
        }
        subtitle="Here is an overview of your campus activities, event registrations, and club engagements."
      />

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>

        {/* Stat 1 */}
        <div className="glass-card stat-card hover-lift" style={{ ...stagger(1) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Registered Events</span>
            <div className="stat-icon-wrapper primary-glow">
              <CalendarCheck size={14} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{String(registrations.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card stat-card hover-lift" style={{ ...stagger(2) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Events Attended</span>
            <div className="stat-icon-wrapper primary-glow">
              <UserCheck size={14} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{String(attendedEventsCount).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card stat-card hover-lift" style={{ ...stagger(3) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Certificates</span>
            <div className="stat-icon-wrapper primary-glow">
              <Award size={14} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{String(certificatesCount).padStart(2, '0')}</span>
            <span className="badge-glass badge-gold" style={{ marginBottom: '4px', fontSize: '9px', padding: '3px 6px' }}>Claimed</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card stat-card hover-lift" style={{ ...stagger(4) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Applications</span>
            <div className="stat-icon-wrapper primary-glow">
              <Send size={14} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <span className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{String(applications.length).padStart(2, '0')}</span>
            <span className="badge-glass badge-warning" style={{ marginBottom: '4px', fontSize: '9px', padding: '3px 6px' }}>{pendingAppsCount} Pending</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '40px' }}>

        {/* Left Column: Upcoming Events & Certificates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Upcoming Events Section */}
          <section style={{ ...stagger(5) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Upcoming Registered Events</h2>
              <button onClick={handleViewAllEvents} className="btn-text-glow">
                Browse More Events <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {upcomingEvents.length === 0 ? (
                <div className="empty-state-card glass-card hover-lift" onClick={handleViewAllEvents} style={{ gridColumn: '1 / -1', cursor: 'pointer' }}>
                  <div className="empty-icon-ring">
                    <Telescope size={32} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your calendar is wide open!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                    You haven't registered for any upcoming events yet. Discover what's happening on campus and join the fun.
                  </p>
                  <div className="btn-primary-glow">Discover Events</div>
                </div>
              ) : upcomingEvents.slice(0, 4).map((reg) => {
                const event = reg.eventId;
                if (!event) return null;

                return (
                  <div key={reg._id} className="event-glass-card hover-lift">
                    <div className="event-card-header">
                      <div className="event-avatar">
                        {event.title ? event.title.substring(0, 2).toUpperCase() : 'EV'}
                      </div>
                      <div className="event-date-pill">
                        <CalendarCheck size={12} />
                        {new Date(event.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ flex: 1, marginTop: '20px', marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>{event.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        <Building2 size={14} />
                        <span>{event.clubId?.name || 'Campus Event'}</span>
                      </div>
                    </div>
                    {reg.qrTicket ? (
                      <a href={reg.qrTicket.startsWith('data:') ? reg.qrTicket : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${reg.qrTicket}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-ticket-active">
                          <QrCode size={16} /> View QR Ticket
                        </button>
                      </a>
                    ) : (
                      <button className="btn-ticket-pending" disabled>
                        QR Pending
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Certificates Panel */}
          {
            earnedCertificates.length > 0 && (
              <section style={{ ...stagger(6) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Earned Certificates</h2>
                  <span className="badge-glass badge-gold" style={{ fontSize: '10px' }}>{certificatesCount} Total</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }} className="hide-scrollbar">
                  {earnedCertificates.map(cert => (
                    <div key={cert._id} className="cert-glass-card hover-lift">
                      <div className="cert-bg-pattern"></div>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="cert-icon-wrapper">
                          <Award size={20} />
                        </div>
                        <h4 className="cert-title">{cert.title}</h4>
                        <span className="cert-subtitle">{cert.clubName}</span>
                      </div>
                      <div className="cert-footer">
                        <span className="cert-date">{new Date(cert.date).toLocaleDateString()}</span>
                        {cert.certificate && (
                          <a href={cert.certificate.startsWith('http') ? cert.certificate : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${cert.certificate}`} target="_blank" rel="noopener noreferrer" className="cert-download-btn" title="View / Download PDF">
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

          <section style={{ ...stagger(7) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Applications</h2>
            </div>

            {applications.length === 0 ? (
              <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Send size={24} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No pending applications.</span>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '0' }}>
                {applications.map((app, idx) => {
                  const isAccepted = ['Accepted', 'Hired'].includes(app.status);
                  const isRejected = ['Rejected', 'Declined'].includes(app.status);

                  return (
                    <div key={app._id} className="app-list-item" style={{ borderBottom: idx !== applications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="app-avatar">
                          {app.recruitmentId?.clubId?.name ? app.recruitmentId.clubId.name.substring(0, 2).toUpperCase() : 'CL'}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{app.recruitmentId?.clubId?.name || 'Unknown Club'}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{app.recruitmentId?.title || 'Unknown Role'}</span>
                        </div>
                      </div>
                      <div className={`status-pill ${isAccepted ? 'status-success' : isRejected ? 'status-danger' : 'status-pending'}`}>
                        {app.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>

      <style>{`
        /* Global & Animations */
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
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Glass Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(109, 1, 26, 0.5);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(109, 1, 26, 0.25);
        }

        /* Stats Component */
        .stat-card {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
        }
        
        .stat-icon-wrapper {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .primary-glow {
          background: rgba(109, 1, 26, 0.35);
          border: 1px solid rgba(109, 1, 26, 0.6);
          box-shadow: inset 0 0 10px rgba(109, 1, 26, 0.2), 0 0 15px rgba(109, 1, 26, 0.4);
        }

        .text-gradient {
          background: linear-gradient(135deg, #FFFFFF 0%, #FF4D6D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Badges */
        .badge-glass {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
        }
        .badge-blue { background: rgba(109, 1, 26, 0.2); color: #FFFFFF; border-color: rgba(109, 1, 26, 0.4); }
        .badge-gold { background: rgba(109, 1, 26, 0.35); color: #FFFFFF; border-color: #6D011A; }
        .badge-warning { background: rgba(255, 255, 255, 0.1); color: #FFFFFF; border-color: rgba(255, 255, 255, 0.2); }

        /* Empty State */
        .empty-state-card {
          padding: 48px 32px;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(109, 1, 26, 0.15);
          border: 1px solid rgba(109, 1, 26, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 0 30px rgba(109, 1, 26, 0.3);
        }

        /* Buttons */
        .btn-text-glow {
          background: transparent;
          border: none;
          color: var(--primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-text-glow:hover {
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(109, 1, 26, 0.8);
        }

        .btn-primary-glow {
          padding: 12px 24px;
          background: #6D011A;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(109, 1, 26, 0.5);
          transition: all 0.2s;
        }
        .btn-primary-glow:hover {
          background: #8C0222;
          box-shadow: 0 6px 20px rgba(109, 1, 26, 0.8);
          transform: translateY(-2px);
        }

        /* Event Cards */
        .event-glass-card {
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .event-glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 100px;
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          pointer-events: none;
        }
        .event-glass-card:hover {
          border-color: rgba(109, 1, 26, 0.6);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(109, 1, 26, 0.15);
        }
        .event-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .event-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(109, 1, 26, 0.25);
          border: 1px solid rgba(109, 1, 26, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
        }
        .event-date-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-ticket-active {
          width: 100%;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          background: linear-gradient(135deg, #8C0222 0%, #6D011A 100%);
          border-radius: 12px;
          border: 1px solid #6D011A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(109, 1, 26, 0.4);
        }
        .btn-ticket-active:hover {
          background: #8C0222;
          box-shadow: 0 6px 16px rgba(109, 1, 26, 0.6);
        }
        .btn-ticket-pending {
          width: 100%;
          padding: 12px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-tertiary);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: not-allowed;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Certificates */
        .cert-glass-card {
          min-width: 280px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .cert-bg-pattern {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background-image: radial-gradient(rgba(109, 1, 26, 0.2) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
          pointer-events: none;
        }
        .cert-glass-card:hover {
          border-color: rgba(109, 1, 26, 0.5);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }
        .cert-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(109, 1, 26, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .cert-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .cert-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .cert-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
          position: relative;
          z-index: 1;
        }
        .cert-date {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-tertiary);
          letter-spacing: 0.5px;
        }
        .cert-download-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cert-download-btn:hover {
          background: #6D011A;
          color: #FFFFFF;
          border-color: #6D011A;
        }

        /* Applications List */
        .app-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          transition: background 0.2s;
        }
        .app-list-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .app-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .status-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .status-success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .status-pending { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}

export default StudentDashboard;
