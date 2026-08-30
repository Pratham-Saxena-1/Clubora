const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
    },
    galleryImages: [
      {
        type: String,
      },
    ],
    qrImage: {
      type: String, // generic qr for the event (if needed)
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    fee: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
