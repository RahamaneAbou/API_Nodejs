const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const verifyToken = require("../middleware/verifyToken");
const transactionController = require('../controllers/transactionController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/',
  verifyToken,
  [
    body('client').isMongoId(),
    body('service').isMongoId(),
    body('amount').isNumeric(),
    // autres validations selon modèle Transaction
  ],
    validateRequest,
  transactionController.createTransaction
);

router.get('/', transactionController.getAllTransactions);

router.get('/:id', transactionController.getTransactionById);

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

router.delete('/:id', verifyToken, transactionController.deleteTransaction);

module.exports = router;
