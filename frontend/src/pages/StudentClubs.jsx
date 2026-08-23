import { Users, Calendar, Award } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { allCampusClubs } from '../data/mockData';

function StudentClubs() {
  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Campus Clubs & Organizations"
        subtitle="Discover student-run clubs, browse their profiles, and find your community."
      />

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {allCampusClubs.map((club) => (
          <div key={club.id} className="host-event-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-tertiary)' }}>
                {club.shortName}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{club.name}</h3>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {club.category}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Users size={18} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{club.memberCount}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Members</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{club.eventsHosted}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Events</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Award size={18} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Active</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Status</span>
              </div>
            </div>

            <button className="host-modal__btn host-modal__btn--secondary" style={{ width: '100%' }}>
              View Full Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentClubs;
