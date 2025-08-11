const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const serviceController = require('../controllers/serviceController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  verifyToken,
  isAdmin,
  [
    body('name').trim().escape(),
    body('description').optional().trim().escape(),
    // autres validations selon modèle Service
  ],
    validateRequest,
  serviceController.createService
);

router.get('/', serviceController.getAllServices);

router.get('/:id', serviceController.getServiceById);

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

router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

module.exports = router;
