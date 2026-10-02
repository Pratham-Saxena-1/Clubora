const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      userId: req.user.id
    });

    if (ticket.clubId) {
      const Club = require('../models/Club');
      const club = await Club.findById(ticket.clubId);
      if (club && club.hostId) {
        await Notification.create({
          userId: club.hostId,
          text: `New query received: ${ticket.subject}`,
          type: 'system',
          link: '/host/support'
        });
      }
    }

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
    const Club = require('../models/Club');
    const club = await Club.findOne({ hostId: req.user.id });
    
    if (!club) {
      return res.json([]);
    }

    const tickets = await Ticket.find({ clubId: club._id })
      .populate('userId', 'name email regNumber')
      .sort({ createdAt: -1 });
      
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

    if (req.user.role === 'Host' && ticket.userId) {
      await Notification.create({
        userId: ticket.userId,
        text: `New reply on your ticket: ${ticket.subject}`,
        type: 'system',
        link: '/student/support'
      });
    }

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
