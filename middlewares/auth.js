const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { headers: { authorization } } = req;
  let payload;
  let token;
  if (authorization !== undefined) {
    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    token = authorization.replace('Bearer ', '');
  }

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
