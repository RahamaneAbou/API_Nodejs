const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const userController = require('../controllers/userController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', userController.getAllUsers);

router.post(
  '/',
  verifyToken,
  isAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('username').trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape(),
  ],
  userController.validateRequest,
  userController.createUser
);

router.get('/:id', userController.getUserById);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('username').optional().trim().escape(),
    body('password').optional().isLength({ min: 6 }).trim().escape(),
  ],
  userController.validateRequest,
  userController.updateUser
);

router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists().trim().escape(),
  ],
  userController.validateRequest,
  userController.login
);

router.post('/refresh-token', userController.refreshToken);

module.exports = router;
