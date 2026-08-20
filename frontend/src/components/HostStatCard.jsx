import './HostStatCard.css';

function HostStatCard({ icon: Icon, value, label, colorClass }) {
  return (
    <div className={`host-stat-card ${colorClass || ''}`}>
      <div className="host-stat-card__icon-wrap">
        <Icon className="host-stat-card__icon" size={22} strokeWidth={1.8} />
      </div>
      <div className="host-stat-card__content">
        <span className="host-stat-card__value">{value}</span>
        <span className="host-stat-card__label">{label}</span>
      </div>
    </div>
  );
}

export default HostStatCard;
