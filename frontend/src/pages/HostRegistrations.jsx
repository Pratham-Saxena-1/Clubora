import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { registrationsData } from '../data/mockData';
import './HostRegistrations.css';

function HostRegistrations() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = registrationsData.filter(
    (r) =>
      r.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      r.participant.regNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = ['Participant', 'Event Name', 'Registration Date', 'Actions'];

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
          disabled={reg.paymentVerified}
        >
          <ShieldCheck size={14} strokeWidth={2} />
          <span>{reg.paymentVerified ? 'Verified' : 'Verify Payment'}</span>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="host-registrations">
      <HostPageHeader
        title="Registration & Payment Ledger"
        subtitle="Search, track, and verify student registrations and transaction records."
      />

      <HostSearchBar
        placeholder="Search registrations, events, or students…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        id="registrations-search"
      />

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
