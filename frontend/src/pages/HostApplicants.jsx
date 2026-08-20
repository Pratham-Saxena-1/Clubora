import { useState } from 'react';
import { Eye, Check, X, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import { applicantsData as initialApplicants } from '../data/mockData';

function HostApplicants() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState(initialApplicants);
  const { addToast } = useToast();
  const pageSize = 10;

  const filtered = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.regNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.appliedRole.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusChange = (id, newStatus, name) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    addToast(`${name} has been ${newStatus}.`, newStatus === 'accepted' ? 'success' : 'info');
  };
  
  const exportToExcel = () => {
    const exportData = applicants.map(a => ({
      Name: a.name,
      'Registration Number': a.regNumber,
      Role: a.appliedRole,
      'Submission Date': a.submissionDate,
      Status: a.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "clubora_applicants.xlsx");
    addToast('Excel file downloaded', 'success');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Clubora Applicants Report", 14, 15);
    const tableColumn = ["Name", "Reg Number", "Role", "Date", "Status"];
    const tableRows = applicants.map(a => [
      a.name, a.regNumber, a.appliedRole, a.submissionDate, a.status
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("clubora_applicants.pdf");
    addToast('PDF report downloaded', 'success');
  };

  const columns = ['Applicant', 'Registration Number', 'Applied Role', 'Submission Date', 'Status', 'Actions'];

  const renderRow = (applicant) => (
    <tr key={applicant.id} className={applicant.status !== 'pending' ? `host-applicants__status--${applicant.status}` : ''}>
      <td>
        <div className="host-data-table__participant">
          <div className="host-data-table__participant-avatar">{applicant.initials}</div>
          <span className="host-data-table__participant-name">{applicant.name}</span>
        </div>
      </td>
      <td className="host-applicants__reg-number">{applicant.regNumber}</td>
      <td>
        <span className="host-applicants__role-badge">{applicant.appliedRole}</span>
      </td>
      <td className="host-applicants__date">{applicant.submissionDate}</td>
      <td>
        {applicant.status !== 'pending' ? (
          <span className={`host-applicants__status-label host-applicants__status-label--${applicant.status}`}>
            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
          </span>
        ) : (
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>Pending</span>
        )}
      </td>
      <td>
        <div className="host-applicants__actions">
          <button className="host-data-table__action-btn" aria-label="View CV" onClick={() => addToast(`Viewing CV for ${applicant.name}`, 'info')}>
            <Eye size={14} strokeWidth={2} />
          </button>
          {applicant.status === 'pending' && (
            <>
              <button 
                className="host-data-table__action-btn host-data-table__action-btn--success" 
                aria-label="Accept"
                onClick={() => handleStatusChange(applicant.id, 'accepted', applicant.name)}
              >
                <Check size={14} strokeWidth={2} />
              </button>
              <button 
                className="host-applicants__reject-btn" 
                aria-label="Reject"
                onClick={() => handleStatusChange(applicant.id, 'rejected', applicant.name)}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="host-applicants">
      <HostPageHeader
        title="Recruitment Applicants"
        subtitle="Review applicant profiles, search credentials, and inspect student CV portfolios."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <HostSearchBar
          placeholder="Search applicants, roles, or registration IDs…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          id="applicants-search"
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
        emptyMessage="No applicant records match your search terms."
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

export default HostApplicants;
