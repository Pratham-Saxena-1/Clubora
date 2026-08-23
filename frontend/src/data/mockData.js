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

export const teamMembers = [
  { id: 1, name: 'Jessica Wang', role: 'Technical Lead', initials: 'JW', regNumber: 'REG-2024-045', email: 'jess.w@university.edu', dateOfJoining: '2023-09-01', gender: 'Female', contact: '+1 (555) 123-4567', photo: null, level: 2, parentId: null },
  { id: 2, name: 'Marcus Johnson', role: 'Event Coordinator', initials: 'MJ', regNumber: 'REG-2024-078', email: 'marcus.j@university.edu', dateOfJoining: '2024-01-15', gender: 'Male', contact: '+1 (555) 987-6543', photo: null, level: 2, parentId: null },
  { id: 3, name: 'Priya Patel', role: 'Marketing Head', initials: 'PP', regNumber: 'REG-2024-112', email: 'priya.p@university.edu', dateOfJoining: '2023-11-10', gender: 'Female', contact: '+1 (555) 456-7890', photo: null, level: 3, parentId: 2 },
  { id: 4, name: 'David Lee', role: 'Designer', initials: 'DL', regNumber: 'REG-2024-150', email: 'david.l@university.edu', dateOfJoining: '2024-02-20', gender: 'Male', contact: '+1 (555) 111-2222', photo: null, level: 3, parentId: 1 },
];

export const upcomingEvents = [
  { id: 1, title: 'AI & Machine Learning Workshop', date: '2026-09-15', time: '10:00 AM', description: 'A hands-on workshop covering the fundamentals of AI/ML, neural networks, and real-world applications using Python and TensorFlow.', registrations: 24, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
  { id: 2, title: 'Hackathon 2026: Code for Change', date: '2026-10-05', time: '09:00 AM', description: '48-hour hackathon focused on building solutions for social impact. Teams of 3-5 compete for prizes and mentorship opportunities.', registrations: 56, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
  { id: 3, title: 'Web3 & Blockchain Seminar', date: '2026-10-20', time: '02:00 PM', description: 'Explore the decentralized web, smart contracts, and how blockchain is transforming industries beyond cryptocurrency.', registrations: 38, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
  { id: 4, title: 'UI/UX Design Sprint', date: '2026-11-02', time: '11:00 AM', description: 'Learn user-centered design principles and wireframing techniques using Figma. Ideal for beginners.', registrations: 45, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
  { id: 5, title: 'Cybersecurity 101', date: '2026-11-15', time: '03:00 PM', description: 'Introduction to ethical hacking, network security, and common vulnerabilities. Capture the flag exercises included.', registrations: 62, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
  { id: 6, title: 'Tech Startup Mixer', date: '2026-12-01', time: '05:00 PM', description: 'Networking event with local tech startup founders. Pitch your ideas and find co-founders for your next big project.', registrations: 85, coverImage: null, club: { name: 'TechVerse Club', shortName: 'TV' } },
];

export const pastEvents = [
  { id: 101, title: 'Intro to Python Bootcamp', date: '2026-02-10', attendees: 120, images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80'] },
  { id: 102, title: 'Cloud Computing with AWS', date: '2026-03-22', attendees: 85, images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'] },
  { id: 103, title: 'TechVerse Annual Gala', date: '2026-05-15', attendees: 200, images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'] },
];

export const mockNotifications = [
  { id: 1, text: 'New application from Sarah Johnson', time: '5m ago', read: false },
  { id: 2, text: 'Payment verified for James Lee', time: '1h ago', read: false },
  { id: 3, text: 'New support ticket: "Cannot access..."', time: '2h ago', read: true },
];

export const applicantsData = [
  { id: 1, name: 'Sarah Johnson', initials: 'SJ', regNumber: 'REG-2024-045', appliedRole: 'Technical Lead', submissionDate: '2026-08-10', status: 'pending' },
  { id: 2, name: 'Michael Park', initials: 'MP', regNumber: 'REG-2024-078', appliedRole: 'Event Coordinator', submissionDate: '2026-08-12', status: 'pending' },
  { id: 3, name: 'Priya Sharma', initials: 'PS', regNumber: 'REG-2024-112', appliedRole: 'Content Writer', submissionDate: '2026-08-14', status: 'pending' },
  { id: 4, name: 'David Kim', initials: 'DK', regNumber: 'REG-2024-156', appliedRole: 'UI/UX Designer', submissionDate: '2026-08-15', status: 'pending' },
  { id: 5, name: 'Emily Chen', initials: 'EC', regNumber: 'REG-2024-189', appliedRole: 'Marketing Intern', submissionDate: '2026-08-16', status: 'pending' },
  { id: 6, name: 'Rahul Singh', initials: 'RS', regNumber: 'REG-2024-201', appliedRole: 'Technical Lead', submissionDate: '2026-08-17', status: 'pending' },
  { id: 7, name: 'Amanda White', initials: 'AW', regNumber: 'REG-2024-222', appliedRole: 'Event Coordinator', submissionDate: '2026-08-18', status: 'pending' },
  { id: 8, name: 'James Taylor', initials: 'JT', regNumber: 'REG-2024-245', appliedRole: 'Content Writer', submissionDate: '2026-08-19', status: 'pending' },
];

export const registrationsData = [
  { id: 1, participant: { name: 'Emma Wilson', initials: 'EW', email: 'emma.w@university.edu', regNumber: 'REG-2024-033' }, eventName: 'AI & Machine Learning Workshop', registrationDate: '2026-08-18', registrationTime: '02:34 PM', paymentVerified: false },
  { id: 2, participant: { name: 'James Lee', initials: 'JL', email: 'james.lee@university.edu', regNumber: 'REG-2024-051' }, eventName: 'Hackathon 2026: Code for Change', registrationDate: '2026-08-19', registrationTime: '11:15 AM', paymentVerified: true },
  { id: 3, participant: { name: 'Sophia Martinez', initials: 'SM', email: 'sophia.m@university.edu', regNumber: 'REG-2024-067' }, eventName: 'Web3 & Blockchain Seminar', registrationDate: '2026-08-20', registrationTime: '09:45 AM', paymentVerified: false },
  { id: 4, participant: { name: 'William Brown', initials: 'WB', email: 'william.b@university.edu', regNumber: 'REG-2024-082' }, eventName: 'AI & Machine Learning Workshop', registrationDate: '2026-08-20', registrationTime: '10:30 AM', paymentVerified: true },
  { id: 5, participant: { name: 'Olivia Davis', initials: 'OD', email: 'olivia.d@university.edu', regNumber: 'REG-2024-095' }, eventName: 'UI/UX Design Sprint', registrationDate: '2026-08-21', registrationTime: '01:20 PM', paymentVerified: false },
  { id: 6, participant: { name: 'Daniel Miller', initials: 'DM', email: 'daniel.m@university.edu', regNumber: 'REG-2024-118' }, eventName: 'Hackathon 2026: Code for Change', registrationDate: '2026-08-21', registrationTime: '03:45 PM', paymentVerified: true },
  { id: 7, participant: { name: 'Ava Wilson', initials: 'AW', email: 'ava.w@university.edu', regNumber: 'REG-2024-134' }, eventName: 'Cybersecurity 101', registrationDate: '2026-08-22', registrationTime: '08:15 AM', paymentVerified: true },
  { id: 8, participant: { name: 'Lucas Moore', initials: 'LM', email: 'lucas.m@university.edu', regNumber: 'REG-2024-150' }, eventName: 'Tech Startup Mixer', registrationDate: '2026-08-22', registrationTime: '04:55 PM', paymentVerified: false },
];

export const ticketsData = [
  { id: 1, participant: { name: 'Emma Wilson', initials: 'EW', email: 'emma.w@university.edu', regNumber: 'REG-2024-033' }, registeredEvent: 'AI & Machine Learning Workshop', qrPass: { issued: false }, certificate: { issued: false } },
  { id: 2, participant: { name: 'James Lee', initials: 'JL', email: 'james.lee@university.edu', regNumber: 'REG-2024-051' }, registeredEvent: 'Hackathon 2026: Code for Change', qrPass: { issued: true }, certificate: { issued: false } },
  { id: 3, participant: { name: 'Sophia Martinez', initials: 'SM', email: 'sophia.m@university.edu', regNumber: 'REG-2024-067' }, registeredEvent: 'Web3 & Blockchain Seminar', qrPass: { issued: true }, certificate: { issued: true } },
  { id: 4, participant: { name: 'William Brown', initials: 'WB', email: 'william.b@university.edu', regNumber: 'REG-2024-082' }, registeredEvent: 'AI & Machine Learning Workshop', qrPass: { issued: false }, certificate: { issued: false } },
  { id: 5, participant: { name: 'Olivia Davis', initials: 'OD', email: 'olivia.d@university.edu', regNumber: 'REG-2024-095' }, registeredEvent: 'UI/UX Design Sprint', qrPass: { issued: true }, certificate: { issued: false } },
  { id: 6, participant: { name: 'Daniel Miller', initials: 'DM', email: 'daniel.m@university.edu', regNumber: 'REG-2024-118' }, registeredEvent: 'Hackathon 2026: Code for Change', qrPass: { issued: false }, certificate: { issued: true } },
  { id: 7, participant: { name: 'Ava Wilson', initials: 'AW', email: 'ava.w@university.edu', regNumber: 'REG-2024-134' }, registeredEvent: 'Cybersecurity 101', qrPass: { issued: true }, certificate: { issued: true } },
  { id: 8, participant: { name: 'Lucas Moore', initials: 'LM', email: 'lucas.m@university.edu', regNumber: 'REG-2024-150' }, registeredEvent: 'Tech Startup Mixer', qrPass: { issued: false }, certificate: { issued: false } },
];

export const recruitmentStats = {
  activeVacancies: 4,
  totalApplicants: 24,
  interviewsSet: 8,
  hiredThisMonth: 3,
};

export const vacanciesData = [
  { id: 1, title: 'Technical Lead', type: 'Core Team', applicants: 8, deadline: '2026-09-30', description: 'Lead the technical direction of club projects and mentor junior members.' },
  { id: 2, title: 'Event Coordinator', type: 'Operations', applicants: 5, deadline: '2026-09-15', description: 'Organize and manage logistics for workshops, seminars, and the annual hackathon.' },
  { id: 3, title: 'Content Writer', type: 'Marketing', applicants: 7, deadline: '2026-09-20', description: 'Create engaging content for our newsletter, blog, and social media channels.' },
  { id: 4, title: 'UI/UX Designer', type: 'Design', applicants: 4, deadline: '2026-10-05', description: 'Design user interfaces for club projects and promotional materials.' },
];

export const supportCategories = ['All', 'Payment Issue', 'Technical', 'Registration', 'Event Detail'];

export const supportTickets = [
  {
    id: 1,
    student: { name: 'Emma Wilson', regNumber: 'REG-2024-033', email: 'emma.w@university.edu' },
    subject: 'Cannot access payment gateway',
    category: 'Payment Issue',
    status: 'Open',
    createdAt: '2026-08-20T10:30:00Z',
    messages: [
      { id: 101, sender: 'Emma Wilson', role: 'student', text: 'Hi, I am trying to pay for the AI Workshop but the gateway keeps throwing a 500 error.', timestamp: '2026-08-20T10:30:00Z' },
      { id: 102, sender: 'Alex Chen', role: 'host', text: 'Hi Emma, we are currently experiencing issues with the payment provider. We will notify you once it is resolved.', timestamp: '2026-08-20T11:15:00Z' }
    ]
  },
  {
    id: 2,
    student: { name: 'James Lee', regNumber: 'REG-2024-051', email: 'james.lee@university.edu' },
    subject: 'Hackathon team size limit?',
    category: 'Event Detail',
    status: 'Open',
    createdAt: '2026-08-21T09:15:00Z',
    messages: [
      { id: 201, sender: 'James Lee', role: 'student', text: 'Can we have a team of 6 for the hackathon? The page says 3-5.', timestamp: '2026-08-21T09:15:00Z' }
    ]
  },
  {
    id: 3,
    student: { name: 'Sophia Martinez', regNumber: 'REG-2024-067', email: 'sophia.m@university.edu' },
    subject: 'Did not receive confirmation email',
    category: 'Registration',
    status: 'Resolved',
    createdAt: '2026-08-19T14:20:00Z',
    messages: [
      { id: 301, sender: 'Sophia Martinez', role: 'student', text: 'I registered for the Web3 seminar but no email arrived.', timestamp: '2026-08-19T14:20:00Z' },
      { id: 302, sender: 'Alex Chen', role: 'host', text: 'Hi Sophia, I just manually resent it. Please check your spam folder as well.', timestamp: '2026-08-19T15:00:00Z' },
      { id: 303, sender: 'Sophia Martinez', role: 'student', text: 'Got it! It was in spam. Thanks!', timestamp: '2026-08-19T15:10:00Z' }
    ]
  },
  {
    id: 4,
    student: { name: 'William Brown', regNumber: 'REG-2024-082', email: 'william.b@university.edu' },
    subject: 'Error updating profile picture',
    category: 'Technical',
    status: 'Open',
    createdAt: '2026-08-21T11:45:00Z',
    messages: [
      { id: 401, sender: 'William Brown', role: 'student', text: 'The upload button for profile pictures is disabled on my end.', timestamp: '2026-08-21T11:45:00Z' }
    ]
  },
  {
    id: 5,
    student: { name: 'Olivia Davis', regNumber: 'REG-2024-095', email: 'olivia.d@university.edu' },
    subject: 'Refund request for design sprint',
    category: 'Payment Issue',
    status: 'Open',
    createdAt: '2026-08-21T16:30:00Z',
    messages: [
      { id: 501, sender: 'Olivia Davis', role: 'student', text: 'I can no longer attend the design sprint. Is it possible to get a refund?', timestamp: '2026-08-21T16:30:00Z' }
    ]
  }
];

// --- STUDENT MOCK DATA ---

export const currentStudent = {
  name: 'Pratham Saxena',
  regNumber: '24BAI10712',
  email: 'pratham.saxena2024@vitstudent.ac.in',
  branch: 'Computer Science & Engineering (AI & ML)',
  photo: null,
};

export const studentStats = {
  registeredEvents: 12,
  eventsAttended: 8,
  certificatesClaimed: 5,
  applicationsSent: 4,
};

export const studentRegisteredEvents = [
  { id: 1, title: 'AI & Machine Learning Workshop', date: '2026-09-15', time: '10:00 AM', location: 'Main Auditorium', status: 'CONFIRMED', club: 'TechVerse', clubLogo: 'TV', isPaid: true },
  { id: 2, title: 'Hackathon 2026: Code for Change', date: '2026-10-05', time: '09:00 AM', location: 'Innovation Lab', status: 'PAYMENT PENDING', club: 'TechVerse', clubLogo: 'TV', isPaid: false },
];

export const studentApplications = [
  { id: 1, club: 'TechVerse', role: 'Technical Lead', status: 'Accepted', date: '2026-08-10' },
  { id: 2, club: 'DesignHub', role: 'UI/UX Designer', status: 'Pending', date: '2026-08-15' },
];

export const studentCertificates = [
  { id: 1, title: 'Intro to Python Bootcamp Certificate', date: '2026-02-10', club: 'TechVerse' },
  { id: 2, title: 'Cloud Computing with AWS Certificate', date: '2026-03-22', club: 'TechVerse' },
];

export const allCampusClubs = [
  { id: 1, name: 'TechVerse Club', shortName: 'TV', category: 'Technology & Innovation', memberCount: 120, eventsHosted: 15 },
  { id: 2, name: 'DesignHub', shortName: 'DH', category: 'Arts & Design', memberCount: 85, eventsHosted: 8 },
  { id: 3, name: 'Debate Society', shortName: 'DS', category: 'Academic Debate', memberCount: 50, eventsHosted: 22 },
];

