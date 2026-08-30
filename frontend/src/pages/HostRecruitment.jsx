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
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState('');
  
  const { addToast } = useToast();

  useEffect(() => {
    fetchClubAndVacancies();
  }, []);

  const fetchClubAndVacancies = async () => {
    try {
      const clubRes = await api.get('/clubs/my-club');
      setClub(clubRes.data);
      if (clubRes.data) {
        const vacRes = await api.get(`/recruitments/club/${clubRes.data._id}`);
        setVacancies(vacRes.data);
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
    payload.positions = positions;
    
    // Convert deadline to ISO Date
    if (payload.deadline) {
      payload.deadline = new Date(payload.deadline).toISOString();
    }

    try {
      await api.post('/recruitments', payload);
      addToast('Vacancy published successfully!', 'success');
      setIsModalOpen(false);
      setPositions([]);
      fetchClubAndVacancies();
    } catch (err) {
      addToast('Failed to publish vacancy', 'error');
    }
  };

  const handleAddPosition = () => {
    if (newPosition.trim()) {
      setPositions([...positions, newPosition.trim()]);
      setNewPosition('');
    }
  };

  const handleRemovePosition = (idx) => {
    setPositions(positions.filter((_, i) => i !== idx));
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
          value={0}
          label="Total Applicants"
          colorClass="host-stat-card--success"
        />
        <HostStatCard
          icon={CalendarCheck}
          value={0}
          label="Interviews Set"
          colorClass="host-stat-card--warning"
        />
        <HostStatCard
          icon={UserCheck}
          value={0}
          label="Hired This Month"
          colorClass="host-stat-card--danger"
        />
      </div>

      <section className="host-recruitment__section">
        <h2 className="host-recruitment__section-title">Active Recruitment Roles</h2>
        {vacancies.length > 0 ? (
          <div className="host-recruitment__vacancies-grid">
            {vacancies.map(vacancy => (
              <div key={vacancy._id} className="host-recruitment__vacancy-card">
                <h3 className="host-recruitment__vacancy-title">{vacancy.title}</h3>
                <p className="host-recruitment__vacancy-desc">{vacancy.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '12px 0' }}>
                  {(vacancy.positions || []).map((pos, idx) => (
                    <span key={idx} style={{ fontSize: '10px', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>{pos}</span>
                  ))}
                </div>
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

          <div className="host-modal__field">
            <label className="host-modal__label">Open Positions</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                className="host-modal__input" 
                placeholder="e.g. Graphic Designer"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPosition(); } }}
              />
              <button type="button" onClick={handleAddPosition} style={{ padding: '0 16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {positions.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
                  <span style={{ fontSize: '14px' }}>{p}</span>
                  <button type="button" onClick={() => handleRemovePosition(idx)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </HostModal>
    </div>
  );
}

export default HostRecruitment;
