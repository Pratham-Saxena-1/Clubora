import { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { applicantsData } from '../data/mockData';
import './HostApplicants.css';

function HostApplicants() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = applicantsData.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.regNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.appliedRole.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = ['Applicant', 'Registration Number', 'Applied Role', 'Submission Date', 'Actions'];

  const renderRow = (applicant, idx) => (
    <tr key={applicant.id}>
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
        <div className="host-applicants__actions">
          <button className="host-data-table__action-btn" aria-label="View CV">
            <Eye size={14} strokeWidth={2} />
          </button>
          <button className="host-data-table__action-btn host-data-table__action-btn--success" aria-label="Accept">
            <Check size={14} strokeWidth={2} />
          </button>
          <button className="host-applicants__reject-btn" aria-label="Reject">
            <X size={14} strokeWidth={2} />
          </button>
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

      <HostSearchBar
        placeholder="Search applicants, roles, or registration IDs…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        id="applicants-search"
      />

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
