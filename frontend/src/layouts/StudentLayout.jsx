import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentTopBar from '../components/StudentTopBar';
import { useSidebar } from '../context/SidebarContext';

function StudentLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`host-layout ${isCollapsed ? 'host-layout--collapsed' : ''}`}>
      <StudentSidebar />
      <StudentTopBar />
      <main className={`host-layout__main ${isCollapsed ? 'host-layout__main--collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
