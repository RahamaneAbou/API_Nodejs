const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   name: Recherche
 *   description: API de recherche globale dans les données
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Recherche globale
 *     tags: [Recherche]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       400:
 *         description: Terme de recherche manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/', searchController.globalSearch);

module.exports = router;
