# 🛠️ Useful Commands - Horizon Studio Platform

Quick reference guide for all project commands.

---

## 📦 Installation

### Automatic Installation

```powershell
# Windows (PowerShell)
.\install.ps1
```

```bash
# Linux/Mac
chmod +x install.sh
./install.sh
```

### Manual Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🗄️ Database

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE horizonstudio;

# Exit
\q
```

### Execute SQL Scripts

```bash
# Schema (tables, relations, indexes)
psql -U postgres -d horizonstudio -f backend/database/schema.sql

# Test data
psql -U postgres -d horizonstudio -f backend/database/seed.sql
```

### Useful PostgreSQL Commands

```bash
# List databases
psql -U postgres -l

# Connect to database
psql -U postgres -d horizonstudio

# List tables
\dt

# Describe table
\d users

# View table data
SELECT * FROM users;

# Delete all data
TRUNCATE TABLE users CASCADE;

# Drop database
DROP DATABASE horizonstudio;
```

---

## 🚀 Launch

### Development Mode

```bash
# Backend (Terminal 1)
cd backend
npm run dev
# Starts on http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm run dev
# Starts on http://localhost:3000
```

### Production Mode

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

---

## 🧪 Tests

### Backend

```bash
cd backend

# Tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests d'un fichier spécifique
npm test -- userController.test.js
```

### Frontend

```bash
cd frontend

# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Tests avec coverage
npm run test:coverage
```

---

## 🔍 Linting & Formatting

### Backend

```bash
cd backend

# Linter (ESLint)
npm run lint

# Fix automatique
npm run lint:fix

# Formatter (Prettier)
npm run format
```

### Frontend

```bash
cd frontend

# Linter
npm run lint

# Fix automatique
npm run lint:fix

# Formatter
npm run format
```

---

## 📊 Logs

### Voir les Logs Backend

```bash
# Logs combinés
cat backend/logs/combined.log

# Logs d'erreurs uniquement
cat backend/logs/error.log

# Suivre les logs en temps réel
tail -f backend/logs/combined.log

# Vider les logs
> backend/logs/combined.log
> backend/logs/error.log
```

---

## 🔐 User Management

### Create Admin via SQL

```sql
-- Connect to database
psql -U postgres -d horizonstudio

-- Create admin
INSERT INTO users (first_name, last_name, email, password, role)
VALUES (
  'Admin',
  'User',
  'admin@horizonstudio.com',
  '$2b$10$YourHashedPasswordHere',
  'admin'
);

-- Verify
SELECT * FROM users WHERE role = 'admin';
```

### Hash a Password

```javascript
// In Node.js REPL
const bcrypt = require('bcryptjs');
const password = 'YourPassword123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

---

## 📦 Gestion des Dépendances

### Backend

```bash
cd backend

# Installer une dépendance
npm install package-name

# Installer en dev
npm install -D package-name

# Mettre à jour toutes les dépendances
npm update

# Vérifier les vulnérabilités
npm audit

# Corriger les vulnérabilités
npm audit fix

# Lister les dépendances obsolètes
npm outdated
```

### Frontend

```bash
cd frontend

# Même commandes que backend
npm install package-name
npm update
npm audit
npm audit fix
npm outdated
```

---

## 🐳 Docker (Coming Soon)

### Build

```bash
# Backend
docker build -t horizonstudio-backend ./backend

# Frontend
docker build -t horizonstudio-frontend ./frontend
```

### Run

```bash
# Backend
docker run -p 5000:5000 horizonstudio-backend

# Frontend
docker run -p 3000:3000 horizonstudio-frontend
```

### Docker Compose

```bash
# Start all services
docker-compose up

# In background
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up --build
```

---

## 🔄 Git

### Basic Workflow

```bash
# Clone repo
git clone https://github.com/username/horizonstudio.git
cd horizonstudio

# Create branch
git checkout -b feature/my-feature

# View changes
git status
git diff

# Add files
git add .

# Commit
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature

# Pull latest changes
git pull origin main

# Merge main into your branch
git merge main
```

### Commit Conventions

```bash
# New feature
git commit -m "feat: add payment system"

# Bug fix
git commit -m "fix: fix login bug"

# Documentation
git commit -m "docs: update README"

# Style/Formatting
git commit -m "style: format code"

# Refactoring
git commit -m "refactor: restructure controller"

# Tests
git commit -m "test: add unit tests"

# Performance
git commit -m "perf: optimize SQL queries"
```

---

## 🌐 Déploiement

### Vercel (Frontend)

```bash
cd frontend

# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Heroku (Backend)

```bash
cd backend

# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create horizonstudio-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Configure environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

---

## 🔧 Maintenance

### Nettoyer le Projet

```bash
# Supprimer node_modules et reinstaller
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer le cache Next.js
cd frontend
rm -rf .next
```

### Database Backup

```bash
# Export database
pg_dump -U postgres -d horizonstudio > backup.sql

# Import database
psql -U postgres -d horizonstudio < backup.sql

# Export with compression
pg_dump -U postgres -d horizonstudio | gzip > backup.sql.gz

# Import from compression
gunzip -c backup.sql.gz | psql -U postgres -d horizonstudio
```

### Monitoring

```bash
# Voir les processus Node.js
ps aux | grep node

# Tuer un processus
kill -9 PID

# Voir l'utilisation mémoire
free -h

# Voir l'espace disque
df -h

# Voir les connexions réseau
netstat -tuln | grep 5000
```

---

## 📊 Performance

### Analyser le Bundle Frontend

```bash
cd frontend

# Analyser la taille du bundle
npm run build
npm run analyze
```

### Profiling Backend

```bash
cd backend

# Avec Node.js profiler
node --prof src/server.js

# Analyser le profil
node --prof-process isolate-*.log > profile.txt
```

---

## 🔍 Debugging

### Backend

```bash
# Mode debug
cd backend
npm run dev:debug

# Avec Node Inspector
node --inspect src/server.js

# Ouvrir chrome://inspect dans Chrome
```

### Frontend

```bash
# Next.js debug mode
cd frontend
NODE_OPTIONS='--inspect' npm run dev

# Ouvrir chrome://inspect dans Chrome
```

---

## 📱 API Testing

### With cURL

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@horizonstudio.com","password":"Admin123!"}'

# Get products (with token)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### With HTTPie

```bash
# Install HTTPie
pip install httpie

# Health check
http GET http://localhost:5000/health

# Login
http POST http://localhost:5000/api/auth/login \
  email=admin@horizonstudio.com \
  password=Admin123!

# Get products
http GET http://localhost:5000/api/products \
  Authorization:"Bearer YOUR_TOKEN"
```

---

## 🎯 Scripts Personnalisés

### Backend (package.json)

```bash
npm run dev          # Démarrage développement
npm run dev:debug    # Démarrage avec debugger
npm start            # Démarrage production
npm test             # Tests
npm run lint         # Linter
npm run format       # Formatter
```

### Frontend (package.json)

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm start            # Démarrage production
npm run lint         # Linter
npm test             # Tests
npm run analyze      # Analyser le bundle
```

---

## 🆘 Troubleshooting

### Port already in use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Database connection issues

```bash
# Check that PostgreSQL is running
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql

# Mac
brew services list
```

### Permission issues

```bash
# Linux/Mac
sudo chown -R $USER:$USER .
chmod -R 755 .
```

---

## 📚 Resources

### Official Documentation
- Node.js: https://nodejs.org/docs
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs
- Express: https://expressjs.com
- React: https://react.dev

### Useful Tools
- Postman: https://www.postman.com
- pgAdmin: https://www.pgadmin.org
- Redis Commander: https://github.com/joeferner/redis-commander
- VS Code Extensions: ESLint, Prettier, GitLens

---

**Last updated:** January 2025  
**Maintainer:** Horizon Studio Team