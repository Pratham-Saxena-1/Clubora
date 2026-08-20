import { Plus, Mail, Camera, Pencil } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { clubInfo } from '../data/mockData';
import './HostClubProfile.css';

function HostClubProfile() {
  return (
    <div className="host-club-profile">
      <HostPageHeader
        title="Club Profile"
        subtitle="Manage your club's public profile, team hierarchy, and contact information."
      />

      <div className="host-club-profile__grid">
        <div className="host-club-profile__main">
          {/* Team Hierarchy */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">Manage Club Team Hierarchy</h2>
            <div className="host-club-profile__hierarchy">
              <div className="host-club-profile__member-card">
                <span className="host-club-profile__role-tag">LEAD ORGANIZER</span>
                <div className="host-club-profile__member-avatar">
                  {clubInfo.president.photo ? (
                    <img src={clubInfo.president.photo} alt={clubInfo.president.name} className="host-club-profile__member-photo" />
                  ) : (
                    <span className="host-club-profile__member-initials">
                      {clubInfo.president.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <h3 className="host-club-profile__member-name">{clubInfo.president.name}</h3>
                <p className="host-club-profile__member-detail">{clubInfo.president.regNumber}</p>
                <p className="host-club-profile__member-detail">{clubInfo.president.email}</p>
                <p className="host-club-profile__member-detail">Est. {clubInfo.established}</p>
              </div>

              <div className="host-club-profile__connector">
                <div className="host-club-profile__connector-line" />
              </div>

              <button className="host-club-profile__add-member" id="add-team-member">
                <Plus size={20} strokeWidth={2} />
                <span>Add Team Member</span>
              </button>
            </div>
          </section>

          {/* Past Events */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">Past Events Showcase</h2>
            <div className="host-club-profile__empty-state">
              <Camera size={40} strokeWidth={1.2} />
              <p className="host-club-profile__empty-text">No past events to showcase yet.</p>
              <p className="host-club-profile__empty-hint">Events will appear here after they conclude.</p>
            </div>
          </section>
        </div>

        <div className="host-club-profile__sidebar">
          {/* About Us */}
          <section className="host-club-profile__card">
            <h2 className="host-club-profile__card-title">About Us</h2>
            <p className="host-club-profile__about-text">{clubInfo.description}</p>
            <div className="host-club-profile__mission">
              <p className="host-club-profile__mission-label">Our Mission</p>
              <blockquote className="host-club-profile__mission-quote">
                &ldquo;{clubInfo.mission}&rdquo;
              </blockquote>
            </div>
            <span className="host-club-profile__category-tag">{clubInfo.category}</span>
          </section>

          {/* Connect Contacts */}
          <section className="host-club-profile__card">
            <div className="host-club-profile__card-header">
              <h2 className="host-club-profile__card-title">Connect Contacts</h2>
              <button className="host-club-profile__edit-btn" aria-label="Edit contacts">
                <Pencil size={16} strokeWidth={1.8} />
              </button>
            </div>
            <div className="host-club-profile__contacts">
              <div className="host-club-profile__contact-tile">
                <Mail size={18} strokeWidth={1.8} />
                <span>Gmail</span>
              </div>
              <div className="host-club-profile__contact-tile">
                <svg className="host-club-profile__contact-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HostClubProfile;
