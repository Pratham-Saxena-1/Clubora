import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import HostModal from '../components/HostModal';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import { registrationsData as initialRegs } from '../data/mockData';

function HostRegistrations() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [registrations, setRegistrations] = useState(initialRegs);
  const { addToast } = useToast();
  const pageSize = 10;

  const [eventFilter, setEventFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentModalData, setPaymentModalData] = useState(null);
  
  const events = [...new Set(initialRegs.map(r => r.eventName))];
  const dates = [...new Set(initialRegs.map(r => r.registrationDate))];

  const filtered = registrations.filter(
    (r) =>
      (r.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      r.participant.regNumber.toLowerCase().includes(search.toLowerCase())) &&
      (eventFilter === '' || r.eventName === eventFilter) &&
      (dateFilter === '' || r.registrationDate === dateFilter)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportToExcel = () => {
    const exportData = registrations.map(r => ({
      'Participant Name': r.participant.name,
      'Email': r.participant.email,
      'Reg Number': r.participant.regNumber,
      'Event Name': r.eventName,
      'Registration Date': r.registrationDate,
      'Registration Time': r.registrationTime
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "clubora_registrations.xlsx");
    addToast('Excel file downloaded', 'success');
  };

  const exportToWord = () => {
    const tableHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Clubora Registrations Report</title></head><body>
      <h1>Clubora Registrations Report</h1>
      <table border="1">
        <tr><th>Participant</th><th>Reg Number</th><th>Event</th><th>Date</th><th>Time</th></tr>
        ${registrations.map(r => `<tr><td>${r.participant.name}</td><td>${r.participant.regNumber}</td><td>${r.eventName}</td><td>${r.registrationDate}</td><td>${r.registrationTime}</td></tr>`).join('')}
      </table>
      </body></html>
    `;
    const blob = new Blob(['\ufeff', tableHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clubora_registrations.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('MS Word report downloaded', 'success');
  };

  const handleVerifyPayment = () => {
    if (paymentModalData) {
      setRegistrations(prev => prev.map(r => r.id === paymentModalData.id ? { ...r, paymentVerified: true } : r));
      addToast(`Payment verified for ${paymentModalData.participant.name}`, 'success');
      setPaymentModalData(null);
    }
  };

  const columns = ['Participant', 'Event Name', 'Registration Date', 'Payment'];

  const renderRow = (reg) => (
    <tr key={reg.id}>
      <td>
        <div className="host-data-table__participant">
          <div className="host-data-table__participant-avatar">{reg.participant.initials}</div>
          <div className="host-data-table__participant-info">
            <span className="host-data-table__participant-name">{reg.participant.name}</span>
            <span className="host-data-table__participant-email">{reg.participant.email}</span>
            <span className="host-data-table__participant-email">{reg.participant.regNumber}</span>
          </div>
        </div>
      </td>
      <td className="host-registrations__event-name">{reg.eventName}</td>
      <td className="host-registrations__date">
        {reg.registrationDate} · {reg.registrationTime}
      </td>
      <td>
        <button 
          className={`host-registrations__verify-btn ${reg.paymentVerified ? 'host-registrations__verify-btn--verified' : ''}`}
          onClick={() => !reg.paymentVerified && setPaymentModalData(reg)}
        >
          {reg.paymentVerified ? 'Verified' : 'View Payment'}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="host-registrations">
      <HostPageHeader
        title="Registration Ledger"
        subtitle="Search, track, and export student registrations and transaction records."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <HostSearchBar
          placeholder="Search registrations, events, or students…"
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
          <button onClick={exportToWord} className="host-modal__btn host-modal__btn--secondary" style={{ padding: '8px 16px' }}>
            <FileText size={16} /> Word
          </button>
          <button onClick={exportToExcel} className="host-modal__btn host-modal__btn--secondary" style={{ padding: '8px 16px' }}>
            <Download size={16} /> Excel
          </button>
        </div>
      </div>

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

      {/* Payment Verification Modal */}
      <HostModal
        isOpen={!!paymentModalData}
        onClose={() => setPaymentModalData(null)}
        title={`Payment Details: ${paymentModalData?.participant?.name}`}
        footer={
          <>
            <button type="button" className="host-modal__btn host-modal__btn--secondary" onClick={() => setPaymentModalData(null)}>Cancel</button>
            <button type="button" className="host-modal__btn host-modal__btn--primary" style={{ background: 'var(--success)', color: 'var(--bg-primary)' }} onClick={handleVerifyPayment}>Verify Payment</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
            Please verify the transaction screenshot uploaded by the participant.
          </p>
          <div style={{ width: '100%', height: '300px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
             <span style={{ color: 'var(--text-tertiary)' }}>Dummy Screenshot of Transaction ID: #TXN-{paymentModalData?.id}9827</span>
          </div>
        </div>
      </HostModal>
    </div>
  );
}

export default HostRegistrations;
