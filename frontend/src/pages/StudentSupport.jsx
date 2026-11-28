import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle,
  HelpCircle,
  Clock,
  Zap,
  Building2,
  Tag,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Inbox,
  FileText,
  Star,
  ArrowRight,
  X
} from 'lucide-react';
import StudentPageHeader from '../components/StudentPageHeader';
import LatticeLoader from '../components/LatticeLoader';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const supportCategories = [
  'Event Participation',
  'Recruitment Status',
  'Payment Issue',
  'Technical Glitch',
  'Other'
];

const faqs = [
  {
    q: 'How do I verify an event payment?',
    a: 'When registering for a paid event, upload your payment screenshot. If verification is delayed, submit an inquiry under "Payment Issue" with your transaction reference number for immediate host review.'
  },
  {
    q: 'When are recruitment drive results published?',
    a: 'Club coordinators typically publish interview shortlists within 3 to 5 business days after recruitment closes. You can monitor your status in real time on the "My Applications" tab.'
  },
  {
    q: 'Where do I find my event QR pass?',
    a: 'Once your registration is verified by the club host, an automated cryptographically signed QR ticket appears right on your Student Dashboard. Show this code at the venue scanner for entry.'
  },
  {
    q: 'How do I claim and verify event certificates?',
    a: 'After you attend an event and check-in via QR, organizers bulk-issue verifiable digital certificates. You can view, download, and share them to LinkedIn directly from your Dashboard.'
  }
];

function StudentSupport() {
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    club: '',
    clubId: '',
    category: 'Event Participation',
    priority: 'Standard',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketRef, setTicketRef] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'inquiries' | 'feedback'
  const [inquiryFilter, setInquiryFilter] = useState('all'); // 'all' | 'open' | 'resolved'
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedRef, setCopiedRef] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await api.get('/clubs');
        setClubs(data);
      } catch (err) {
        console.error('Failed to load clubs');
      }
    };
    fetchClubs();
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const { data } = await api.get('/support/me');
      setMyTickets(data);
    } catch (err) {
      console.error('Failed to load student inquiries', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // Strictly filter inquiries and feedback submissions
  const inquiries = myTickets.filter(t => t.type !== 'Feedback');
  const feedbacks = myTickets.filter(t => t.type === 'Feedback');

  const filteredInquiries = inquiries.filter(t => {
    if (inquiryFilter === 'open') return t.status === 'Open' || t.status === 'In Progress';
    if (inquiryFilter === 'resolved') return t.status === 'Resolved';
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const description = `Priority: ${formData.priority}\nCategory: ${formData.category}\nClub: ${formData.club || 'General'}\n\nMessage:\n${formData.message}`;

      const payload = {
        type: 'Support',
        subject: formData.subject,
        description: description
      };

      if (formData.clubId && formData.clubId !== 'General') {
        payload.clubId = formData.clubId;
      }

      const { data } = await api.post('/support', payload);

      const refId = data._id.substring(0, 8);
      setTicketRef(refId);
      setFormData({
        club: '',
        clubId: '',
        category: 'Event Participation',
        priority: 'Standard',
        subject: '',
        message: ''
      });
      addToast('Inquiry sent successfully to club organizers!', 'success');
      fetchMyTickets();
    } catch (err) {
      addToast(err.response?.data?.error?.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
    addToast('Ticket Reference copied to clipboard!', 'info');
  };

  return (
    <div className="host-dashboard" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-8%',
          left: '-4%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(109, 1, 26, 0.22) 0%, transparent 65%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(70px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-6%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(109, 1, 26, 0.12) 0%, transparent 65%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(70px)'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <StudentPageHeader
          title="Club Support Hub"
          subtitle="Direct assistance, inquiries, and resolution center for all campus clubs and events."
        />

        {/* Compact, Slim Banner (Refined to be sleek and proportionate) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(109, 1, 26, 0.25) 0%, rgba(10, 10, 10, 0.95) 100%)',
            border: '1px solid rgba(109, 1, 26, 0.35)',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(109, 1, 26, 0.4)', border: '1px solid #6D011A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
              <HelpCircle size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  Student Help & Inquiries Desk
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 7px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} /> Active
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#A0A0A0', margin: '2px 0 0 0' }}>
                Direct communication channel for campus events, payments, and club matters.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#C8C8C8', fontSize: '11px', fontWeight: 600 }}>
              <Clock size={12} style={{ color: '#FF4D6D' }} />
              <span>Response: ~24h</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#C8C8C8', fontSize: '11px', fontWeight: 600 }}>
              <ShieldCheck size={12} style={{ color: '#10b981' }} />
              <span>Direct to Clubs</span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs: Separate New Inquiry, My Inquiries, and Submitted Feedback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>

          {/* Tab 1: Submit New Inquiry */}
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'new' ? '#6D011A' : '#0A0A0A',
              color: '#FFFFFF',
              border: `1px solid ${activeTab === 'new' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: activeTab === 'new' ? '0 4px 16px rgba(109, 1, 26, 0.5)' : 'none'
            }}
          >
            <Send size={15} />
            <span>Submit New Inquiry</span>
          </button>

          {/* Tab 2: My Inquiries (Questions asked only) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('inquiries');
              fetchMyTickets();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'inquiries' ? '#6D011A' : '#0A0A0A',
              color: '#FFFFFF',
              border: `1px solid ${activeTab === 'inquiries' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: activeTab === 'inquiries' ? '0 4px 16px rgba(109, 1, 26, 0.5)' : 'none'
            }}
          >
            <Inbox size={15} />
            <span>My Inquiries</span>
            {inquiries.length > 0 && (
              <span style={{
                background: activeTab === 'inquiries' ? '#FFFFFF' : 'rgba(109, 1, 26, 0.5)',
                color: activeTab === 'inquiries' ? '#6D011A' : '#FFFFFF',
                padding: '1px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {inquiries.length}
              </span>
            )}
          </button>

          {/* Tab 3: Dedicated Section for Submitted Feedback */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('feedback');
              fetchMyTickets();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'feedback' ? '#6D011A' : '#0A0A0A',
              color: '#FFFFFF',
              border: `1px solid ${activeTab === 'feedback' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: activeTab === 'feedback' ? '0 4px 16px rgba(109, 1, 26, 0.5)' : 'none'
            }}
          >
            <Star size={15} style={{ color: activeTab === 'feedback' ? '#FFFFFF' : '#FF4D6D' }} />
            <span>Submitted Feedback</span>
            {feedbacks.length > 0 && (
              <span style={{
                background: activeTab === 'feedback' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                color: activeTab === 'feedback' ? '#6D011A' : '#FFFFFF',
                padding: '1px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {feedbacks.length}
              </span>
            )}
          </button>

        </div>

        {/* ==================== TAB 1: SUBMIT NEW INQUIRY ==================== */}
        {activeTab === 'new' && (
          <div className="support-layout-grid">

            {/* Form Card */}
            <div
              style={{
                background: '#0A0A0A',
                padding: '32px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                position: 'relative'
              }}
            >
              {ticketRef ? (
                /* Success Screen */
                <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      background: 'rgba(109, 1, 26, 0.25)',
                      border: '2px solid #6D011A',
                      color: '#FFFFFF',
                      marginBottom: '20px',
                      boxShadow: '0 0 30px rgba(109, 1, 26, 0.4)'
                    }}
                  >
                    <CheckCircle size={38} style={{ color: '#FFFFFF' }} />
                  </div>

                  <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                    Inquiry Dispatched Successfully!
                  </h3>
                  <p style={{ color: '#C8C8C8', maxWidth: '440px', margin: '0 auto 24px auto', fontSize: '14px', lineHeight: 1.6 }}>
                    Your message has been assigned to the club leadership team. You will be notified as soon as a coordinator replies.
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#141414',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '28px'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ticket ID:</span>
                    <strong style={{ fontSize: '15px', color: '#FFFFFF', fontFamily: 'monospace', letterSpacing: '1px' }}>
                      #{ticketRef}
                    </strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ticketRef)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: copiedRef ? '#10b981' : '#FF4D6D',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 6px',
                        borderRadius: '6px'
                      }}
                      title="Copy Reference"
                    >
                      {copiedRef ? <Check size={15} /> : <Copy size={15} />}
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{copiedRef ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setTicketRef(null)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        background: '#6D011A',
                        color: '#FFFFFF',
                        border: '1px solid #6D011A',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(109, 1, 26, 0.5)',
                        transition: 'all 0.2s'
                      }}
                    >
                      Submit Another Inquiry
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTicketRef(null);
                        setActiveTab('inquiries');
                        fetchMyTickets();
                      }}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '13.5px',
                        background: '#141414',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      View My Inquiries
                    </button>
                  </div>
                </div>
              ) : (
                /* Inquiry Form */
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(109, 1, 26, 0.3)', border: '1px solid #6D011A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        Inquiry Information
                      </h3>
                      <span style={{ fontSize: '12.5px', color: '#8E8E8E' }}>
                        Provide details so the designated club team can resolve your query promptly.
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Organization and Category in 2 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>

                      {/* Organization Dropdown */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          <Building2 size={14} style={{ color: '#FF4D6D' }} />
                          Target Organization / Club
                        </label>
                        <select
                          value={formData.clubId || ''}
                          onChange={(e) => {
                            const selectedText = e.target.options[e.target.selectedIndex].text;
                            setFormData({ ...formData, clubId: e.target.value, club: selectedText });
                          }}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: '#141414',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '13.5px',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#6D011A';
                            e.target.style.boxShadow = '0 0 0 3px rgba(109, 1, 26, 0.25)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="" disabled style={{ background: '#141414', color: '#888' }}>Select club or entity...</option>
                          <option value="General" style={{ background: '#141414', color: '#FFF' }}>General Campus & Platform Support</option>
                          {clubs.map(club => (
                            <option key={club._id} value={club._id} style={{ background: '#141414', color: '#FFF' }}>
                              {club.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category Dropdown */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                          <Tag size={14} style={{ color: '#FF4D6D' }} />
                          Inquiry Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: '#141414',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '13.5px',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#6D011A';
                            e.target.style.boxShadow = '0 0 0 3px rgba(109, 1, 26, 0.25)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          {supportCategories.map((cat, i) => (
                            <option key={i} value={cat} style={{ background: '#141414', color: '#FFF' }}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Priority Selector with rich visual cards */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                        <Zap size={14} style={{ color: '#FF4D6D' }} />
                        Priority Level
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                        {/* Standard Option */}
                        <div
                          onClick={() => setFormData({ ...formData, priority: 'Standard' })}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            border: formData.priority === 'Standard' ? '1.5px solid #6D011A' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: formData.priority === 'Standard' ? 'rgba(109, 1, 26, 0.35)' : '#141414',
                            boxShadow: formData.priority === 'Standard' ? '0 0 16px rgba(109, 1, 26, 0.4)' : 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: formData.priority === 'Standard' ? '#6D011A' : 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Clock size={15} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#FFFFFF', marginBottom: '2px' }}>
                              Standard
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#A0A0A0' }}>
                              Normal queries (~24h response)
                            </div>
                          </div>
                        </div>

                        {/* Urgent Option */}
                        <div
                          onClick={() => setFormData({ ...formData, priority: 'Urgent' })}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            border: formData.priority === 'Urgent' ? '1.5px solid #6D011A' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: formData.priority === 'Urgent' ? 'rgba(109, 1, 26, 0.35)' : '#141414',
                            boxShadow: formData.priority === 'Urgent' ? '0 0 16px rgba(109, 1, 26, 0.4)' : 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: formData.priority === 'Urgent' ? '#6D011A' : 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Zap size={15} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#FFFFFF', marginBottom: '2px' }}>
                              Urgent
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#A0A0A0' }}>
                              Time-sensitive or payment blocked
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Subject Input */}
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                        <FileText size={14} style={{ color: '#FF4D6D' }} />
                        Subject Line
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Payment not verified for Hackathon 2026"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: '#141414',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13.5px',
                          outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = '#6D011A';
                          e.target.style.boxShadow = '0 0 0 3px rgba(109, 1, 26, 0.25)';
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
                          <MessageSquare size={14} style={{ color: '#FF4D6D' }} />
                          Detailed Message
                        </label>
                        <span style={{ fontSize: '11.5px', color: '#888' }}>
                          Include specific dates or reference IDs
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="Explain your inquiry in detail. Mention any specific event, transaction ID, or registration number to expedite assistance..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: '#141414',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13.5px',
                          lineHeight: 1.5,
                          outline: 'none',
                          resize: 'vertical',
                          transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = '#6D011A';
                          e.target.style.boxShadow = '0 0 0 3px rgba(109, 1, 26, 0.25)';
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Bottom Submit Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A0A0A0', fontSize: '11.5px' }}>
                        <ShieldCheck size={14} style={{ color: '#10b981' }} />
                        <span>Confidential message delivered directly to club host</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 24px',
                          background: '#6D011A',
                          color: '#FFFFFF',
                          border: '1px solid #6D011A',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 18px rgba(109, 1, 26, 0.55)',
                          transition: 'all 0.2s ease',
                          opacity: isSubmitting ? 0.7 : 1
                        }}
                        onMouseEnter={e => {
                          if (!isSubmitting) {
                            e.currentTarget.style.background = '#8C0222';
                            e.currentTarget.style.boxShadow = '0 6px 22px rgba(109, 1, 26, 0.8)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSubmitting) {
                            e.currentTarget.style.background = '#6D011A';
                            e.currentTarget.style.boxShadow = '0 4px 18px rgba(109, 1, 26, 0.55)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {isSubmitting ? (
                          <LatticeLoader status="working" label="Sending" pattern="orbit" grid={3} shape="round" cellSize={4} gap={2} fontSize={13} step={90} idleOpacity={0.15} showTimer={false} color="#f5f5f5" />
                        ) : (
                          <>
                            <span>Send Inquiry</span>
                            <Send size={15} />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </>
              )}
            </div>

            {/* Right Column: FAQ Accordion & Quick Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* FAQ Accordion Card */}
              <div
                style={{
                  background: '#0A0A0A',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(109, 1, 26, 0.25)', border: '1px solid rgba(109, 1, 26, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                    <HelpCircle size={15} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      Quick Answers (FAQ)
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isOpen ? 'rgba(109, 1, 26, 0.15)' : '#141414',
                          border: isOpen ? '1px solid rgba(109, 1, 26, 0.45)' : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'transparent',
                            border: 'none',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: '13px',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ paddingRight: '10px' }}>{faq.q}</span>
                          {isOpen ? <ChevronUp size={15} style={{ color: '#FF4D6D', flexShrink: 0 }} /> : <ChevronDown size={15} style={{ color: '#888', flexShrink: 0 }} />}
                        </button>

                        {isOpen && (
                          <div style={{ padding: '0 14px 12px 14px', fontSize: '12.5px', color: '#C8C8C8', lineHeight: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '8px' }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guidelines & Tips Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(109, 1, 26, 0.18) 0%, #0A0A0A 100%)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(109, 1, 26, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>
                  <Sparkles size={15} style={{ color: '#FF4D6D' }} />
                  <span>Pro-Tip for Fast Resolution</span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#C8C8C8', lineHeight: 1.5, margin: 0 }}>
                  For payment issues, always include the transaction UTR number or upload proof. For recruitment inquiries, ensure your registered student email matches your submission.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 2: MY INQUIRIES (COMPACT RESPONSIVE CARD GRID) ==================== */}
        {activeTab === 'inquiries' && (
          <div style={{ background: '#0A0A0A', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)' }}>

            {/* Header & Filter Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  My Support Inquiries
                </h3>
                <span style={{ fontSize: '12.5px', color: '#888' }}>
                  Showing all questions and requests you have asked club organizers.
                </span>
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setInquiryFilter('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: inquiryFilter === 'all' ? '#6D011A' : '#141414',
                    color: '#FFFFFF',
                    border: `1px solid ${inquiryFilter === 'all' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  All ({inquiries.length})
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryFilter('open')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: inquiryFilter === 'open' ? '#6D011A' : '#141414',
                    color: '#FFFFFF',
                    border: `1px solid ${inquiryFilter === 'open' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  Open ({inquiries.filter(i => i.status !== 'Resolved').length})
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryFilter('resolved')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: inquiryFilter === 'resolved' ? '#6D011A' : '#141414',
                    color: '#FFFFFF',
                    border: `1px solid ${inquiryFilter === 'resolved' ? '#6D011A' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  Resolved ({inquiries.filter(i => i.status === 'Resolved').length})
                </button>

                <button
                  type="button"
                  onClick={fetchMyTickets}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#C8C8C8',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>

            {loadingTickets ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#FFFFFF' }}>
                  <LatticeLoader status="working" label="Loading inquiries" pattern="orbit" grid={3} shape="round" cellSize={6} gap={2} fontSize={13} step={90} idleOpacity={0.15} showTimer color="#f5f5f5" />
                </div>
                ) : filteredInquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '14px' }}>
                    <Inbox size={24} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {inquiryFilter === 'all' ? 'No Inquiries Submitted Yet' : `No ${inquiryFilter} inquiries found`}
                  </h4>
                  <p style={{ color: '#888', fontSize: '13px', maxWidth: '360px', margin: '0 auto 18px auto' }}>
                    {inquiryFilter === 'all'
                      ? "You haven't submitted any questions or requests. If you need help with an event or club, submit an inquiry."
                      : `You do not have any inquiries currently marked as ${inquiryFilter}.`
                    }
                  </p>
                  {inquiryFilter === 'all' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('new')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '10px',
                        background: '#6D011A',
                        color: '#FFFFFF',
                        border: '1px solid #6D011A',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Create New Inquiry
                    </button>
                  )}
                </div>
                ) : (
                /* Balanced Card Grid: Eliminates horizontal full-width stretched strips */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
                  {filteredInquiries.map(ticket => {
                    const isResolved = ticket.status === 'Resolved';
                    const isInProgress = ticket.status === 'In Progress';
                    const dateStr = new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    const clubName = ticket.clubId?.name || (typeof ticket.clubId === 'string' ? ticket.clubId : 'General Support');
                    const hasReplies = ticket.messages && ticket.messages.length > 0;

                    return (
                      <div
                        key={ticket._id}
                        style={{
                          background: '#141414',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedTicket(ticket)}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#6D011A';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(109, 1, 26, 0.2)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div>
                          {/* Top ID & Status */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#FF4D6D', fontWeight: 800, background: 'rgba(109, 1, 26, 0.25)', border: '1px solid rgba(109, 1, 26, 0.4)', padding: '2px 6px', borderRadius: '6px' }}>
                                #{ticket._id.substring(0, 8)}
                              </span>
                              <span style={{ fontSize: '11px', color: '#888' }}>
                                {dateStr}
                              </span>
                            </div>

                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                background: isResolved
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : isInProgress
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(109, 1, 26, 0.35)',
                                color: isResolved
                                  ? '#10b981'
                                  : isInProgress
                                    ? '#f59e0b'
                                    : '#FFFFFF',
                                border: `1px solid ${isResolved ? 'rgba(16, 185, 129, 0.3)' : isInProgress ? 'rgba(245, 158, 11, 0.3)' : '#6D011A'}`
                              }}
                            >
                              {ticket.status}
                            </span>
                          </div>

                          {/* Club Tag */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#A0A0A0', marginBottom: '8px' }}>
                            <Building2 size={13} style={{ color: '#FF4D6D' }} />
                            <span style={{ fontWeight: 600 }}>{clubName}</span>
                          </div>

                          {/* Subject */}
                          <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                            {ticket.subject}
                          </h4>

                          {/* Description Preview (Cleanly clamped to 2 lines) */}
                          <p style={{ fontSize: '12.5px', color: '#A0A0A0', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {ticket.description}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {hasReplies ? (
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF4D6D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageSquare size={12} /> Host Replied
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#777', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={11} /> Awaiting Review
                            </span>
                          )}

                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF' }}>
                            View Thread <ArrowRight size={12} style={{ color: '#FF4D6D' }} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}
              </div>
            )}

            {/* ==================== TAB 3: SEPARATE SECTION FOR SUBMITTED FEEDBACK ==================== */}
            {activeTab === 'feedback' && (
              <div style={{ background: '#0A0A0A', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={18} style={{ color: '#FF4D6D' }} />
                      Submitted Event Feedback & Ratings
                    </h3>
                    <span style={{ fontSize: '12.5px', color: '#888' }}>
                      Archive of reviews, star ratings, and feedback you have submitted for events.
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link
                      to="/student/feedback"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: '#6D011A',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(109, 1, 26, 0.4)'
                      }}
                    >
                      <span>Rate More Events</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={fetchMyTickets}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: '#141414',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#C8C8C8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {loadingTickets ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#FFFFFF' }}>
                      <LatticeLoader status="working" label="Loading submitted feedback" pattern="orbit" grid={3} shape="round" cellSize={6} gap={2} fontSize={13} step={90} idleOpacity={0.15} showTimer color="#f5f5f5" />
                    </div>
                    ) : feedbacks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '14px' }}>
                        <Star size={24} style={{ color: '#FF4D6D' }} />
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                        No Event Feedback Submitted Yet
                      </h4>
                      <p style={{ color: '#888', fontSize: '13px', maxWidth: '380px', margin: '0 auto 18px auto' }}>
                        When you attend campus events and submit ratings, your verified reviews will be archived here.
                      </p>
                      <Link
                        to="/student/feedback"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 18px',
                          borderRadius: '10px',
                          background: '#6D011A',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          textDecoration: 'none'
                        }}
                      >
                        <span>Go to Event Feedback</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                    ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
                      {feedbacks.map(ticket => {
                        const dateStr = new Date(ticket.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });

                        // Parse rating and clean text
                        const ratingMatch = ticket.description?.match(/Rating:\s*(\d+)/i);
                        const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

                        const textMatch = ticket.description?.match(/Feedback:\s*([\s\S]*)$/i);
                        const reviewComment = textMatch ? textMatch[1].trim() : ticket.description;

                        const eventTitle = ticket.eventId?.title || ticket.subject?.replace(/^Feedback for\s*/i, '') || 'Campus Event';
                        const clubName = ticket.clubId?.name || (typeof ticket.clubId === 'string' ? ticket.clubId : 'Campus Club');

                        return (
                          <div
                            key={ticket._id}
                            style={{
                              background: '#141414',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '16px',
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '14px',
                              transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = '#6D011A';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div>
                              {/* Top Metadata */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#888' }}>
                                  {dateStr}
                                </span>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  color: '#10b981',
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  border: '1px solid rgba(16, 185, 129, 0.25)',
                                  padding: '2px 7px',
                                  borderRadius: '10px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle size={10} /> Delivered
                                </span>
                              </div>

                              {/* Event Title */}
                              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                                {eventTitle}
                              </h4>

                              {/* Associated Club */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#A0A0A0', marginBottom: '12px' }}>
                                <Building2 size={13} style={{ color: '#FF4D6D' }} />
                                <span>{clubName}</span>
                              </div>

                              {/* Star Rating Visualization */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '8px', width: 'fit-content' }}>
                                <div style={{ display: 'flex', gap: '3px' }}>
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      size={14}
                                      fill={star <= rating ? '#FF4D6D' : 'none'}
                                      color={star <= rating ? '#FF4D6D' : 'rgba(255,255,255,0.2)'}
                                    />
                                  ))}
                                </div>
                                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', marginLeft: '2px' }}>
                                  {rating} / 5
                                </span>
                              </div>

                              {/* Review text */}
                              <p style={{ fontSize: '12.5px', color: '#C8C8C8', lineHeight: 1.5, margin: 0, fontStyle: reviewComment === 'No text provided' ? 'italic' : 'normal' }}>
                                "{reviewComment}"
                              </p>
                            </div>

                            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: '#888' }}>
                              <span>Ref #{ticket._id.substring(0, 8)}</span>
                              <span style={{ color: '#FF4D6D' }}>Verified Feedback</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
            )}
                  </div>
                )}

              </div>

      {/* ==================== FOCUSED INQUIRY DETAILS MODAL ==================== */}
            {selectedTicket && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  padding: '20px'
                }}
                onClick={() => setSelectedTicket(null)}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '620px',
                    background: '#0A0A0A',
                    border: '1px solid rgba(109, 1, 26, 0.6)',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(109, 1, 26, 0.3)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Modal Top */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#FF4D6D', fontWeight: 800 }}>
                          #{selectedTicket._id.substring(0, 8)}
                        </span>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          • {new Date(selectedTicket.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: selectedTicket.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(109, 1, 26, 0.35)',
                          color: selectedTicket.status === 'Resolved' ? '#10b981' : '#FFFFFF',
                          border: `1px solid ${selectedTicket.status === 'Resolved' ? 'rgba(16, 185, 129, 0.3)' : '#6D011A'}`
                        }}>
                          {selectedTicket.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        {selectedTicket.subject}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Club metadata */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#C8C8C8', marginBottom: '16px' }}>
                    <Building2 size={14} style={{ color: '#FF4D6D' }} />
                    <span>Assigned Club: <strong style={{ color: '#FFFFFF' }}>{selectedTicket.clubId?.name || (typeof selectedTicket.clubId === 'string' ? selectedTicket.clubId : 'General Campus Support')}</strong></span>
                  </div>

                  {/* Student's Original Message */}
                  <div style={{ background: '#141414', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Your Inquiry Message:
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#FFFFFF', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {selectedTicket.description}
                    </div>
                  </div>

                  {/* Conversation Thread / Replies */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FF4D6D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={14} />
                      <span>Host Communication & Responses ({selectedTicket.messages?.length || 0})</span>
                    </div>

                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedTicket.messages.map((msg, i) => (
                          <div
                            key={i}
                            style={{
                              background: msg.role === 'host' ? 'rgba(109, 1, 26, 0.25)' : '#141414',
                              border: `1px solid ${msg.role === 'host' ? 'rgba(109, 1, 26, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                              borderRadius: '12px',
                              padding: '12px 16px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '11px', color: '#A0A0A0' }}>
                              <strong style={{ color: msg.role === 'host' ? '#FF4D6D' : '#FFFFFF' }}>
                                {msg.sender || (msg.role === 'host' ? 'Club Organizer' : 'You')}
                              </strong>
                              <span>{new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: 1.5 }}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                        No responses yet. Club organizers typically review inquiries within 24 hours.
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: '#6D011A',
                        color: '#FFFFFF',
                        border: '1px solid #6D011A',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .support-layout-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(320px, 1fr);
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 960px) {
          .support-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
          </div>
        );
}

        export default StudentSupport;