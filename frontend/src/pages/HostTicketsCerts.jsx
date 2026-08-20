import { useState, useMemo } from 'react';
import { Upload, FileCheck, CheckCircle2 } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostSearchBar from '../components/HostSearchBar';
import HostDataTable from '../components/HostDataTable';
import HostPagination from '../components/HostPagination';
import { useToast } from '../context/ToastContext';
import { ticketsData as initialTickets } from '../data/mockData';

function HostTicketsCerts() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All Events');
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState(initialTickets);
  const { addToast } = useToast();
  const pageSize = 10;

  // Extract unique events for filter dropdown
  const uniqueEvents = useMemo(() => {
    const events = new Set(tickets.map(t => t.registeredEvent));
    return ['All Events', ...Array.from(events)];
  }, [tickets]);

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      t.participant.regNumber.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = eventFilter === 'All Events' || t.registeredEvent === eventFilter;
    return matchesSearch && matchesEvent;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleIssueQR = (id, name) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, qrPass: { issued: true } } : t));
    addToast(`QR Entry Pass issued for ${name}`, 'success');
  };

  const handleIssueCert = (id, name) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, certificate: { issued: true } } : t));
    addToast(`Certificate issued for ${name}`, 'success');
  };

  const columns = ['Participant', 'Event', 'QR Entry Pass', 'Certificate'];

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
          {ticket.qrPass.issued ? (
            <span className="host-data-table__status-badge host-data-table__status-badge--issued">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              Issued
            </span>
          ) : (
            <label className="host-tickets__upload-btn" style={{ cursor: 'pointer' }}>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                style={{ display: 'none' }} 
                onChange={() => handleIssueQR(ticket.id, ticket.participant.name)} 
              />
              <Upload size={14} strokeWidth={2} />
              Issue QR
            </label>
          )}
        </div>
      </td>
      <td>
        <div className="host-tickets__status-cell">
          {ticket.certificate.issued ? (
            <span className="host-data-table__status-badge host-data-table__status-badge--issued">
              <FileCheck size={12} strokeWidth={2.5} />
              Issued
            </span>
          ) : (
            <label className="host-tickets__upload-btn" style={{ cursor: 'pointer' }}>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                style={{ display: 'none' }} 
                onChange={() => handleIssueCert(ticket.id, ticket.participant.name)} 
              />
              <Upload size={14} strokeWidth={2} />
              Issue Cert
            </label>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="host-tickets">
      <HostPageHeader
        title="Tickets & Certificates"
        subtitle="Issue QR entry passes for upcoming events and distribute completion certificates."
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
    </div>
  );
}

export default HostTicketsCerts;
