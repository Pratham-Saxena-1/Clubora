import { useState } from 'react';
import { Inbox, MessageSquare, User } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { supportCategories } from '../data/mockData';
import './HostSupport.css';

function HostSupport() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="host-support">
      <HostPageHeader
        title="Helpdesk & Support Center"
        subtitle="Resolve student tickets, post coordinator-only notes, and view student profile information."
        action={
          <span className="host-support__total-badge">0 Total Tickets</span>
        }
      />

      <div className="host-support__categories">
        {supportCategories.map((cat) => (
          <button
            key={cat}
            className={`host-support__category-btn ${activeCategory === cat ? 'host-support__category-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="host-support__grid">
        {/* Left: Open Tickets */}
        <div className="host-support__panel">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Open Tickets</h3>
            <span className="host-support__count-badge">0</span>
          </div>
          <div className="host-support__panel-empty">
            <Inbox size={36} strokeWidth={1.2} />
            <p className="host-support__panel-empty-text">No open tickets in this category.</p>
          </div>
        </div>

        {/* Middle: Thread Viewer */}
        <div className="host-support__panel host-support__panel--thread">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Thread</h3>
          </div>
          <div className="host-support__panel-empty">
            <MessageSquare size={36} strokeWidth={1.2} />
            <p className="host-support__panel-empty-text">
              Select a support ticket from the database list to inspect thread logs.
            </p>
          </div>
        </div>

        {/* Right: Student Metadata */}
        <div className="host-support__panel">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Student Info</h3>
          </div>
          <div className="host-support__panel-empty">
            <User size={36} strokeWidth={1.2} />
            <p className="host-support__panel-empty-text">No active student metadata.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostSupport;
