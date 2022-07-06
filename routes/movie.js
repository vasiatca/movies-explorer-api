const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validate');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
