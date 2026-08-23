import { useState, useRef } from 'react';
import { Upload, Save } from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import { useToast } from '../context/ToastContext';
import { currentStudent } from '../data/mockData';

function StudentSettings() {
  const [formData, setFormData] = useState({
    name: currentStudent.name,
    email: currentStudent.email,
    password: '',
    regNumber: currentStudent.regNumber,
    branch: currentStudent.branch,
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
      addToast('Profile photo selected successfully!', 'success');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Student profile settings saved successfully!', 'success');
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
              <span className="host-settings__photo-initials">PS</span>
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
            <div className="host-settings__field">
              <label className="host-settings__label">Change Password</label>
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

export default StudentSettings;
