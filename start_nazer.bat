@echo off
title NAZER System Launcher
color 0B

echo.
echo  ███╗   ██╗ █████╗ ███████╗███████╗██████╗
echo  ████╗  ██║██╔══██╗╚══███╔╝██╔════╝██╔══██╗
echo  ██╔██╗ ██║███████║  ███╔╝ █████╗  ██████╔╝
echo  ██║╚██╗██║██╔══██║ ███╔╝  ██╔══╝  ██╔══██╗
echo  ██║ ╚████║██║  ██║███████╗███████╗██║  ██║
echo  ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
echo.
echo  Speed Monitoring System — Admin Panel
echo  ----------------------------------------
echo.

:: ── 1. Start Backend in a new window ──────────────────────────────────────
echo  [1/3] Starting Backend (port 8080)...
start "NAZER Backend" cmd /k "cd /d C:\Dan_WS\Nazer-Backend && call venv\Scripts\activate.bat && echo. && echo  NAZER Backend running at http://localhost:8080 && echo  API Docs:  http://localhost:8080/docs && echo. && uvicorn main:app --host 0.0.0.0 --port 8080 --reload"

:: ── 2. Start Vite dev server in a new window ──────────────────────────────
echo  [2/3] Starting Website (port 5173)...
start "NAZER Website" cmd /k "cd /d C:\Dan_WS\Nazer-Website && npm run dev"

:: ── 3. Wait for Vite to be ready, then open browser ──────────────────────
echo  [3/3] Waiting for Vite to be ready...
timeout /t 4 /nobreak >nul

:: Open browser
start "" "http://localhost:5173"

echo.
echo  ----------------------------------------
echo  Backend  →  http://localhost:8080
echo  Website  →  http://localhost:5173
echo  API Docs →  http://localhost:8080/docs
echo  ----------------------------------------
echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
pause
