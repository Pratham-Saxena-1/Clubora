const express = require('express');
const { z } = require('zod');
const { getEvents, getEvent, createEvent, updateEvent, registerForEvent, getMyRegistrations, verifyPayment, uploadQrTicket, uploadCertificate, getEventRegistrations, getClubRegistrations, uploadGalleryImage, deleteEvent } = require('../controllers/eventController');
const { authenticate, authorizeOwner, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const Club = require('../models/Club');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

const router = express.Router();

const eventSchema = z.object({
  clubId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  dateTime: z.string().datetime().or(z.date()),
  capacity: z.number().optional(),
  isPaid: z.boolean().optional(),
  fee: z.number().optional(),
});

const updateEventSchema = eventSchema.omit({ clubId: true }).partial();

const isClubOwner = async (req) => {
  const clubId = req.body.clubId;
  if (!clubId) return false;
  const club = await Club.findById(clubId);
  return club && club.hostId.toString() === req.user.id;
};

const isEventOwner = async (req) => {
  const eventId = req.params.id || (await EventRegistration.findById(req.params.id)).eventId;
  if (!eventId) return false;
  const event = await Event.findById(eventId);
  if (!event) return false;
  const club = await Club.findById(event.clubId);
  return club && club.hostId.toString() === req.user.id;
};

const isRegistrationOwner = async (req) => {
  const reg = await EventRegistration.findById(req.params.id);
  if (!reg) return false;
  const event = await Event.findById(reg.eventId);
  const club = await Club.findById(event.clubId);
  return club && club.hostId.toString() === req.user.id;
};

// Public Event Browsing
router.get('/', getEvents);
router.get('/:id', getEvent);

// Host Event Management
router.get('/registrations/club', authenticate, authorize('Host'), getClubRegistrations);
router.post('/', authenticate, authorize('Host'), authorizeOwner(isClubOwner), validate(eventSchema), createEvent);
router.put('/:id', authenticate, authorizeOwner(isEventOwner), validate(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, authorizeOwner(isEventOwner), deleteEvent);
router.get('/:id/registrations', authenticate, authorizeOwner(isEventOwner), getEventRegistrations);
router.post('/:id/gallery', authenticate, authorizeOwner(isEventOwner), upload.array('galleryImages', 10), uploadGalleryImage);

// Student Registration
router.get('/registrations/student/me', authenticate, authorize('Student'), getMyRegistrations);
router.post('/:id/register', authenticate, authorize('Student'), upload.single('paymentScreenshot'), registerForEvent);

// Payment and QR ticket (Host Action on Registration)
router.put('/registrations/:id/payment', authenticate, authorizeOwner(isRegistrationOwner), verifyPayment);
router.post('/registrations/:id/qr-ticket', authenticate, authorizeOwner(isRegistrationOwner), upload.single('qrTicket'), uploadQrTicket);
router.post('/registrations/:id/certificate', authenticate, authorizeOwner(isRegistrationOwner), upload.single('certificate'), uploadCertificate);

module.exports = router;
