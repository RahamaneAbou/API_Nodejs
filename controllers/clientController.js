const Client = require('../models/client');

// --------------------------- Ajouter un nouveau client
exports.createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------------------------- Récupérer tous les clients
exports.getAllClients = async (req, res) => {
  try {
    // Récupérer les paramètres de pagination et tri depuis req.query
    let { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    
    // Construire l'objet de tri
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };
    
    // Calculer le skip (documents à sauter)
    const skip = (page - 1) * limit;
    
    // Requête paginée et triée
    const clients = await Client.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Total de documents pour la pagination côté client
    const total = await Client.countDocuments();

    res.status(200).json({
      data: clients,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// --------------------------- Récupérer un seul client par ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------- Mettre à jour un client
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --------------------------- Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
