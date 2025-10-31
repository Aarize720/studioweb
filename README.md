# Horizon Studio - Creative Code, Clear Results

## 🚀 Description

Complete web platform for Horizon Studio including:
- Showcase website with services and portfolio
- Online shop with Stripe/PayPal payment
- Blog with content management system
- Client area with messaging and support tickets
- Complete admin dashboard
- Secure REST API with JWT authentication

## 📋 Technologies Used

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

### Prerequisites

- Node.js 18+ et npm
- PostgreSQL 14+
- Redis 6+
- Compte Stripe (mode test)
- Compte Cloudinary (gratuit)

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. PostgreSQL database configuration

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE horizonstudio;

# Connect to database
\c horizonstudio

# Execute SQL scripts
\i backend/database/schema.sql
\i backend/database/seed.sql
```

### 3. Redis Configuration

```bash
# Install Redis (Windows)
# Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL/Docker

# Start Redis
redis-server
```

### 4. Environment Variables

#### Backend (.env in /backend)

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=horizonstudio
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secure_jwt_secret_change_me
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secure_refresh_secret
JWT_REFRESH_EXPIRE=30d

# Email (Nodemailer - example with Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Horizon Studio <noreply@horizonstudio.com>

# Stripe
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth2 (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend (.env.local dans /frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
NEXT_PUBLIC_PAYPAL_CLIENT_ID=votre_client_id
```

### 5. Launch the application

#### Development

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

## 📁 Project Structure

```
horizonstudio/
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

## 🔐 Test Accounts

### Administrator
- **Email:** admin@horizonstudio.com
- **Password:** Admin123!

### Client
- **Email:** client@example.com
- **Password:** Client123!

## 🎯 Main Features

### Public Frontend
- ✅ Homepage with presentation and CTA
- ✅ Services page with pricing and quote form
- ✅ Portfolio filterable by category
- ✅ Shop with cart and payment
- ✅ Blog with categories and tags
- ✅ Contact form with email sending

### Client Area
- ✅ Authentication (login/signup)
- ✅ Personal dashboard
- ✅ Order tracking
- ✅ Support ticket system
- ✅ Real-time internal messaging
- ✅ Profile management

### Admin Dashboard
- ✅ User management
- ✅ Product and service management
- ✅ Order management
- ✅ Support ticket management
- ✅ Content management (portfolio, blog)
- ✅ Statistics with charts
- ✅ Logs and monitoring

### Backend API
- ✅ JWT Authentication + Refresh tokens
- ✅ OAuth2 (Google)
- ✅ Complete CRUD for all entities
- ✅ File upload to Cloudinary
- ✅ Stripe and PayPal payments
- ✅ Email notifications
- ✅ WebSocket for real-time messaging
- ✅ Rate limiting and security
- ✅ Redis cache
- ✅ Centralized error handling

## 🔧 NPM Scripts

### Backend
```bash
npm run dev          # Development with nodemon
npm run build        # Build for production
npm start            # Start in production
npm test             # Run tests
npm run lint         # Check code
```

### Frontend
```bash
npm run dev          # Development
npm run build        # Build for production
npm start            # Start in production
npm run lint         # Check code
```

## 🔒 Security

- ✅ Helmet.js for secure HTTP headers
- ✅ CORS configured
- ✅ CSRF protection
- ✅ Rate limiting on sensitive endpoints
- ✅ Input validation with Joi
- ✅ Data sanitization
- ✅ Passwords hashed with bcrypt
- ✅ JWT with expiration and refresh tokens
- ✅ HTTPS in production

## 📊 Database

### Main Tables
- **users** - Users and admins
- **products** - Shop products
- **services** - Services offered
- **orders** - Orders
- **order_items** - Order details
- **portfolio** - Portfolio projects
- **blog_posts** - Blog articles
- **blog_categories** - Blog categories
- **tickets** - Support tickets
- **messages** - Internal messages
- **testimonials** - Client testimonials

## 🚀 Deployment

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

The API is documented and accessible via:
- **Swagger UI:** http://localhost:5000/api-docs
- **Postman Collection:** Available in `/backend/docs/postman_collection.json`

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/google` - OAuth Google

#### Users
- `GET /api/users` - List (admin)
- `GET /api/users/:id` - Details
- `PUT /api/users/:id` - Update
- `DELETE /api/users/:id` - Delete (admin)

#### Products
- `GET /api/products` - List
- `GET /api/products/:id` - Details
- `POST /api/products` - Create (admin)
- `PUT /api/products/:id` - Update (admin)
- `DELETE /api/products/:id` - Delete (admin)

#### Orders
- `GET /api/orders` - List
- `GET /api/orders/:id` - Details
- `POST /api/orders` - Create
- `PUT /api/orders/:id` - Update status (admin)

#### Portfolio
- `GET /api/portfolio` - List
- `GET /api/portfolio/:id` - Details
- `POST /api/portfolio` - Create (admin)
- `PUT /api/portfolio/:id` - Update (admin)
- `DELETE /api/portfolio/:id` - Delete (admin)

#### Blog
- `GET /api/blog` - List articles
- `GET /api/blog/:slug` - Article details
- `POST /api/blog` - Create (admin)
- `PUT /api/blog/:id` - Update (admin)
- `DELETE /api/blog/:id` - Delete (admin)

#### Tickets
- `GET /api/tickets` - List
- `GET /api/tickets/:id` - Details
- `POST /api/tickets` - Create
- `PUT /api/tickets/:id` - Update status
- `POST /api/tickets/:id/messages` - Add message

## 🐛 Troubleshooting

### PostgreSQL connection error
```bash
# Check that PostgreSQL is running
# Windows: Services > PostgreSQL
# Check credentials in .env
```

### Redis connection error
```bash
# Start Redis
redis-server

# Or temporarily disable cache in backend/src/config/redis.js
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
- **Email:** admin@horizonstudio.com
- **Discord:** https://discord.gg/4qEUNSVjQF
- **Documentation:** Voir `/docs`
- **Issues:** Créer une issue sur le repo

## 📄 Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.

## 🎉 Crédits

Développé avec ❤️ par l'équipe Horizon Studio

---

**Note:** Ce projet est prêt pour la production mais pensez à :
1. Changer tous les secrets et clés API
2. Configurer un vrai service email
3. Activer HTTPS
4. Configurer les sauvegardes de la base de données
5. Mettre en place un monitoring (Sentry, LogRocket, etc.)