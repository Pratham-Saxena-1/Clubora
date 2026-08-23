import { useState } from 'react';
import { Send, Hash, MessageCircle, CheckCircle } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { supportCategories, allCampusClubs } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentSupport() {
  const [formData, setFormData] = useState({
    club: '',
    category: '',
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
      setFormData({ club: '', category: '', priority: 'Standard', subject: '', message: '' });
      addToast('Support ticket submitted successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Student Support"
        subtitle="Need help? Submit a support ticket to an organizer or club."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          {ticketRef ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', marginBottom: '16px' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Ticket Submitted</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Your inquiry has been received. We usually respond within 24 hours.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                <Hash size={18} style={{ color: 'var(--text-tertiary)' }} /> Reference: {ticketRef}
              </div>
              <div style={{ marginTop: '32px' }}>
                <button className="host-modal__btn host-modal__btn--secondary" onClick={() => setTicketRef(null)}>
                  Submit Another Ticket
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="host-modal__field">
                <label className="host-modal__label">Select Club/Organizer</label>
                <select className="host-modal__input" value={formData.club} onChange={(e) => setFormData({...formData, club: e.target.value})} required>
                  <option value="" disabled>Select a club...</option>
                  <option value="general">General University Support</option>
                  {allCampusClubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="host-modal__field">
                  <label className="host-modal__label">Category</label>
                  <select className="host-modal__input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                    <option value="" disabled>Select a category...</option>
                    {supportCategories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="host-modal__field">
                  <label className="host-modal__label">Priority</label>
                  <select className="host-modal__input" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} required>
                    <option value="Low">Low</option>
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="host-modal__field">
                <label className="host-modal__label">Subject</label>
                <input 
                  type="text" 
                  className="host-modal__input" 
                  placeholder="e.g. Issue with Hackathon registration"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>

              <div className="host-modal__field">
                <label className="host-modal__label">Message</label>
                <textarea 
                  className="host-modal__textarea" 
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="host-modal__btn host-modal__btn--primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }} disabled={isSubmitting}>
                <Send size={16} style={{ marginRight: '6px' }} /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} style={{ color: 'var(--primary)' }} /> FAQ
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>When will I get my refund?</strong>Refunds for canceled paid events take 3-5 business days.</li>
              <li><strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>How do I download my certificate?</strong>Certificates appear in your Dashboard 24 hours after event completion.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentSupport;
