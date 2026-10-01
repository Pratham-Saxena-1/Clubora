const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // in case of file uploads in forms

router.post('/', authenticate, authorize('Host'), formController.createForm);
router.get('/:id', formController.getForm);
router.put('/:id', authenticate, authorize('Host'), formController.updateForm);
router.get('/:id/responses', authenticate, authorize('Host'), formController.getFormResponses);

// For submitting responses, handling single file upload for now (if they upload a resume/payment screenshot via the old way)
// If dynamic forms need multiple files, we should use upload.any() or upload.array()
router.post('/:id/submit', authenticate, upload.single('file'), formController.submitFormResponse);

module.exports = router;
