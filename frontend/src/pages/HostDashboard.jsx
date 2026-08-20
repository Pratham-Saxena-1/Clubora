import { Plus, ArrowRight } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostEventCard from '../components/HostEventCard';
import { clubInfo, upcomingEvents } from '../data/mockData';
import './HostDashboard.css';

function HostDashboard() {
  return (
    <div className="host-dashboard">
      <HostPageHeader
        title="Organizer Overview"
        subtitle={`Welcome back to ${clubInfo.name} management workspace. Monitor events, track registrations, and manage your club operations.`}
        action={
          <button className="host-dashboard__create-btn" id="create-event-btn">
            <Plus size={18} strokeWidth={2} />
            <span>Create Event</span>
          </button>
        }
      />

      <section className="host-dashboard__section">
        <h2 className="host-dashboard__section-title">Upcoming Club Events</h2>
        <div className="host-dashboard__events-grid">
          {upcomingEvents.map((event, idx) => (
            <HostEventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="host-dashboard__view-all">
          <button className="host-dashboard__view-all-btn" id="view-all-events">
            <span>View All Events</span>
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default HostDashboard;
