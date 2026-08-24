import { useState } from 'react';
import { Send, Clock, Briefcase, CheckCircle } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { vacanciesData, studentApplications } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentRecruitments() {
  const [applied, setApplied] = useState(
    studentApplications.reduce((acc, app) => ({ ...acc, [app.role]: true }), {})
  );
  const { addToast } = useToast();

  const handleApply = (roleTitle) => {
    setApplied((prev) => ({ ...prev, [roleTitle]: true }));
    addToast(`Successfully applied for ${roleTitle}!`, 'success');
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Club Recruitments"
        subtitle="Browse active club vacancies and apply for roles within campus organizations."
      />

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
        {vacanciesData.map((vacancy) => (
          <div key={vacancy.id} className="host-event-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '24px', gap: '24px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}>
            
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
              <Briefcase size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 className="host-event-card__title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{vacancy.title}</h3>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {vacancy.type}
                </span>
              </div>
              <p className="host-event-card__desc" style={{ maxWidth: '700px', fontSize: '14px', lineHeight: 1.6, marginBottom: 0 }}>{vacancy.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>
                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Deadline: {vacancy.deadline}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0, minWidth: '140px' }}>
              {applied[vacancy.title] ? (
                <button className="host-modal__btn" style={{ width: '100%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled>
                  <CheckCircle size={16} /> Applied
                </button>
              ) : (
                <button 
                  className="host-modal__btn host-modal__btn--primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleApply(vacancy.title)}
                >
                  <Send size={14} style={{ marginRight: '8px' }} /> Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentRecruitments;
