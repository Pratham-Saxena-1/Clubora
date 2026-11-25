const express = require('express');
const { getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public verification route - accessible without authentication
router.get('/verify/:id', verifyCertificate);

router.get('/student/me', authenticate, authorize('Student'), getMyCertificates);

module.exports = router;
