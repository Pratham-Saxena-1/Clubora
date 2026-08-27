const Club = require('../models/Club');
const Membership = require('../models/Membership');

exports.getClubs = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { categories: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const clubs = await Club.find(query).populate('hostId', 'name profilePic');
    res.json(clubs);
  } catch (error) {
    next(error);
  }
};

exports.getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate('hostId', 'name profilePic');
    if (!club) {
      return res.status(404).json({ error: { message: 'Club not found', code: 'NOT_FOUND' } });
    }
    const memberCount = await Membership.countDocuments({ clubId: club._id });
    res.json({ ...club.toObject(), memberCount });
  } catch (error) {
    next(error);
  }
};

exports.getMyClub = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id }).populate('hostId', 'name profilePic');
    if (!club) {
      return res.status(404).json({ error: { message: 'Club not found', code: 'NOT_FOUND' } });
    }
    const memberCount = await Membership.countDocuments({ clubId: club._id });
    res.json({ ...club.toObject(), memberCount });
  } catch (error) {
    next(error);
  }
};

exports.createClub = async (req, res, next) => {
  try {
    const club = await Club.create({
      ...req.body,
      hostId: req.user.id
    });
    res.status(201).json(club);
  } catch (error) {
    next(error);
  }
};

exports.updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(club);
  } catch (error) {
    next(error);
  }
};

exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Please upload an image', code: 'BAD_REQUEST' } });
    }
    const filePath = `/uploads/logos/${req.file.filename}`;
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { logo: filePath },
      { new: true }
    );
    res.json(club);
  } catch (error) {
    next(error);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const members = await Membership.find({ clubId: req.params.id }).populate('userId', 'name email profilePic');
    res.json(members);
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const membership = await Membership.create({
      clubId: req.params.id,
      userId,
      role: role || 'Member'
    });
    res.status(201).json(membership);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const membership = await Membership.findOneAndDelete({
      clubId: req.params.id,
      userId: req.params.userId
    });
    if (!membership) {
      return res.status(404).json({ error: { message: 'Membership not found', code: 'NOT_FOUND' } });
    }
    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};
