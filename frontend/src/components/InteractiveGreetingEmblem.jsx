import { useState, useRef, useEffect } from 'react';
import './InteractiveGreetingEmblem.css';

const VIBES = [
  'Ready to explore',
  'Make today count',
  'Stay curious',
  'Clubora ready',
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function InteractiveGreetingEmblem() {
  const wrapRef = useRef(null);
  const burstTimeoutRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [vibeIndex, setVibeIndex] = useState(-1);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

    wrapRef.current.style.setProperty('--tilt-x', `${(-dy * 16).toFixed(1)}deg`);
    wrapRef.current.style.setProperty('--tilt-y', `${(dx * 16).toFixed(1)}deg`);
    wrapRef.current.style.setProperty('--mag-x', `${(dx * 3).toFixed(1)}px`);
    wrapRef.current.style.setProperty('--mag-y', `${(dy * 3).toFixed(1)}px`);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (!wrapRef.current) return;
    wrapRef.current.style.setProperty('--tilt-x', '0deg');
    wrapRef.current.style.setProperty('--tilt-y', '0deg');
    wrapRef.current.style.setProperty('--mag-x', '0px');
    wrapRef.current.style.setProperty('--mag-y', '0px');
  };

  const handleClick = () => {
    setBursting(false);
    requestAnimationFrame(() => setBursting(true));
    setVibeIndex((prev) => (prev + 1) % VIBES.length);
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    burstTimeoutRef.current = setTimeout(() => setBursting(false), 650);
  };

  const tooltipText = vibeIndex >= 0 ? VIBES[vibeIndex] : getTimeGreeting();

  return (
    <button
      ref={wrapRef}
      type="button"
      className={`greeting-emblem${hovered ? ' is-hovered' : ''}${bursting ? ' is-bursting' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`Campus greeting emblem — ${tooltipText}`}
    >
      <span className="greeting-emblem__ring" aria-hidden="true" />
      <span className="greeting-emblem__sparks" aria-hidden="true">
        <span className="greeting-emblem__spark" style={{ '--angle': '0deg' }} />
        <span className="greeting-emblem__spark" style={{ '--angle': '60deg' }} />
        <span className="greeting-emblem__spark" style={{ '--angle': '120deg' }} />
        <span className="greeting-emblem__spark" style={{ '--angle': '180deg' }} />
        <span className="greeting-emblem__spark" style={{ '--angle': '240deg' }} />
        <span className="greeting-emblem__spark" style={{ '--angle': '300deg' }} />
      </span>

      <svg
        className="greeting-emblem__svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main sculpted 4-point star */}
        <path
          className="greeting-emblem__main-star"
          d="M11.5 2.5C11.7 7.1 13.9 9.3 18.5 9.5C13.9 9.7 11.7 11.9 11.5 16.5C11.3 11.9 9.1 9.7 4.5 9.5C9.1 9.3 11.3 7.1 11.5 2.5Z"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinejoin="round"
        />
        {/* Satellite top-right star */}
        <path
          className="greeting-emblem__sat-top"
          d="M19 3.5V6.5M17.5 5H20.5"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
        />
        {/* Satellite bottom-left ring */}
        <circle
          className="greeting-emblem__sat-dot"
          cx="5.5"
          cy="17.5"
          r="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <span className="greeting-emblem__tooltip" aria-hidden="true">
        {tooltipText}
      </span>
    </button>
  );
}
