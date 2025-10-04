/**
 * Middleware de rate limiting
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiter général pour l'API
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard',
  },
  standardHeaders: true, // Retourner les infos dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
  handler: (req, res) => {
    logger.warn(`Rate limit dépassé pour IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard',
    });
  },
});

/**
 * Rate limiter strict pour l'authentification
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
  },
  handler: (req, res) => {
    logger.warn(`Tentatives de connexion excessives pour IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
    });
  },
});

/**
 * Rate limiter pour la création de ressources
 */
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 créations par heure
  message: {
    success: false,
    message: 'Limite de création atteinte, veuillez réessayer plus tard',
  },
});

/**
 * Rate limiter pour les emails
 */
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 emails par heure
  message: {
    success: false,
    message: 'Limite d\'envoi d\'emails atteinte, veuillez réessayer plus tard',
  },
});

/**
 * Rate limiter pour les uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads
  message: {
    success: false,
    message: 'Limite d\'upload atteinte, veuillez réessayer plus tard',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  createLimiter,
  emailLimiter,
  uploadLimiter,
};