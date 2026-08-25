const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, code: 'NOT_FOUND' };
    return res.status(404).json({ error });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, code: 'DUPLICATE_KEY' };
    return res.status(409).json({ error });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, code: 'VALIDATION_ERROR' };
    return res.status(400).json({ error });
  }

  res.status(error.statusCode || 500).json({
    error: {
      message: error.message || 'Server Error',
      code: error.code || 'SERVER_ERROR'
    }
  });
};

module.exports = errorHandler;
