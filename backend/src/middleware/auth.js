const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Authentication invalid', code: 'UNAUTHORIZED' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Token expired or invalid', code: 'UNAUTHORIZED' } });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Forbidden access', code: 'FORBIDDEN' } });
    }
    next();
  };
};

const authorizeOwner = (resourceLookupFn) => {
  return async (req, res, next) => {
    try {
      const isOwner = await resourceLookupFn(req);
      if (!isOwner) {
        return res.status(403).json({ error: { message: 'You do not have permission to modify this resource', code: 'FORBIDDEN' } });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authenticate, authorize, authorizeOwner };
