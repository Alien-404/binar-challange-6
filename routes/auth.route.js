const multer = require('multer')();
const authController = require('../controllers/auth.controller');
const mediaController = require('../controllers/media.controller');
const { authHandler } = require('../middleware');

// modules
require('dotenv').config();
const router = require('express').Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/oauth', authController.googleOauth2);

// need auth
router.get('/whoami', authHandler, authController.whoami);
router.put(
  '/update-avatar',
  multer.single('media'),
  authHandler,
  mediaController.imagekitUpload
);

// activate account
router.get('/activate', authController.activateUser);

module.exports = router;
