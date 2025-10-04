# 🚀 Guide de Démarrage Rapide - Studio Web

Ce guide vous permettra de lancer l'application en moins de 10 minutes.

## ⚡ Installation Rapide

### Option 1: Script Automatique (Recommandé)

#### Windows (PowerShell)
```powershell
.\install.ps1
```

#### Linux/Mac (Bash)
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Installation Manuelle

```bash
# 1. Installer les dépendances backend
cd backend
npm install

# 2. Installer les dépendances frontend
cd ../frontend
npm install
```

## 🗄️ Configuration de la Base de Données

### 1. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE studioweb;

# Quitter
\q
```

### 2. Exécuter les scripts SQL

```bash
# Créer les tables
psql -U postgres -d studioweb -f backend/database/schema.sql

# Insérer les données de test
psql -U postgres -d studioweb -f backend/database/seed.sql
```

## ⚙️ Configuration Minimale

### Backend (.env)

Créer `backend/.env` avec au minimum :

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studioweb
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=changez_moi_secret_super_securise_123456
JWT_REFRESH_SECRET=changez_moi_refresh_secret_123456

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

Créer `frontend/.env.local` avec :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🎯 Lancer l'Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le backend démarre sur **http://localhost:5000**

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Le frontend démarre sur **http://localhost:3000**

## 🔐 Comptes de Test

### Administrateur
- **Email:** admin@studioweb.com
- **Mot de passe:** Admin123!
- **Accès:** Dashboard admin complet

### Client
- **Email:** client@example.com
- **Mot de passe:** Client123!
- **Accès:** Espace client

## 📍 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Site web principal |
| **Backend API** | http://localhost:5000 | API REST |
| **API Health** | http://localhost:5000/health | Vérifier l'état de l'API |
| **Admin Dashboard** | http://localhost:3000/admin | Dashboard administrateur |
| **Client Dashboard** | http://localhost:3000/dashboard | Espace client |

## ✅ Vérification de l'Installation

### 1. Tester le Backend

```bash
# Vérifier que l'API répond
curl http://localhost:5000/health
```

Réponse attendue :
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Tester le Frontend

Ouvrir http://localhost:3000 dans votre navigateur.
Vous devriez voir la page d'accueil.

### 3. Tester la Connexion

1. Aller sur http://localhost:3000/auth/login
2. Se connecter avec les identifiants de test
3. Vous devriez être redirigé vers le dashboard

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
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
EMAIL_FROM=Studio Web <noreply@studioweb.com>
```

## 🐛 Problèmes Courants

### Erreur: "Cannot connect to database"

**Solution:**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans `backend/.env`
3. Vérifier que la base `studioweb` existe

```bash
psql -U postgres -l  # Lister les bases de données
```

### Erreur: "Port 5000 already in use"

**Solution:**
Changer le port dans `backend/.env` :
```env
PORT=5001
```

Et dans `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Erreur: "Module not found"

**Solution:**
Réinstaller les dépendances :
```bash
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Le frontend ne se connecte pas au backend

**Solution:**
1. Vérifier que le backend est démarré
2. Vérifier les URLs dans `frontend/.env.local`
3. Vérifier la configuration CORS dans `backend/src/server.js`

## 📚 Prochaines Étapes

1. **Explorer l'application**
   - Tester toutes les fonctionnalités
   - Créer des produits, articles, projets
   - Tester le système de tickets

2. **Personnaliser**
   - Modifier les couleurs dans `frontend/tailwind.config.js`
   - Changer le logo et les images
   - Adapter les textes à votre entreprise

3. **Configurer les services externes**
   - Cloudinary pour les images
   - Stripe pour les paiements
   - Email pour les notifications

4. **Déployer en production**
   - Consulter le README.md section "Déploiement"
   - Configurer les variables d'environnement de production
   - Utiliser HTTPS

## 💡 Conseils

- **Développement:** Utilisez toujours `npm run dev` pour le hot-reload
- **Production:** Utilisez `npm run build` puis `npm start`
- **Logs:** Consultez `backend/logs/` pour les logs de l'application
- **Documentation API:** Consultez le README.md pour la liste complète des endpoints

## 🆘 Besoin d'Aide ?

- **Documentation complète:** Voir `README.md`
- **Structure du projet:** Voir `ARBORESCENCE.md`
- **Issues:** Créer une issue sur GitHub

## 🎉 C'est Parti !

Votre application est maintenant prête à l'emploi. Bon développement ! 🚀