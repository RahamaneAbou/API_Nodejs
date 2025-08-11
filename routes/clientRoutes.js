/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: API de gestion des clients
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const clientController = require('../controllers/clientController');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               entreprise:
 *                 type: string
 *               adresse:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post(
  '/',
  verifyToken,
  [
    body('name').trim().escape(),
    body('email').isEmail().normalizeEmail(),
  ],
  validateRequest,
  clientController.createClient
);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Récupérer tous les clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Liste des clients
 */
router.get('/', clientController.getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Récupérer un client par ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Client trouvé
 *       404:
 *         description: Client non trouvé
 */
router.get('/:id', clientController.getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Mettre à jour un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour
 *       404:
 *         description: Client non trouvé
 */
router.put(
  '/:id',
  verifyToken,
  [
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  validateRequest,
  clientController.updateClient
);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du client
 *     responses:
 *       204:
 *         description: Client supprimé
 *       404:
 *         description: Client non trouvé
 */
router.delete('/:id', verifyToken, clientController.deleteClient);

module.exports = router;
