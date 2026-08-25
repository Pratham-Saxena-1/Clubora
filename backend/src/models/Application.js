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
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    resume: {
      type: String, // file path
    },
  },
  { timestamps: true }
);

applicationSchema.index({ recruitmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
