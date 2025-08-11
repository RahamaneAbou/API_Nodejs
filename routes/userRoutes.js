/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API de gestion des utilisateurs
 */

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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur (admin requis)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       403:
 *         description: Accès refusé
 */
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (admin requis)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin requis)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
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

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Rafraîchir le token JWT
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Token invalide ou expiré
 */
router.post('/refresh-token', userController.refreshToken);

module.exports = router;
