const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -tokenVersion');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found', code: 'NOT_FOUND' } });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Cannot update email or password through this route
    const { name, contactNumber, settings } = req.body;
    
    // Only allow users to update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: { message: 'Cannot update another user profile', code: 'FORBIDDEN' } });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, contactNumber, settings },
      { new: true, runValidators: true }
    ).select('-password -tokenVersion');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.uploadProfilePic = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: { message: 'Cannot update another user profile', code: 'FORBIDDEN' } });
    }

    if (!req.file) {
      return res.status(400).json({ error: { message: 'Please upload an image', code: 'BAD_REQUEST' } });
    }

    const filePath = `/uploads/profile-pics/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: filePath },
      { new: true }
    ).select('-password -tokenVersion');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (userId !== req.params.id) {
      return res.status(403).json({ error: { message: 'Cannot delete another user account', code: 'FORBIDDEN' } });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found', code: 'NOT_FOUND' } });
    }

    if (user.role === 'Host') {
      const Club = require('../models/Club');
      const Event = require('../models/Event');
      const Recruitment = require('../models/Recruitment');
      const EventRegistration = require('../models/EventRegistration');
      const Application = require('../models/Application');
      const Membership = require('../models/Membership');
      
      const clubs = await Club.find({ hostId: userId });
      for (const club of clubs) {
        const events = await Event.find({ clubId: club._id });
        for (const event of events) {
          await EventRegistration.deleteMany({ eventId: event._id });
          await event.deleteOne();
        }
        
        const recruitments = await Recruitment.find({ clubId: club._id });
        for (const rec of recruitments) {
          await Application.deleteMany({ recruitmentId: rec._id });
          await rec.deleteOne();
        }
        
        await Membership.deleteMany({ clubId: club._id });
        await club.deleteOne();
      }
    } else if (user.role === 'Student') {
      const EventRegistration = require('../models/EventRegistration');
      const Application = require('../models/Application');
      const Membership = require('../models/Membership');
      const Certificate = require('../models/Certificate');
      
      await EventRegistration.deleteMany({ studentId: userId });
      await Application.deleteMany({ studentId: userId });
      await Membership.deleteMany({ studentId: userId });
      await Certificate.deleteMany({ studentId: userId });
    }

    await user.deleteOne();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
