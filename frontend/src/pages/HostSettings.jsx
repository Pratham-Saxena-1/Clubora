import { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { clubInfo } from '../data/mockData';
import './HostSettings.css';

function HostSettings() {
  const [form, setForm] = useState({
    fullName: clubInfo.president.name,
    email: clubInfo.president.email,
    regNumber: clubInfo.president.regNumber,
    gmail: clubInfo.contacts.gmail,
    instagram: clubInfo.contacts.instagram,
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="host-settings">
      <HostPageHeader
        title="Club President & Contacts"
        subtitle="Update the Lead Organizer profile credentials and contact channels embedded in the Club Profile view."
      />

      <form className="host-settings__form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="host-settings__card">
          <h2 className="host-settings__card-title">President Profile Picture</h2>
          <div className="host-settings__photo-section">
            <div className="host-settings__photo-preview">
              <span className="host-settings__photo-initials">
                {form.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <button type="button" className="host-settings__upload-btn">
              <Upload size={16} strokeWidth={2} />
              <span>Upload JPG / JPEG</span>
            </button>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="host-settings__card">
          <h2 className="host-settings__card-title">President Information</h2>
          <div className="host-settings__fields">
            <div className="host-settings__field">
              <label className="host-settings__label" htmlFor="president-name">
                President Full Name
              </label>
              <input
                type="text"
                id="president-name"
                className="host-settings__input"
                value={form.fullName}
                onChange={handleChange('fullName')}
              />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label" htmlFor="president-email">
                President Email Address
              </label>
              <input
                type="email"
                id="president-email"
                className="host-settings__input"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label" htmlFor="president-reg">
                President Registration Number
              </label>
              <input
                type="text"
                id="president-reg"
                className="host-settings__input"
                value={form.regNumber}
                onChange={handleChange('regNumber')}
              />
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="host-settings__card">
          <h2 className="host-settings__card-title">Club Contact Channels</h2>
          <div className="host-settings__fields">
            <div className="host-settings__field">
              <label className="host-settings__label" htmlFor="club-gmail">
                Club Gmail Contact
              </label>
              <input
                type="email"
                id="club-gmail"
                className="host-settings__input"
                value={form.gmail}
                onChange={handleChange('gmail')}
              />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label" htmlFor="club-instagram">
                Instagram Profile URL
              </label>
              <input
                type="text"
                id="club-instagram"
                className="host-settings__input"
                value={form.instagram}
                onChange={handleChange('instagram')}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="host-settings__save-btn" id="save-profile">
          <Save size={18} strokeWidth={2} />
          <span>Save Profile & Contacts</span>
        </button>
      </form>
    </div>
  );
}

export default HostSettings;
