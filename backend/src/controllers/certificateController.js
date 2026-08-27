const Certificate = require('../models/Certificate');
const Club = require('../models/Club');

exports.issueCertificate = async (req, res, next) => {
  try {
    const { studentId, eventId, title } = req.body;
    
    const club = await Club.findOne({ hostId: req.user.id });
    if (!club) return res.status(404).json({ error: { message: 'Club not found for this host', code: 'NOT_FOUND' } });

    let fileUrl = undefined;
    if (req.file) {
      fileUrl = `/uploads/certificates/${req.file.filename}`;
    }

    const certificate = await Certificate.create({
      studentId,
      clubId: club._id,
      eventId: eventId || null,
      title,
      fileUrl
    });

    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
};

exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user.id })
      .populate('clubId', 'name')
      .sort('-issueDate');
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};
