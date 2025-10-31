# 🚀 Quick Start Guide - Horizon Studio

This guide will help you launch the application in less than 10 minutes.

## ⚡ Quick Installation

### Option 1: Automatic Script (Recommended)

#### Windows (PowerShell)
```powershell
.\install.ps1
```

#### Linux/Mac (Bash)
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

## 🗄️ Database Configuration

### 1. Create database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE horizonstudio;

# Exit
\q
```

### 2. Execute SQL scripts

```bash
# Create tables
psql -U postgres -d horizonstudio -f backend/database/schema.sql

# Insert test data
psql -U postgres -d horizonstudio -f backend/database/seed.sql
```

## ⚙️ Minimal Configuration

### Backend (.env)

Create `backend/.env` with at minimum:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=horizonstudio
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=change_me_super_secure_secret_123456
JWT_REFRESH_SECRET=change_me_refresh_secret_123456

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🎯 Launch Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend starts on **http://localhost:5000**

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend starts on **http://localhost:3000**

## 🔐 Test Accounts

### Administrator
- **Email:** admin@horizonstudio.com
- **Password:** Admin123!
- **Access:** Complete admin dashboard

### Client
- **Email:** client@example.com
- **Password:** Client123!
- **Access:** Client area

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main website |
| **Backend API** | http://localhost:5000 | REST API |
| **API Health** | http://localhost:5000/health | Check API status |
| **Admin Dashboard** | http://localhost:3000/admin | Admin dashboard |
| **Client Dashboard** | http://localhost:3000/dashboard | Client area |

## ✅ Installation Verification

### 1. Test Backend

```bash
# Check that API responds
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Test Frontend

Open http://localhost:3000 in your browser.
You should see the homepage.

### 3. Test Login

1. Go to http://localhost:3000/auth/login
2. Login with test credentials
3. You should be redirected to the dashboard

## 🔧 Configuration Optionnelle

### Redis (Cache - Optionnel)

Si vous voulez activer le cache Redis :

```bash
# Installer Redis
# Windows: https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt-get install redis-server

# Démarrer Redis
redis-server
```

Ajouter dans `backend/.env` :
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Cloudinary (Upload d'images - Optionnel)

1. Créer un compte gratuit sur https://cloudinary.com
2. Récupérer vos credentials
3. Ajouter dans `backend/.env` :

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### Stripe (Paiements - Optionnel)

1. Créer un compte sur https://stripe.com
2. Récupérer vos clés de test
3. Ajouter dans `backend/.env` :

```env
STRIPE_SECRET_KEY=sk_test_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
```

4. Ajouter dans `frontend/.env.local` :

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_cle
```

### Email (Notifications - Optionnel)

Pour Gmail :

1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application
3. Ajouter dans `backend/.env` :

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Horizon Studio <noreply@horizonstudio.com>
```

## 🐛 Common Issues

### Error: "Cannot connect to database"

**Solution:**
1. Check that PostgreSQL is running
2. Check credentials in `backend/.env`
3. Check that `horizonstudio` database exists

```bash
psql -U postgres -l  # List databases
```

### Error: "Port 5000 already in use"

**Solution:**
Change port in `backend/.env`:
```env
PORT=5001
```

And in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Error: "Module not found"

**Solution:**
Reinstall dependencies:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Frontend doesn't connect to backend

**Solution:**
1. Check that backend is running
2. Check URLs in `frontend/.env.local`
3. Check CORS configuration in `backend/src/server.js`

## 📚 Next Steps

1. **Explore the application**
   - Test all features
   - Create products, articles, projects
   - Test ticket system

2. **Customize**
   - Modify colors in `frontend/tailwind.config.js`
   - Change logo and images
   - Adapt texts to your business

3. **Configure external services**
   - Cloudinary for images
   - Stripe for payments
   - Email for notifications

4. **Deploy to production**
   - See README.md "Deployment" section
   - Configure production environment variables
   - Use HTTPS

## 💡 Tips

- **Development:** Always use `npm run dev` for hot-reload
- **Production:** Use `npm run build` then `npm start`
- **Logs:** Check `backend/logs/` for application logs
- **API Documentation:** See README.md for complete endpoint list

## 🆘 Need Help?

- **Complete documentation:** See `README.md`
- **Project structure:** See `ARBORESCENCE.md`
- **Issues:** Create an issue on GitHub

## 🎉 Let's Go!

Your application is now ready to use. Happy coding! 🚀