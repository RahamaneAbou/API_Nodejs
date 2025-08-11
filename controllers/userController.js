const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Middleware pour vérifier erreurs de validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --------------------------- Obtenir tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const users = await User.find()
      .sort({ [sortBy]: sortOrder })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments();

    console.log('----------------------------- La liste de tous les utilisateurs a été demandée ');

    res.status(200).json({
      total: totalUsers,
      page: parseInt(page),
      pages: Math.ceil(totalUsers / limit),
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// --------------------------- Créer un utilisateur
const createUser = async (req, res) => {
  try {
    // Vérifier erreurs de validation/sanitization
    validateRequest(req, res, () => {});

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création de l'utilisateur avec le mot de passe haché
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log('----------------------------- La création d\'un nouvel utilisateur a été demandée');
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --------------------------- Obtenir un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    console.log('----------------------------- un utilisateur a été demandé via ID');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------- Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  try {
    // Vérifier erreurs de validation/sanitization
    validateRequest(req, res, () => {});

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    console.log('----------------------------- la mise a jour d\'un utilisateur a été demandée');
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --------------------------- Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    console.log('----------------------------- la suppression d\'un utilisateur a été demandée');
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    // Vérifier erreurs de validation/sanitization
    validateRequest(req, res, () => {});

    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Vérifie le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect.' });

    // Créer les tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Stocke les tokens dans l'utilisateur
    user.token = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: 'Connexion réussie.',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "Token de rafraîchissement manquant." });

  try {
    // Vérifier si le token est en base
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Token invalide." });

    // Vérifier la validité du refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || user.email !== decoded.email) {
        return res.status(403).json({ message: "Échec de l'authentification du refresh token." });
      }

      // Générer un nouveau accessToken
      const newAccessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        accessToken: newAccessToken
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur interne." });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  refreshToken,
  validateRequest, // export pour utiliser dans routes
};
