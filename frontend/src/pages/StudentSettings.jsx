import { useState, useRef, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function StudentSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    regNumber: '',
    branch: '',
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
          regNumber: data.settings?.regNumber || '',
          branch: data.settings?.branch || '',
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
        addToast('Profile photo updated successfully!', 'success');
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
        settings: {
          regNumber: formData.regNumber,
          branch: formData.branch,
        }
      });
      addToast('Student profile settings saved successfully!', 'success');
    } catch (err) {
      addToast('Failed to save settings', 'error');
    }
  };

  return (
    <div className="host-settings">
      <StudentPageHeader
        title="Student Profile & Settings"
        subtitle="Manage your personal details, academic information, and account security."
      />

      <form className="host-settings__form" onSubmit={handleSave}>
        <section className="host-settings__card">
          <h2 className="host-settings__card-title">Profile Information</h2>
          
          <div className="host-settings__photo-section">
            <div className="host-settings__photo-preview">
              <span className="host-settings__photo-initials">{formData.name ? formData.name.substring(0, 2).toUpperCase() : 'ST'}</span>
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
              <label className="host-settings__label">Registration Number</label>
              <input 
                type="text" 
                className="host-settings__input" 
                value={formData.regNumber} 
                onChange={(e) => setFormData({...formData, regNumber: e.target.value})} 
              />
            </div>
            <div className="host-settings__field">
              <label className="host-settings__label">Branch / Division</label>
              <input 
                type="text" 
                className="host-settings__input" 
                value={formData.branch} 
                onChange={(e) => setFormData({...formData, branch: e.target.value})} 
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

export default StudentSettings;
