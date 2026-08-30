import { useState, useEffect, useRef } from 'react';
import { FileText, Clock, Briefcase, CheckCircle, Loader2, X, Upload } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function StudentRecruitments() {
  const [vacancies, setVacancies] = useState([]);
  const [applied, setApplied] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Application Modal state
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [answers, setAnswers] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { addToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [vacRes, appRes] = await Promise.all([
        api.get('/recruitments'),
        api.get(`/applications/student/${user.id}`)
      ]);
      setVacancies(vacRes.data);
      
      const appliedMap = {};
      appRes.data.forEach(app => {
        appliedMap[app.recruitmentId?._id || app.recruitmentId] = true;
      });
      setApplied(appliedMap);
    } catch (err) {
      addToast('Failed to load recruitments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplication = (vacancy) => {
    setSelectedVacancy(vacancy);
    setAnswers({});
    setResumeFile(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      addToast('Please upload your resume (PDF)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('recruitmentId', selectedVacancy._id);
      
      const formattedAnswers = Object.entries(answers).map(([q, a]) => ({ question: q, answer: a }));
      formData.append('answers', JSON.stringify(formattedAnswers));
      formData.append('resume', resumeFile);

      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setApplied(prev => ({ ...prev, [selectedVacancy._id]: true }));
      addToast(`Successfully applied for ${selectedVacancy.title}!`, 'success');
      setSelectedVacancy(null);
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Club Recruitments"
        subtitle="Browse active club vacancies and apply for roles within campus organizations."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {vacancies.length > 0 ? vacancies.map((vacancy) => (
            <div key={vacancy._id} className="host-event-card hover-lift" style={{ display: 'flex', flexDirection: 'column', padding: '24px', gap: '20px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                  <Briefcase size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="host-event-card__title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{vacancy.title}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {vacancy.type || 'Role'}
                  </span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <p className="host-event-card__desc" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '16px', color: 'var(--text-secondary)' }}>{vacancy.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>
                  <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span>Deadline: {new Date(vacancy.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                {applied[vacancy._id] ? (
                  <button className="host-modal__btn" style={{ width: '100%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }} disabled>
                    <CheckCircle size={16} /> Applied
                  </button>
                ) : (
                  <button 
                    className="host-modal__btn host-modal__btn--primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}
                    onClick={() => handleOpenApplication(vacancy)}
                  >
                    <FileText size={14} style={{ marginRight: '8px' }} /> Apply Now
                  </button>
                )}
              </div>
            </div>
          )) : (
             <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                No active vacancies found. Check back later!
             </div>
          )}
        </div>
      )}

      {/* Application Form Modal */}
      {selectedVacancy && (
        <div className="host-modal__overlay" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(5, 5, 5, 0.6)' }} onClick={() => setSelectedVacancy(null)}>
          <div className="host-modal" style={{ maxWidth: '600px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Apply for {selectedVacancy.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Fill out the application form carefully.</p>
              </div>
              <button onClick={() => setSelectedVacancy(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedVacancy.questions && selectedVacancy.questions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Questionnaire</h3>
                  {selectedVacancy.questions.map((q, idx) => (
                    <div key={idx}>
                      <label className="host-modal__label">{q}</label>
                      <textarea 
                        className="host-modal__textarea" 
                        required 
                        rows={3}
                        value={answers[q] || ''}
                        onChange={(e) => setAnswers({...answers, [q]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Resume Upload</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    <Upload size={16} />
                    <span>Select PDF Resume</span>
                  </button>
                  <span style={{ fontSize: '14px', color: resumeFile ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    {resumeFile ? resumeFile.name : 'No file chosen (PDF only)'}
                  </span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="host-modal__btn host-modal__btn--secondary" style={{ flex: 1 }} onClick={() => setSelectedVacancy(null)}>Cancel</button>
                <button type="submit" className="host-modal__btn host-modal__btn--primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? <Loader2 className="spin" size={16} /> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border-color: var(--border-light) !important;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default StudentRecruitments;
