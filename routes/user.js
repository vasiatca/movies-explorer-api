const router = require('express').Router();
const { validateEditUser } = require('../middlewares/validate');

const { getMyUser, editUser } = require('../controllers/user');

router.get('/me', getMyUser);
router.patch('/me', validateEditUser, editUser);

module.exports = router;
