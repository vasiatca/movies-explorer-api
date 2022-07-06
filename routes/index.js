const router = require('express').Router();
const usersRoutes = require('./user');
const moviesRoutes = require('./movie');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../errors/NotFoundError');
const { validateLogin, validateCreateUser } = require('../middlewares/validate');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);
router.use('/movies', moviesRoutes);
router.use('/users', usersRoutes);
router.use('*', (req, res, next) => next(new NotFoundError('Адрес не существует')));

module.exports = router;
