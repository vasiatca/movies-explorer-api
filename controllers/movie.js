const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const CastError = require('../errors/CastError');
const {
  movieNotFoundMsg,
  validationErrMsg,
  castErrMsg,
  movieForbiddenMsg,
} = require('../utils/errorMessages');

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.send({ data: movies }))
  .catch(next);

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrMsg));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError(movieNotFoundMsg))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(movieForbiddenMsg));
      }
      return movie.remove()
        .then(() => res.send({ message: `Фильм с id ${movie.id} успешно удален!` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError(castErrMsg));
      } else {
        next(err);
      }
    });
};
