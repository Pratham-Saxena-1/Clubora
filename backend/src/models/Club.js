const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    contactNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
