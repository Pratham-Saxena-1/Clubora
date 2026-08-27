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

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).populate('userId', 'name email regNumber').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'name email regNumber').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.replyToTicket = async (req, res, next) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: { message: 'Not found' } });
    
    ticket.messages.push({
      sender: req.user.name || (req.user.role === 'Host' ? 'Host' : 'User'),
      role: req.user.role === 'Host' ? 'host' : 'user',
      text
    });
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.resolveTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};
