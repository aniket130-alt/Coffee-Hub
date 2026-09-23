Write-Host "========================================================" -ForegroundColor DarkYellow
Write-Host "  Starting Coffee Shop Full-Stack Application" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor DarkYellow

Write-Host "`nStarting Golang Backend on http://localhost:8080 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\coffeeshop-backend.exe"

Start-Sleep -Seconds 2

Write-Host "Starting React + TypeScript Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`n[SUCCESS] Services launched!" -ForegroundColor Green
Write-Host "Customer Storefront : http://localhost:5173" -ForegroundColor Yellow
Write-Host "Master Admin Panel  : http://localhost:5173/admin (Login: admin / admin123)" -ForegroundColor Yellow
Write-Host "Golang REST API     : http://localhost:8080/api/settings" -ForegroundColor Yellow
