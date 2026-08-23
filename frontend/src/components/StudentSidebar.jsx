import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Users,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/discover', icon: Compass, label: 'Discover Events' },
  { to: '/student/clubs', icon: Users, label: 'Clubs Profile' },
  { to: '/student/recruitments', icon: Send, label: 'Club Recruitments' },
  { to: '/student/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/student/support', icon: HeadphonesIcon, label: 'Support' },
];

function StudentSidebar() {
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
          to="/student/settings"
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

export default StudentSidebar;
