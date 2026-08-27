import { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function StudentFeedback() {
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    try {
      const { data } = await api.get('/events/registrations/student/me');
      // Assume all registered events are open for feedback for simplicity
      setEvents(data.map(reg => reg.eventId).filter(Boolean));
    } catch (err) {
      addToast('Failed to load your past events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (eventId, rating) => {
    setFeedbacks(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], rating }
    }));
  };

  const handleTextChange = (eventId, text) => {
    setFeedbacks(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], text }
    }));
  };

  const handleSubmit = async (event) => {
    const fb = feedbacks[event._id];
    if (!fb || !fb.rating) {
      addToast('Please provide a rating before submitting.', 'error');
      return;
    }
    
    try {
      const description = `Event: ${event.title}\nRating: ${fb.rating} Stars\nFeedback: ${fb.text || 'No text provided'}`;
      
      await api.post('/support', {
        type: 'Feedback',
        subject: `Feedback for ${event.title}`,
        description: description
      });

      setFeedbacks(prev => ({
        ...prev,
        [event._id]: { ...prev[event._id], submitted: true }
      }));
      addToast('Feedback submitted successfully!', 'success');
    } catch (err) {
      addToast('Failed to submit feedback', 'error');
    }
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Event Feedback"
        subtitle="Rate and review the events you have attended to help organizers improve."
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Loader2 className="spin" size={32} style={{ color: 'var(--primary)' }} />
          <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : events.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>You haven't registered for any events yet.</div>
      ) : (
        <div className="host-dashboard__events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {events.map((event) => {
            const isSubmitted = feedbacks[event._id]?.submitted;
            const currentRating = feedbacks[event._id]?.rating || 0;

            return (
              <div key={event._id} className="host-event-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{event.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.location}</span>
                </div>

                {!isSubmitted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Rating:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            style={{ cursor: 'pointer', color: star <= currentRating ? 'var(--primary)' : 'var(--text-tertiary)', fill: star <= currentRating ? 'var(--primary)' : 'none', transition: 'all 0.2s', transform: star <= currentRating ? 'scale(1.1)' : 'scale(1)' }}
                            onClick={() => handleRating(event._id, star)}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <textarea
                        className="host-modal__textarea"
                        placeholder="Write your detailed feedback here..."
                        value={feedbacks[event._id]?.text || ''}
                        onChange={(e) => handleTextChange(event._id, e.target.value)}
                        rows={4}
                        style={{ width: '100%', resize: 'none', background: 'var(--bg-tertiary)' }}
                      />
                      <MessageSquare size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                    </div>

                    <button 
                      className="host-modal__btn host-modal__btn--primary" 
                      onClick={() => handleSubmit(event)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CheckCircle size={16} /> Submit Feedback
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={24} />
                    </div>
                    <div style={{ color: '#10b981', fontSize: '15px', fontWeight: 600 }}>Feedback submitted</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Thank you for helping us improve campus events.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentFeedback;
