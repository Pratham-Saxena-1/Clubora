import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  CreditCard,
  Ticket,
  HeadphonesIcon,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/host/club-profile', icon: Users, label: 'Club Profile' },
  { to: '/host/recruitment', icon: UserPlus, label: 'Recruitment' },
  { to: '/host/applicants', icon: ClipboardList, label: 'Applicants' },
  { to: '/host/registrations', icon: CreditCard, label: 'Registrations' },
  { to: '/host/tickets-certs', icon: Ticket, label: 'Tickets & Certs' },
  { to: '/host/support', icon: HeadphonesIcon, label: 'Support' },
];

function HostSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="host-sidebar">
      <div className="host-sidebar__brand">
        <div className="host-sidebar__logo">C</div>
        <span className="host-sidebar__brand-text">CLUBORA</span>
      </div>

      <nav className="host-sidebar__nav">
        <ul className="host-sidebar__nav-list">
          {navItems.map((item) => (
            <li key={item.to} className="host-sidebar__nav-item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `host-sidebar__nav-link${isActive ? ' host-sidebar__nav-link--active' : ''}`
                }
              >
                <item.icon className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
                <span className="host-sidebar__nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="host-sidebar__footer">
        <NavLink
          to="/host/settings"
          className={({ isActive }) =>
            `host-sidebar__nav-link${isActive ? ' host-sidebar__nav-link--active' : ''}`
          }
        >
          <Settings className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
          <span className="host-sidebar__nav-label">Settings</span>
        </NavLink>

        <div className="host-sidebar__divider" />

        <button className="host-sidebar__logout" onClick={handleLogout}>
          <LogOut className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
          <span className="host-sidebar__nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default HostSidebar;
