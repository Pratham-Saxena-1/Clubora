const Application = require('../models/Application');
const Recruitment = require('../models/Recruitment');

exports.createApplication = async (req, res, next) => {
  try {
    const { recruitmentId, answers } = req.body;
    let resume = undefined;
    if (req.file) {
      resume = `/uploads/resumes/${req.file.filename}`;
    }

    const application = await Application.create({
      recruitmentId,
      studentId: req.user.id,
      answers: JSON.parse(answers || '[]'),
      resume
    });
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

exports.getStudentApplications = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.studentId) {
      return res.status(403).json({ error: { message: 'Forbidden', code: 'FORBIDDEN' } });
    }
    const applications = await Application.find({ studentId: req.params.studentId }).populate({
      path: 'recruitmentId',
      populate: { path: 'clubId', select: 'name' }
    });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.getRecruitmentApplicants = async (req, res, next) => {
  try {
    const applications = await Application.find({ recruitmentId: req.params.recruitmentId }).populate('studentId', 'name email profilePic contactNumber');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    res.json(application);
  } catch (error) {
    next(error);
  }
};

exports.getClubApplications = async (req, res, next) => {
  try {
    const Club = require('../models/Club');
    const club = await Club.findOne({ hostId: req.user.id });
    if (!club) return res.json([]);
    const recruitments = await Recruitment.find({ clubId: club._id });
    const recruitmentIds = recruitments.map(r => r._id);
    const applications = await Application.find({ recruitmentId: { $in: recruitmentIds } })
      .populate('studentId', 'name email profilePic contactNumber')
      .populate('recruitmentId', 'title type');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
