const express = require('express');
const { z } = require('zod');
const { getClubs, getClub, getMyClub, createClub, updateClub, uploadLogo, getMembers, addMember, removeMember } = require('../controllers/clubController');
const { authenticate, authorize, authorizeOwner } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');
const Club = require('../models/Club');

const router = express.Router();

const clubSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  contactNumber: z.string().optional(),
});

const memberSchema = z.object({
  userId: z.string(),
  role: z.enum(['Member', 'Officer']).optional(),
});

const isClubOwner = async (req) => {
  const club = await Club.findById(req.params.id);
  return club && club.hostId.toString() === req.user.id;
};

router.get('/my-club', authenticate, getMyClub);
router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/', authenticate, authorize('Host'), validate(clubSchema), createClub);
router.put('/:id', authenticate, authorizeOwner(isClubOwner), validate(clubSchema), updateClub);
router.post('/:id/logo', authenticate, authorizeOwner(isClubOwner), upload.single('logo'), uploadLogo);
router.get('/:id/members', authenticate, getMembers);
router.post('/:id/members', authenticate, authorizeOwner(isClubOwner), validate(memberSchema), addMember);
router.delete('/:id/members/:userId', authenticate, authorizeOwner(isClubOwner), removeMember);

module.exports = router;
