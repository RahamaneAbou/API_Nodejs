const isAdmin = (req, res, next) => {
    // Vérifie si l'utilisateur est authentifié et a le rôle d'administrateur
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: 'Accès refusé : Administrateurs uniquement' });
  }
};

module.exports = isAdmin;
