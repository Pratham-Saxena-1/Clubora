const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.getUserTickets = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: { message: 'Forbidden', code: 'FORBIDDEN' } });
    }
    const tickets = await Ticket.find({ userId: req.params.userId });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};
