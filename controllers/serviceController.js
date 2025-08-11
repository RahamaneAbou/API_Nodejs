const Service = require('../models/Services');

// --------------------------- Créer un service
exports.createService = async (req, res) => {
  try {
    const nouveauService = new Service(req.body);
    const serviceEnregistre = await nouveauService.save();
    console.log('----------------------------- La création d\'un nouveau service a été demandée');
    res.status(201).json(serviceEnregistre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --------------------------- Récupérer tous les services
exports.getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const services = await Service.find()
      .sort({ [sortBy]: sortOrder })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalServices = await Service.countDocuments();

    console.log('----------------------------- La liste de tous les services a été demandée');

    res.status(200).json({
      total: totalServices,
      page: parseInt(page),
      pages: Math.ceil(totalServices / limit),
      data: services
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// --------------------------- Récupérer un service par ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    console.log('----------------------------- Un service a été demandé via ID');
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------- Mettre à jour un service
exports.updateService = async (req, res) => {
  try {
    const serviceMisAJour = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!serviceMisAJour) return res.status(404).json({ message: 'Service non trouvé' });
    console.log('----------------------------- La mise à jour d\'un service a été demandée');
    res.status(200).json(serviceMisAJour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --------------------------- Supprimer un service
exports.deleteService = async (req, res) => {
  try {
    const serviceSupprime = await Service.findByIdAndDelete(req.params.id);
    if (!serviceSupprime) return res.status(404).json({ message: 'Service non trouvé' });
    console.log('----------------------------- La suppression d\'un service a été demandée');
    res.status(200).json({ message: 'Service supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
