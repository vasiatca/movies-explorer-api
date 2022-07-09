const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const ValidationError = require('../errors/ValidationError');
const { validationUrlErrMsg } = require('../utils/errorMessages');

const checkURL = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new ValidationError(validationUrlErrMsg);
};

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validateEditUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().custom(checkURL),
    trailerLink: Joi.string().required().custom(checkURL),
    thumbnail: Joi.string().required().custom(checkURL),
    movieId: Joi.number().min(1).required(),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
