const Client = require('../models/client');
const Service = require('../models/services');
const Transaction = require('../models/transaction');

exports.getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 1. Totaux
    const totalClients = await Client.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // 2. Top 5 services les plus utilisés
    const topServices = await Transaction.aggregate([
      { $group: { _id: "$service", usageCount: { $sum: 1 } } },
      { $sort: { usageCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "serviceDetails"
        }
      },
      { $unwind: "$serviceDetails" },
      {
        $project: {
          _id: 0,
          serviceId: "$_id",
          serviceName: "$serviceDetails.nom",
          usageCount: 1
        }
      }
    ]);

    // 3. Chiffre d'affaires sur une période donnée
    let revenueMatch = {};
    if (startDate && endDate) {
      revenueMatch = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const revenueResult = await Transaction.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, totalRevenue: { $sum: "$montant" } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 4. Croissance mensuelle des transactions
    const monthlyGrowth = await Transaction.aggregate([
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      totals: {
        clients: totalClients,
        services: totalServices,
        transactions: totalTransactions
      },
      topServices,
      totalRevenue,
      monthlyGrowth
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors du calcul des statistiques" });
  }
};
