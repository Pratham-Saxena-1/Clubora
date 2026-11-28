import { useNavigate } from 'react-router-dom';
import { Users, Calendar, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { clubTracks } from '../data/landingClubs';

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

const allClubs = clubTracks.flat();

function LandingPage() {
  const navigate = useNavigate();
  const landingRef = useRef(null);
  const beaconRef = useRef(null);
  const historyRef = useRef([]);
  const timeoutRef = useRef(null);
  const isRotatingRef = useRef(false);

  const [illuminatedClub, setIlluminatedClub] = useState(allClubs[0]);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDir, setRotationDir] = useState('clockwise');

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!landingRef.current) return;
    const x = e.clientX;
    const y = e.clientY;

    landingRef.current.style.setProperty('--mouse-x', `${x}px`);
    landingRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (beaconRef.current) {
      beaconRef.current.style.setProperty('--beacon-x', `${x}px`);
      beaconRef.current.style.setProperty('--beacon-y', `${y}px`);
    }

    const now = performance.now();
    const history = historyRef.current;
    history.push({ x, y, time: now });

    // Keep sliding window of recent 550ms
    while (history.length > 0 && now - history[0].time > 550) {
      history.shift();
    }

    if (history.length >= 5) {
      // Filter out sub-pixel jitter
      const filtered = [history[0]];
      for (let i = 1; i < history.length; i++) {
        const prev = filtered[filtered.length - 1];
        const dist = Math.hypot(history[i].x - prev.x, history[i].y - prev.y);
        if (dist >= 2.5) {
          filtered.push(history[i]);
        }
      }

      if (filtered.length >= 5) {
        let signedTurnSum = 0;
        let absTurnSum = 0;
        let lastHeading = Math.atan2(filtered[1].y - filtered[0].y, filtered[1].x - filtered[0].x);

        for (let i = 2; i < filtered.length; i++) {
          const curHeading = Math.atan2(filtered[i].y - filtered[i-1].y, filtered[i].x - filtered[i-1].x);
          let diff = curHeading - lastHeading;
          while (diff > Math.PI) diff -= 2 * Math.PI;
          while (diff < -Math.PI) diff += 2 * Math.PI;
          lastHeading = curHeading;

          signedTurnSum += diff;
          absTurnSum += Math.abs(diff);
        }

        const consistency = absTurnSum > 0 ? Math.abs(signedTurnSum) / absTurnSum : 0;

        // Detect circular / rotation gesture in either clockwise or anticlockwise direction
        if (Math.abs(signedTurnSum) >= 1.5 && consistency >= 0.58) {
          const dir = signedTurnSum > 0 ? 'clockwise' : 'anticlockwise';

          if (!isRotatingRef.current) {
            isRotatingRef.current = true;
            setIsRotating(true);
            setRotationDir(dir);
            // Select a club based on cursor position
            const clubIdx = Math.abs(Math.floor((x * 7 + y * 13) % allClubs.length));
            setIlluminatedClub(allClubs[clubIdx]);
          } else {
            setRotationDir(dir);
          }

          // Reset idle timeout to smoothly hide illuminated logo when rotation stops
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            isRotatingRef.current = false;
            setIsRotating(false);
          }, 700);
        }
      }
    }
  };

  return (
    <div className="landing" ref={landingRef} onMouseMove={handleMouseMove}>
      {/* Base Starting Grid Background */}
      <div className="landing__bg-grid" />

      {/* Dynamic Ambient Burgundy Glows */}
      <div className="landing__bg-glow landing__bg-glow--1" />
      <div className="landing__bg-glow landing__bg-glow--2" />

      {/* 108 Unique Club & Community Logos Dynamic Embedded Banner (Base Layer) */}
      <div className="landing__clubs-banner" aria-hidden="true">
        {clubTracks.map((track, trackIdx) => (
          <div
            key={`track-${trackIdx}`}
            className={`landing__clubs-track landing__clubs-track--${trackIdx % 2 === 0 ? 'left' : 'right'} track-speed-${trackIdx + 1}`}
          >
            {[...track, ...track].map((club, idx) => {
              const IconComp = club.icon;
              return (
                <div key={`${club.id}-${idx}`} className="landing__club-badge">
                  <span className="landing__club-badge-icon">
                    <IconComp size={13} strokeWidth={2.2} />
                  </span>
                  <span className="landing__club-badge-name">{club.name}</span>
                  <span className="landing__club-badge-tag">{club.tag}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Interactive Cursor Spotlight over the Logo Banner */}
      <div className="landing__clubs-banner landing__clubs-banner--highlight" aria-hidden="true">
        {clubTracks.map((track, trackIdx) => (
          <div
            key={`highlight-track-${trackIdx}`}
            className={`landing__clubs-track landing__clubs-track--${trackIdx % 2 === 0 ? 'left' : 'right'} track-speed-${trackIdx + 1}`}
          >
            {[...track, ...track].map((club, idx) => {
              const IconComp = club.icon;
              return (
                <div key={`hl-${club.id}-${idx}`} className="landing__club-badge landing__club-badge--highlight">
                  <span className="landing__club-badge-icon">
                    <IconComp size={13} strokeWidth={2.2} />
                  </span>
                  <span className="landing__club-badge-name">{club.name}</span>
                  <span className="landing__club-badge-tag">{club.tag}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Central Vignette & Gradient Mask for Ultra-Clear Content Visibility */}
      <div className="landing__bg-vignette" />

      {/* Enhanced Cursor Illumination: Ambient Burgundy Aura & Bright Illuminated Grid Lines */}
      <div className="landing__bg-grid-glow" />
      <div className="landing__bg-grid-highlight" />

      {/* Rotation Activated Illuminated Club Logo Beacon */}
      {illuminatedClub && (
        <div
          ref={beaconRef}
          className={`landing__illuminated-beacon ${isRotating ? 'is-active' : ''}`}
          aria-hidden="true"
        >
          <div className={`landing__beacon-halo landing__beacon-halo--${rotationDir}`} />
          <div className="landing__beacon-card">
            <span className="landing__beacon-icon">
              {(() => {
                const ActiveIcon = illuminatedClub.icon;
                return <ActiveIcon size={18} strokeWidth={2.5} />;
              })()}
            </span>
            <div className="landing__beacon-content">
              <span className="landing__beacon-name">{illuminatedClub.name}</span>
              <span className="landing__beacon-tag">{illuminatedClub.tag}</span>
            </div>
          </div>
        </div>
      )}

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
