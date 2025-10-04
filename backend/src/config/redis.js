/**
 * Configuration de Redis pour le cache
 */

const redis = require('redis');
const logger = require('../utils/logger');

// Création du client Redis
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: false, // Désactiver la reconnexion automatique
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: 0,
});

// Gestion des événements
redisClient.on('connect', () => {
  logger.info('✅ Connexion à Redis établie');
});

redisClient.on('error', (err) => {
  logger.error('❌ Erreur Redis:', err.message);
});

redisClient.on('ready', () => {
  logger.info('Redis est prêt à recevoir des commandes');
});

/**
 * Connecte le client Redis
 */
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return true;
  } catch (error) {
    logger.error('Erreur lors de la connexion à Redis:', error.message);
    return false;
  }
};

/**
 * Déconnecte le client Redis
 */
const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    logger.error('Erreur lors de la déconnexion de Redis:', error.message);
  }
};

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé du cache
 */
const getCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Erreur lors de la récupération du cache ${key}:`, error.message);
    return null;
  }
};

/**
 * Définit une valeur dans le cache
 * @param {string} key - Clé du cache
 * @param {*} value - Valeur à mettre en cache
 * @param {number} ttl - Durée de vie en secondes (par défaut: 1 heure)
 */
const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Erreur lors de la définition du cache ${key}:`, error.message);
    return false;
  }
};

/**
 * Supprime une valeur du cache
 * @param {string} key - Clé du cache
 */
const deleteCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Erreur lors de la suppression du cache ${key}:`, error.message);
    return false;
  }
};

/**
 * Supprime toutes les clés correspondant à un pattern
 * @param {string} pattern - Pattern de recherche (ex: 'user:*')
 */
const deleteCachePattern = async (pattern) => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Erreur lors de la suppression du pattern ${pattern}:`, error.message);
    return false;
  }
};

/**
 * Vide tout le cache
 */
const flushCache = async () => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    await redisClient.flushDb();
    logger.info('Cache Redis vidé');
    return true;
  } catch (error) {
    logger.error('Erreur lors du vidage du cache:', error.message);
    return false;
  }
};

/**
 * Middleware de cache pour Express
 * @param {number} duration - Durée du cache en secondes
 */
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Ne pas mettre en cache les requêtes non-GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await getCache(key);
      
      if (cachedData) {
        logger.debug(`Cache hit pour ${key}`);
        return res.json(cachedData);
      }

      // Override de res.json pour mettre en cache la réponse
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        setCache(key, data, duration);
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Erreur dans le middleware de cache:', error.message);
      next();
    }
  };
};

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  flushCache,
  cacheMiddleware,
};