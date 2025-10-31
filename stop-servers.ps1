# Script PowerShell pour arrêter les serveurs Backend et Frontend
# Horizon Studio - Arrêt automatique

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   HORIZON STUDIO - Arrêt Serveurs     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Trouver et arrêter tous les processus Node.js
Write-Host "Recherche des processus Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Processus Node.js trouvés: $($nodeProcesses.Count)" -ForegroundColor Yellow
    
    foreach ($process in $nodeProcesses) {
        try {
            Write-Host "  • Arrêt du processus $($process.Id)..." -ForegroundColor Yellow
            Stop-Process -Id $process.Id -Force
            Write-Host "    ✓ Processus $($process.Id) arrêté" -ForegroundColor Green
        } catch {
            Write-Host "    ✗ Erreur lors de l'arrêt du processus $($process.Id)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Tous les serveurs ont été arrêtés ✓  " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "Aucun processus Node.js en cours d'exécution." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")