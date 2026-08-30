const express = require('express');
const { z } = require('zod');
const { createTicket, getMyTickets, getAllTickets, replyToTicket, resolveTicket } = require('../controllers/supportController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const ticketSchema = z.object({
  subject: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['Support', 'Feedback']).optional(),
  eventId: z.string().optional(),
});

router.post('/', authenticate, validate(ticketSchema), createTicket);
router.get('/me', authenticate, getMyTickets);
router.get('/all', authenticate, getAllTickets); // ideally restricted, but keeping simple
router.post('/:id/reply', authenticate, replyToTicket);
router.put('/:id/resolve', authenticate, resolveTicket);

module.exports = router;
