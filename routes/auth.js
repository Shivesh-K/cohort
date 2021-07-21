const router = require('express').Router();

const { signup_post, login_post, logout_delete, verify_get } = require('../controllers/auth');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/auth');

router.post('/signup', ensureNotAuthenticated, signup_post);
router.post('/login', ensureNotAuthenticated, login_post);
router.delete('/logout', ensureAuthenticated, logout_delete);
router.get('/verify', ensureAuthenticated, verify_get);

module.exports = router;