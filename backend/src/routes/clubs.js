const express = require('express');
const { z } = require('zod');
const { getClubs, getClub, getMyClub, createClub, updateClub, uploadLogo, getMembers, addMember, removeMember, addTeamMember, removeTeamMember, createGallery, removeGallery } = require('../controllers/clubController');
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
  instagram: z.string().optional(),
  establishedYear: z.number().optional(),
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
router.post('/:id/team-members', authenticate, authorizeOwner(isClubOwner), upload.single('teamMemberPhoto'), addTeamMember);
router.delete('/:id/team-members/:memberId', authenticate, authorizeOwner(isClubOwner), removeTeamMember);
router.get('/:id/members', authenticate, getMembers);
router.post('/:id/members', authenticate, authorizeOwner(isClubOwner), validate(memberSchema), addMember);
router.delete('/:id/members/:userId', authenticate, authorizeOwner(isClubOwner), removeMember);
router.post('/:id/galleries', authenticate, authorizeOwner(isClubOwner), upload.fields([{ name: 'thumbnailImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), createGallery);
router.delete('/:id/galleries/:galleryId', authenticate, authorizeOwner(isClubOwner), removeGallery);

module.exports = router;
