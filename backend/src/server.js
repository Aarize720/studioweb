/**
 * Serveur principal de l'application
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

// Importation des configurations
const { testConnection } = require('./config/database');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');
const { verifyEmailConfig } = require('./utils/email');

// Importation des middlewares
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Importation des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const serviceRoutes = require('./routes/services');
const portfolioRoutes = require('./routes/portfolio');
const blogRoutes = require('./routes/blog');
const ticketRoutes = require('./routes/tickets');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const statsRoutes = require('./routes/stats');
const contactRoutes = require('./routes/contact');

// Initialisation de l'application
const app = express();
const server = http.createServer(app);

// Configuration de Socket.io pour les notifications en temps réel
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Rendre io accessible dans les routes
app.set('io', io);

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Compression des réponses
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logger HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes API avec rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Studio Web',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// Gestion des routes non trouvées
app.use(notFound);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Configuration de Socket.io
io.on('connection', (socket) => {
  logger.info(`Client connecté: ${socket.id}`);

  // Rejoindre une room utilisateur
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} a rejoint sa room`);
  });

  // Gestion des messages
  socket.on('send_message', (data) => {
    io.to(`user:${data.recipient_id}`).emit('new_message', data);
  });

  // Gestion des notifications
  socket.on('send_notification', (data) => {
    io.to(`user:${data.user_id}`).emit('new_notification', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Client déconnecté: ${socket.id}`);
  });
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Test de connexion à PostgreSQL
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Impossible de se connecter à PostgreSQL');
      process.exit(1);
    }

    // Connexion à Redis (optionnel, ne bloque pas le démarrage)
    const redisConnected = await connectRedis();
    if (!redisConnected) {
      logger.warn('Redis non disponible - Le cache sera désactivé');
    }

    // Vérification de la configuration email (optionnel)
    await verifyEmailConfig();

    // Démarrage du serveur
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🌐 URL: http://localhost:${PORT}`);
      logger.info(`🔌 WebSocket activé`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux du serveur');
  server.close(() => {
    logger.info('Serveur arrêté');
    process.exit(0);
  });
});

// Démarrer le serveur
startServer();

module.exports = { app, server, io };