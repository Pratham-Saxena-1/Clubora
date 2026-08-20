import { useState, useMemo } from 'react';
import { MessageSquarePlus, MessageCircle, Send } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import { useToast } from '../context/ToastContext';
import { supportCategories, supportTickets as initialTickets } from '../data/mockData';

function HostSupport() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { addToast } = useToast();

  const filteredTickets = useMemo(() => {
    if (activeCategory === 'All') return tickets;
    return tickets.filter(t => t.category === activeCategory);
  }, [tickets, activeCategory]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: Date.now(),
              sender: 'Alex Chen', // Assuming host's name
              role: 'host',
              text: replyText.trim(),
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    }));
    setReplyText('');
    addToast('Reply sent successfully', 'success');
  };

  const handleResolve = () => {
    if (!activeTicket) return;
    setTickets(prev => prev.map(t => t.id === activeTicketId ? { ...t, status: 'Resolved' } : t));
    addToast(`Ticket "${activeTicket.subject}" resolved`, 'info');
  };

  return (
    <div className="host-support">
      <HostPageHeader
        title="Support & Queries"
        subtitle="Manage student inquiries, resolve issues, and provide timely assistance."
        action={
          <div className="host-support__total-badge">
            {tickets.filter(t => t.status === 'Open').length} Open Tickets
          </div>
        }
      />

      <div className="host-support__categories">
        {supportCategories.map((cat) => (
          <button
            key={cat}
            className={`host-support__category-btn ${activeCategory === cat ? 'host-support__category-btn--active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setActiveTicketId(null);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="host-support__grid">
        {/* Ticket List Panel */}
        <div className="host-support__panel">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Inbox</h3>
            <span className="host-support__count-badge">{filteredTickets.length}</span>
          </div>
          {filteredTickets.length > 0 ? (
            <div className="host-support__ticket-list">
              {filteredTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className={`host-support__ticket-item ${activeTicketId === ticket.id ? 'host-support__ticket-item--active' : ''}`}
                  onClick={() => setActiveTicketId(ticket.id)}
                >
                  <h4 className="host-support__ticket-subject">{ticket.subject}</h4>
                  <div className="host-support__ticket-meta">
                    {ticket.student.name} · {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  <span className="host-support__ticket-category-badge">{ticket.category}</span>
                  {ticket.status === 'Resolved' && (
                    <span className="host-support__ticket-category-badge" style={{ background: 'var(--success-soft)', color: 'var(--success)', marginLeft: 'var(--space-xs)' }}>Resolved</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="host-support__panel-empty">
              <MessageSquarePlus size={32} strokeWidth={1.5} />
              <p className="host-support__panel-empty-text">No tickets in this category.</p>
            </div>
          )}
        </div>

        {/* Conversation Thread Panel */}
        <div className="host-support__panel host-support__panel--thread">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Conversation</h3>
          </div>
          {activeTicket ? (
            <>
              <div className="host-support__thread-messages">
                {activeTicket.messages.map(msg => (
                  <div key={msg.id} className={`host-support__message host-support__message--${msg.role}`}>
                    <div className="host-support__message-sender">{msg.sender}</div>
                    <div className="host-support__message-text">{msg.text}</div>
                    <div className="host-support__message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                {activeTicket.status === 'Open' ? (
                  <form onSubmit={handleReply} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <input 
                      type="text" 
                      style={{ flex: 1, padding: '12px var(--space-md)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="host-modal__btn host-modal__btn--primary" style={{ borderRadius: 'var(--radius-full)' }}>
                      <Send size={16} />
                      Reply
                    </button>
                    <button type="button" onClick={handleResolve} className="host-modal__btn" style={{ background: 'var(--success-soft)', color: 'var(--success)', borderRadius: 'var(--radius-full)', border: 'none' }}>
                      Mark Resolved
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', padding: 'var(--space-sm)' }}>
                    This ticket has been resolved.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="host-support__panel-empty">
              <MessageCircle size={48} strokeWidth={1} />
              <p className="host-support__panel-empty-text">Select a ticket from the inbox<br />to view the conversation thread.</p>
            </div>
          )}
        </div>

        {/* Student Context Panel */}
        <div className="host-support__panel">
          <div className="host-support__panel-header">
            <h3 className="host-support__panel-title">Student Details</h3>
          </div>
          {activeTicket ? (
            <div className="host-support__student-info">
              <div className="host-support__student-avatar">
                {activeTicket.student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="host-support__student-name">{activeTicket.student.name}</h4>
                <p className="host-support__student-detail">{activeTicket.student.regNumber}</p>
                <p className="host-support__student-detail">{activeTicket.student.email}</p>
              </div>
            </div>
          ) : (
            <div className="host-support__panel-empty">
              <p className="host-support__panel-empty-text">Context details will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostSupport;
