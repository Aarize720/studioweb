# Script PowerShell pour démarrer les serveurs Backend et Frontend
# Horizon Studio - Démarrage automatique

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HORIZON STUDIO - Démarrage Serveurs  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si PostgreSQL est en cours d'exécution
Write-Host "[1/4] Vérification de PostgreSQL..." -ForegroundColor Yellow
$pgStatus = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($pgStatus) {
    Write-Host "✓ PostgreSQL est actif (port 5432)" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL n'est pas actif!" -ForegroundColor Red
    Write-Host "  Veuillez démarrer PostgreSQL avant de continuer." -ForegroundColor Yellow
    exit 1
}

# Démarrer le Backend
Write-Host ""
Write-Host "[2/4] Démarrage du Backend (port 5000)..." -ForegroundColor Yellow
$backendPath = "c:\Users\Aaron\Desktop\studioweb\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host 'Backend Server - Horizon Studio' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 3

# Vérifier si le backend a démarré
$backendCheck = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($backendCheck) {
    Write-Host "✓ Backend démarré avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend en cours de démarrage..." -ForegroundColor Yellow
}

# Démarrer le Frontend
Write-Host ""
Write-Host "[3/4] Démarrage du Frontend (port 3000)..." -ForegroundColor Yellow
$frontendPath = "c:\Users\Aaron\Desktop\studioweb\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host 'Frontend Server - Horizon Studio' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 5

# Vérifier si le frontend a démarré
$frontendCheck = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($frontendCheck) {
    Write-Host "✓ Frontend démarré avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend en cours de démarrage..." -ForegroundColor Yellow
}

# Résumé
Write-Host ""
Write-Host "[4/4] Résumé des services:" -ForegroundColor Yellow
Write-Host "  • Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  • Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • Admin Panel:  http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Serveurs démarrés avec succès! ✓     " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir le navigateur..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Ouvrir le navigateur
Start-Process "http://localhost:3000"