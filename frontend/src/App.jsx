import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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

function App() {
  return (
    <ThemeProvider>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
