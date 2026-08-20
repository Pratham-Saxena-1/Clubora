import { useState } from 'react';
import { Plus, Briefcase, Users, CalendarCheck, UserCheck, Inbox } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostStatCard from '../components/HostStatCard';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { recruitmentStats, vacanciesData } from '../data/mockData';

function HostRecruitment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const handlePublish = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    addToast('Vacancy published successfully!', 'success');
  };

  return (
    <div className="host-recruitment">
      <HostPageHeader
        title="Recruitment Dashboard"
        subtitle="Manage vacancies, view recruitment processes, and analyze applicant profiles."
        action={
          <button className="host-recruitment__publish-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} strokeWidth={2} />
            <span>Publish Vacancy</span>
          </button>
        }
      />

      <div className="host-recruitment__stats">
        <HostStatCard
          icon={Briefcase}
          value={recruitmentStats.activeVacancies}
          label="Active Vacancies"
          colorClass="host-stat-card--info"
        />
        <HostStatCard
          icon={Users}
          value={recruitmentStats.totalApplicants}
          label="Total Applicants"
          colorClass="host-stat-card--success"
        />
        <HostStatCard
          icon={CalendarCheck}
          value={recruitmentStats.interviewsSet}
          label="Interviews Set"
          colorClass="host-stat-card--warning"
        />
        <HostStatCard
          icon={UserCheck}
          value={recruitmentStats.hiredThisMonth}
          label="Hired This Month"
          colorClass="host-stat-card--danger"
        />
      </div>

      <section className="host-recruitment__section">
        <h2 className="host-recruitment__section-title">Active Recruitment Roles</h2>
        {vacanciesData.length > 0 ? (
          <div className="host-recruitment__vacancies-grid">
            {vacanciesData.map(vacancy => (
              <div key={vacancy.id} className="host-recruitment__vacancy-card">
                <h3 className="host-recruitment__vacancy-title">{vacancy.title}</h3>
                <p className="host-recruitment__vacancy-desc">{vacancy.description}</p>
                <div className="host-recruitment__vacancy-meta">
                  <span style={{ background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{vacancy.type}</span>
                  <span>•</span>
                  <span>{vacancy.applicants} Applicants</span>
                  <span>•</span>
                  <span>Ends {vacancy.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="host-recruitment__empty">
            <Inbox size={48} strokeWidth={1.2} />
            <p className="host-recruitment__empty-text">No active recruitment roles published.</p>
            <p className="host-recruitment__empty-hint">Click &quot;Publish Vacancy&quot; to create your first role listing.</p>
          </div>
        )}
      </section>

      <HostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Vacancy"
        footer={
          <>
            <button className="host-modal__btn host-modal__btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="host-modal__btn host-modal__btn--primary" onClick={handlePublish}>Publish Role</button>
          </>
        }
      >
        <form onSubmit={handlePublish}>
          <div className="host-modal__field">
            <label className="host-modal__label">Role Title</label>
            <input type="text" className="host-modal__input" placeholder="e.g. Technical Lead" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Department / Type</label>
            <input type="text" className="host-modal__input" placeholder="e.g. Core Team" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Application Deadline</label>
            <input type="date" className="host-modal__input" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Role Description</label>
            <textarea className="host-modal__textarea" placeholder="Describe the responsibilities..." required />
          </div>
        </form>
      </HostModal>
    </div>
  );
}

export default HostRecruitment;
