# Arborescence Complète du Projet Studio Web

## 📁 Structure Générale

```
studioweb/
├── backend/                          # Backend Node.js + Express
├── frontend/                         # Frontend Next.js 14
├── README.md                         # Documentation principale
├── ARBORESCENCE.md                   # Ce fichier
├── install.ps1                       # Script d'installation Windows
└── install.sh                        # Script d'installation Linux/Mac
```

## 🔧 Backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/                       # Configuration
│   │   ├── database.js              # Configuration PostgreSQL
│   │   ├── redis.js                 # Configuration Redis (cache)
│   │   ├── cloudinary.js            # Configuration Cloudinary
│   │   ├── stripe.js                # Configuration Stripe
│   │   └── paypal.js                # Configuration PayPal
│   │
│   ├── controllers/                  # Contrôleurs API
│   │   ├── authController.js        # Authentification (login, register, OAuth)
│   │   ├── productController.js     # Gestion des produits
│   │   ├── blogController.js        # Gestion du blog
│   │   ├── ticketController.js      # Système de tickets support
│   │   ├── uploadController.js      # Upload de fichiers
│   │   ├── statsController.js       # Statistiques et analytics
│   │   ├── contactController.js     # Formulaire de contact
│   │   ├── portfolioController.js   # Gestion du portfolio
│   │   └── messageController.js     # Messagerie interne
│   │
│   ├── middleware/                   # Middlewares
│   │   ├── auth.js                  # Authentification JWT
│   │   ├── errorHandler.js          # Gestion des erreurs
│   │   ├── rateLimiter.js           # Rate limiting
│   │   ├── upload.js                # Multer pour uploads
│   │   └── validation.js            # Validation des données
│   │
│   ├── routes/                       # Routes API
│   │   ├── auth.js                  # Routes authentification
│   │   ├── users.js                 # Routes utilisateurs
│   │   ├── products.js              # Routes produits
│   │   ├── orders.js                # Routes commandes
│   │   ├── services.js              # Routes services
│   │   ├── portfolio.js             # Routes portfolio
│   │   ├── blog.js                  # Routes blog
│   │   ├── tickets.js               # Routes tickets
│   │   ├── messages.js              # Routes messages
│   │   ├── upload.js                # Routes upload
│   │   ├── stats.js                 # Routes statistiques
│   │   └── contact.js               # Routes contact
│   │
│   ├── utils/                        # Utilitaires
│   │   ├── appError.js              # Classe d'erreur personnalisée
│   │   ├── email.js                 # Envoi d'emails (Nodemailer)
│   │   ├── logger.js                # Logger (Winston)
│   │   └── helpers.js               # Fonctions utilitaires
│   │
│   ├── validators/                   # Validation Joi
│   │   ├── authValidator.js         # Validation auth
│   │   ├── productValidator.js      # Validation produits
│   │   ├── orderValidator.js        # Validation commandes
│   │   └── ...                      # Autres validateurs
│   │
│   └── server.js                     # Point d'entrée principal
│
├── database/                         # Base de données
│   ├── schema.sql                   # Schéma PostgreSQL complet
│   └── seed.sql                     # Données de test
│
├── uploads/                          # Fichiers uploadés localement
├── logs/                            # Logs de l'application
├── .env.example                     # Exemple de variables d'environnement
├── .gitignore                       # Fichiers à ignorer par Git
└── package.json                     # Dépendances backend
```

## 🎨 Frontend (Next.js 14)

```
frontend/
├── src/
│   ├── app/                          # Pages Next.js (App Router)
│   │   ├── layout.js                # Layout principal
│   │   ├── page.js                  # Page d'accueil
│   │   ├── globals.css              # Styles globaux
│   │   │
│   │   ├── auth/                    # Pages d'authentification
│   │   │   ├── login/
│   │   │   │   └── page.js         # Page de connexion
│   │   │   ├── register/
│   │   │   │   └── page.js         # Page d'inscription
│   │   │   └── forgot-password/
│   │   │       └── page.js         # Mot de passe oublié
│   │   │
│   │   ├── services/                # Pages services
│   │   │   ├── page.js             # Liste des services
│   │   │   └── [slug]/
│   │   │       └── page.js         # Détail d'un service
│   │   │
│   │   ├── portfolio/               # Pages portfolio
│   │   │   ├── page.js             # Liste des projets
│   │   │   └── [slug]/
│   │   │       └── page.js         # Détail d'un projet
│   │   │
│   │   ├── shop/                    # Pages boutique
│   │   │   ├── page.js             # Liste des produits
│   │   │   ├── cart/
│   │   │   │   └── page.js         # Panier
│   │   │   ├── checkout/
│   │   │   │   └── page.js         # Paiement
│   │   │   └── [slug]/
│   │   │       └── page.js         # Détail produit
│   │   │
│   │   ├── blog/                    # Pages blog
│   │   │   ├── page.js             # Liste des articles
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.js     # Articles par catégorie
│   │   │   └── [slug]/
│   │   │       └── page.js         # Détail article
│   │   │
│   │   ├── contact/                 # Page de contact
│   │   │   └── page.js
│   │   │
│   │   ├── dashboard/               # Espace client
│   │   │   ├── page.js             # Dashboard principal
│   │   │   ├── profile/
│   │   │   │   └── page.js         # Profil utilisateur
│   │   │   ├── orders/
│   │   │   │   ├── page.js         # Liste des commandes
│   │   │   │   └── [id]/
│   │   │   │       └── page.js     # Détail commande
│   │   │   ├── tickets/
│   │   │   │   ├── page.js         # Liste des tickets
│   │   │   │   └── [id]/
│   │   │   │       └── page.js     # Détail ticket
│   │   │   └── messages/
│   │   │       ├── page.js         # Messagerie
│   │   │       └── [id]/
│   │   │           └── page.js     # Conversation
│   │   │
│   │   └── admin/                   # Dashboard admin
│   │       ├── page.js             # Dashboard principal
│   │       ├── users/
│   │       │   └── page.js         # Gestion utilisateurs
│   │       ├── products/
│   │       │   └── page.js         # Gestion produits
│   │       ├── orders/
│   │       │   └── page.js         # Gestion commandes
│   │       ├── services/
│   │       │   └── page.js         # Gestion services
│   │       ├── portfolio/
│   │       │   └── page.js         # Gestion portfolio
│   │       ├── blog/
│   │       │   └── page.js         # Gestion blog
│   │       ├── tickets/
│   │       │   └── page.js         # Gestion tickets
│   │       └── stats/
│   │           └── page.js         # Statistiques
│   │
│   ├── components/                   # Composants React
│   │   ├── layout/                  # Composants de layout
│   │   │   ├── Navbar.js           # Barre de navigation
│   │   │   ├── Footer.js           # Pied de page
│   │   │   └── Sidebar.js          # Barre latérale (dashboard)
│   │   │
│   │   ├── home/                    # Composants page d'accueil
│   │   │   ├── Hero.js             # Section hero
│   │   │   ├── Services.js         # Section services
│   │   │   ├── Portfolio.js        # Section portfolio
│   │   │   ├── Testimonials.js     # Témoignages
│   │   │   ├── Stats.js            # Statistiques
│   │   │   └── CTA.js              # Call-to-action
│   │   │
│   │   ├── common/                  # Composants communs
│   │   │   ├── Button.js           # Bouton
│   │   │   ├── Input.js            # Champ de saisie
│   │   │   ├── Card.js             # Carte
│   │   │   ├── Modal.js            # Modal
│   │   │   ├── Loader.js           # Loader
│   │   │   ├── Pagination.js       # Pagination
│   │   │   └── Badge.js            # Badge
│   │   │
│   │   ├── shop/                    # Composants boutique
│   │   │   ├── ProductCard.js      # Carte produit
│   │   │   ├── ProductGrid.js      # Grille de produits
│   │   │   ├── CartItem.js         # Item du panier
│   │   │   └── CheckoutForm.js     # Formulaire de paiement
│   │   │
│   │   ├── dashboard/               # Composants dashboard
│   │   │   ├── StatsCard.js        # Carte de statistique
│   │   │   ├── OrderTable.js       # Tableau des commandes
│   │   │   ├── TicketList.js       # Liste des tickets
│   │   │   └── Chart.js            # Graphiques
│   │   │
│   │   └── Providers.js             # Providers (React Query, etc.)
│   │
│   ├── lib/                          # Bibliothèques et utilitaires
│   │   ├── api.js                   # Configuration Axios + API calls
│   │   ├── utils.js                 # Fonctions utilitaires
│   │   └── socket.js                # Configuration Socket.io
│   │
│   ├── store/                        # État global (Zustand)
│   │   ├── authStore.js             # Store authentification
│   │   ├── cartStore.js             # Store panier
│   │   └── notificationStore.js     # Store notifications
│   │
│   └── hooks/                        # Hooks personnalisés
│       ├── useAuth.js               # Hook authentification
│       ├── useCart.js               # Hook panier
│       └── useSocket.js             # Hook WebSocket
│
├── public/                           # Assets statiques
│   ├── images/                      # Images
│   ├── icons/                       # Icônes
│   └── favicon.ico                  # Favicon
│
├── .env.example                      # Exemple de variables d'environnement
├── .gitignore                        # Fichiers à ignorer par Git
├── next.config.js                    # Configuration Next.js
├── tailwind.config.js                # Configuration Tailwind CSS
├── postcss.config.js                 # Configuration PostCSS
└── package.json                      # Dépendances frontend
```

## 📊 Base de Données (PostgreSQL)

### Tables Principales

1. **users** - Utilisateurs et administrateurs
2. **refresh_tokens** - Tokens de rafraîchissement JWT
3. **services** - Services proposés
4. **service_quotes** - Demandes de devis
5. **products** - Produits de la boutique
6. **cart_items** - Paniers d'achat
7. **orders** - Commandes
8. **order_items** - Détails des commandes
9. **portfolio** - Projets portfolio
10. **portfolio_images** - Images des projets
11. **blog_categories** - Catégories du blog
12. **blog_tags** - Tags du blog
13. **blog_posts** - Articles de blog
14. **blog_post_tags** - Relation articles-tags
15. **testimonials** - Témoignages clients
16. **tickets** - Tickets de support
17. **ticket_messages** - Messages des tickets
18. **messages** - Messagerie interne
19. **contact_messages** - Messages du formulaire de contact

## 🔑 Fichiers de Configuration Importants

### Backend
- **`.env`** - Variables d'environnement (DB, API keys, etc.)
- **`package.json`** - Dépendances et scripts npm
- **`server.js`** - Point d'entrée de l'application

### Frontend
- **`.env.local`** - Variables d'environnement frontend
- **`next.config.js`** - Configuration Next.js
- **`tailwind.config.js`** - Configuration Tailwind CSS
- **`package.json`** - Dépendances et scripts npm

## 📦 Dépendances Principales

### Backend
- **express** - Framework web
- **pg** - Client PostgreSQL
- **redis** - Client Redis
- **jsonwebtoken** - Authentification JWT
- **bcryptjs** - Hashage des mots de passe
- **joi** - Validation des données
- **nodemailer** - Envoi d'emails
- **cloudinary** - Stockage de médias
- **stripe** - Paiements
- **socket.io** - WebSocket temps réel
- **helmet** - Sécurité HTTP
- **cors** - CORS
- **morgan** - Logger HTTP
- **winston** - Logger applicatif

### Frontend
- **next** - Framework React
- **react** - Bibliothèque UI
- **tailwindcss** - Framework CSS
- **framer-motion** - Animations
- **axios** - Client HTTP
- **react-query** - Gestion état serveur
- **zustand** - Gestion état global
- **react-hook-form** - Gestion des formulaires
- **react-hot-toast** - Notifications
- **socket.io-client** - Client WebSocket
- **stripe** - Intégration Stripe
- **recharts** - Graphiques

## 🚀 Scripts NPM

### Backend
```bash
npm run dev          # Développement avec nodemon
npm start            # Production
npm test             # Tests
npm run lint         # Linter
```

### Frontend
```bash
npm run dev          # Développement
npm run build        # Build production
npm start            # Serveur production
npm run lint         # Linter
```

## 📝 Notes

- Tous les fichiers sont commentés en français
- Le code suit les conventions ES6+
- Architecture modulaire et scalable
- Sécurité renforcée (JWT, bcrypt, helmet, rate limiting)
- Responsive design (mobile-first)
- SEO optimisé
- Performance optimisée (lazy loading, code splitting)
- Accessibilité (ARIA labels, semantic HTML)