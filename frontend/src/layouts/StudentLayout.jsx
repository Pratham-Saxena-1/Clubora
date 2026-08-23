import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentTopBar from '../components/StudentTopBar';

function StudentLayout() {
  return (
    <div className="host-layout">
      <StudentSidebar />
      <StudentTopBar />
      <main className="host-layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
