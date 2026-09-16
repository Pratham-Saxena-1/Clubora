const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    recruitmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruitment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Not Shortlisted', 'Interviewed', 'Hired', 'Not Hired', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    position: {
      type: String,
    },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    interview: {
      date: Date,
      time: String,
      link: String,
    },
    resume: {
      type: String, // file path
    },
  },
  { timestamps: true }
);

applicationSchema.index({ recruitmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
