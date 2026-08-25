const express = require('express');
const { z } = require('zod');
const { getProfile, updateProfile, uploadProfilePic } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  contactNumber: z.string().optional(),
  settings: z.any().optional(),
});

router.get('/:id', authenticate, getProfile);
router.put('/:id', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/:id/profile-pic', authenticate, upload.single('profilePic'), uploadProfilePic);

module.exports = router;
