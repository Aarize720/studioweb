# Studio Web - Plateforme Complète de Développement Web

## 🚀 Description

Plateforme web complète pour un studio de développement incluant :
- Site vitrine avec services et portfolio
- Boutique en ligne avec paiement Stripe/PayPal
- Blog avec système de gestion de contenu
- Espace client avec messagerie et tickets support
- Dashboard administrateur complet
- API REST sécurisée avec authentification JWT

## 📋 Technologies Utilisées

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Axios** (requêtes HTTP)
- **React Query** (gestion état serveur)
- **Zustand** (gestion état global)

### Backend
- **Node.js + Express**
- **PostgreSQL** (base de données)
- **Redis** (cache)
- **JWT** (authentification)
- **Stripe & PayPal** (paiements)
- **Cloudinary** (stockage médias)
- **Nodemailer** (emails)
- **Socket.io** (temps réel)

## 🛠️ Installation

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Redis 6+
- Compte Stripe (mode test)
- Compte Cloudinary (gratuit)

### 1. Cloner et installer les dépendances

```bash
# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### 2. Configuration de la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE studioweb;

# Se connecter à la base
\c studioweb

# Exécuter le script SQL
\i backend/database/schema.sql
\i backend/database/seed.sql
```

### 3. Configuration Redis

```bash
# Installer Redis (Windows)
# Télécharger depuis https://github.com/microsoftarchive/redis/releases
# Ou utiliser WSL/Docker

# Démarrer Redis
redis-server
```

### 4. Variables d'environnement

#### Backend (.env dans /backend)

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studioweb
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise
JWT_REFRESH_EXPIRE=30d

# Email (Nodemailer - exemple avec Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
EMAIL_FROM=Studio Web <noreply@studioweb.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=votre_client_id
PAYPAL_CLIENT_SECRET=votre_client_secret
PAYPAL_MODE=sandbox

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# OAuth2 (optionnel)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
```

#### Frontend (.env.local dans /frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
NEXT_PUBLIC_PAYPAL_CLIENT_ID=votre_client_id
```

### 5. Lancement de l'application

#### Développement

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📁 Structure du Projet

```
studioweb/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration (DB, Redis, etc.)
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── middleware/     # Middlewares (auth, validation, etc.)
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Logique métier
│   │   ├── utils/          # Utilitaires
│   │   ├── validators/     # Validation des données
│   │   └── server.js       # Point d'entrée
│   ├── database/
│   │   ├── schema.sql      # Schéma de la base
│   │   └── seed.sql        # Données de test
│   ├── uploads/            # Fichiers uploadés localement
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Pages Next.js (App Router)
│   │   ├── components/     # Composants React
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── lib/            # Bibliothèques et utilitaires
│   │   ├── store/          # État global (Zustand)
│   │   └── styles/         # Styles globaux
│   ├── public/             # Assets statiques
│   └── package.json
└── README.md
```

## 🔐 Comptes de Test

### Administrateur
- **Email:** admin@studioweb.com
- **Mot de passe:** Admin123!

### Client
- **Email:** client@example.com
- **Mot de passe:** Client123!

## 🎯 Fonctionnalités Principales

### Frontend Public
- ✅ Page d'accueil avec présentation et CTA
- ✅ Page services avec tarifs et formulaire de devis
- ✅ Portfolio filtrable par catégorie
- ✅ Boutique avec panier et paiement
- ✅ Blog avec catégories et tags
- ✅ Formulaire de contact avec envoi email

### Espace Client
- ✅ Authentification (login/signup)
- ✅ Dashboard personnel
- ✅ Suivi des commandes
- ✅ Système de tickets support
- ✅ Messagerie interne temps réel
- ✅ Gestion du profil

### Dashboard Admin
- ✅ Gestion des utilisateurs
- ✅ Gestion des produits et services
- ✅ Gestion des commandes
- ✅ Gestion des tickets support
- ✅ Gestion du contenu (portfolio, blog)
- ✅ Statistiques avec graphiques
- ✅ Logs et monitoring

### API Backend
- ✅ Authentification JWT + Refresh tokens
- ✅ OAuth2 (Google)
- ✅ CRUD complet pour toutes les entités
- ✅ Upload de fichiers vers Cloudinary
- ✅ Paiements Stripe et PayPal
- ✅ Notifications email
- ✅ WebSocket pour messagerie temps réel
- ✅ Rate limiting et sécurité
- ✅ Cache Redis
- ✅ Gestion des erreurs centralisée

## 🔧 Scripts NPM

### Backend
```bash
npm run dev          # Développement avec nodemon
npm run build        # Build pour production
npm start            # Démarrer en production
npm test             # Lancer les tests
npm run lint         # Vérifier le code
```

### Frontend
```bash
npm run dev          # Développement
npm run build        # Build pour production
npm start            # Démarrer en production
npm run lint         # Vérifier le code
```

## 🔒 Sécurité

- ✅ Helmet.js pour headers HTTP sécurisés
- ✅ CORS configuré
- ✅ Protection CSRF
- ✅ Rate limiting sur les endpoints sensibles
- ✅ Validation des entrées avec Joi
- ✅ Sanitization des données
- ✅ Mots de passe hashés avec bcrypt
- ✅ JWT avec expiration et refresh tokens
- ✅ HTTPS en production

## 📊 Base de Données

### Tables Principales
- **users** - Utilisateurs et admins
- **products** - Produits de la boutique
- **services** - Services proposés
- **orders** - Commandes
- **order_items** - Détails des commandes
- **portfolio** - Projets portfolio
- **blog_posts** - Articles de blog
- **blog_categories** - Catégories blog
- **tickets** - Tickets support
- **messages** - Messages internes
- **testimonials** - Témoignages clients

## 🚀 Déploiement

### Backend (Heroku, Railway, DigitalOcean)
```bash
# Build
npm run build

# Variables d'environnement
# Configurer toutes les variables .env sur la plateforme

# Démarrer
npm start
```

### Frontend (Vercel, Netlify)
```bash
# Build
npm run build

# La plateforme détectera automatiquement Next.js
```

### Base de Données
- PostgreSQL : Heroku Postgres, Supabase, ou DigitalOcean
- Redis : Redis Cloud, Upstash

## 📝 API Documentation

L'API est documentée et accessible via :
- **Swagger UI:** http://localhost:5000/api-docs
- **Postman Collection:** Disponible dans `/backend/docs/postman_collection.json`

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/google` - OAuth Google

#### Utilisateurs
- `GET /api/users` - Liste (admin)
- `GET /api/users/:id` - Détails
- `PUT /api/users/:id` - Modifier
- `DELETE /api/users/:id` - Supprimer (admin)

#### Produits
- `GET /api/products` - Liste
- `GET /api/products/:id` - Détails
- `POST /api/products` - Créer (admin)
- `PUT /api/products/:id` - Modifier (admin)
- `DELETE /api/products/:id` - Supprimer (admin)

#### Commandes
- `GET /api/orders` - Liste
- `GET /api/orders/:id` - Détails
- `POST /api/orders` - Créer
- `PUT /api/orders/:id` - Modifier statut (admin)

#### Portfolio
- `GET /api/portfolio` - Liste
- `GET /api/portfolio/:id` - Détails
- `POST /api/portfolio` - Créer (admin)
- `PUT /api/portfolio/:id` - Modifier (admin)
- `DELETE /api/portfolio/:id` - Supprimer (admin)

#### Blog
- `GET /api/blog` - Liste articles
- `GET /api/blog/:slug` - Détails article
- `POST /api/blog` - Créer (admin)
- `PUT /api/blog/:id` - Modifier (admin)
- `DELETE /api/blog/:id` - Supprimer (admin)

#### Tickets
- `GET /api/tickets` - Liste
- `GET /api/tickets/:id` - Détails
- `POST /api/tickets` - Créer
- `PUT /api/tickets/:id` - Modifier statut
- `POST /api/tickets/:id/messages` - Ajouter message

## 🐛 Dépannage

### Erreur de connexion à PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
# Windows : Services > PostgreSQL
# Vérifier les credentials dans .env
```

### Erreur de connexion à Redis
```bash
# Démarrer Redis
redis-server

# Ou désactiver temporairement le cache dans backend/src/config/redis.js
```

### Erreur Stripe/PayPal
```bash
# Vérifier les clés API dans .env
# Utiliser les clés de test pour le développement
```

### Port déjà utilisé
```bash
# Changer le port dans .env
# Backend : PORT=5001
# Frontend : modifier dans package.json ou utiliser -p 3001
```

## 📞 Support

Pour toute question ou problème :
- **Email:** support@studioweb.com
- **Documentation:** Voir `/docs`
- **Issues:** Créer une issue sur le repo

## 📄 Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.

## 🎉 Crédits

Développé avec ❤️ par l'équipe Studio Web

---

**Note:** Ce projet est prêt pour la production mais pensez à :
1. Changer tous les secrets et clés API
2. Configurer un vrai service email
3. Activer HTTPS
4. Configurer les sauvegardes de la base de données
5. Mettre en place un monitoring (Sentry, LogRocket, etc.)