const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET = 'super-secret-key' } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.find({ _id: userId })
    .then((user) => {
      res.send({ data: { email: user[0].email, name: user[0].name } });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка в переданных данных');
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const { password, name } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then(() => res.send({
        email,
        name,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          throw new ConflictError(
            'Пользователь с таким email уже зарегистрирован:',
          );
        }
        if (err.name === 'ValidationError') {
          throw new BadRequestError(
            `Переданы некорректные данные: ${err.message}`,
          );
        }
        throw new Error();
      })
      .catch(next);
  });
};
module.exports.login = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
