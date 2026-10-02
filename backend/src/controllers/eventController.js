const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Club = require('../models/Club');
const path = require('path');
const fs = require('fs');

exports.getEvents = async (req, res, next) => {
  try {
    const { clubId } = req.query;
    let query = {};
    if (clubId) query.clubId = clubId;
    const events = await Event.find(query).populate('clubId', 'name logo').populate('formId');
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'name logo').populate('formId');
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
    const payload = { ...req.body };
    if (req.file) {
      payload.coverImage = `/uploads/${req.file.filename}`;
    }
    const event = await Event.create(payload);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.coverImage = `/uploads/${req.file.filename}`;
    }
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found' } });
    }
    // Delete all registrations for this event
    await EventRegistration.deleteMany({ eventId: event._id });
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const payload = {
      eventId: req.params.id,
      studentId: req.user.id,
    };
    if (req.file) {
      payload.paymentScreenshot = `/uploads/${req.file.filename}`;
    }
    const registration = await EventRegistration.create(payload);
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
    }).populate({ path: 'formResponseId', populate: { path: 'formId' } });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      { paymentVerified: true },
      { new: true }
    ).populate('eventId', 'title');
    
    if (registration && registration.studentId) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: registration.studentId,
        text: `Your payment for ${registration.eventId?.title} has been verified.`,
        type: 'system',
        link: '/student/events'
      });
    }

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
    
    const registration = await EventRegistration.findById(req.params.id).populate('eventId', 'title');
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }

    if (registration.qrTicket) {
      const oldPath = path.join(__dirname, '..', '..', registration.qrTicket);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const filePath = `/uploads/event-qr/${req.file.filename}`;
    registration.qrTicket = filePath;
    await registration.save();
    
    if (registration.studentId) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: registration.studentId,
        text: `Your ticket for ${registration.eventId?.title} is ready.`,
        type: 'system',
        link: '/student/events'
      });
    }
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.deleteQrTicket = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }

    if (registration.qrTicket) {
      const oldPath = path.join(__dirname, '..', '..', registration.qrTicket);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    registration.qrTicket = null;
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.uploadCertificate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Please upload a certificate', code: 'BAD_REQUEST' } });
    }

    const registration = await EventRegistration.findById(req.params.id).populate('eventId', 'title');
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }

    if (registration.certificate) {
      const oldPath = path.join(__dirname, '..', '..', registration.certificate);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const filePath = `/uploads/${req.file.filename}`;
    registration.certificate = filePath;
    await registration.save();
    
    if (registration.studentId) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: registration.studentId,
        text: `You have received a certificate for ${registration.eventId?.title}.`,
        type: 'system',
        link: '/student/events'
      });
    }
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }

    if (registration.certificate) {
      const oldPath = path.join(__dirname, '..', '..', registration.certificate);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    registration.certificate = null;
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

exports.uploadGalleryImage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: { message: 'Please upload at least one image', code: 'BAD_REQUEST' } });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    
    req.files.forEach(file => {
      event.galleryImages.push(`/uploads/gallery/${file.filename}`);
    });
    
    await event.save();
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id })
      .populate('studentId', 'name email profilePic')
      .populate({ path: 'formResponseId', populate: { path: 'formId' } });
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
      .populate('eventId', 'title')
      .populate({ path: 'formResponseId', populate: { path: 'formId' } });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};
