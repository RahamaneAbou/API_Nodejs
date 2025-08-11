// controllers/searchController.js
const Client = require('../models/client');
const Service = require('../models/services');
const Transaction = require('../models/transaction');

exports.globalSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Veuillez fournir un paramètre de recherche ?q=..." });
    }

    // Regex pour recherche partielle insensible à la casse
    const regex = new RegExp(query, 'i');

    const [clients, services, transactions] = await Promise.all([
      Client.find({
        $or: [
          { nom: regex },
          { email: regex }
        ]
      }),
      Service.find({
        $or: [
          { nom: regex },
          { description: regex }
        ]
      }),
      Transaction.find({
        $or: [
          { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null },
          { statut: regex }
        ]
      })
      .populate('client')
      .populate('service')
    ]);

    res.status(200).json({
      query,
      results: {
        clients,
        services,
        transactions
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la recherche globale." });
  }
};
