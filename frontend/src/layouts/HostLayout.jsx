import { Outlet } from 'react-router-dom';
import HostSidebar from '../components/HostSidebar';
import HostTopBar from '../components/HostTopBar';
import { useSidebar } from '../context/SidebarContext';

function HostLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`host-layout ${isCollapsed ? 'host-layout--collapsed' : ''}`}>
      <HostSidebar />
      <HostTopBar />
      <main className={`host-layout__main ${isCollapsed ? 'host-layout__main--collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default HostLayout;
