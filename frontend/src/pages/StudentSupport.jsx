import { useState } from 'react';
import { Send, CheckCircle, HelpCircle } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { supportCategories, allCampusClubs } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentSupport() {
  const [formData, setFormData] = useState({
    club: '',
    category: 'Event Participation',
    priority: 'Standard',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState(null);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const ref = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketRef(ref);
      setIsSubmitting(false);
      setFormData({ club: '', category: 'Event Participation', priority: 'Standard', subject: '', message: '' });
      addToast('Message sent successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Club Support"
        subtitle="Connect with the Heart of Campus Clubs."
      />

      {/* Header Banner */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '40px', marginBottom: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Help Desk</span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '12px 0 16px 0', letterSpacing: '-0.5px' }}>How can we help?</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
          Have questions about an upcoming hackathon, workshop, or recruitment cycle? Reach out directly to club organizers for rapid support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        
        {/* Main Form Area */}
        <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          {ticketRef ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '24px' }}>
                <CheckCircle size={40} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.5px' }}>Message Sent</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>Your inquiry has been received. We usually respond within 24 hours.</p>
              <div>
                <button className="host-modal__btn host-modal__btn--secondary" onClick={() => setTicketRef(null)}>
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <Send size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>New Inquiry</h3>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="host-modal__field" style={{ marginBottom: 0 }}>
                    <label className="host-modal__label">Select Organization</label>
                    <select className="host-modal__input" value={formData.club} onChange={(e) => setFormData({...formData, club: e.target.value})} required>
                      <option value="" disabled>Choose a club...</option>
                      <option value="general">General University Support</option>
                      {allCampusClubs.map(club => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="host-modal__field" style={{ marginBottom: 0 }}>
                    <label className="host-modal__label">Inquiry Category</label>
                    <select className="host-modal__input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                      {supportCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="host-modal__field" style={{ marginBottom: 0 }}>
                  <label className="host-modal__label">Priority Level</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="button"
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        borderRadius: 'var(--radius-md)', 
                        fontWeight: 600, 
                        fontSize: '14px',
                        background: formData.priority === 'Standard' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                        color: formData.priority === 'Standard' ? '#fff' : 'var(--text-tertiary)',
                        border: `1px solid ${formData.priority === 'Standard' ? '#fff' : 'transparent'}`,
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setFormData({...formData, priority: 'Standard'})}
                    >
                      Standard
                    </button>
                    <button 
                      type="button"
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        borderRadius: 'var(--radius-md)', 
                        fontWeight: 600, 
                        fontSize: '14px',
                        background: formData.priority === 'Urgent' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                        color: formData.priority === 'Urgent' ? '#fff' : 'var(--text-tertiary)',
                        border: `1px solid ${formData.priority === 'Urgent' ? '#fff' : 'transparent'}`,
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setFormData({...formData, priority: 'Urgent'})}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                <div className="host-modal__field" style={{ marginBottom: 0 }}>
                  <label className="host-modal__label">Subject Line</label>
                  <input 
                    type="text" 
                    className="host-modal__input" 
                    placeholder="Briefly describe your doubt"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>

                <div className="host-modal__field" style={{ marginBottom: 0 }}>
                  <label className="host-modal__label">Detailed Message</label>
                  <textarea 
                    className="host-modal__textarea" 
                    placeholder="How can the club help you today?"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                    <HelpCircle size={14} /> Response Time: ~24 Hours
                  </div>
                  <button type="submit" className="host-modal__btn host-modal__btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={14} style={{ marginLeft: '6px' }} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* FAQ Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '40px 32px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
              <HelpCircle size={20} style={{ color: 'var(--primary)' }} /> General FAQ
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px', fontSize: '14px' }}>How do I verify a payment?</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Submit an inquiry select the payment verification category and attach receipt details.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Recruitment drive results?</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Check 'Clubs Recruitments' or review direct inbox updates for selection sheets.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentSupport;
