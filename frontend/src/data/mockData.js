export const currentUser = {
  name: 'Alex Chen',
  initials: 'AC',
  role: 'HOST',
  email: 'alex.chen@university.edu',
  regNumber: 'REG-2024-001',
};

export const clubInfo = {
  name: 'TechVerse Club',
  shortName: 'TV',
  description:
    'TechVerse is the premier technology and innovation club on campus, dedicated to fostering creativity, technical excellence, and collaborative problem-solving among students. We organize workshops, hackathons, and speaker sessions that bridge the gap between academic learning and industry practice.',
  mission:
    'To empower students with cutting-edge technical skills and create a vibrant community of innovators who shape the future of technology.',
  category: 'Technology & Innovation',
  established: 'Aug 2022',
  contacts: {
    gmail: 'techverse.club@gmail.com',
    instagram: '@techverse_official',
  },
  president: {
    name: 'Alex Chen',
    regNumber: 'REG-2024-001',
    email: 'alex.chen@university.edu',
    role: 'Lead Organizer',
    photo: null,
  },
};

export const upcomingEvents = [
  {
    id: 1,
    title: 'AI & Machine Learning Workshop',
    date: '2026-09-15',
    time: '10:00 AM',
    description:
      'A hands-on workshop covering the fundamentals of AI/ML, neural networks, and real-world applications using Python and TensorFlow.',
    registrations: 24,
    coverImage: null,
    club: { name: 'TechVerse Club', shortName: 'TV' },
  },
  {
    id: 2,
    title: 'Hackathon 2026: Code for Change',
    date: '2026-10-05',
    time: '09:00 AM',
    description:
      '48-hour hackathon focused on building solutions for social impact. Teams of 3-5 compete for prizes and mentorship opportunities.',
    registrations: 56,
    coverImage: null,
    club: { name: 'TechVerse Club', shortName: 'TV' },
  },
];

export const applicantsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    regNumber: 'REG-2024-045',
    appliedRole: 'Technical Lead',
    submissionDate: '2026-08-10',
  },
  {
    id: 2,
    name: 'Michael Park',
    initials: 'MP',
    regNumber: 'REG-2024-078',
    appliedRole: 'Event Coordinator',
    submissionDate: '2026-08-12',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    initials: 'PS',
    regNumber: 'REG-2024-112',
    appliedRole: 'Content Writer',
    submissionDate: '2026-08-14',
  },
];

export const registrationsData = [
  {
    id: 1,
    participant: {
      name: 'Emma Wilson',
      initials: 'EW',
      email: 'emma.w@university.edu',
      regNumber: 'REG-2024-033',
    },
    eventName: 'AI & Machine Learning Workshop',
    registrationDate: '2026-08-18',
    registrationTime: '02:34 PM',
    paymentVerified: false,
  },
  {
    id: 2,
    participant: {
      name: 'James Lee',
      initials: 'JL',
      email: 'james.lee@university.edu',
      regNumber: 'REG-2024-051',
    },
    eventName: 'Hackathon 2026: Code for Change',
    registrationDate: '2026-08-19',
    registrationTime: '11:15 AM',
    paymentVerified: true,
  },
];

export const ticketsData = [
  {
    id: 1,
    participant: {
      name: 'Emma Wilson',
      initials: 'EW',
      email: 'emma.w@university.edu',
      regNumber: 'REG-2024-033',
    },
    registeredEvent: 'AI & Machine Learning Workshop',
    qrPass: { issued: false },
    certificate: { issued: false },
  },
  {
    id: 2,
    participant: {
      name: 'James Lee',
      initials: 'JL',
      email: 'james.lee@university.edu',
      regNumber: 'REG-2024-051',
    },
    registeredEvent: 'Hackathon 2026: Code for Change',
    qrPass: { issued: true },
    certificate: { issued: false },
  },
];

export const recruitmentStats = {
  activeVacancies: 3,
  totalApplicants: 12,
  interviewsSet: 4,
  hiredThisMonth: 1,
};

export const supportCategories = [
  'All',
  'Payment Issue',
  'Technical',
  'Registration',
  'Event Detail',
];
