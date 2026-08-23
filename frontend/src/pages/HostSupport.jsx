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
    <div className="host-support" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
      <HostPageHeader
        title="Support & Queries"
        subtitle="Manage student inquiries, resolve issues, and provide timely assistance."
        action={
          <div className="host-support__total-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
            {tickets.filter(t => t.status === 'Open').length} Open Tickets
          </div>
        }
      />

      <div style={{ flex: 1, display: 'flex', gap: 'var(--space-md)', overflow: 'hidden', marginTop: 'var(--space-md)' }}>
        {/* Left Column: Inbox & Filters */}
        <div style={{ width: '320px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>Inbox</h3>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {supportCategories.map((cat) => (
                <button
                  key={cat}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-hover)',
                    color: activeCategory === cat ? '#fff' : 'var(--text-secondary)'
                  }}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveTicketId(null);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    background: activeTicketId === ticket.id ? 'var(--accent-soft)' : 'transparent',
                    borderLeft: activeTicketId === ticket.id ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                  onClick={() => setActiveTicketId(ticket.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{ticket.subject}</h4>
                    {ticket.status === 'Open' && <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }}></span>}
                  </div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                    {ticket.student.name} · {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '10px', color: 'var(--text-secondary)' }}>{ticket.category}</span>
                    {ticket.status === 'Resolved' && (
                      <span style={{ padding: '2px 8px', background: 'var(--success-soft)', borderRadius: 'var(--radius-sm)', fontSize: '10px', color: 'var(--success)' }}>Resolved</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 'var(--space-2xl) var(--space-lg)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <MessageSquarePlus size={32} style={{ margin: '0 auto var(--space-md)', opacity: 0.5 }} />
                <p style={{ fontSize: 'var(--font-sm)' }}>No tickets found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Conversation Thread */}
        <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTicket ? (
            <>
              <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{activeTicket.subject}</h3>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Ticket ID: #{activeTicket.id}</span>
                </div>
                {activeTicket.status === 'Open' && (
                  <button onClick={handleResolve} style={{ padding: '6px 12px', background: 'var(--success-soft)', color: 'var(--success)', border: 'none', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-xs)', fontWeight: 600, cursor: 'pointer' }}>
                    Mark as Resolved
                  </button>
                )}
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {activeTicket.messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: msg.role === 'host' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px', marginLeft: msg.role === 'host' ? 'auto' : '12px', marginRight: msg.role === 'host' ? '12px' : 'auto' }}>
                      {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: msg.role === 'host' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-tertiary)',
                      color: msg.role === 'host' ? '#fff' : 'var(--text-primary)',
                      borderBottomRightRadius: msg.role === 'host' ? '4px' : '16px',
                      borderBottomLeftRadius: msg.role === 'host' ? '16px' : '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <p style={{ margin: 0, fontSize: 'var(--font-sm)', lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                {activeTicket.status === 'Open' ? (
                  <form onSubmit={handleReply} style={{ display: 'flex', gap: 'var(--space-sm)', position: 'relative' }}>
                    <input 
                      type="text" 
                      style={{ flex: 1, padding: '14px 48px 14px 20px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: 'var(--font-sm)', transition: 'border-color var(--transition-fast)' }}
                      placeholder="Type your reply to the student..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
                      <Send size={16} style={{ marginLeft: '-2px' }} />
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', padding: 'var(--space-xs)' }}>
                    This conversation is closed.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-2xl)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                <MessageCircle size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: 'var(--font-base)', color: 'var(--text-secondary)', marginBottom: '8px' }}>No Ticket Selected</h3>
              <p style={{ fontSize: 'var(--font-sm)', textAlign: 'center' }}>Select a ticket from the inbox to view<br/>the conversation details.</p>
            </div>
          )}
        </div>

        {/* Right Column: Context Panel */}
        <div style={{ width: '280px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Student Context</h3>
          </div>
          {activeTicket ? (
            <div style={{ padding: 'var(--space-xl) var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--accent), var(--secondary))', color: '#fff', fontSize: 'var(--font-2xl)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                {activeTicket.student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', textAlign: 'center' }}>{activeTicket.student.name}</h4>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>{activeTicket.student.regNumber}</p>
              
              <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>Email Address</span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{activeTicket.student.email}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>Ticket Created</span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{new Date(activeTicket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)', textAlign: 'center' }}>Context details will appear here when a ticket is selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostSupport;
