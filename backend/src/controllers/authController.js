/**
 * Contrôleur d'authentification
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query, transaction } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const logger = require('../utils/logger');

/**
 * Génère un token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Génère un refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);

  if (existingUser.rows.length > 0) {
    throw new AppError('Un compte existe déjà avec cet email', 400);
  }

  // Hasher le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Créer l'utilisateur
  const result = await query(
    `INSERT INTO users (email, password, first_name, last_name, phone, role, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, first_name, last_name, phone, role, created_at`,
    [email, hashedPassword, first_name, last_name, phone || null, 'client', true]
  );

  const user = result.rows[0];

  // Générer les tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Sauvegarder le refresh token
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  // Envoyer l'email de bienvenue (async, ne bloque pas la réponse)
  sendWelcomeEmail(user).catch((err) => {
    logger.error('Erreur lors de l\'envoi de l\'email de bienvenue:', err);
  });

  res.status(201).json({
    success: true,
    message: 'Inscription réussie',
    data: {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe
  const result = await query(
    'SELECT id, email, password, first_name, last_name, role, is_active, avatar FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  const user = result.rows[0];

  // Vérifier si le compte est actif
  if (!user.is_active) {
    throw new AppError('Votre compte a été désactivé', 401);
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  // Mettre à jour la date de dernière connexion
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  // Générer les tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Sauvegarder le refresh token
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, expiresAt]
  );

  // Supprimer le mot de passe de la réponse
  delete user.password;

  res.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user,
      token,
      refreshToken,
    },
  });
});

/**
 * @desc    Rafraîchir le token d'accès
 * @route   POST /api/auth/refresh
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token manquant', 400);
  }

  // Vérifier le refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError('Refresh token invalide ou expiré', 401);
  }

  // Vérifier si le refresh token existe en base
  const result = await query(
    'SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
    [decoded.id, refreshToken]
  );

  if (result.rows.length === 0) {
    throw new AppError('Refresh token invalide', 401);
  }

  // Générer un nouveau token d'accès
  const newToken = generateToken(decoded.id);

  res.json({
    success: true,
    data: {
      token: newToken,
    },
  });
});

/**
 * @desc    Déconnexion
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Supprimer le refresh token
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }

  res.json({
    success: true,
    message: 'Déconnexion réussie',
  });
});

/**
 * @desc    Obtenir l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT id, email, first_name, last_name, phone, avatar, role, is_verified, created_at FROM users WHERE id = $1',
    [req.user.id]
  );

  res.json({
    success: true,
    data: result.rows[0],
  });
});

/**
 * @desc    Mettre à jour le profil de l'utilisateur connecté
 * @route   PUT /api/auth/me
 * @access  Private
 */
exports.updateMe = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone, avatar } = req.body;

  // Construire la requête de mise à jour dynamiquement
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (first_name !== undefined) {
    updates.push(`first_name = $${paramCount}`);
    values.push(first_name);
    paramCount++;
  }

  if (last_name !== undefined) {
    updates.push(`last_name = $${paramCount}`);
    values.push(last_name);
    paramCount++;
  }

  if (phone !== undefined) {
    updates.push(`phone = $${paramCount}`);
    values.push(phone || null);
    paramCount++;
  }

  if (avatar !== undefined) {
    updates.push(`avatar = $${paramCount}`);
    values.push(avatar || null);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new AppError('Aucune donnée à mettre à jour', 400);
  }

  // Ajouter l'ID de l'utilisateur
  values.push(req.user.id);

  // Exécuter la mise à jour
  const result = await query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() 
     WHERE id = $${paramCount}
     RETURNING id, email, first_name, last_name, phone, avatar, role, is_verified, created_at`,
    values
  );

  res.json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: result.rows[0],
  });
});

/**
 * @desc    Demander la réinitialisation du mot de passe
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Vérifier si l'utilisateur existe
  const result = await query(
    'SELECT id, email, first_name, last_name FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    // Ne pas révéler si l'email existe ou non
    return res.json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
  }

  const user = result.rows[0];

  // Générer un token de réinitialisation
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  // Sauvegarder le token
  await query(
    'UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3',
    [hashedToken, resetExpire, user.id]
  );

  // Envoyer l'email
  await sendPasswordResetEmail(user, resetToken);

  res.json({
    success: true,
    message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
  });
});

/**
 * @desc    Réinitialiser le mot de passe
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hasher le token reçu
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Trouver l'utilisateur avec ce token
  const result = await query(
    'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()',
    [hashedToken]
  );

  if (result.rows.length === 0) {
    throw new AppError('Token invalide ou expiré', 400);
  }

  const user = result.rows[0];

  // Hasher le nouveau mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Mettre à jour le mot de passe et supprimer le token
  await query(
    'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2',
    [hashedPassword, user.id]
  );

  res.json({
    success: true,
    message: 'Mot de passe réinitialisé avec succès',
  });
});

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Récupérer l'utilisateur avec le mot de passe
  const result = await query('SELECT password FROM users WHERE id = $1', [req.user.id]);
  const user = result.rows[0];

  // Vérifier le mot de passe actuel
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError('Mot de passe actuel incorrect', 401);
  }

  // Hasher le nouveau mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Mettre à jour le mot de passe
  await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès',
  });
});