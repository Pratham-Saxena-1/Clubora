import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import HostLayout from './layouts/HostLayout';
import LandingPage from './pages/LandingPage';
import HostDashboard from './pages/HostDashboard';
import HostClubProfile from './pages/HostClubProfile';
import HostRecruitment from './pages/HostRecruitment';
import HostApplicants from './pages/HostApplicants';
import HostRegistrations from './pages/HostRegistrations';
import HostTicketsCerts from './pages/HostTicketsCerts';
import HostSupport from './pages/HostSupport';
import HostSettings from './pages/HostSettings';

import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/StudentDashboard';
import StudentDiscover from './pages/StudentDiscover';
import StudentClubs from './pages/StudentClubs';
import StudentRecruitments from './pages/StudentRecruitments';
import StudentFeedback from './pages/StudentFeedback';
import StudentSupport from './pages/StudentSupport';
import StudentSettings from './pages/StudentSettings';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/host" element={<HostLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<HostDashboard />} />
              <Route path="club-profile" element={<HostClubProfile />} />
              <Route path="recruitment" element={<HostRecruitment />} />
              <Route path="applicants" element={<HostApplicants />} />
              <Route path="registrations" element={<HostRegistrations />} />
              <Route path="tickets-certs" element={<HostTicketsCerts />} />
              <Route path="support" element={<HostSupport />} />
              <Route path="settings" element={<HostSettings />} />
            </Route>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="discover" element={<StudentDiscover />} />
              <Route path="clubs" element={<StudentClubs />} />
              <Route path="recruitments" element={<StudentRecruitments />} />
              <Route path="feedback" element={<StudentFeedback />} />
              <Route path="support" element={<StudentSupport />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
