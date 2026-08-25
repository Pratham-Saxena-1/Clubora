import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Shield, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await signup(name, email, password, role);
    setIsLoading(false);
    
    if (result.success) {
      if (result.role === 'Host') {
        navigate('/host/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            <span style={styles.logoText}>CLUBORA</span>
          </div>
          <h1 style={styles.title}>Create an Account</h1>
          <p style={styles.subtitle}>Join Clubora to manage or discover campus clubs</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.roleGroup}>
            <button 
              type="button" 
              style={role === 'Student' ? styles.roleBtnActive : styles.roleBtn}
              onClick={() => setRole('Student')}
            >
              <User size={18} /> Student
            </button>
            <button 
              type="button" 
              style={role === 'Host' ? styles.roleBtnActive : styles.roleBtn}
              onClick={() => setRole('Host')}
            >
              <Shield size={18} /> Host
            </button>
          </div>

          <div style={styles.inputGroup}>
            <User style={styles.icon} size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail style={styles.icon} size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <Lock style={styles.icon} size={20} />
            <input
              type="password"
              placeholder="Create Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? <Loader2 className="spin" size={20} /> : <span>Sign Up</span>}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(179, 141, 69, 0.12) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
  },
  glow2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(179, 141, 69, 0.08) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '48px',
    zIndex: 1,
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'var(--primary)',
    color: 'var(--primary-text)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '800',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'var(--text-primary)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '15px',
  },
  error: {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '24px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid rgba(248, 113, 113, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  roleGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  roleBtn: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'var(--transition-fast)',
  },
  roleBtnActive: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'var(--accent-soft)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'var(--transition-fast)',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-tertiary)',
  },
  input: {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px 14px 48px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'var(--transition-base)',
  },
  button: {
    background: 'var(--primary)',
    color: 'var(--primary-text)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    transition: 'var(--transition-base)',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '32px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '600',
  }
};
