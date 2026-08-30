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
    instagram: {
      type: String,
    },
    establishedYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    teamMembers: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        photoUrl: { type: String },
        registrationNumber: { type: String },
        contactNumber: { type: String },
        level: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
