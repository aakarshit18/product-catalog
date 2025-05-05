const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { registerValidator, validate } = require('../middlewares/validate.middleware');

// Register route
router.post('/register', registerValidator, validate, authController.register);

// Login route (if same validation applies)
router.post('/login', registerValidator, validate, authController.login);

// Other routes
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;