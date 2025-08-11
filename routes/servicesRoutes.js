/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API pour la gestion des services
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - nom
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du service
 *         nom:
 *           type: string
 *           description: Nom du service
 *         description:
 *           type: string
 *           description: Description du service
 *         prix:
 *           type: number
 *           description: Prix du service
 *       example:
 *         id: 64f7c1c9c2f8f1a7c1d12345
 *         nom: Développement Web
 *         description: Création de sites et applications web
 *         prix: 100
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const serviceController = require('../controllers/serviceController');
const validateRequest = require('../middleware/validateRequest');

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Créer un nouveau service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service créé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 */
router.post(
  '/',
  verifyToken,
  isAdmin,
  [
    body('name').trim().escape(),
    body('description').optional().trim().escape(),
  ],
  validateRequest,
  serviceController.createService
);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Récupérer la liste de tous les services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste des services
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Récupérer un service par ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service trouvé
 *       404:
 *         description: Service introuvable
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Mettre à jour un service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service mis à jour avec succès
 *       404:
 *         description: Service introuvable
 */
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  [
    body('name').optional().trim().escape(),
    body('description').optional().trim().escape(),
  ],
  validateRequest,
  serviceController.updateService
);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Supprimer un service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
 *       404:
 *         description: Service introuvable
 */
router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

module.exports = router;
