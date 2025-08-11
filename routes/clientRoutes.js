const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const clientController = require('../controllers/clientController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  verifyToken,
  [
    body('name').trim().escape(),
    body('email').isEmail().normalizeEmail(),
    // ajoute d'autres validations selon ton modèle Client
  ],
    validateRequest,
  clientController.createClient
);

router.get('/', clientController.getAllClients);

router.get('/:id', clientController.getClientById);

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

router.delete('/:id', verifyToken, clientController.deleteClient);

module.exports = router;
