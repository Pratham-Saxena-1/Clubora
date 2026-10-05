const Form = require('../models/Form');
const FormResponse = require('../models/FormResponse');
const Club = require('../models/Club');
const Application = require('../models/Application');
const EventRegistration = require('../models/EventRegistration');

exports.createForm = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id });
    if (!club) {
      return res.status(403).json({ error: { message: 'Club profile required to create forms' } });
    }
    
    const { title, description, fields } = req.body;
    const form = await Form.create({
      clubId: club._id,
      title,
      description,
      fields
    });
    
    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
};

exports.getForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: { message: 'Form not found' } });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
};

exports.updateForm = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id });
    const form = await Form.findById(req.params.id);
    
    if (!form) return res.status(404).json({ error: { message: 'Form not found' } });
    if (!club || form.clubId.toString() !== club._id.toString()) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }
    
    const { title, description, fields } = req.body;
    form.title = title || form.title;
    form.description = description || form.description;
    form.fields = fields || form.fields;
    
    await form.save();
    res.json(form);
  } catch (error) {
    next(error);
  }
};

exports.getFormResponses = async (req, res, next) => {
  try {
    const club = await Club.findOne({ hostId: req.user.id });
    const form = await Form.findById(req.params.id);
    
    if (!form) return res.status(404).json({ error: { message: 'Form not found' } });
    if (!club || form.clubId.toString() !== club._id.toString()) {
      return res.status(403).json({ error: { message: 'Forbidden' } });
    }
    
    const responses = await FormResponse.find({ formId: form._id }).populate('studentId', 'name email');
    res.json(responses);
  } catch (error) {
    next(error);
  }
};

exports.submitFormResponse = async (req, res, next) => {
  try {
    const { formId, answers, contextType, contextId } = req.body;
    
    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: { message: 'Form not found' } });
    
    // Create FormResponse
    let parsedAnswers = answers;
    if (typeof answers === 'string') {
        try { parsedAnswers = JSON.parse(answers); } catch(e) {}
    }

    if (req.file) {
      const fileAns = parsedAnswers.find(a => a.value === req.file.originalname);
      if (fileAns) {
        fileAns.value = `/uploads/${req.file.filename}`;
      } else {
        parsedAnswers.push({ fieldId: 'uploaded_file', value: `/uploads/${req.file.filename}` });
      }
    }

    const formResponse = await FormResponse.create({
      formId,
      studentId: req.user.id,
      answers: parsedAnswers || []
    });
    
    // Auto-create Application or Registration based on context
    if (contextType === 'Recruitment') {
      const application = await Application.create({
        recruitmentId: contextId,
        studentId: req.user.id,
        formResponseId: formResponse._id,
      });
      return res.status(201).json({ formResponse, application });
    } else if (contextType === 'Event') {
      const payload = {
        eventId: contextId,
        studentId: req.user.id,
        formResponseId: formResponse._id,
      };
      if (req.file) { // if there's a payment screenshot, although dynamic form handles files now, we might keep it or use dynamic fields for files.
        payload.paymentScreenshot = `/uploads/${req.file.filename}`;
      }
      const registration = await EventRegistration.create(payload);
      return res.status(201).json({ formResponse, registration });
    }

    res.status(201).json(formResponse);
  } catch (error) {
    next(error);
  }
};
