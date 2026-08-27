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
    const exportData = registrations.map(r => ({
      'Participant Name': r.studentId?.name || 'Unknown',
      'Email': r.studentId?.email || 'N/A',
      'Event Name': r.eventId?.title || 'Unknown',
      'Registration Date': new Date(r.createdAt).toLocaleDateString(),
      'Checked In': r.checkedIn ? 'Yes' : 'No'
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "clubora_registrations.xlsx");
    addToast('Excel file downloaded', 'success');
  };

  const handleCheckIn = async (id) => {
    try {
      await api.put(`/events/registrations/${id}/check-in`);
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, checkedIn: true } : r));
      addToast('Participant checked in successfully!', 'success');
      setModalData(null);
    } catch (err) {
      addToast('Failed to check in participant', 'error');
    }
  };

  const columns = ['Participant', 'Event Name', 'Registration Date', 'Status'];

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
          {reg.checkedIn ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle size={16} /> Checked In
            </span>
          ) : (
            <button 
              className="host-modal__btn host-modal__btn--primary" 
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setModalData(reg)}
            >
              Check In
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="host-registrations">
      <HostPageHeader
        title="Registration Ledger"
        subtitle="Search, track, and manage student event registrations and check-ins."
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

      {/* Check-In Modal */}
      <HostModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        title={`Check In Participant`}
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setModalData(null)}>Cancel</button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" style={{ background: 'var(--success)', color: 'var(--bg-primary)' }} onClick={() => handleCheckIn(modalData._id)}>Confirm Check-In</button>
          </>
        }
      >
        {modalData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              You are about to check in <strong>{modalData.studentId?.name}</strong> for the event <strong>{modalData.eventId?.title}</strong>.
            </p>
            {modalData.answers && modalData.answers.length > 0 && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Participant Details</h4>
                {modalData.answers.map((ans, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{ans.question}</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{ans.answer}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </HostModal>
    </div>
  );
}

export default HostRegistrations;
