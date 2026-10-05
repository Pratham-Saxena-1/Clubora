import { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import HostModal from '../components/HostModal';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostRegistrations() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const pageSize = 10;

  const [eventFilter, setEventFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [modalData, setModalData] = useState(null);
  const [viewedScreenshots, setViewedScreenshots] = useState(new Set());
  
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data } = await api.get('/events/registrations/club');
      setRegistrations(data);
    } catch (err) {
      addToast('Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const events = [...new Set(registrations.map(r => r.eventId?.title))].filter(Boolean);
  const dates = [...new Set(registrations.map(r => new Date(r.createdAt).toLocaleDateString()))];

  const filtered = registrations.filter(
    (r) => {
      const studentName = (r.studentId?.name || '').toLowerCase();
      const eventName = (r.eventId?.title || '').toLowerCase();
      const regDate = new Date(r.createdAt).toLocaleDateString();
      
      return (
        (studentName.includes(search.toLowerCase()) || eventName.includes(search.toLowerCase())) &&
        (eventFilter === '' || r.eventId?.title === eventFilter) &&
        (dateFilter === '' || regDate === dateFilter)
      );
    }
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportToExcel = () => {
    const exportData = registrations.map(r => {
      const baseData = {
        'Participant Name': r.studentId?.name || 'Unknown',
        'Email': r.studentId?.email || 'N/A',
        'Event Name': r.eventId?.title || 'Unknown',
        'Registration Date': new Date(r.createdAt).toLocaleDateString(),
        'Payment Verified': r.paymentVerified ? 'Yes' : 'No'
      };
      
      if (r.formResponseId?.answers && r.formResponseId.answers.length > 0) {
        r.formResponseId.answers.forEach(ans => {
          const fieldDef = r.formResponseId.formId?.fields?.find(f => f.id === ans.fieldId);
          const label = fieldDef ? fieldDef.label : ans.fieldId;
          baseData[label] = Array.isArray(ans.value) ? ans.value.join(', ') : (typeof ans.value === 'object' ? JSON.stringify(ans.value) : String(ans.value));
        });
      }
      
      return baseData;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "clubora_registrations.xlsx");
    addToast('Excel file downloaded', 'success');
  };

  const handleVerifyPayment = async (id) => {
    try {
      await api.put(`/events/registrations/${id}/payment`);
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, paymentVerified: true } : r));
      addToast('Payment verified successfully!', 'success');
      setModalData(null);
    } catch (err) {
      addToast('Failed to verify payment', 'error');
    }
  };

  const columns = ['Participant', 'Event Name', 'Registration Date', 'Payment Status', 'Actions'];

  const renderRow = (reg) => {
    const student = reg.studentId || {};
    const eventName = reg.eventId?.title || 'Unknown';
    const regDate = new Date(reg.createdAt).toLocaleDateString();
    
    return (
      <tr key={reg._id}>
        <td>
          <div className="host-data-table__participant">
            <div className="host-data-table__participant-avatar">{student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}</div>
            <div className="host-data-table__participant-info">
              <span className="host-data-table__participant-name">{student.name || 'Unknown'}</span>
              <span className="host-data-table__participant-email">{student.email || 'N/A'}</span>
            </div>
          </div>
        </td>
        <td className="host-registrations__event-name">{eventName}</td>
        <td className="host-registrations__date">{regDate}</td>
        <td>
          {reg.paymentVerified ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle size={16} /> Verified
            </span>
          ) : reg.eventId?.isPaid ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>
              <Clock size={16} /> Pending
            </span>
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>N/A (Free)</span>
          )}
        </td>
        <td>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="host-data-table__action-btn" 
              aria-label="View Details" 
              title="View Details"
              onClick={() => setModalData(reg)}
            >
              <FileText size={14} strokeWidth={2} />
            </button>
            
            {(() => {
              let screenshotUrl = reg.paymentScreenshot;
              if (!screenshotUrl && reg.formResponseId?.answers) {
                const uploadAns = reg.formResponseId.answers.find(a => typeof a.value === 'string' && a.value.startsWith('/uploads/'));
                if (uploadAns) screenshotUrl = uploadAns.value;
              }
              
              return screenshotUrl ? (
                <>
                  <a 
                    href={`http://localhost:5000${screenshotUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="host-data-table__action-btn"
                    title="View Screenshot"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                    onClick={() => {
                      setViewedScreenshots(prev => {
                        const newSet = new Set(prev);
                        newSet.add(reg._id);
                        return newSet;
                      });
                    }}
                  >
                    <img src={`http://localhost:5000${screenshotUrl}`} alt="Payment" style={{ width: '16px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                  </a>
                  {(!reg.paymentVerified || reg.paymentVerified === false) && viewedScreenshots.has(reg._id) && (
                    <button 
                      className="host-data-table__action-btn" 
                      aria-label="Verify Payment" 
                      title="Verify Payment"
                      style={{ color: '#10b981' }}
                      onClick={() => handleVerifyPayment(reg._id)}
                    >
                      <CheckCircle size={14} strokeWidth={2} />
                    </button>
                  )}
                </>
              ) : null;
            })()}
          </div>
        </td>
        </tr>
    );
  };

  return (
    <div className="host-registrations">
      <HostPageHeader
        title="Registration Ledger"
        subtitle="Search, track, and verify student event registrations and payments."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <HostSearchBar
          placeholder="Search registrations or events…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          id="registrations-search"
        />
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <select 
            value={eventFilter} 
            onChange={e => { setEventFilter(e.target.value); setCurrentPage(1); }} 
            className="host-tickets__filter"
          >
            <option value="">All Events</option>
            {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
          </select>
          <select 
            value={dateFilter} 
            onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }} 
            className="host-tickets__filter"
          >
            <option value="">All Dates</option>
            {dates.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={exportToExcel} className="host-modal__btn host-modal__btn--secondary" style={{ padding: '8px 16px' }}>
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading registrations...</div>
      ) : (
        <>
          <HostDataTable
            columns={columns}
            data={paged}
            emptyMessage="No registration records match your search terms."
            renderRow={renderRow}
          />
          <HostPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Registration Details Modal */}
      <HostModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        title={`Registration Details: ${modalData?.studentId?.name}`}
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setModalData(null)}>Close</button>
            {modalData?.eventId?.isPaid && !modalData?.paymentVerified && (
              <button type="button" className="host-modal__btn host-modal__btn--primary" style={{ background: 'var(--success)', color: 'var(--bg-primary)' }} onClick={() => handleVerifyPayment(modalData._id)}>Confirm Payment</button>
            )}
          </>
        }
      >
        {modalData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {modalData.formResponseId?.answers && modalData.formResponseId.answers.length > 0 ? (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Registration Form Responses</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {modalData.formResponseId.answers
                    .filter(ans => !(typeof ans.value === 'string' && ans.value.startsWith('/uploads/')))
                    .map((ans, idx) => {
                    const fieldDef = modalData.formResponseId.formId?.fields?.find(f => f.id === ans.fieldId);
                    return (
                      <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{fieldDef ? fieldDef.label : `Field ID: ${ans.fieldId}`}</span>
                        <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '4px' }}>
                          {Array.isArray(ans.value) ? ans.value.join(', ') : (typeof ans.value === 'object' ? JSON.stringify(ans.value) : String(ans.value))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', color: 'var(--text-secondary)' }}>No dynamic form responses found.</div>
            )}

            {modalData.eventId?.isPaid && modalData.eventId?.fee > 0 && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Payment Verification Details</h4>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Event Fee</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>${modalData.eventId.fee}</span>
                </div>
                {modalData.paymentScreenshot && (
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Student Uploaded Screenshot</span>
                    <a href={`http://localhost:5000${modalData.paymentScreenshot}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <img src={`http://localhost:5000${modalData.paymentScreenshot}`} alt="Payment Proof" style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ padding: '8px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <FileText size={14} /> View Full Image
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </HostModal>

    </div>
  );
}

export default HostRegistrations;
