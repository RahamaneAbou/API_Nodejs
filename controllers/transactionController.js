const Transaction = require('../models/transaction');

// --------------------------- Créer une nouvelle transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    console.log('----------------------------- la création d\'une nouvelle transaction a été demandée');
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------------------------- Obtenir toutes les transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const transactions = await Transaction.find()
      .populate('client')
      .populate('service')
      .sort({ [sortBy]: sortOrder })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments();

    console.log('----------------------------- La liste de toutes les transactions a été demandée');

    res.status(200).json({
      total: totalTransactions,
      page: parseInt(page),
      pages: Math.ceil(totalTransactions / limit),
      data: transactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// --------------------------- Obtenir une transaction par ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('client')
      .populate('service');
    if (!transaction) return res.status(404).json({ error: 'Transaction non trouvée' });
    console.log('----------------------------- Une transaction a été demandée via ID');
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Mettre à jour une transaction
exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Transaction non trouvée' });
    console.log('----------------------------- La mise à jour d\'une transaction a été demandée');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------------------------- Supprimer une transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction non trouvée' });
    res.json({ message: 'Transaction supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
