const authController = require('../controllers/auth.controller');

// modules
require('dotenv').config();
const router = require('express').Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
