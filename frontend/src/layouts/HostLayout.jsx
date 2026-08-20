import { Outlet } from 'react-router-dom';
import HostSidebar from '../components/HostSidebar';
import HostTopBar from '../components/HostTopBar';
import './HostLayout.css';

function HostLayout() {
  return (
    <div className="host-layout">
      <HostSidebar />
      <HostTopBar />
      <main className="host-layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default HostLayout;
