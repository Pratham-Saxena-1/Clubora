const Certificate = require('../models/Certificate');
const Club = require('../models/Club');

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

exports.verifyCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id)
      .populate('studentId', 'name email profilePic settings')
      .populate('clubId', 'name logo description instagram')
      .populate('eventId', 'title dateTime location description coverImage');

    if (!cert) {
      return res.status(404).json({ error: { message: 'Certificate not found or ID is invalid' }, valid: false });
    }

    res.json({
      valid: true,
      certificate: {
        id: cert._id,
        title: cert.title,
        issueDate: cert.issueDate,
        fileUrl: cert.fileUrl,
        student: {
          name: cert.studentId?.name || 'Distinguished Participant',
          email: cert.studentId?.email,
          profilePic: cert.studentId?.profilePic,
          regNumber: cert.studentId?.settings?.regNumber || cert.studentId?.regNumber
        },
        club: {
          name: cert.clubId?.name || 'Campus Club',
          logo: cert.clubId?.logo,
          description: cert.clubId?.description,
          instagram: cert.clubId?.instagram
        },
        event: {
          title: cert.eventId?.title || cert.title,
          dateTime: cert.eventId?.dateTime,
          location: cert.eventId?.location,
          coverImage: cert.eventId?.coverImage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
