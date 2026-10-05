import { useState, useRef, useEffect } from 'react';
import { Upload, Save, AlertTriangle } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostModal from '../components/HostModal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function HostSettings() {
  const { user, login, logout, updateUser } = useAuth(); // Need to update context on save if possible, or just rely on re-fetch
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    presidentEmail: '',
    instagramUrl: '',
    regNumber: '',
    contactNumber: '',
    gender: 'Male',
    profilePic: '',
  });
  
  const [photoName, setPhotoName] = useState('Recommended: 200x200px JPG or PNG');
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [manageTab, setManageTab] = useState('password'); 
  const [pwEmail, setPwEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [delEmail, setDelEmail] = useState('');
  const [delPassword, setDelPassword] = useState('');
  const [delConfirm, setDelConfirm] = useState('');

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
          profilePic: data.profilePic || '',
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
        const res = await api.post(`/users/${user.id}/profile-pic`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData(prev => ({ ...prev, profilePic: res.data.profilePic }));
        if (updateUser) updateUser({ profilePic: res.data.profilePic });
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
      if (updateUser) updateUser({ name: formData.name });
      addToast('Profile settings saved successfully!', 'success');
    } catch (err) {
      addToast('Failed to save settings', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}/password`, { email: pwEmail, newPassword });
      addToast('Password changed successfully', 'success');
      setManageModalOpen(false);
      setPwEmail('');
      setNewPassword('');
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Failed to change password', 'error');
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (delConfirm !== 'DELETE THIS ACCOUNT FOR ME') {
      return addToast('Please type the exact confirmation phrase.', 'error');
    }
    try {
      // Verify credentials first
      await api.post('/auth/login', { email: delEmail, password: delPassword });
      
      await api.delete(`/users/${user.id}`);
      addToast('Account deleted successfully', 'success');
      logout();
    } catch (err) {
      addToast('Invalid credentials or failed to delete account', 'error');
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
              {formData.profilePic ? (
                <img src={`http://localhost:5000${formData.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span className="host-settings__photo-initials">{formData.name ? formData.name.substring(0, 2).toUpperCase() : 'HO'}</span>
              )}
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

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            To update account click on <button type="button" onClick={() => setManageModalOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--error)', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '11px' }}>Manage Account</button>.
          </span>
        </div>
      </div>

      <HostModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        title="Manage Account"
      >
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <button 
            type="button" 
            onClick={() => setManageTab('password')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: manageTab === 'password' ? '600' : '400', color: manageTab === 'password' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            Change Password
          </button>
          <button 
            type="button" 
            onClick={() => setManageTab('delete')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: manageTab === 'delete' ? '600' : '400', color: manageTab === 'delete' ? 'var(--error)' : 'var(--text-secondary)' }}
          >
            Delete Account
          </button>
        </div>

        {manageTab === 'password' && (
          <form onSubmit={handleChangePassword} autoComplete="off">
            <div className="host-modal__field">
              <label className="host-modal__label">Username (Email)</label>
              <input type="email" className="host-modal__input" value={pwEmail} onChange={e => setPwEmail(e.target.value)} required autoComplete="off" />
            </div>
            <div className="host-modal__field">
              <label className="host-modal__label">New Password</label>
              <input type="password" className="host-modal__input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="host-modal__btn host-modal__btn--primary">Update Password</button>
            </div>
          </form>
        )}

        {manageTab === 'delete' && (
          <form onSubmit={handleDeleteSubmit} autoComplete="off">
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
              <span style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '500' }}>Warning: This action cannot be undone. All your data will be permanently deleted.</span>
            </div>
            <div className="host-modal__field">
              <label className="host-modal__label">Username (Email)</label>
              <input type="email" className="host-modal__input" value={delEmail} onChange={e => setDelEmail(e.target.value)} required autoComplete="off" />
            </div>
            <div className="host-modal__field">
              <label className="host-modal__label">Password</label>
              <input type="password" className="host-modal__input" value={delPassword} onChange={e => setDelPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="host-modal__field">
              <label className="host-modal__label">To confirm, type "DELETE THIS ACCOUNT FOR ME"</label>
              <input type="text" className="host-modal__input" value={delConfirm} onChange={e => setDelConfirm(e.target.value)} required autoComplete="off" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="host-modal__btn" style={{ 
                background: '#991b1b', 
                color: '#fff', 
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#7f1d1d'}
              onMouseOut={(e) => e.currentTarget.style.background = '#991b1b'}
              >
                <AlertTriangle size={16} />
                Permanently Delete Account
              </button>
            </div>
          </form>
        )}
      </HostModal>
    </div>
  );
}

export default HostSettings;
