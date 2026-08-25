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
    const applications = await Application.find({ studentId: req.params.studentId }).populate('recruitmentId');
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
