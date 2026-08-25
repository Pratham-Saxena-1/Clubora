const express = require('express');
const { z } = require('zod');
const { getRecruitments, getClubRecruitments, getRecruitment, createRecruitment, updateRecruitment } = require('../controllers/recruitmentController');
const { authenticate, authorize, authorizeOwner } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const Club = require('../models/Club');
const Recruitment = require('../models/Recruitment');

const router = express.Router();

const recruitmentSchema = z.object({
  clubId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['Open', 'Closed']).optional(),
  deadline: z.string().datetime().optional().or(z.date().optional()),
  requirements: z.array(z.string()).optional(),
  questions: z.array(z.string()).optional(),
});

const updateRecruitmentSchema = recruitmentSchema.omit({ clubId: true }).partial();

const isClubOwner = async (req) => {
  const clubId = req.body.clubId;
  if (!clubId) return false;
  const club = await Club.findById(clubId);
  return club && club.hostId.toString() === req.user.id;
};

const isRecruitmentOwner = async (req) => {
  const recruitment = await Recruitment.findById(req.params.id);
  if (!recruitment) return false;
  const club = await Club.findById(recruitment.clubId);
  return club && club.hostId.toString() === req.user.id;
};

router.get('/', getRecruitments);
router.get('/club/:clubId', getClubRecruitments);
router.get('/:id', getRecruitment);
router.post('/', authenticate, authorize('Host'), authorizeOwner(isClubOwner), validate(recruitmentSchema), createRecruitment);
router.put('/:id', authenticate, authorizeOwner(isRecruitmentOwner), validate(updateRecruitmentSchema), updateRecruitment);

module.exports = router;
