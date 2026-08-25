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
