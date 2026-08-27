const express = require('express');
const { issueCertificate, getMyCertificates } = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/issue', authenticate, authorize('Host'), upload.single('certificateFile'), issueCertificate);
router.get('/student/me', authenticate, authorize('Student'), getMyCertificates);

module.exports = router;
