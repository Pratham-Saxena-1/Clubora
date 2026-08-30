import { Calendar, Pencil, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

function HostEventCard({ event, onEdit, onDelete }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
    } else {
      addToast(`Editing event: ${event.title}`, 'info');
    }
  };

  const handleViewRegs = () => {
    navigate('/host/registrations');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      if (onDelete) {
        onDelete(event);
      }
    }
  };

  const formattedDate = event.dateTime ? new Date(event.dateTime).toLocaleDateString() : (event.date || 'TBA');
  const formattedTime = event.dateTime ? new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (event.time || 'TBA');

  return (
    <div className="host-event-card">
      <div className="host-event-card__cover">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="host-event-card__cover-img" />
        ) : (
          <div className="host-event-card__cover-placeholder">
            <Calendar size={32} strokeWidth={1.5} />
          </div>
        )}
        {onDelete && (
          <button 
            onClick={handleDelete}
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            aria-label="Delete event"
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>&times;</span>
          </button>
        )}
      </div>

      <div className="host-event-card__body">
        <h3 className="host-event-card__title">{event.title}</h3>
        <div className="host-event-card__date">
          <Calendar size={14} strokeWidth={1.8} />
          <span>{formattedDate} &middot; {formattedTime}</span>
        </div>
        <p className="host-event-card__desc">{event.description}</p>

        <div className="host-event-card__footer" style={{ justifyContent: 'flex-end' }}>
          <div className="host-event-card__actions">
            <button className="host-event-card__action-btn" aria-label="Edit event" onClick={handleEdit}>
              <Pencil size={14} strokeWidth={2} />
              <span>Edit</span>
            </button>
            <button className="host-event-card__action-btn" aria-label="View registrations" onClick={handleViewRegs}>
              <Eye size={14} strokeWidth={2} />
              <span>Regs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostEventCard;
