import { Calendar, Pencil, Eye } from 'lucide-react';
import './HostEventCard.css';

function HostEventCard({ event }) {
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
        <span className="host-event-card__reg-badge">
          {event.registrations} REGS
        </span>
      </div>

      <div className="host-event-card__body">
        <h3 className="host-event-card__title">{event.title}</h3>
        <div className="host-event-card__date">
          <Calendar size={14} strokeWidth={1.8} />
          <span>{event.date} · {event.time}</span>
        </div>
        <p className="host-event-card__desc">{event.description}</p>

        <div className="host-event-card__footer">
          <div className="host-event-card__club">
            <div className="host-event-card__club-avatar">{event.club.shortName}</div>
            <span className="host-event-card__club-name">{event.club.name}</span>
          </div>
          <div className="host-event-card__actions">
            <button className="host-event-card__action-btn" aria-label="Edit event">
              <Pencil size={16} strokeWidth={1.8} />
            </button>
            <button className="host-event-card__action-btn" aria-label="View registrations">
              <Eye size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostEventCard;
