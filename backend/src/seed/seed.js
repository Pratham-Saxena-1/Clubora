require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Club = require('../models/Club');
const Membership = require('../models/Membership');
const Recruitment = require('../models/Recruitment');
const Application = require('../models/Application');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Ticket = require('../models/Ticket');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clubora';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Membership.deleteMany({});
    await Recruitment.deleteMany({});
    await Application.deleteMany({});
    await Event.deleteMany({});
    await EventRegistration.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Password123!', salt);

    // Create 3 Hosts
    const hosts = [];
    for (let i = 1; i <= 3; i++) {
      hosts.push({
        name: `Host User ${i}`,
        email: `host${i}@example.com`,
        password,
        role: 'Host'
      });
    }
    const createdHosts = await User.insertMany(hosts);

    // Create 10 Students
    const students = [];
    for (let i = 1; i <= 10; i++) {
      students.push({
        name: `Student User ${i}`,
        email: `student${i}@example.com`,
        password,
        role: 'Student'
      });
    }
    const createdStudents = await User.insertMany(students);

    // Create 5 Clubs
    const clubs = [
      { name: 'Tech Club', description: 'Coding and stuff', hostId: createdHosts[0]._id, categories: ['Tech'] },
      { name: 'Art Society', description: 'Painting and design', hostId: createdHosts[1]._id, categories: ['Art'] },
      { name: 'Debate Club', description: 'Arguing professionally', hostId: createdHosts[2]._id, categories: ['Debate'] },
      { name: 'Music Band', description: 'Playing instruments', hostId: createdHosts[0]._id, categories: ['Music'] },
      { name: 'Sports Team', description: 'Football and more', hostId: createdHosts[1]._id, categories: ['Sports'] }
    ];
    const createdClubs = await Club.insertMany(clubs);

    // Create Memberships
    for (let i = 0; i < 5; i++) {
      await Membership.create({
        clubId: createdClubs[i]._id,
        userId: createdStudents[i]._id,
        role: 'Member'
      });
    }

    // Create 8 Recruitments
    const recruitments = [];
    for (let i = 0; i < 8; i++) {
      recruitments.push({
        clubId: createdClubs[i % 5]._id,
        title: `Recruitment Drive ${i + 1}`,
        description: 'Join our awesome club!',
        status: i % 2 === 0 ? 'Open' : 'Closed',
        questions: ['Why do you want to join?']
      });
    }
    const createdRecruitments = await Recruitment.insertMany(recruitments);

    // Create 15 Applications
    const applications = [];
    for (let i = 0; i < 15; i++) {
      const studentId = createdStudents[i % 10]._id;
      const recruitmentId = createdRecruitments[i % 8]._id;
      // Prevent duplicates manually for seeding
      const exists = applications.find(a => a.studentId === studentId && a.recruitmentId === recruitmentId);
      if (!exists) {
        applications.push({
          recruitmentId,
          studentId,
          status: i % 3 === 0 ? 'Accepted' : (i % 3 === 1 ? 'Pending' : 'Rejected'),
          answers: [{ question: 'Why do you want to join?', answer: 'Because it is fun!' }]
        });
      }
    }
    await Application.insertMany(applications);

    // Create 4 Events
    const events = [];
    for (let i = 0; i < 4; i++) {
      events.push({
        clubId: createdClubs[i]._id,
        title: `Event ${i + 1}`,
        description: 'Awesome event',
        dateTime: new Date(Date.now() + 86400000 * (i + 1)), // Future dates
        capacity: 100
      });
    }
    const createdEvents = await Event.insertMany(events);

    // Create Registrations
    const registrations = [];
    for (let i = 0; i < 10; i++) {
      const studentId = createdStudents[i]._id;
      const eventId = createdEvents[i % 4]._id;
      registrations.push({
        eventId,
        studentId,
        checkedIn: i % 2 === 0
      });
    }
    await EventRegistration.insertMany(registrations);

    // Create Support Tickets
    await Ticket.create({ userId: createdStudents[0]._id, subject: 'Login issue', description: 'Cannot login', type: 'Support' });
    await Ticket.create({ userId: createdHosts[1]._id, subject: 'Feature request', description: 'Add dark mode', type: 'Feedback' });

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
