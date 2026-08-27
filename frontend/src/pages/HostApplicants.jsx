import { useState, useEffect } from 'react';
import { Eye, Check, X, FileText, Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import HostModal from '../components/HostModal';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function HostApplicants() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const pageSize = 10;

  const [roleFilter, setRoleFilter] = useState('');
  const [resumeModal, setResumeModal] = useState(null);
  const [answersModal, setAnswersModal] = useState(null);
  
  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get('/applications/club');
      setApplicants(data);
    } catch (err) {
      addToast('Failed to load applicants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const roles = [...new Set(applicants.map(a => a.recruitmentId?.title))].filter(Boolean);

  const filtered = applicants.filter(
    (a) => {
      const studentName = (a.studentId?.name || '').toLowerCase();
      const roleName = (a.recruitmentId?.title || '').toLowerCase();
      
      return (
        (studentName.includes(search.toLowerCase()) || roleName.includes(search.toLowerCase())) &&
        (roleFilter === '' || a.recruitmentId?.title === roleFilter)
      );
    }
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusChange = async (id, newStatus, name) => {
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus });
      setApplicants(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      addToast(`${name} has been ${newStatus}.`, newStatus === 'Accepted' ? 'success' : 'info');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };
  
  const exportToExcel = () => {
    const exportData = applicants.map(a => ({
      Name: a.studentId?.name || 'Unknown',
      'Contact Number': a.studentId?.contactNumber || 'N/A',
      Email: a.studentId?.email || 'N/A',
      Role: a.recruitmentId?.title || 'Unknown',
      'Submission Date': new Date(a.createdAt).toLocaleDateString(),
      Status: a.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "clubora_applicants.xlsx");
    addToast('Excel file downloaded', 'success');
  };

  const columns = ['Applicant', 'Applied Role', 'Submission Date', 'Status', 'Actions'];

  const renderRow = (applicant) => {
    const student = applicant.studentId || {};
    const roleTitle = applicant.recruitmentId?.title || 'Unknown';
    const subDate = new Date(applicant.createdAt).toLocaleDateString();

    return (
      <tr key={applicant._id} className={applicant.status !== 'Pending' ? `host-applicants__status--${applicant.status.toLowerCase()}` : ''}>
        <td>
          <div className="host-data-table__participant">
            <div className="host-data-table__participant-avatar">{student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}</div>
            <div className="host-data-table__participant-info">
              <span className="host-data-table__participant-name">{student.name || 'Unknown'}</span>
              <span className="host-data-table__participant-email">{student.email || 'N/A'}</span>
            </div>
          </div>
        </td>
        <td>
          <span className="host-applicants__role-badge">{roleTitle}</span>
        </td>
        <td className="host-applicants__date">{subDate}</td>
        <td>
          {applicant.status !== 'Pending' ? (
            <span className={`host-applicants__status-label host-applicants__status-label--${applicant.status.toLowerCase()}`}>
              {applicant.status}
            </span>
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>Pending</span>
          )}
        </td>
        <td>
          <div className="host-applicants__actions">
            {applicant.resume && (
              <button 
                className="host-data-table__action-btn" 
                aria-label="View CV" 
                onClick={() => setResumeModal(applicant)}
              >
                <Eye size={14} strokeWidth={2} />
              </button>
            )}
            
            {applicant.answers && applicant.answers.length > 0 && (
              <button 
                className="host-data-table__action-btn" 
                aria-label="View Answers" 
                onClick={() => setAnswersModal(applicant)}
              >
                <FileText size={14} strokeWidth={2} />
              </button>
            )}

            {applicant.status === 'Pending' && (
              <>
                <button 
                  className="host-data-table__action-btn host-data-table__action-btn--success" 
                  aria-label="Accept"
                  onClick={() => handleStatusChange(applicant._id, 'Accepted', student.name)}
                >
                  <Check size={14} strokeWidth={2} />
                </button>
                <button 
                  className="host-applicants__reject-btn" 
                  aria-label="Reject"
                  onClick={() => handleStatusChange(applicant._id, 'Rejected', student.name)}
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="host-applicants">
      <HostPageHeader
        title="Recruitment Applicants"
        subtitle="Review applicant profiles, evaluate answers, and inspect student CV portfolios."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <HostSearchBar
          placeholder="Search applicants or roles…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          id="applicants-search"
        />
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <select 
            value={roleFilter} 
            onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} 
            className="host-tickets__filter"
            style={{ minWidth: '150px' }}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button onClick={exportToExcel} className="host-modal__btn host-modal__btn--secondary" style={{ padding: '8px 16px' }}>
            <Download size={16} /> Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading applicants...</div>
      ) : (
        <>
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
        </>
      )}

      {/* View CV Modal */}
      <HostModal
        isOpen={!!resumeModal}
        onClose={() => setResumeModal(null)}
        title={`Resume: ${resumeModal?.studentId?.name}`}
      >
        {resumeModal && (
          <div style={{ height: '600px', width: '100%' }}>
            <iframe 
              src={`http://localhost:5000${resumeModal.resume}`} 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-md)' }} 
              title="Resume Preview"
            />
          </div>
        )}
      </HostModal>

      {/* View Answers Modal */}
      <HostModal
        isOpen={!!answersModal}
        onClose={() => setAnswersModal(null)}
        title={`Application Answers: ${answersModal?.studentId?.name}`}
      >
        {answersModal && answersModal.answers && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {answersModal.answers.map((ans, idx) => (
              <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Question {idx + 1}</span>
                <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>{ans.question}</span>
                <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '4px' }}>{ans.answer}</span>
              </div>
            ))}
          </div>
        )}
      </HostModal>

    </div>
  );
}

export default HostApplicants;
