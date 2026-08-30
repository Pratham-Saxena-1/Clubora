const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    paymentScreenshot: {
      type: String, // Path to payment screenshot
    },
    qrTicket: {
      type: String, // uploaded manually by host for this specific registration
    },
    certificate: {
      type: String, // Path to uploaded certificate
    },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
