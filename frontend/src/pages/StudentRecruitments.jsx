import { useState } from 'react';
import { Send, Clock } from 'lucide-react';
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

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: '1fr' }}>
        {vacanciesData.map((vacancy) => (
          <div key={vacancy.id} className="host-event-card" style={{ flexDirection: 'row', alignItems: 'center', padding: '20px', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 className="host-event-card__title" style={{ margin: 0 }}>{vacancy.title}</h3>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {vacancy.type}
                </span>
              </div>
              <p className="host-event-card__desc" style={{ maxWidth: '600px' }}>{vacancy.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                <Clock size={14} />
                <span>Deadline: {vacancy.deadline}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              {applied[vacancy.title] ? (
                <button className="host-modal__btn" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }} disabled>
                  Applied
                </button>
              ) : (
                <button 
                  className="host-modal__btn host-modal__btn--primary"
                  onClick={() => handleApply(vacancy.title)}
                >
                  <Send size={14} style={{ marginRight: '6px' }} /> Apply Now
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
