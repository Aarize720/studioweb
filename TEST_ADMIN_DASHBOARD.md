# 🧪 Guide de Test - Dashboard Admin

## ✅ Checklist de Test Rapide

### 1. Authentification (5 min)

#### Test 1.1 : Connexion Admin
```
1. Aller sur http://localhost:3000/auth/login
2. Se connecter avec :
   - Email : admin@horizonstudio.com
   - Password : Admin123!
3. ✅ Vérifier la redirection vers /admin
4. ✅ Vérifier que le nom apparaît en haut à droite
```

#### Test 1.2 : Persistance de Session
```
1. Naviguer vers /admin/portfolio
2. Rafraîchir la page (F5)
3. ✅ Vérifier qu'on reste connecté
4. Naviguer vers /admin/blog
5. ✅ Vérifier qu'on reste connecté
6. Fermer l'onglet et rouvrir /admin
7. ✅ Vérifier qu'on reste connecté
```

#### Test 1.3 : Déconnexion
```
1. Cliquer sur le bouton "Déconnexion" dans le sidebar
2. ✅ Vérifier la redirection vers /auth/login
3. Essayer d'accéder à /admin directement
4. ✅ Vérifier la redirection vers /auth/login
```

**Résultat attendu :** ✅ Pas de déconnexion intempestive lors de la navigation

---

### 2. Portfolio (10 min)

#### Test 2.1 : Créer un Projet
```
1. Aller sur /admin/portfolio
2. Cliquer sur "Nouveau projet"
3. Remplir le formulaire :
   - Titre : "Site E-commerce"
   - Description : "Boutique en ligne moderne"
   - Client : "Client Test"
   - Catégorie : Web
   - Technologies : "React, Node.js, MongoDB"
   - URL : "https://example.com"
4. Uploader une image (JPG/PNG < 5MB)
5. Cocher "Mettre en avant"
6. Statut : Actif
7. Cliquer sur "Créer le projet"
8. ✅ Vérifier le message "Projet créé avec succès"
9. ✅ Vérifier la redirection vers /admin/portfolio
10. ✅ Vérifier que le projet apparaît dans la liste
```

#### Test 2.2 : Modifier un Projet
```
1. Cliquer sur un projet dans la liste
2. Modifier le titre : "Site E-commerce V2"
3. Changer la catégorie : Mobile
4. Cliquer sur "Enregistrer"
5. ✅ Vérifier le message "Projet mis à jour avec succès"
6. ✅ Vérifier que les modifications sont sauvegardées
```

#### Test 2.3 : Supprimer un Projet
```
1. Ouvrir un projet
2. Cliquer sur "Supprimer"
3. Confirmer la suppression
4. ✅ Vérifier le message "Projet supprimé"
5. ✅ Vérifier que le projet n'apparaît plus dans la liste
```

**Résultat attendu :** ✅ Toutes les opérations CRUD fonctionnent

---

### 3. Blog (10 min)

#### Test 3.1 : Créer un Article
```
1. Aller sur /admin/blog
2. Cliquer sur "Nouvel article"
3. Remplir le formulaire :
   - Titre : "Les tendances web 2024"
   - Contenu : "Lorem ipsum dolor sit amet..."
   - Extrait : "Découvrez les tendances..."
   - Catégorie : "Développement web"
   - Tags : "react, javascript, web"
   - Statut : Publié
4. Section SEO :
   - Titre SEO : "Tendances Web 2024 | Blog"
   - Description SEO : "Découvrez les dernières tendances..."
5. Uploader une image de couverture
6. Cliquer sur "Créer l'article"
7. ✅ Vérifier le message "Article créé avec succès"
8. ✅ Vérifier la redirection vers /admin/blog
9. ✅ Vérifier que l'article apparaît dans la liste
```

#### Test 3.2 : Modifier un Article
```
1. Cliquer sur un article dans la liste
2. Modifier le contenu
3. Changer le statut : Brouillon
4. Cliquer sur "Enregistrer"
5. ✅ Vérifier le message "Article mis à jour avec succès"
6. ✅ Vérifier que les modifications sont sauvegardées
```

#### Test 3.3 : Aperçu d'un Article
```
1. Ouvrir un article
2. Cliquer sur "Aperçu"
3. ✅ Vérifier l'ouverture dans un nouvel onglet
4. ✅ Vérifier l'affichage de l'article côté public
```

#### Test 3.4 : Supprimer un Article
```
1. Ouvrir un article
2. Cliquer sur "Supprimer"
3. Confirmer la suppression
4. ✅ Vérifier le message "Article supprimé"
5. ✅ Vérifier que l'article n'apparaît plus dans la liste
```

**Résultat attendu :** ✅ Toutes les opérations CRUD fonctionnent

---

### 4. Services (10 min)

#### Test 4.1 : Créer un Service
```
1. Aller sur /admin/services
2. Cliquer sur "Nouveau service"
3. Remplir le formulaire :
   - Nom : "Développement Web"
   - Description : "Création de sites web sur mesure"
   - Prix : "2500"
   - Durée : "4 semaines"
   - Catégorie : Web
4. Ajouter des features :
   - Cliquer sur "Ajouter une fonctionnalité"
   - Feature 1 : "Design responsive"
   - Feature 2 : "SEO optimisé"
   - Feature 3 : "Support 6 mois"
5. Uploader une image
6. Statut : Actif
7. Cliquer sur "Créer le service"
8. ✅ Vérifier le message "Service créé avec succès"
9. ✅ Vérifier la redirection vers /admin/services
10. ✅ Vérifier que le service apparaît dans la liste
```

#### Test 4.2 : Modifier un Service
```
1. Cliquer sur un service dans la liste
2. Modifier le prix : "3000"
3. Ajouter une nouvelle feature
4. Supprimer une feature existante
5. Cliquer sur "Enregistrer"
6. ✅ Vérifier le message "Service mis à jour avec succès"
7. ✅ Vérifier que les modifications sont sauvegardées
```

#### Test 4.3 : Supprimer un Service
```
1. Ouvrir un service
2. Cliquer sur "Supprimer"
3. Confirmer la suppression
4. ✅ Vérifier le message "Service supprimé"
5. ✅ Vérifier que le service n'apparaît plus dans la liste
```

**Résultat attendu :** ✅ Toutes les opérations CRUD fonctionnent

---

### 5. Upload d'Images (5 min)

#### Test 5.1 : Upload Valide
```
1. Aller sur n'importe quelle page de création
2. Cliquer sur "Choisir une image"
3. Sélectionner une image JPG/PNG < 5MB
4. ✅ Vérifier l'aperçu de l'image
5. ✅ Vérifier le bouton X pour supprimer
6. Cliquer sur X
7. ✅ Vérifier que l'aperçu disparaît
```

#### Test 5.2 : Upload Invalide
```
1. Essayer d'uploader un fichier > 5MB
2. ✅ Vérifier le message d'erreur
3. Essayer d'uploader un fichier non-image (PDF, TXT)
4. ✅ Vérifier que le fichier est rejeté
```

**Résultat attendu :** ✅ Validation des uploads fonctionne

---

### 6. Navigation et UI (5 min)

#### Test 6.1 : Sidebar Desktop
```
1. Ouvrir le dashboard sur un écran > 1024px
2. ✅ Vérifier que le sidebar est visible
3. Cliquer sur chaque lien du menu
4. ✅ Vérifier que l'item actif est surligné
5. ✅ Vérifier que le contenu change
```

#### Test 6.2 : Sidebar Mobile
```
1. Ouvrir le dashboard sur mobile (< 1024px)
2. ✅ Vérifier que le sidebar est caché
3. Cliquer sur l'icône menu (hamburger)
4. ✅ Vérifier que le sidebar s'ouvre
5. Cliquer sur un lien
6. ✅ Vérifier que le sidebar se ferme automatiquement
```

#### Test 6.3 : Notifications
```
1. Cliquer sur l'icône cloche
2. ✅ Vérifier l'affichage du dropdown
3. ✅ Vérifier le badge avec le nombre de notifications
4. Cliquer sur "Tout marquer comme lu"
5. ✅ Vérifier que le badge disparaît
```

**Résultat attendu :** ✅ Interface responsive et fonctionnelle

---

### 7. Gestion des Erreurs (5 min)

#### Test 7.1 : Erreur Réseau
```
1. Arrêter le backend
2. Essayer de créer un projet
3. ✅ Vérifier le message d'erreur
4. ✅ Vérifier que le bouton redevient cliquable
5. Redémarrer le backend
```

#### Test 7.2 : Validation Formulaire
```
1. Essayer de soumettre un formulaire vide
2. ✅ Vérifier les messages de validation HTML5
3. Remplir seulement le titre
4. ✅ Vérifier que les autres champs requis sont signalés
```

#### Test 7.3 : Token Expiré
```
1. Se connecter
2. Supprimer le token dans localStorage :
   - F12 > Application > Local Storage
   - Supprimer "token"
3. Essayer de créer un projet
4. ✅ Vérifier la redirection vers /auth/login
```

**Résultat attendu :** ✅ Gestion d'erreurs robuste

---

## 🔍 Tests Avancés (Optionnel)

### Test de Performance
```
1. Créer 50 projets portfolio
2. ✅ Vérifier que la liste charge rapidement
3. ✅ Vérifier la pagination
4. ✅ Vérifier les filtres
```

### Test de Sécurité
```
1. Se connecter en tant que client (non-admin)
2. Essayer d'accéder à /admin
3. ✅ Vérifier le message "Accès non autorisé"
4. ✅ Vérifier la redirection vers /dashboard
```

### Test Cross-Browser
```
1. Tester sur Chrome ✅
2. Tester sur Firefox ✅
3. Tester sur Safari ✅
4. Tester sur Edge ✅
```

---

## 📊 Rapport de Test

### Template de Rapport

```markdown
# Rapport de Test - Dashboard Admin

**Date :** [DATE]
**Testeur :** [NOM]
**Version :** 1.0

## Résultats

### Authentification
- [ ] Test 1.1 : Connexion Admin - ✅ PASS / ❌ FAIL
- [ ] Test 1.2 : Persistance Session - ✅ PASS / ❌ FAIL
- [ ] Test 1.3 : Déconnexion - ✅ PASS / ❌ FAIL

### Portfolio
- [ ] Test 2.1 : Créer Projet - ✅ PASS / ❌ FAIL
- [ ] Test 2.2 : Modifier Projet - ✅ PASS / ❌ FAIL
- [ ] Test 2.3 : Supprimer Projet - ✅ PASS / ❌ FAIL

### Blog
- [ ] Test 3.1 : Créer Article - ✅ PASS / ❌ FAIL
- [ ] Test 3.2 : Modifier Article - ✅ PASS / ❌ FAIL
- [ ] Test 3.3 : Aperçu Article - ✅ PASS / ❌ FAIL
- [ ] Test 3.4 : Supprimer Article - ✅ PASS / ❌ FAIL

### Services
- [ ] Test 4.1 : Créer Service - ✅ PASS / ❌ FAIL
- [ ] Test 4.2 : Modifier Service - ✅ PASS / ❌ FAIL
- [ ] Test 4.3 : Supprimer Service - ✅ PASS / ❌ FAIL

### Upload Images
- [ ] Test 5.1 : Upload Valide - ✅ PASS / ❌ FAIL
- [ ] Test 5.2 : Upload Invalide - ✅ PASS / ❌ FAIL

### Navigation UI
- [ ] Test 6.1 : Sidebar Desktop - ✅ PASS / ❌ FAIL
- [ ] Test 6.2 : Sidebar Mobile - ✅ PASS / ❌ FAIL
- [ ] Test 6.3 : Notifications - ✅ PASS / ❌ FAIL

### Gestion Erreurs
- [ ] Test 7.1 : Erreur Réseau - ✅ PASS / ❌ FAIL
- [ ] Test 7.2 : Validation Formulaire - ✅ PASS / ❌ FAIL
- [ ] Test 7.3 : Token Expiré - ✅ PASS / ❌ FAIL

## Bugs Trouvés

### Bug #1
**Titre :** [Description courte]
**Sévérité :** Critique / Majeur / Mineur
**Étapes pour reproduire :**
1. ...
2. ...
**Résultat attendu :** ...
**Résultat obtenu :** ...

## Recommandations

1. ...
2. ...
3. ...

## Conclusion

**Status Global :** ✅ PASS / ⚠️ PASS avec réserves / ❌ FAIL

**Commentaires :** ...
```

---

## 🛠️ Outils de Test

### Console du Navigateur
```javascript
// Vérifier l'authentification
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Vérifier les erreurs
// F12 > Console > Filtrer par "Error"

// Vérifier les requêtes réseau
// F12 > Network > Filtrer par "XHR"
```

### Postman (Test API Backend)
```
1. Importer la collection Postman
2. Configurer l'environnement :
   - API_URL : http://localhost:5000/api
   - TOKEN : [votre_token_jwt]
3. Tester chaque endpoint
```

### React DevTools
```
1. Installer React DevTools (extension Chrome/Firefox)
2. F12 > Components
3. Inspecter les props et state des composants
```

---

## 📝 Notes Importantes

### Avant de Commencer les Tests

1. **Backend doit être lancé**
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend doit être lancé**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Base de données doit être initialisée**
   ```bash
   psql -U postgres -d horizonstudio < backend/database/seed.sql
   ```

4. **Redis doit être lancé** (optionnel)
   ```bash
   redis-server
   ```

### Données de Test

Utilisez ces données pour les tests :

**Admin :**
- Email : admin@horizonstudio.com
- Password : Admin123!

**Client :**
- Email : client@example.com
- Password : Client123!

### Nettoyage Après Tests

```bash
# Supprimer les données de test
psql -U postgres -d horizonstudio
DELETE FROM portfolio WHERE title LIKE '%Test%';
DELETE FROM blog_posts WHERE title LIKE '%Test%';
DELETE FROM services WHERE name LIKE '%Test%';

# Ou réinitialiser complètement
\i backend/database/seed.sql
```

---

## ✅ Checklist Finale

Avant de considérer les tests terminés :

- [ ] Tous les tests de base sont PASS
- [ ] Aucun bug critique trouvé
- [ ] Les messages d'erreur sont clairs
- [ ] L'interface est responsive
- [ ] Les uploads fonctionnent
- [ ] La navigation est fluide
- [ ] Pas de déconnexion intempestive
- [ ] Les données sont bien sauvegardées
- [ ] Les suppressions fonctionnent
- [ ] Le rapport de test est complété

---

**Durée totale estimée :** 50-60 minutes

**Bonne chance ! 🚀**