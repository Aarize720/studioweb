/**
 * Middleware d'authentification JWT
 */

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Vérifie le token JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Ou depuis les cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant',
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const result = await query(
        'SELECT id, email, first_name, last_name, role, is_active, avatar FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      const user = result.rows[0];

      // Vérifier si l'utilisateur est actif
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé',
        });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      logger.error('Erreur de vérification du token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      });
    }
  } catch (error) {
    logger.error('Erreur dans le middleware protect:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

/**
 * Vérifie les rôles autorisés
 * @param  {...string} roles - Rôles autorisés
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`,
      });
    }

    next();
  };
};

/**
 * Middleware optionnel - Ajoute l'utilisateur s'il est connecté
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await query(
          'SELECT id, email, first_name, last_name, role, is_active, avatar FROM users WHERE id = $1',
          [decoded.id]
        );

        if (result.rows.length > 0 && result.rows[0].is_active) {
          req.user = result.rows[0];
        }
      } catch (error) {
        // Token invalide, on continue sans utilisateur
        logger.debug('Token invalide dans optionalAuth');
      }
    }

    next();
  } catch (error) {
    logger.error('Erreur dans optionalAuth:', error);
    next();
  }
};

/**
 * Vérifie si l'utilisateur est propriétaire de la ressource
 */
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    // Les admins ont accès à tout
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      return next();
    }

    // Vérifier si l'utilisateur est propriétaire
    const resourceUserId = req.resource ? req.resource[resourceUserIdField] : null;
    
    if (!resourceUserId || resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - Vous n\'êtes pas propriétaire de cette ressource',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
};