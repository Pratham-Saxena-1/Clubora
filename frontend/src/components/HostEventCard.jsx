import { Calendar, Pencil, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

function HostEventCard({ event, onEdit }) {
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
      </div>

      <div className="host-event-card__body">
        <h3 className="host-event-card__title">{event.title}</h3>
        <div className="host-event-card__date">
          <Calendar size={14} strokeWidth={1.8} />
          <span>{event.date} · {event.time}</span>
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
