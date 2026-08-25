import { useNavigate } from 'react-router-dom';
import { Users, Calendar, BarChart3, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Club Management',
    description: 'Build and manage your club team hierarchy with role-based access and seamless coordination.',
  },
  {
    icon: Calendar,
    title: 'Event Orchestration',
    description: 'Create, publish, and track campus events with registration management and payment verification.',
  },
  {
    icon: BarChart3,
    title: 'Recruitment Pipeline',
    description: 'Publish vacancies, review applicants, schedule interviews, and onboard new team members.',
  },
  {
    icon: Shield,
    title: 'Tickets & Certificates',
    description: 'Issue scannable QR entry passes and generate achievement certificates for participants.',
  },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing__bg-grid" />
      <div className="landing__bg-glow landing__bg-glow--1" />
      <div className="landing__bg-glow landing__bg-glow--2" />

      <header className="landing__header">
        <div className="landing__logo">
          <div className="landing__logo-icon">C</div>
          <span className="landing__logo-text">CLUBORA</span>
        </div>
      </header>

      <section className="landing__hero">
        <div className="landing__hero-badge">Campus Club & Event Management</div>
        <h1 className="landing__hero-title">
          Organize. Engage.<br />
          <span className="landing__hero-title--accent">Inspire.</span>
        </h1>
        <p className="landing__hero-subtitle">
          The all-in-one platform for campus club hosts and students.
          Manage events, recruit members, issue certificates — all in one place.
        </p>

        <div className="landing__cta-group">
          <button
            className="landing__cta landing__cta--host"
            onClick={() => navigate('/login')}
            id="sign-in-host"
          >
            <span>Sign In</span>
            <ArrowRight size={18} strokeWidth={2} />
          </button>
          <button
            className="landing__cta landing__cta--student"
            onClick={() => navigate('/signup')}
            id="sign-in-student"
          >
            <span>Create Account</span>
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </section>

      <section className="landing__features">
        <div className="landing__features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className={`landing__feature-card delay-${idx + 1}`}>
              <div className="landing__feature-icon-wrap">
                <feature.icon className="landing__feature-icon" size={24} strokeWidth={1.8} />
              </div>
              <h3 className="landing__feature-title">{feature.title}</h3>
              <p className="landing__feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing__footer">
        <p className="landing__footer-text">
          © 2026 Clubora · Built for campus communities
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
