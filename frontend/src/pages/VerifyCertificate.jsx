import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Award, Calendar, Building2, Download, Share2, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function VerifyCertificate() {
  const { id } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/certificates/verify/${id}`);
      setCertData(data.certificate);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Certificate not found or ID is invalid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLinkedInCertUrl = () => {
    if (!certData) return '#';
    const dateObj = certData.issueDate ? new Date(certData.issueDate) : new Date();
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: certData.title || 'Certificate of Participation',
      organizationName: certData.club?.name || 'Clubora',
      issueYear: String(dateObj.getFullYear()),
      issueMonth: String(dateObj.getMonth() + 1),
      certUrl: window.location.href,
      certId: String(certData.id || id)
    });
    return `https://www.linkedin.com/profile/add?${params.toString()}`;
  };

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Loader2 className="spin" size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Verifying credential authenticity...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '20px' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <AlertCircle size={52} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Unverified Credential</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            {error || 'This credential could not be found or has been revoked.'}
          </p>
          <Link to="/" className="host-modal__btn host-modal__btn--primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Back to Clubora Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = certData.issueDate
    ? new Date(certData.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Navbar */}
      <header style={{ width: '100%', maxWidth: '780px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>C</div>
          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1px' }}>CLUBORA</span>
        </Link>
        <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '16px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} /> Cryptographically Verified
        </span>
      </header>

      {/* Main Verification Card */}
      <main style={{ width: '100%', maxWidth: '780px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        
        {/* Verified Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(16, 185, 129, 0.1))', padding: '28px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Official Credential Verification</span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0 0 0', color: 'var(--text-primary)' }}>Verified Achievement</h1>
          </div>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={32} />
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '36px 32px' }}>
          
          {/* Recipient Details */}
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Awarded To</span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>{certData.student?.name}</h2>
            {certData.student?.regNumber && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Registration Number: {certData.student.regNumber}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Event / Program</span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px' }}>
                {certData.event?.title || certData.title}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Issuing Organization</span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} style={{ color: 'var(--primary)' }} />
                {certData.club?.name}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Date Issued</span>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                {formattedDate}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Credential ID</span>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'monospace' }}>
                {certData.id || id}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {certData.fileUrl && (
              <a
                href={certData.fileUrl.startsWith('http') ? certData.fileUrl : `${apiBase}${certData.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="host-modal__btn host-modal__btn--primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '12px 20px', fontWeight: 600 }}
              >
                <Download size={18} />
                Download Original Certificate
              </a>
            )}

            <a
              href={getLinkedInCertUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="host-modal__btn host-modal__btn--secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '12px 20px', fontWeight: 600 }}
            >
              <ExternalLink size={18} />
              Add to LinkedIn Profile
            </a>

            <button
              onClick={copyShareLink}
              className="host-modal__btn host-modal__btn--secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 18px', fontWeight: 600 }}
            >
              {copied ? <Check size={18} style={{ color: '#10b981' }} /> : <Share2 size={18} />}
              {copied ? 'Link Copied!' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* Footer verification note */}
        <div style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border)', padding: '14px 32px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Issued via Clubora Authenticated Credential Protocol</span>
          <span>Status: Valid & Active</span>
        </div>
      </main>

      <footer style={{ marginTop: '32px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
        © {new Date().getFullYear()} Clubora · Campus Club & Event Management Platform
      </footer>
    </div>
  );
}
