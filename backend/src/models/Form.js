const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['short_answer', 'long_answer', 'email', 'phone', 'number', 'dropdown', 'multiple_choice', 'checkboxes', 'date', 'url', 'file_upload']
  },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }], // for dropdown, multiple_choice, checkboxes
});

const formSchema = new mongoose.Schema({
  clubId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club', 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  fields: [formFieldSchema],
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
