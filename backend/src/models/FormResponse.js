const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed }, // String, Number, Array of Strings, or file path
});

const formResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  answers: [answerSchema],
}, { timestamps: true });

module.exports = mongoose.model('FormResponse', formResponseSchema);
