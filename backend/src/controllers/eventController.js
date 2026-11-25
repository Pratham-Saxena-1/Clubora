const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Club = require('../models/Club');
const FormResponse = require('../models/FormResponse');
const Form = require('../models/Form');
const Certificate = require('../models/Certificate');
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
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });

    const payload = {
      eventId: req.params.id,
      studentId: req.user.id,
    };
    if (req.file) {
      payload.paymentScreenshot = `/uploads/${req.file.filename}`;
    }
    const registration = await EventRegistration.create(payload);

    // Automatically generate QR code if event is free
    if (!event.isPaid) {
      const { confirmAndAttachQR } = require('../utils/qrHelper');
      await confirmAndAttachQR(registration, event.title);
    }

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ studentId: req.user.id }).populate({
      path: 'eventId',
      populate: { path: 'clubId', select: 'name logo' }
    }).populate({ path: 'formResponseId', populate: { path: 'formId' } });

    // Sync from Certificate collection if any certificates were issued there
    try {
      const Certificate = require('../models/Certificate');
      const certs = await Certificate.find({ studentId: req.user.id });
      const certMap = {};
      for (const c of certs) {
        if (c.eventId) certMap[c.eventId.toString()] = c.fileUrl;
      }

      for (const reg of registrations) {
        if (reg.eventId && certMap[reg.eventId._id.toString()] && !reg.certificate) {
          reg.certificate = certMap[reg.eventId._id.toString()];
          await EventRegistration.findByIdAndUpdate(reg._id, { certificate: reg.certificate });
        }
      }
    } catch (syncErr) {
      console.warn('Error syncing certificates for student registrations:', syncErr.message);
    }

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id).populate('eventId', 'title');
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found' } });
    }

    registration.paymentVerified = true;

    // Automatically generate QR entry pass when payment is verified
    const { confirmAndAttachQR } = require('../utils/qrHelper');
    await confirmAndAttachQR(registration, registration.eventId?.title);

    if (registration.studentId) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: registration.studentId,
        text: `Your payment for ${registration.eventId?.title} has been verified and your ticket is ready.`,
        type: 'system',
        link: '/student/dashboard'
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

exports.deleteCertificate = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: { message: 'Registration not found', code: 'NOT_FOUND' } });
    }

    if (registration.certificate) {
      const oldPath = path.join(__dirname, '..', '..', registration.certificate.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    try {
      const Certificate = require('../models/Certificate');
      await Certificate.deleteMany({
        studentId: registration.studentId,
        eventId: registration.eventId
      });
    } catch (e) {
      console.warn('Could not delete Certificate doc:', e.message);
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

    // Sync any existing certificates from Certificate collection
    try {
      const Certificate = require('../models/Certificate');
      const certs = await Certificate.find({ eventId: { $in: eventIds } });
      const certMap = {};
      for (const c of certs) {
        if (c.eventId && c.studentId) {
          certMap[`${c.eventId.toString()}_${c.studentId.toString()}`] = c.fileUrl;
        }
      }

      for (const reg of registrations) {
        if (reg.eventId && reg.studentId) {
          const key = `${reg.eventId._id.toString()}_${reg.studentId._id.toString()}`;
          if (certMap[key] && !reg.certificate) {
            reg.certificate = certMap[key];
            await EventRegistration.findByIdAndUpdate(reg._id, { certificate: certMap[key] });
          }
        }
      }
    } catch (syncErr) {
      console.warn('Error syncing certificates for club registrations:', syncErr.message);
    }

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.checkInAttendee = async (req, res, next) => {
  try {
    const { qrToken } = req.body;
    const eventId = req.params.id;

    if (!qrToken) {
      return res.status(400).json({ error: { message: 'QR Token is required' } });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found' } });
    }

    const registration = await EventRegistration.findOne({
      eventId,
      qrToken
    }).populate('studentId', 'name email profilePic contactNumber settings');

    if (!registration) {
      return res.status(404).json({
        error: { message: 'Invalid ticket or registration not found for this event' }
      });
    }

    if (registration.attended) {
      return res.status(400).json({
        error: {
          code: 'ALREADY_CHECKED_IN',
          message: `Already checked in at ${new Date(registration.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        },
        student: registration.studentId,
        checkInTime: registration.checkInTime,
        alreadyAttended: true
      });
    }

    registration.attended = true;
    registration.checkInTime = new Date();
    await registration.save();

    res.json({
      success: true,
      message: 'Check-in confirmed!',
      student: registration.studentId,
      checkInTime: registration.checkInTime,
      attended: true
    });
  } catch (error) {
    next(error);
  }
};

const issueCertificateForRegistration = async (reg, event, club) => {
  if (!reg.studentId) return null;
  const { generateCertificatePDF } = require('../utils/certificateGenerator');
  const Certificate = require('../models/Certificate');
  const Notification = require('../models/Notification');
  const mongoose = require('mongoose');

  const studentId = reg.studentId._id || reg.studentId;
  const studentName = reg.studentId.name || 'Participant';

  let cert = await Certificate.findOne({
    studentId,
    eventId: event._id
  });

  const certId = cert ? cert._id.toString() : new mongoose.Types.ObjectId().toString();

  const fileUrl = await generateCertificatePDF({
    studentName,
    eventName: event.title,
    completionDate: event.dateTime,
    clubName: club?.name || event.clubId?.name,
    clubLogoPath: club?.logo || event.clubId?.logo,
    certificateId: certId
  });

  if (!cert) {
    cert = await Certificate.create({
      _id: certId,
      studentId,
      clubId: club?._id || event.clubId?._id || event.clubId,
      eventId: event._id,
      title: `Certificate of Participation - ${event.title}`,
      issueDate: new Date(),
      fileUrl
    });
  } else {
    cert.fileUrl = fileUrl;
    cert.issueDate = new Date();
    await cert.save();
  }

  reg.certificate = fileUrl;
  await EventRegistration.findByIdAndUpdate(reg._id, { certificate: fileUrl });

  try {
    await Notification.create({
      userId: studentId,
      text: `You have received a certificate for ${event.title}!`,
      type: 'system',
      link: '/student/dashboard'
    });
  } catch (err) {
    console.error('Error creating notification', err);
  }

  return fileUrl;
};

exports.bulkIssueCertificates = async (req, res, next) => {
  try {
    if (req.params.id === 'all') {
      return exports.bulkIssueAllCertificates(req, res, next);
    }

    const event = await Event.findById(req.params.id).populate('clubId');
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });

    // Issue to all registered attendees for this event
    const registrations = await EventRegistration.find({ eventId: event._id }).populate('studentId', 'name email');

    if (registrations.length === 0) {
      return res.status(400).json({ error: { message: `No registrations found for ${event.title}.` } });
    }

    let issuedCount = 0;
    for (const reg of registrations) {
      const url = await issueCertificateForRegistration(reg, event, event.clubId);
      if (url) issuedCount++;
    }

    res.json({
      success: true,
      count: issuedCount,
      message: `Successfully generated and issued ${issuedCount} certificates for ${event.title}!`
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkIssueAllCertificates = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id });
    if (!club) return res.status(404).json({ error: { message: 'Club not found for this host' } });

    const events = await Event.find({ clubId: club._id });
    if (events.length === 0) {
      return res.status(400).json({ error: { message: 'No events found for your club.' } });
    }

      let totalIssued = 0;
      for (const event of events) {
        const registrations = await EventRegistration.find({ eventId: event._id }).populate('studentId', 'name email');
        for (const reg of registrations) {
          const url = await issueCertificateForRegistration(reg, event, club);
          if (url) totalIssued++;
        }
      }

      res.json({
        success: true,
      count: totalIssued,
        message: `Successfully generated and issued ${totalIssued} certificates across all club events!`
      });
    } catch (error) {
      next(error);
    }
  };

  exports.issueSingleCertificate = async (req, res, next) => {
    try {
      const reg = await EventRegistration.findById(req.params.id).populate('studentId', 'name email');
      if (!reg) return res.status(404).json({ error: { message: 'Registration not found' } });

      const event = await Event.findById(reg.eventId).populate('clubId');
      if (!event) return res.status(404).json({ error: { message: 'Event not found' } });

      const fileUrl = await issueCertificateForRegistration(reg, event, event.clubId);

      const updated = await EventRegistration.findById(reg._id)
        .populate('studentId', 'name email regNumber')
        .populate('eventId', 'title');

      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
