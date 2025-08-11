const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statsController');

/**
 * @swagger
 * tags:
 *   name: Statistiques
 *   description: API pour récupérer des données statistiques
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Récupère les statistiques globales
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getStatistics);

module.exports = router;
