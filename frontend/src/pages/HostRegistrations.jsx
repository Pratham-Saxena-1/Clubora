import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  const filtered = registrations.filter(
    (r) =>
      r.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      r.participant.regNumber.toLowerCase().includes(search.toLowerCase())
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Clubora Registrations Report", 14, 15);
    const tableColumn = ["Participant", "Reg Number", "Event", "Date", "Time"];
    const tableRows = registrations.map(r => [
      r.participant.name, r.participant.regNumber, r.eventName, r.registrationDate, r.registrationTime
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("clubora_registrations.pdf");
    addToast('PDF report downloaded', 'success');
  };

  const columns = ['Participant', 'Event Name', 'Registration Date'];

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
          <button onClick={exportToPDF} className="host-modal__btn host-modal__btn--secondary" style={{ padding: '8px 16px' }}>
            <FileText size={16} /> PDF
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
    </div>
  );
}

export default HostRegistrations;
