import { Plus, Briefcase, Users, CalendarCheck, UserCheck, Inbox } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import HostStatCard from '../components/HostStatCard';
import { recruitmentStats } from '../data/mockData';
import './HostRecruitment.css';

function HostRecruitment() {
  return (
    <div className="host-recruitment">
      <HostPageHeader
        title="Recruitment Dashboard"
        subtitle="Manage vacancies, view recruitment processes, and analyze applicant profiles."
        action={
          <button className="host-recruitment__publish-btn" id="publish-vacancy-btn">
            <Plus size={18} strokeWidth={2} />
            <span>Publish Vacancy</span>
          </button>
        }
      />

      <div className="host-recruitment__stats">
        <HostStatCard
          icon={Briefcase}
          value={recruitmentStats.activeVacancies}
          label="Active Vacancies"
          colorClass="host-stat-card--info"
        />
        <HostStatCard
          icon={Users}
          value={recruitmentStats.totalApplicants}
          label="Total Applicants"
          colorClass="host-stat-card--success"
        />
        <HostStatCard
          icon={CalendarCheck}
          value={recruitmentStats.interviewsSet}
          label="Interviews Set"
          colorClass="host-stat-card--warning"
        />
        <HostStatCard
          icon={UserCheck}
          value={recruitmentStats.hiredThisMonth}
          label="Hired This Month"
          colorClass="host-stat-card--danger"
        />
      </div>

      <section className="host-recruitment__section">
        <h2 className="host-recruitment__section-title">Active Recruitment Roles</h2>
        <div className="host-recruitment__empty">
          <Inbox size={48} strokeWidth={1.2} />
          <p className="host-recruitment__empty-text">No active recruitment roles published.</p>
          <p className="host-recruitment__empty-hint">Click &quot;Publish Vacancy&quot; to create your first role listing.</p>
        </div>
      </section>
    </div>
  );
}

export default HostRecruitment;
