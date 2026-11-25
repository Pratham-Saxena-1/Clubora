const crypto = require('crypto');
const QRCode = require('qrcode');

const generateQRToken = (registrationId, eventId, studentId) => {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'clubora_jwt_secret';
  return crypto
    .createHmac('sha256', secret)
    .update(`${registrationId}${eventId}${studentId}`)
    .digest('hex');
};

const generateQRCodeBuffer = async (text) => {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    scale: 8,
  });
};

const confirmAndAttachQR = async (registration, eventTitle) => {
  const qrToken = generateQRToken(registration._id, registration.eventId, registration.studentId);
  const qrDataUrl = await generateQRCodeBuffer(qrToken);

  registration.qrToken = qrToken;
  registration.qrTicket = qrDataUrl;
  await registration.save();

  if (registration.studentId) {
    const Notification = require('../models/Notification');
    try {
      await Notification.create({
        userId: registration.studentId,
        text: `Your entry ticket for ${eventTitle || 'the event'} is ready.`,
        type: 'system',
        link: '/student/dashboard',
      });
    } catch (err) {
      console.error('Notification error:', err);
    }
  }

  return registration;
};

module.exports = {
  generateQRToken,
  generateQRCodeBuffer,
  confirmAndAttachQR,
};
