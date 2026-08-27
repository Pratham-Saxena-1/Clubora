const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String, // e.g. 'event', 'application', 'system'
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // optional URL to redirect to on click
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
