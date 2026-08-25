const Recruitment = require('../models/Recruitment');
const Club = require('../models/Club');

exports.getRecruitments = async (req, res, next) => {
  try {
    const recruitments = await Recruitment.find({ status: 'Open' }).populate('clubId', 'name logo');
    res.json(recruitments);
  } catch (error) {
    next(error);
  }
};

exports.getClubRecruitments = async (req, res, next) => {
  try {
    const recruitments = await Recruitment.find({ clubId: req.params.clubId }).populate('clubId', 'name logo');
    res.json(recruitments);
  } catch (error) {
    next(error);
  }
};

exports.getRecruitment = async (req, res, next) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id).populate('clubId', 'name logo');
    if (!recruitment) {
      return res.status(404).json({ error: { message: 'Recruitment not found', code: 'NOT_FOUND' } });
    }
    res.json(recruitment);
  } catch (error) {
    next(error);
  }
};

exports.createRecruitment = async (req, res, next) => {
  try {
    const recruitment = await Recruitment.create(req.body);
    res.status(201).json(recruitment);
  } catch (error) {
    next(error);
  }
};

exports.updateRecruitment = async (req, res, next) => {
  try {
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(recruitment);
  } catch (error) {
    next(error);
  }
};
