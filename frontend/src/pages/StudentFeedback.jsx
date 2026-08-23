import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { pastEvents } from '../data/mockData';
import { useToast } from '../context/ToastContext';

function StudentFeedback() {
  const [feedbacks, setFeedbacks] = useState({});
  const { addToast } = useToast();

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

  const handleSubmit = (eventId) => {
    const fb = feedbacks[eventId];
    if (!fb || !fb.rating) {
      addToast('Please provide a rating before submitting.', 'error');
      return;
    }
    setFeedbacks(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], submitted: true }
    }));
    addToast('Feedback submitted successfully!', 'success');
  };

  return (
    <div className="host-dashboard">
      <StudentPageHeader
        title="Event Feedback"
        subtitle="Rate and review the events you have attended to help organizers improve."
      />

      <div className="host-dashboard__events-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        {pastEvents.map((event) => {
          const isSubmitted = feedbacks[event.id]?.submitted;
          const currentRating = feedbacks[event.id]?.rating || 0;

          return (
            <div key={event.id} className="host-event-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{event.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Attended on {event.date}</span>
              </div>

              {!isSubmitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Rating:</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          style={{ cursor: 'pointer', color: star <= currentRating ? '#f59e0b' : 'var(--border)', fill: star <= currentRating ? '#f59e0b' : 'none', transition: 'all 0.2s' }}
                          onClick={() => handleRating(event.id, star)}
                        />
                      ))}
                    </div>
                  </div>

                  <textarea
                    className="host-modal__textarea"
                    placeholder="Write your detailed feedback here..."
                    value={feedbacks[event.id]?.text || ''}
                    onChange={(e) => handleTextChange(event.id, e.target.value)}
                    rows={3}
                  />

                  <button 
                    className="host-modal__btn host-modal__btn--primary" 
                    onClick={() => handleSubmit(event.id)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <MessageSquare size={16} style={{ marginRight: '6px' }} /> Submit Feedback
                  </button>
                </div>
              ) : (
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '14px', fontWeight: 600 }}>
                  Feedback successfully submitted. Thank you!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentFeedback;
