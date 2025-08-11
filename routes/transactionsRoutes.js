/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gestion des transactions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - client
 *         - service
 *         - amount
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de la transaction
 *         client:
 *           type: string
 *           description: ID du client (ObjectId MongoDB)
 *         service:
 *           type: string
 *           description: ID du service (ObjectId MongoDB)
 *         montant:
 *           type: number
 *           description: Montant de la transaction
 *         statut:
 *           type: string
 *           description: Statut de la transaction
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date de la transaction
 *       example:
 *         id: 60b8c0f8f1d2c8a1d8f9e1a2
 *         client: 60b8c0f8f1d2c8a1d8f9e1a3
 *         service: 60b8c0f8f1d2c8a1d8f9e1a4
 *         amount: 100
 *         date: 2025-08-10T14:48:00.000Z
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const transactionController = require('../controllers/transactionController');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Créer une nouvelle transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction créée avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post(
  '/',
  verifyToken,
  [
    body('client').isMongoId(),
    body('service').isMongoId(),
    body('amount').isNumeric(),
  ],
  validateRequest,
  transactionController.createTransaction
);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Obtenir toutes les transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Liste des transactions
 */
router.get('/', transactionController.getAllTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Obtenir une transaction par son ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Transaction trouvée
 *       404:
 *         description: Transaction non trouvée
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Mettre à jour une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction mise à jour avec succès
 *       404:
 *         description: Transaction non trouvée
 */
router.put(
  '/:id',
  verifyToken,
  [
    body('client').optional().isMongoId(),
    body('service').optional().isMongoId(),
    body('amount').optional().isNumeric(),
  ],
  validateRequest,
  transactionController.updateTransaction
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Supprimer une transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction supprimée avec succès
 *       404:
 *         description: Transaction non trouvée
 */
router.delete('/:id', verifyToken, transactionController.deleteTransaction);

module.exports = router;
