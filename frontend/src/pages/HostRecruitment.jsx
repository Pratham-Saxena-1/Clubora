import { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, CalendarCheck, UserCheck, Inbox, X } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostStatCard from '../components/HostStatCard';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostRecruitment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [club, setClub] = useState(null);
  const [applicantsCount, setApplicantsCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  
  const { addToast } = useToast();

  useEffect(() => {
    fetchClubAndVacancies();
    
    // Set up polling to dynamically update stats in real-time
    const intervalId = setInterval(() => {
      fetchClubAndVacancies();
    }, 5000); // 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchClubAndVacancies = async () => {
    try {
      const clubRes = await api.get('/clubs/my-club');
      setClub(clubRes.data);
      if (clubRes.data) {
        const vacRes = await api.get(`/recruitments/club/${clubRes.data._id}`);
        setVacancies(vacRes.data);
        
        // Fetch applications for these vacancies
        const appsRes = await api.get('/applications/club');
        const apps = appsRes.data;
        setApplicantsCount(apps.length);
        
        const interviews = apps.filter(a => a.interview != null || a.status === 'Interviewed');
        setInterviewsCount(interviews.length);
        
        const hired = apps.filter(a => (a.status === 'Hired' || a.status === 'Accepted') && new Date(a.updatedAt).getMonth() === new Date().getMonth());
        setHiredCount(hired.length);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        addToast('Error fetching data', 'error');
      }
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!club) {
      addToast('Please create a club profile first', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    payload.clubId = club._id;
    
    // Convert deadline to ISO Date
    if (payload.deadline) {
      payload.deadline = new Date(payload.deadline).toISOString();
    }

    try {
      await api.post('/recruitments', payload);
      addToast('Vacancy published successfully!', 'success');
      setIsModalOpen(false);
      fetchClubAndVacancies();
    } catch (err) {
      addToast('Failed to publish vacancy', 'error');
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
    try {
      await api.delete(`/recruitments/${id}`);
      addToast('Vacancy deleted successfully!', 'success');
      fetchClubAndVacancies();
    } catch (err) {
      addToast('Failed to delete vacancy', 'error');
    }
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
          value={vacancies.length}
          label="Active Vacancies"
          colorClass="host-stat-card--info"
        />
        <HostStatCard
          icon={Users}
          value={applicantsCount}
          label="Total Applicants"
          colorClass="host-stat-card--success"
        />
        <HostStatCard
          icon={CalendarCheck}
          value={interviewsCount}
          label="Interviews Set"
          colorClass="host-stat-card--warning"
        />
        <HostStatCard
          icon={UserCheck}
          value={hiredCount}
          label="Hired This Month"
          colorClass="host-stat-card--danger"
        />
      </div>

      <section className="host-recruitment__section">
        <h2 className="host-recruitment__section-title">Active Recruitment Roles</h2>
        {vacancies.length > 0 ? (
          <div className="host-recruitment__vacancies-grid">
            {vacancies.map(vacancy => (
              <div key={vacancy._id} className="host-recruitment__vacancy-card" style={{ position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteVacancy(vacancy._id)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: '#fff', border: 'none', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                  title="Delete Vacancy"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
                <h3 className="host-recruitment__vacancy-title">{vacancy.title}</h3>
                <p className="host-recruitment__vacancy-desc">{vacancy.description}</p>
                <div className="host-recruitment__vacancy-meta">
                  <span style={{ background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{vacancy.type || 'Role'}</span>
                  <span>•</span>
                  <span>Ends {new Date(vacancy.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="host-recruitment__empty">
            <Inbox size={48} strokeWidth={1.2} />
            <p className="host-recruitment__empty-text">No active recruitment roles published.</p>
            <p className="host-recruitment__empty-hint">Click "Publish Vacancy" to create your first role listing.</p>
          </div>
        )}
      </section>

      <HostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Vacancy"
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" onClick={() => document.getElementById('recruitment-form').requestSubmit()}>Publish Role</button>
          </>
        }
      >
        <form id="recruitment-form" onSubmit={handlePublish}>
          <div className="host-modal__field">
            <label className="host-modal__label">Role Title</label>
            <input name="title" type="text" className="host-modal__input" placeholder="e.g. Technical Lead" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Department / Type</label>
            <input name="type" type="text" className="host-modal__input" placeholder="e.g. Core Team" />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Application Deadline</label>
            <input name="deadline" type="date" className="host-modal__input" required />
          </div>
          <div className="host-modal__field">
            <label className="host-modal__label">Role Description</label>
            <textarea name="description" className="host-modal__textarea" placeholder="Describe the responsibilities..." required />
          </div>

        </form>
      </HostModal>
    </div>
  );
}

export default HostRecruitment;
