const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Club = require('../models/Club');

exports.getEvents = async (req, res, next) => {
  try {
    const { clubId } = req.query;
    let query = {};
    if (clubId) query.clubId = clubId;
    const events = await Event.find(query).populate('clubId', 'name logo');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'name logo');
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found', code: 'NOT_FOUND' } });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const registration = await EventRegistration.create({
      eventId: req.params.id,
      studentId: req.user.id,
      answers: Array.isArray(answers) ? answers : (answers ? JSON.parse(answers) : [])
    });
    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ studentId: req.user.id }).populate({
      path: 'eventId',
      populate: { path: 'clubId', select: 'name' }
    });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.checkInRegistration = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      { checkedIn: true },
      { new: true }
    );
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.uploadQrTicket = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Please upload an image', code: 'BAD_REQUEST' } });
    }
    const filePath = `/uploads/event-qr/${req.file.filename}`;
    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      { qrTicket: filePath },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.uploadGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Please upload an image', code: 'BAD_REQUEST' } });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    
    event.galleryImages.push(`/uploads/gallery/${req.file.filename}`);
    await event.save();
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id }).populate('studentId', 'name email profilePic');
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.getClubRegistrations = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id });
    if (!club) return res.json([]);
    const events = await Event.find({ clubId: club._id });
    const eventIds = events.map(e => e._id);
    const registrations = await EventRegistration.find({ eventId: { $in: eventIds } })
      .populate('studentId', 'name email regNumber')
      .populate('eventId', 'title');
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};
