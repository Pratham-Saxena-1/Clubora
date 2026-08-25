const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return res.status(400).json({ error: { message, code: 'VALIDATION_ERROR', details: error.errors } });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return res.status(400).json({ error: { message, code: 'VALIDATION_ERROR', details: error.errors } });
  }
};

module.exports = { validate, validateQuery };
