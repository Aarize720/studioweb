/**
 * Middleware de validation avec Joi
 */

const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Middleware de validation générique
 * @param {Object} schema - Schéma Joi de validation
 * @param {string} property - Propriété à valider (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Retourner toutes les erreurs
      stripUnknown: true, // Supprimer les champs non définis
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Erreur de validation:', errors);

      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    // Remplacer les données par les valeurs validées
    req[property] = value;
    next();
  };
};

/**
 * Schémas de validation courants
 */

// Validation d'inscription
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': 'L\'email est requis',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'any.required': 'Le mot de passe est requis',
  }),
  first_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'any.required': 'Le prénom est requis',
  }),
  last_name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'any.required': 'Le nom est requis',
  }),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional().messages({
    'string.pattern.base': 'Numéro de téléphone invalide',
  }),
});

// Validation de connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': 'L\'email est requis',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis',
  }),
});

// Validation de mise à jour du profil
const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).optional(),
  last_name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional().allow(''),
  avatar: Joi.string().uri().optional().allow(''),
});

// Validation de produit
const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  slug: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional().allow(''),
  short_description: Joi.string().max(500).optional().allow(''),
  price: Joi.number().min(0).required(),
  compare_at_price: Joi.number().min(0).optional().allow(null),
  sku: Joi.string().max(100).optional().allow(''),
  quantity: Joi.number().integer().min(0).default(0),
  track_inventory: Joi.boolean().default(true),
  category: Joi.string().max(100).optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  is_active: Joi.boolean().default(true),
  is_featured: Joi.boolean().default(false),
});

// Validation de commande
const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().optional().allow(''),
  billing_address_line1: Joi.string().required(),
  billing_city: Joi.string().required(),
  billing_postal_code: Joi.string().required(),
  billing_country: Joi.string().required(),
  shipping_address_line1: Joi.string().optional(),
  shipping_city: Joi.string().optional(),
  shipping_postal_code: Joi.string().optional(),
  shipping_country: Joi.string().optional(),
  payment_method: Joi.string().valid('stripe', 'paypal').required(),
  customer_notes: Joi.string().optional().allow(''),
});

// Validation de ticket
const ticketSchema = Joi.object({
  subject: Joi.string().min(5).max(255).required(),
  category: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  message: Joi.string().min(10).required(),
});

// Validation de message
const messageSchema = Joi.object({
  recipient_id: Joi.string().uuid().required(),
  subject: Joi.string().max(255).optional().allow(''),
  message: Joi.string().min(1).required(),
});

// Validation de message de ticket
const ticketMessageSchema = Joi.object({
  message: Joi.string().min(1).required(),
  is_internal: Joi.boolean().optional().default(false),
});

// Validation de contact
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(255).required(),
  message: Joi.string().min(10).required(),
});

// Validation de devis
const quoteSchema = Joi.object({
  service_id: Joi.string().uuid().optional().allow(null),
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(''),
  company: Joi.string().max(255).optional().allow(''),
  message: Joi.string().min(10).required(),
  budget_range: Joi.string().optional().allow(''),
  timeline: Joi.string().optional().allow(''),
});

// Validation d'article de blog
const blogPostSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  slug: Joi.string().min(5).max(255).optional(),
  excerpt: Joi.string().optional().allow(''),
  content: Joi.string().min(50).required(),
  featured_image: Joi.string().uri().optional().allow(''),
  category_id: Joi.string().uuid().optional().allow(null),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  is_featured: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).optional(),
});

// Validation de projet portfolio
const portfolioSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  slug: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional().allow(''),
  short_description: Joi.string().max(500).optional().allow(''),
  client_name: Joi.string().max(255).optional().allow(''),
  project_url: Joi.string().uri().optional().allow(''),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  featured_image: Joi.string().uri().optional().allow(''),
  technologies: Joi.array().items(Joi.string()).optional(),
  is_featured: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
});

// Validation UUID
const uuidSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// Middlewares de validation prêts à l'emploi
const validateRegister = validate(registerSchema);
const validateLogin = validate(loginSchema);
const validateUpdateProfile = validate(updateProfileSchema);
const validateProduct = validate(productSchema);
const validateOrder = validate(orderSchema);
const validateTicket = validate(ticketSchema);
const validateMessage = validate(messageSchema);
const validateTicketMessage = validate(ticketMessageSchema);
const validateContact = validate(contactSchema);
const validateQuote = validate(quoteSchema);
const validateBlogPost = validate(blogPostSchema);
const validatePortfolio = validate(portfolioSchema);
const validateUUID = validate(uuidSchema, 'params');

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  productSchema,
  orderSchema,
  ticketSchema,
  messageSchema,
  ticketMessageSchema,
  contactSchema,
  quoteSchema,
  blogPostSchema,
  portfolioSchema,
  uuidSchema,
  // Middlewares prêts à l'emploi
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateProduct,
  validateOrder,
  validateTicket,
  validateMessage,
  validateTicketMessage,
  validateContact,
  validateQuote,
  validateBlogPost,
  validatePortfolio,
  validateUUID,
};