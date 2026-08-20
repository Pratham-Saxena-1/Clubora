import { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { useToast } from '../context/ToastContext';
import { currentUser } from '../data/mockData';

function HostSettings() {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: '',
  });
  const { addToast } = useToast();

  const handleUploadClick = () => {
    addToast('Simulating file upload...', 'info');
  };

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Profile settings saved successfully!', 'success');
  };

  return (
    <div className="host-settings">
      <HostPageHeader
        title="Settings & Preferences"
        subtitle="Manage your personal host account details, security settings, and notification preferences."
      />

      <form className="host-settings__form" onSubmit={handleSave}>
        <section className="host-settings__card">
          <h2 className="host-settings__card-title">Profile Information</h2>
          
          <div className="host-settings__photo-section">
            <div className="host-settings__photo-preview">
              <span className="host-settings__photo-initials">{currentUser.initials}</span>
            </div>
            <div className="host-settings__photo-info">
              <button type="button" className="host-settings__upload-btn" onClick={handleUploadClick}>
                <Upload size={16} strokeWidth={2} />
                <span>Upload Photo</span>
              </button>
              <span className="host-settings__file-name">Recommended: 200x200px JPG or PNG</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-xl)' }} className="host-settings__fields">
            <div className="host-settings__field">
              <label className="host-settings__label">Full Name</label>
              <input 
                type="text" 
                className="host-settings__input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Email Address</label>
              <input 
                type="email" 
                className="host-settings__input" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </section>

        <section className="host-settings__card">
          <h2 className="host-settings__card-title">Security</h2>
          <div className="host-settings__fields">
            <div className="host-settings__field">
              <label className="host-settings__label">New Password</label>
              <input 
                type="password" 
                className="host-settings__input" 
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
        </section>

        <button type="submit" className="host-settings__save-btn">
          <Save size={18} strokeWidth={2} />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}

export default HostSettings;
