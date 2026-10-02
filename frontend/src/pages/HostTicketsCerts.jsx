import { useState, useEffect, useMemo } from 'react';
import { Upload, CheckCircle2, RefreshCcw, Trash2 } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostTicketsCerts() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All Events');
  const [currentPage, setCurrentPage] = useState(1);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const pageSize = 10;

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data } = await api.get('/events/registrations/club');
      setRegistrations(data);
    } catch (err) {
      addToast('Failed to load tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uniqueEvents = useMemo(() => {
    const events = new Set(registrations.map(t => t.eventId?.title).filter(Boolean));
    return ['All Events', ...Array.from(events)];
  }, [registrations]);

  const filtered = registrations.filter((t) => {
    const studentName = (t.studentId?.name || '').toLowerCase();
    const regNumber = (t.studentId?.regNumber || '').toLowerCase();
    const eventName = t.eventId?.title || 'Unknown';

    const matchesSearch = studentName.includes(search.toLowerCase()) || regNumber.includes(search.toLowerCase());
    const matchesEvent = eventFilter === 'All Events' || eventName === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleIssueQR = async (e, id, name) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('qrTicket', file);

    try {
      const { data } = await api.post(`/events/registrations/${id}/qr-ticket`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRegistrations(prev => prev.map(t => t._id === id ? { ...t, qrTicket: data.qrTicket } : t));
      addToast(`QR Entry Pass issued for ${name}`, 'success');
    } catch (err) {
      addToast(`Failed to issue QR for ${name}`, 'error');
    }
  };

  const handleIssueCertificate = async (e, id, name) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const { data } = await api.post(`/events/registrations/${id}/certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRegistrations(prev => prev.map(t => t._id === id ? { ...t, certificate: data.certificate } : t));
      addToast(`Certificate issued for ${name}`, 'success');
    } catch (err) {
      addToast(`Failed to issue Certificate for ${name}`, 'error');
    }
  };

  const handleDeleteQR = async (id, name) => {
    if (!window.confirm(`Are you sure you want to completely remove the QR pass for ${name}?`)) return;
    try {
      await api.delete(`/events/registrations/${id}/qr-ticket`);
      setRegistrations(prev => prev.map(t => t._id === id ? { ...t, qrTicket: null } : t));
      addToast(`QR Entry Pass removed for ${name}`, 'success');
    } catch (err) {
      addToast(`Failed to remove QR for ${name}`, 'error');
    }
  };

  const handleDeleteCertificate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to completely remove the certificate for ${name}?`)) return;
    try {
      await api.delete(`/events/registrations/${id}/certificate`);
      setRegistrations(prev => prev.map(t => t._id === id ? { ...t, certificate: null } : t));
      addToast(`Certificate removed for ${name}`, 'success');
    } catch (err) {
      addToast(`Failed to remove Certificate for ${name}`, 'error');
    }
  };

  const columns = ['Participant', 'Event', 'QR Entry Pass', 'Certificate'];

  const renderRow = (ticket) => {
    const student = ticket.studentId || {};
    const eventName = ticket.eventId?.title || 'Unknown';

    return (
      <tr key={ticket._id}>
        <td>
          <div className="host-data-table__participant">
            <div className="host-data-table__participant-avatar">{student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}</div>
            <div className="host-data-table__participant-info">
              <span className="host-data-table__participant-name">{student.name || 'Unknown'}</span>
              <span className="host-data-table__participant-email">{student.email || 'N/A'}</span>
              <span className="host-data-table__participant-email">{student.regNumber || 'N/A'}</span>
            </div>
          </div>
        </td>
        <td className="host-tickets__event-name">{eventName}</td>
        <td>
          <div className="host-tickets__status-cell">
            {ticket.qrTicket ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a href={`http://localhost:5000${ticket.qrTicket}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <span className="host-data-table__status-badge host-data-table__status-badge--issued" style={{ cursor: 'pointer' }}>
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    View Pass
                  </span>
                </a>
                <label style={{ cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Replace QR Pass">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleIssueQR(e, ticket._id, student.name)} 
                  />
                  <RefreshCcw size={14} />
                </label>
                <button 
                  onClick={() => handleDeleteQR(ticket._id, student.name)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  title="Remove QR Pass"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="host-tickets__upload-btn" style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleIssueQR(e, ticket._id, student.name)} 
                />
                <Upload size={14} strokeWidth={2} />
                Upload QR
              </label>
            )}
          </div>
        </td>
        <td>
          <div className="host-tickets__status-cell">
            {ticket.certificate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a href={`http://localhost:5000${ticket.certificate}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <span className="host-data-table__status-badge host-data-table__status-badge--issued" style={{ cursor: 'pointer' }}>
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    View Cert
                  </span>
                </a>
                <label style={{ cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Replace Certificate">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    style={{ display: 'none' }} 
                    onChange={(e) => handleIssueCertificate(e, ticket._id, student.name)} 
                  />
                  <RefreshCcw size={14} />
                </label>
                <button 
                  onClick={() => handleDeleteCertificate(ticket._id, student.name)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  title="Remove Certificate"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="host-tickets__upload-btn" style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleIssueCertificate(e, ticket._id, student.name)} 
                />
                <Upload size={14} strokeWidth={2} />
                Upload Cert
              </label>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="host-tickets">
      <HostPageHeader
        title="Tickets & Entry Passes"
        subtitle="Upload and issue QR entry passes for your upcoming events."
      />

      <div className="host-tickets__controls">
        <HostSearchBar
          placeholder="Search participant name or registration ID…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          id="tickets-search"
        />
        <select
          className="host-tickets__filter"
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setCurrentPage(1); }}
          aria-label="Filter by event"
        >
          {uniqueEvents.map(evt => (
            <option key={evt} value={evt}>{evt}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading tickets...</div>
      ) : (
        <>
          <HostDataTable
            columns={columns}
            data={paged}
            emptyMessage="No ticket records match your criteria."
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
    </div>
  );
}

export default HostTicketsCerts;
