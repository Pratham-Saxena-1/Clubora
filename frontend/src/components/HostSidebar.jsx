import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  CreditCard,
  Ticket,
  QrCode,
  HeadphonesIcon,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

const navItems = [
  { to: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/host/club-profile', icon: Users, label: 'Club Profile' },
  { to: '/host/recruitment', icon: UserPlus, label: 'Recruitment' },
  { to: '/host/applicants', icon: ClipboardList, label: 'Applicants' },
  { to: '/host/registrations', icon: CreditCard, label: 'Registrations' },
  { to: '/host/tickets-certs', icon: Ticket, label: 'Tickets & Certs' },
  { to: '/host/scanner', icon: QrCode, label: 'QR Scanner' },
  { to: '/host/support', icon: HeadphonesIcon, label: 'Support' },
];

function HostSidebar() {
  const { logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`host-sidebar ${isCollapsed ? 'host-sidebar--collapsed' : ''}`}>
      <div className="host-sidebar__brand">
        <button
          className="host-sidebar__hamburger-btn"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="host-sidebar-hamburger"
        >
      <Menu size={22} strokeWidth={2} />
    </button>

        {
    !isCollapsed && (
          <div className="host-sidebar__brand-title">
            <div className="host-sidebar__logo">C</div>
            <span className="host-sidebar__brand-text">CLUBORA</span>
          </div>
    )
  }
      </div >

      <nav className="host-sidebar__nav">
        <ul className="host-sidebar__nav-list">
          {navItems.map((item) => (
            <li key={item.to} className="host-sidebar__nav-item">
              <NavLink
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `host-sidebar__nav-link${isActive ? ' host-sidebar__nav-link--active' : ''}`
                }
              >
                <item.icon className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
                {!isCollapsed && <span className="host-sidebar__nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="host-sidebar__footer">
        <NavLink
          to="/host/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `host-sidebar__nav-link${isActive ? ' host-sidebar__nav-link--active' : ''}`
          }
        >
          <Settings className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
          {!isCollapsed && <span className="host-sidebar__nav-label">Settings</span>}
        </NavLink>

        <div className="host-sidebar__divider" />

        <button
          className="host-sidebar__logout"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="host-sidebar__nav-icon" size={20} strokeWidth={1.8} />
          {!isCollapsed && <span className="host-sidebar__nav-label">Logout</span>}
        </button>
      </div>
    </aside >
  );
}

export default HostSidebar;
