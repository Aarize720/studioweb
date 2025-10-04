/**
 * Service d'envoi d'emails avec Nodemailer
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Vérifie la configuration email
 */
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    logger.info('✅ Configuration email vérifiée');
    return true;
  } catch (error) {
    logger.error('❌ Erreur de configuration email:', error.message);
    return false;
  }
};

/**
 * Envoie un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.text - Contenu texte
 * @param {string} options.html - Contenu HTML
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Studio Web <noreply@studioweb.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email envoyé à ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email de bienvenue
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Bienvenue sur Studio Web !';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenue ${user.first_name} !</h1>
        </div>
        <div class="content">
          <p>Nous sommes ravis de vous accueillir sur <strong>Studio Web</strong> !</p>
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant accéder à tous nos services :</p>
          <ul>
            <li>Consulter notre portfolio de projets</li>
            <li>Commander nos produits et services</li>
            <li>Suivre vos commandes en temps réel</li>
            <li>Contacter notre support via le système de tickets</li>
          </ul>
          <center>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Accéder à mon espace</a>
          </center>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>À bientôt,<br><strong>L'équipe Studio Web</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Studio Web. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Envoie un email de confirmation de commande
 */
const sendOrderConfirmationEmail = async (order) => {
  const subject = `Confirmation de commande #${order.order_number}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; background: #f9f9f9; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Commande confirmée !</h1>
        </div>
        <div class="content">
          <p>Bonjour ${order.first_name},</p>
          <p>Merci pour votre commande ! Nous avons bien reçu votre paiement.</p>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande :</strong> ${order.order_number}</p>
            <p><strong>Date :</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
            <p><strong>Montant total :</strong> <span class="total">${order.total.toFixed(2)} €</span></p>
          </div>

          <center>
            <a href="${process.env.FRONTEND_URL}/dashboard/orders/${order.id}" class="button">Voir ma commande</a>
          </center>

          <p>Vous recevrez un email de confirmation dès l'expédition de votre commande.</p>
          <p>Cordialement,<br><strong>L'équipe Studio Web</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Studio Web. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: order.email, subject, html });
};

/**
 * Envoie un email de réinitialisation de mot de passe
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Réinitialisation de votre mot de passe';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Réinitialisation du mot de passe</h1>
        </div>
        <div class="content">
          <p>Bonjour ${user.first_name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          
          <center>
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </center>

          <div class="warning">
            <strong>⚠️ Important :</strong> Ce lien est valable pendant 1 heure seulement.
          </div>

          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <p>Cordialement,<br><strong>L'équipe Studio Web</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Studio Web. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Envoie une notification de nouveau ticket
 */
const sendTicketNotificationEmail = async (ticket, user) => {
  const subject = `Nouveau ticket #${ticket.ticket_number}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .ticket-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 Nouveau ticket créé</h1>
        </div>
        <div class="content">
          <p>Bonjour ${user.first_name},</p>
          <p>Votre ticket de support a été créé avec succès.</p>
          
          <div class="ticket-info">
            <p><strong>Numéro :</strong> ${ticket.ticket_number}</p>
            <p><strong>Sujet :</strong> ${ticket.subject}</p>
            <p><strong>Priorité :</strong> ${ticket.priority}</p>
            <p><strong>Statut :</strong> ${ticket.status}</p>
          </div>

          <p>Notre équipe vous répondra dans les plus brefs délais.</p>

          <center>
            <a href="${process.env.FRONTEND_URL}/dashboard/tickets/${ticket.id}" class="button">Voir mon ticket</a>
          </center>

          <p>Cordialement,<br><strong>L'équipe Studio Web</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Studio Web. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Envoie un email de contact
 */
const sendContactEmail = async ({ name, email, subject, message }) => {
  const adminEmail = process.env.EMAIL_USER;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
        .info { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📧 Nouveau message de contact</h2>
        </div>
        <div class="content">
          <div class="info">
            <p><strong>De :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
          </div>
          <h3>Message :</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: adminEmail, subject: `Contact: ${subject}`, html });
};

module.exports = {
  verifyEmailConfig,
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendTicketNotificationEmail,
  sendContactEmail,
};