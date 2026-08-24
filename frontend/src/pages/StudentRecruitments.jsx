import { useState } from 'react';
import { FileText, Clock, Briefcase, CheckCircle } from 'lucide-react';
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

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {vacanciesData.map((vacancy) => (
          <div key={vacancy.id} className="host-event-card hover-lift" style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '20px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                <Briefcase size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="host-event-card__title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{vacancy.title}</h3>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {vacancy.type}
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <p className="host-event-card__desc" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '16px', color: 'var(--text-secondary)' }}>{vacancy.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>
                <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Deadline: {vacancy.deadline}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {applied[vacancy.title] ? (
                <button className="host-modal__btn" style={{ width: '100%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }} disabled>
                  <CheckCircle size={16} /> Applied
                </button>
              ) : (
                <button 
                  className="host-modal__btn host-modal__btn--primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
                  onClick={() => handleApply(vacancy.title)}
                >
                  <FileText size={14} style={{ marginRight: '8px' }} /> Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
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

export default StudentRecruitments;
