/**
 * Middleware de gestion des erreurs
 */

const logger = require('../utils/logger');

/**
 * Gestionnaire d'erreurs global
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  logger.error('Erreur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Erreur de validation Mongoose/PostgreSQL
  if (err.code === '23505') {
    // Duplicate key error
    const message = 'Cette valeur existe déjà';
    error = { statusCode: 400, message };
  }

  if (err.code === '23503') {
    // Foreign key violation
    const message = 'Référence invalide';
    error = { statusCode: 400, message };
  }

  if (err.code === '22P02') {
    // Invalid text representation
    const message = 'Format de données invalide';
    error = { statusCode: 400, message };
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = { statusCode: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = { statusCode: 401, message };
  }

  // Erreur de validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Gestionnaire pour les routes non trouvées
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Classe d'erreur personnalisée
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wrapper async pour éviter les try/catch
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  AppError,
  asyncHandler,
};