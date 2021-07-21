const router = require('express').Router();

const { username_get, userid_get } = require('../controllers/user');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/username/:username', ensureAuthenticated, username_get);
router.get('/id/:userid', ensureAuthenticated, userid_get);

module.exports = router;