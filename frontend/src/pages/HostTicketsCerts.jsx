import { useState } from 'react';
import { Upload } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { ticketsData } from '../data/mockData';
import './HostTicketsCerts.css';

function HostTicketsCerts() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = ticketsData.filter(
    (t) =>
      t.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      t.participant.email.toLowerCase().includes(search.toLowerCase()) ||
      t.participant.regNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = ['Participant', 'Registered Event', 'QR Entry Pass', 'Event Certificate'];

  const renderRow = (ticket) => (
    <tr key={ticket.id}>
      <td>
        <div className="host-data-table__participant">
          <div className="host-data-table__participant-avatar">{ticket.participant.initials}</div>
          <div className="host-data-table__participant-info">
            <span className="host-data-table__participant-name">{ticket.participant.name}</span>
            <span className="host-data-table__participant-email">{ticket.participant.email}</span>
            <span className="host-data-table__participant-email">{ticket.participant.regNumber}</span>
          </div>
        </div>
      </td>
      <td className="host-tickets__event-name">{ticket.registeredEvent}</td>
      <td>
        <div className="host-tickets__status-cell">
          <span
            className={`host-data-table__status-badge ${
              ticket.qrPass.issued
                ? 'host-data-table__status-badge--issued'
                : 'host-data-table__status-badge--not-issued'
            }`}
          >
            {ticket.qrPass.issued ? 'Issued' : 'Not Issued'}
          </span>
          {!ticket.qrPass.issued && (
            <button className="host-tickets__upload-btn">
              <Upload size={12} strokeWidth={2} />
              <span>Upload</span>
            </button>
          )}
        </div>
      </td>
      <td>
        <div className="host-tickets__status-cell">
          <span
            className={`host-data-table__status-badge ${
              ticket.certificate.issued
                ? 'host-data-table__status-badge--issued'
                : 'host-data-table__status-badge--not-issued'
            }`}
          >
            {ticket.certificate.issued ? 'Issued' : 'Not Issued'}
          </span>
          {!ticket.certificate.issued && (
            <button className="host-tickets__upload-btn">
              <Upload size={12} strokeWidth={2} />
              <span>Upload</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="host-tickets">
      <HostPageHeader
        title="Tickets & Certificates"
        subtitle="Issue scannable entry QR passes and generate achievement certificates for registered participants."
      />

      <div className="host-tickets__controls">
        <select
          className="host-tickets__filter"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          id="event-filter"
        >
          <option value="all">All Registered Events</option>
        </select>

        <HostSearchBar
          placeholder="Search participant details…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          id="tickets-search"
        />
      </div>

      <HostDataTable
        columns={columns}
        data={paged}
        emptyMessage="No participant records match your search."
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

export default HostTicketsCerts;
