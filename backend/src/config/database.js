/**
 * Configuration de la base de données PostgreSQL
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

// Configuration du pool de connexions
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'studioweb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps avant fermeture d'une connexion inactive
  connectionTimeoutMillis: 2000, // Temps d'attente pour obtenir une connexion
});

// Gestion des événements du pool
pool.on('connect', () => {
  logger.info('Nouvelle connexion à la base de données établie');
});

pool.on('error', (err) => {
  logger.error('Erreur inattendue sur le client PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Teste la connexion à la base de données
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info('✅ Connexion à PostgreSQL réussie:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    logger.error('❌ Erreur de connexion à PostgreSQL:', error.message);
    return false;
  }
};

/**
 * Exécute une requête SQL
 * @param {string} text - Requête SQL
 * @param {Array} params - Paramètres de la requête
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Requête exécutée', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Erreur lors de l\'exécution de la requête:', { text, error: error.message });
    throw error;
  }
};

/**
 * Obtient un client pour les transactions
 */
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Timeout pour éviter les connexions bloquées
  const timeout = setTimeout(() => {
    logger.error('Un client n\'a pas été libéré dans les 5 secondes');
  }, 5000);

  // Override de la méthode release
  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release();
  };

  return client;
};

/**
 * Exécute une transaction
 * @param {Function} callback - Fonction contenant les requêtes de la transaction
 */
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
};