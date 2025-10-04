# Script d'installation automatique pour Studio Web
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Studio Web - Installation Automatique" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Vérifier npm
Write-Host "Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installé: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier PostgreSQL
Write-Host "Vérification de PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL installé: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL n'est pas détecté. Assurez-vous qu'il est installé et dans le PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation des dépendances" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Installation Backend
Write-Host "Installation des dépendances backend..." -ForegroundColor Yellow
Set-Location "backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dépendances backend installées" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de l'installation des dépendances backend" -ForegroundColor Red
    exit 1
}

# Installation Frontend
Write-Host ""
Write-Host "Installation des dépendances frontend..." -ForegroundColor Yellow
Set-Location "../frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dépendances frontend installées" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de l'installation des dépendances frontend" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Copier les fichiers .env.example
if (-not (Test-Path "backend\.env")) {
    Write-Host "Création du fichier backend/.env..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✓ Fichier backend/.env créé" -ForegroundColor Green
    Write-Host "⚠ N'oubliez pas de configurer les variables d'environnement dans backend/.env" -ForegroundColor Yellow
} else {
    Write-Host "✓ Le fichier backend/.env existe déjà" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "Création du fichier frontend/.env.local..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env.local"
    Write-Host "✓ Fichier frontend/.env.local créé" -ForegroundColor Green
    Write-Host "⚠ N'oubliez pas de configurer les variables d'environnement dans frontend/.env.local" -ForegroundColor Yellow
} else {
    Write-Host "✓ Le fichier frontend/.env.local existe déjà" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation terminée !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configurer PostgreSQL:" -ForegroundColor White
Write-Host "   - Créer la base de données: CREATE DATABASE studioweb;" -ForegroundColor Gray
Write-Host "   - Exécuter le schéma: psql -U postgres -d studioweb -f backend/database/schema.sql" -ForegroundColor Gray
Write-Host "   - Insérer les données de test: psql -U postgres -d studioweb -f backend/database/seed.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configurer les variables d'environnement:" -ForegroundColor White
Write-Host "   - Éditer backend/.env avec vos credentials" -ForegroundColor Gray
Write-Host "   - Éditer frontend/.env.local avec vos clés API" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Démarrer l'application:" -ForegroundColor White
Write-Host "   - Backend: cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   - Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Accéder à l'application:" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Backend API: http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour plus d'informations, consultez le README.md" -ForegroundColor Cyan
Write-Host ""