# 🛠️ Commandes Utiles - Studio Web Platform

Guide de référence rapide pour toutes les commandes du projet.

---

## 📦 Installation

### Installation Automatique

```powershell
# Windows (PowerShell)
.\install.ps1
```

```bash
# Linux/Mac
chmod +x install.sh
./install.sh
```

### Installation Manuelle

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🗄️ Base de Données

### Créer la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE studioweb;

# Quitter
\q
```

### Exécuter les Scripts SQL

```bash
# Schéma (tables, relations, indexes)
psql -U postgres -d studioweb -f backend/database/schema.sql

# Données de test
psql -U postgres -d studioweb -f backend/database/seed.sql
```

### Commandes PostgreSQL Utiles

```bash
# Lister les bases de données
psql -U postgres -l

# Se connecter à une base
psql -U postgres -d studioweb

# Lister les tables
\dt

# Décrire une table
\d users

# Voir les données d'une table
SELECT * FROM users;

# Supprimer toutes les données
TRUNCATE TABLE users CASCADE;

# Supprimer la base
DROP DATABASE studioweb;
```

---

## 🚀 Lancement

### Mode Développement

```bash
# Backend (Terminal 1)
cd backend
npm run dev
# Démarre sur http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm run dev
# Démarre sur http://localhost:3000
```

### Mode Production

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

## 🔐 Gestion des Utilisateurs

### Créer un Admin via SQL

```sql
-- Se connecter à la base
psql -U postgres -d studioweb

-- Créer un admin
INSERT INTO users (first_name, last_name, email, password, role)
VALUES (
  'Admin',
  'User',
  'admin@studioweb.com',
  '$2b$10$YourHashedPasswordHere',
  'admin'
);

-- Vérifier
SELECT * FROM users WHERE role = 'admin';
```

### Hasher un Mot de Passe

```javascript
// Dans Node.js REPL
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

## 🐳 Docker (À venir)

### Build

```bash
# Backend
docker build -t studioweb-backend ./backend

# Frontend
docker build -t studioweb-frontend ./frontend
```

### Run

```bash
# Backend
docker run -p 5000:5000 studioweb-backend

# Frontend
docker run -p 3000:3000 studioweb-frontend
```

### Docker Compose

```bash
# Démarrer tous les services
docker-compose up

# En arrière-plan
docker-compose up -d

# Arrêter
docker-compose down

# Rebuild
docker-compose up --build
```

---

## 🔄 Git

### Workflow de Base

```bash
# Cloner le repo
git clone https://github.com/username/studioweb.git
cd studioweb

# Créer une branche
git checkout -b feature/ma-fonctionnalite

# Voir les changements
git status
git diff

# Ajouter les fichiers
git add .

# Commit
git commit -m "feat: ajout de ma fonctionnalité"

# Push
git push origin feature/ma-fonctionnalite

# Pull les derniers changements
git pull origin main

# Merge main dans votre branche
git merge main
```

### Conventions de Commit

```bash
# Nouvelle fonctionnalité
git commit -m "feat: ajout du système de paiement"

# Correction de bug
git commit -m "fix: correction du bug de connexion"

# Documentation
git commit -m "docs: mise à jour du README"

# Style/Formatting
git commit -m "style: formatage du code"

# Refactoring
git commit -m "refactor: restructuration du controller"

# Tests
git commit -m "test: ajout des tests unitaires"

# Performance
git commit -m "perf: optimisation des requêtes SQL"
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

# Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Créer une app
heroku create studioweb-api

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Ajouter Redis
heroku addons:create heroku-redis:hobby-dev

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=your_secret

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail

# Ouvrir l'app
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

### Backup Base de Données

```bash
# Exporter la base
pg_dump -U postgres -d studioweb > backup.sql

# Importer la base
psql -U postgres -d studioweb < backup.sql

# Exporter avec compression
pg_dump -U postgres -d studioweb | gzip > backup.sql.gz

# Importer depuis compression
gunzip -c backup.sql.gz | psql -U postgres -d studioweb
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

### Avec cURL

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@studioweb.com","password":"Admin123!"}'

# Get products (avec token)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Avec HTTPie

```bash
# Installer HTTPie
pip install httpie

# Health check
http GET http://localhost:5000/health

# Login
http POST http://localhost:5000/api/auth/login \
  email=admin@studioweb.com \
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

## 🆘 Dépannage

### Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Problèmes de connexion DB

```bash
# Vérifier que PostgreSQL est démarré
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql

# Mac
brew services list
```

### Problèmes de permissions

```bash
# Linux/Mac
sudo chown -R $USER:$USER .
chmod -R 755 .
```

---

## 📚 Ressources

### Documentation Officielle
- Node.js: https://nodejs.org/docs
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs
- Express: https://expressjs.com
- React: https://react.dev

### Outils Utiles
- Postman: https://www.postman.com
- pgAdmin: https://www.pgadmin.org
- Redis Commander: https://github.com/joeferner/redis-commander
- VS Code Extensions: ESLint, Prettier, GitLens

---

**Dernière mise à jour:** Janvier 2024  
**Mainteneur:** Studio Web Team