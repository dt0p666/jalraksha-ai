# start-dev.ps1 - Launch both JALRAKSHAK AI servers on Windows
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Starting JALRAKSHAK AI Development Environment" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend server
Write-Host "Launching Backend (FastAPI on http://127.0.0.1:8000)..." -ForegroundColor Yellow
$backendCmd = "cd '$workspace\backend'; .\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -PassThru

# Start frontend server
Write-Host "Launching Frontend (Vite on http://localhost:5173)..." -ForegroundColor Yellow
$frontendCmd = "cd '$workspace\frontend'; npm run dev -- --host"
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -PassThru

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "JALRAKSHAK AI is running:" -ForegroundColor Green
Write-Host "  Backend API:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  API Health:    http://127.0.0.1:8000/api/health" -ForegroundColor White
Write-Host "  Interactive UI: http://localhost:5173" -ForegroundColor White
Write-Host "=====================================================" -ForegroundColor Green
