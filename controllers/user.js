const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const { JWT_SECRET } = require('../utils/config');

const {
  userNotFoundMsg,
  userConflictMsg,
  validationErrMsg,
  castErrMsg,
} = require('../utils/errorMessages');

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.findOne({ email })
    .then((u) => {
      if (u) {
        throw new ConflictError(userConflictMsg);
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then((user) => res.status(201).send({
          _id: user._id,
          email: user.email,
          name: user.name,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError(validationErrMsg));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(validationErrMsg);
      } if (err.name === 'CastError') {
        throw new CastError(castErrMsg);
      } if (err.codeName === 'DuplicateKey') {
        throw new ConflictError(userConflictMsg);
      }
      throw err;
    })
    .catch(next);
};
