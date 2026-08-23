import { useState, useRef } from 'react';
import { Upload, Save } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { useToast } from '../context/ToastContext';
import { currentUser, clubInfo } from '../data/mockData';

function HostSettings() {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: '',
    presidentEmail: clubInfo.president.email,
    instagramUrl: clubInfo.contacts.instagram,
    regNumber: currentUser.regNumber,
    contactNumber: '+1 555-0123',
    gender: 'Male',
  });
  
  const [photoName, setPhotoName] = useState('Recommended: 200x200px JPG or PNG');
  const fileInputRef = useRef(null);
  
  const { addToast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoName(e.target.files[0].name);
      addToast('Photo selected successfully!', 'success');
    }
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
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <button type="button" className="host-settings__upload-btn" onClick={handleUploadClick}>
                <Upload size={16} strokeWidth={2} />
                <span>Upload Photo</span>
              </button>
              <span className="host-settings__file-name">{photoName}</span>
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
            <div className="host-settings__field">
              <label className="host-settings__label">President / Club Email ID</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <input type="email" className="host-settings__input" style={{ flex: 1 }} value={formData.presidentEmail} onChange={(e) => setFormData({...formData, presidentEmail: e.target.value})} />
                <a href={`mailto:${formData.presidentEmail}`} style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: 'var(--font-sm)' }}>Email Link</a>
              </div>
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Instagram URL</label>
              <input type="text" className="host-settings__input" value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">President Registration Number</label>
              <input type="text" className="host-settings__input" value={formData.regNumber} onChange={(e) => setFormData({...formData, regNumber: e.target.value})} />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Contact Number</label>
              <input type="tel" className="host-settings__input" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Gender</label>
              <select className="host-settings__input" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ background: 'var(--bg-tertiary)' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Change Password</label>
              <input type="password" className="host-settings__input" placeholder="Leave blank to keep current password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
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
