import { useState, useRef, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function HostSettings() {
  const { user, login } = useAuth(); // Need to update context on save if possible, or just rely on re-fetch
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    presidentEmail: '',
    instagramUrl: '',
    regNumber: '',
    contactNumber: '',
    gender: 'Male',
  });
  
  const [photoName, setPhotoName] = useState('Recommended: 200x200px JPG or PNG');
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${user.id}`);
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          contactNumber: data.contactNumber || '',
          presidentEmail: data.settings?.presidentEmail || '',
          instagramUrl: data.settings?.instagramUrl || '',
          regNumber: data.settings?.regNumber || '',
          gender: data.settings?.gender || 'Male',
        }));
      } catch (err) {
        addToast('Failed to load profile data', 'error');
      }
    };
    if (user?.id) fetchProfile();
  }, [user, addToast]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);
      
      const formData = new FormData();
      formData.append('profilePic', file);
      
      try {
        await api.post(`/users/${user.id}/profile-pic`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Photo updated successfully!', 'success');
      } catch (err) {
        addToast('Failed to update photo', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        name: formData.name,
        contactNumber: formData.contactNumber,
        settings: {
          presidentEmail: formData.presidentEmail,
          instagramUrl: formData.instagramUrl,
          regNumber: formData.regNumber,
          gender: formData.gender,
        }
        // Password update would go to a separate endpoint or require old password typically, keeping simple
      });
      addToast('Profile settings saved successfully!', 'success');
    } catch (err) {
      addToast('Failed to save settings', 'error');
    }
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
              <span className="host-settings__photo-initials">{formData.name ? formData.name.substring(0, 2).toUpperCase() : 'HO'}</span>
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
              <label className="host-settings__label">Email Address (Read-only)</label>
              <input 
                type="email" 
                className="host-settings__input" 
                value={formData.email}
                readOnly
                style={{ opacity: 0.7 }}
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
