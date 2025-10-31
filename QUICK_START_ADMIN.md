# 🚀 Guide de Démarrage Rapide - Dashboard Admin

## ⚡ Démarrage en 5 Minutes

### 1. Installation des Dépendances

```bash
# Depuis le dossier frontend
cd frontend
npm install
```

### 2. Configuration de l'API

Créez le fichier `.env.local` dans `/frontend` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Lancement du Frontend

```bash
npm run dev
```

Le frontend sera accessible sur **http://localhost:3000**

### 4. Accès au Dashboard Admin

1. Connectez-vous avec un compte admin :
   - Email : `admin@horizonstudio.com`
   - Password : `Admin123!`

2. Accédez au dashboard : **http://localhost:3000/admin**

---

## 📋 Checklist de Vérification

### Frontend ✅
- [x] Next.js 14 installé
- [x] Toutes les dépendances installées
- [x] Variables d'environnement configurées
- [x] Serveur de développement lancé

### Backend (À Faire)
- [ ] Node.js + Express configuré
- [ ] PostgreSQL installé et configuré
- [ ] Redis installé et lancé
- [ ] Variables d'environnement backend configurées
- [ ] Base de données initialisée avec le schéma
- [ ] Données de test insérées
- [ ] Serveur backend lancé sur le port 5000

---

## 🔧 Configuration du Backend (Requis)

### 1. Installation Backend

```bash
cd backend
npm install
```

### 2. Configuration PostgreSQL

```bash
# Créer la base de données
psql -U postgres
CREATE DATABASE horizonstudio;
\c horizonstudio
\i database/schema.sql
\i database/seed.sql
```

### 3. Configuration Redis

```bash
# Lancer Redis
redis-server
```

### 4. Variables d'Environnement Backend

Créez `.env` dans `/backend` :

```env
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

# JWT
JWT_SECRET=your_super_secure_jwt_secret_change_me
JWT_EXPIRE=7d

# Cloudinary (pour les uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Lancement Backend

```bash
npm run dev
```

Le backend sera accessible sur **http://localhost:5000**

---

## 🎯 Test du Dashboard

### 1. Connexion

```
URL : http://localhost:3000/login
Email : admin@horizonstudio.com
Password : Admin123!
```

### 2. Navigation

Une fois connecté, vous serez redirigé vers `/admin` avec accès à :

- 📊 **Dashboard** - Statistiques et graphiques
- 👥 **Utilisateurs** - Gestion des comptes
- 🛍️ **Produits** - Catalogue e-commerce
- 📦 **Commandes** - Suivi des ventes
- 🎨 **Services** - Offres de services
- 💼 **Portfolio** - Projets réalisés
- 📝 **Blog** - Articles et contenu
- 🎫 **Tickets** - Support client
- 💬 **Messages** - Messagerie interne
- ⚙️ **Paramètres** - Configuration

### 3. Test des Fonctionnalités

#### Créer un Produit
1. Allez sur `/admin/products`
2. Cliquez sur "Nouveau produit"
3. Remplissez le formulaire
4. Uploadez une image
5. Cliquez sur "Créer le produit"

#### Gérer une Commande
1. Allez sur `/admin/orders`
2. Cliquez sur une commande
3. Changez le statut
4. Ajoutez un numéro de tracking
5. Sauvegardez

#### Répondre à un Ticket
1. Allez sur `/admin/tickets`
2. Cliquez sur un ticket
3. Tapez votre réponse
4. Changez le statut si nécessaire
5. Envoyez

---

## 🐛 Dépannage

### Erreur : "Cannot connect to API"

**Cause** : Le backend n'est pas lancé ou l'URL est incorrecte

**Solution** :
```bash
# Vérifier que le backend tourne
cd backend
npm run dev

# Vérifier l'URL dans .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Erreur : "Unauthorized" ou redirection vers /login

**Cause** : Token JWT invalide ou expiré

**Solution** :
1. Déconnectez-vous
2. Reconnectez-vous avec les identifiants admin
3. Vérifiez que le backend retourne un token valide

### Erreur : "Database connection failed"

**Cause** : PostgreSQL n'est pas lancé ou mal configuré

**Solution** :
```bash
# Vérifier que PostgreSQL tourne
# Windows : Services > PostgreSQL

# Vérifier les credentials dans backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=horizonstudio
DB_USER=postgres
DB_PASSWORD=your_password
```

### Erreur : "Redis connection failed"

**Cause** : Redis n'est pas lancé

**Solution** :
```bash
# Lancer Redis
redis-server

# Ou désactiver temporairement le cache dans le backend
```

### Page blanche ou erreur 404

**Cause** : Route inexistante ou erreur de build

**Solution** :
```bash
# Nettoyer et rebuilder
cd frontend
rm -rf .next
npm run dev
```

---

## 📚 Ressources Utiles

### Documentation
- **Next.js** : https://nextjs.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Framer Motion** : https://www.framer.com/motion/
- **Recharts** : https://recharts.org/

### Fichiers Importants
- `frontend/src/lib/api.js` - Configuration Axios
- `frontend/src/app/admin/layout.js` - Layout admin
- `backend/src/routes/` - Routes API
- `backend/database/schema.sql` - Schéma de la base

### Commandes Utiles

```bash
# Frontend
npm run dev          # Développement
npm run build        # Build production
npm run start        # Lancer en production
npm run lint         # Vérifier le code

# Backend
npm run dev          # Développement avec nodemon
npm start            # Production
npm test             # Tests

# Base de données
psql -U postgres -d horizonstudio    # Se connecter
\dt                                   # Lister les tables
\d users                              # Décrire la table users
```

---

## 🎨 Personnalisation

### Changer les Couleurs

Modifiez `frontend/tailwind.config.js` :

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',  // Bleu par défaut
          dark: '#2563EB',
        },
      },
    },
  },
}
```

### Ajouter une Nouvelle Page Admin

1. Créez le fichier dans `/frontend/src/app/admin/`
2. Ajoutez le lien dans le sidebar (`layout.js`)
3. Créez la route API correspondante dans le backend

Exemple :

```jsx
// frontend/src/app/admin/analytics/page.js
'use client';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      {/* Votre contenu */}
    </div>
  );
}
```

### Modifier le Sidebar

Éditez `frontend/src/app/admin/layout.js` :

```jsx
const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart }, // Nouveau
  // ... autres items
];
```

---

## 🔐 Sécurité

### En Développement
- ✅ Utilisez des clés API de test (Stripe, PayPal)
- ✅ Gardez les secrets dans `.env` (jamais dans le code)
- ✅ Utilisez `http://localhost` (pas besoin de HTTPS)

### En Production
- ⚠️ Changez TOUS les secrets et clés API
- ⚠️ Activez HTTPS obligatoirement
- ⚠️ Configurez CORS correctement
- ⚠️ Activez rate limiting
- ⚠️ Mettez en place des backups automatiques
- ⚠️ Utilisez des variables d'environnement sécurisées

---

## 📊 Monitoring

### Logs Backend
```bash
# Voir les logs en temps réel
cd backend
npm run dev

# Les logs apparaîtront dans le terminal
```

### Logs Frontend
```bash
# Ouvrir la console du navigateur
F12 > Console

# Les erreurs et logs apparaîtront ici
```

### Base de Données
```bash
# Voir les requêtes en temps réel
psql -U postgres -d horizonstudio

# Activer le logging
SET log_statement = 'all';
```

---

## 🚀 Déploiement

### Frontend (Vercel)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel

# Configurer les variables d'environnement sur vercel.com
```

### Backend (Railway/Heroku)
```bash
# Railway
railway login
railway init
railway up

# Heroku
heroku login
heroku create
git push heroku main
```

### Base de Données (Supabase/Heroku Postgres)
```bash
# Exporter le schéma
pg_dump -U postgres -d horizonstudio -s > schema.sql

# Importer sur le serveur distant
psql -h your-host -U your-user -d your-db < schema.sql
```

---

## 💡 Conseils Pro

### Performance
- Utilisez `React.memo()` pour les composants lourds
- Implémentez le lazy loading pour les images
- Activez la compression gzip sur le serveur
- Utilisez un CDN pour les assets statiques

### SEO
- Ajoutez des meta tags dans chaque page
- Créez un sitemap.xml
- Configurez robots.txt
- Utilisez des URLs propres

### UX
- Ajoutez des loading states partout
- Affichez des messages d'erreur clairs
- Implémentez des confirmations pour les actions destructives
- Testez sur mobile et desktop

### Maintenance
- Commentez le code complexe
- Gardez les dépendances à jour
- Écrivez des tests
- Documentez les changements

---

## 📞 Support

### Problèmes Techniques
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du backend
3. Consultez la documentation
4. Créez une issue sur GitHub

### Questions
- Email : admin@horizonstudio.com
- Discord : https://discord.gg/4qEUNSVjQF
- Documentation : `/docs`

---

## ✅ Checklist Avant Production

### Code
- [ ] Tous les tests passent
- [ ] Pas d'erreurs dans la console
- [ ] Code reviewé et approuvé
- [ ] Documentation à jour

### Sécurité
- [ ] Tous les secrets changés
- [ ] HTTPS activé
- [ ] CORS configuré
- [ ] Rate limiting activé
- [ ] Validation des inputs

### Performance
- [ ] Images optimisées
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] Temps de chargement < 3s

### Monitoring
- [ ] Sentry configuré
- [ ] Google Analytics installé
- [ ] Logs centralisés
- [ ] Alertes configurées

### Backup
- [ ] Backup automatique de la DB
- [ ] Backup des fichiers uploadés
- [ ] Plan de restauration testé

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser le dashboard admin !

**Bon développement ! 🚀**

---

*Guide créé pour Horizon Studio - 2024*