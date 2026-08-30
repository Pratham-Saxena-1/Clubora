const express = require('express');
const { z } = require('zod');
const { createApplication, getStudentApplications, getRecruitmentApplicants, updateApplicationStatus, getClubApplications } = require('../controllers/applicationController');
const { authenticate, authorizeOwner, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const Application = require('../models/Application');
const Recruitment = require('../models/Recruitment');
const Club = require('../models/Club');

const router = express.Router();

const statusSchema = z.object({
  status: z.enum(['Pending', 'Shortlisted', 'Interviewed', 'Accepted', 'Rejected'])
});

const interviewSchema = z.object({
  date: z.string(),
  time: z.string(),
  link: z.string()
});

const isRecruitmentOwner = async (req) => {
  const recruitmentId = req.params.recruitmentId;
  const recruitment = await Recruitment.findById(recruitmentId);
  if (!recruitment) return false;
  const club = await Club.findById(recruitment.clubId);
  return club && club.hostId.toString() === req.user.id;
};

const isApplicationOwner = async (req) => {
  const application = await Application.findById(req.params.id);
  if (!application) return false;
  const recruitment = await Recruitment.findById(application.recruitmentId);
  if (!recruitment) return false;
  const club = await Club.findById(recruitment.clubId);
  return club && club.hostId.toString() === req.user.id;
};

// body contains recruitmentId, answers (stringified JSON)
router.post('/', authenticate, authorize('Student'), upload.single('resume'), createApplication);
router.get('/club', authenticate, authorize('Host'), getClubApplications);
router.get('/student/:studentId', authenticate, getStudentApplications);
router.get('/recruitment/:recruitmentId', authenticate, authorizeOwner(isRecruitmentOwner), getRecruitmentApplicants);
router.put('/:id/status', authenticate, authorizeOwner(isApplicationOwner), validate(statusSchema), updateApplicationStatus);

router.put('/:id/interview', authenticate, authorizeOwner(isApplicationOwner), validate(interviewSchema), async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { interview: req.body, status: 'Interviewed' },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
