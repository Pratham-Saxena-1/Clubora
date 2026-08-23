import { CalendarCheck, UserCheck, Award, Send, ArrowRight } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import HostStatCard from '../components/HostStatCard';
import { currentStudent, studentStats, studentRegisteredEvents } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();

  const stats = [
    { id: 1, value: studentStats.registeredEvents, label: 'Registered Events', icon: CalendarCheck, colorClass: 'host-stat-card--purple' },
    { id: 2, value: studentStats.eventsAttended, label: 'Events Attended', icon: UserCheck, colorClass: 'host-stat-card--blue' },
    { id: 3, value: studentStats.certificatesClaimed, label: 'Certificates Claimed', icon: Award, colorClass: 'host-stat-card--green' },
    { id: 4, value: studentStats.applicationsSent, label: 'Applications Sent', icon: Send, colorClass: 'host-stat-card--orange' },
  ];

  const handleViewAllEvents = () => {
    navigate('/student/discover');
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title={`Welcome back, ${currentStudent.name.split(' ')[0]}`}
        subtitle="Here is an overview of your campus activities, event registrations, and club engagements."
      />

      <section className="host-dashboard__section">
        <div className="host-dashboard__stats-grid">
          {stats.map((stat) => (
            <HostStatCard
              key={stat.id}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              colorClass={stat.colorClass}
            />
          ))}
        </div>
      </section>

      <section className="host-dashboard__section">
        <h2 className="host-dashboard__section-title">Upcoming Registered Events</h2>
        
        {studentRegisteredEvents.length > 0 ? (
          <div className="host-dashboard__events-grid">
            {studentRegisteredEvents.map((event) => (
              <div key={event.id} className="host-event-card">
                <div className="host-event-card__cover" style={{ height: '100px', background: 'var(--bg-tertiary)' }}>
                  <div className="host-event-card__cover-placeholder" style={{ opacity: 0.5, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-tertiary)' }}>
                    {event.clubLogo}
                  </div>
                </div>

                <div className="host-event-card__body">
                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: event.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: event.status === 'CONFIRMED' ? '#10b981' : '#f59e0b', width: 'fit-content', marginBottom: '8px' }}>
                    {event.status}
                  </span>
                  <h3 className="host-event-card__title">{event.title}</h3>
                  <div className="host-event-card__date" style={{ marginTop: '8px' }}>
                    <CalendarCheck size={14} strokeWidth={1.8} />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <p className="host-event-card__desc" style={{ marginTop: '4px' }}>Location: {event.location}</p>

                  <div className="host-event-card__footer" style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button className="host-modal__btn host-modal__btn--primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      View Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't registered for any upcoming events.</p>
          </div>
        )}

        <div className="host-dashboard__view-all" style={{ marginTop: '16px' }}>
          <button className="host-dashboard__view-all-btn" onClick={handleViewAllEvents}>
            <span>Discover More Events</span>
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
