@echo off
title LWSS Gumma Portal Server
echo ===================================================
echo Starting LWSS Gumma Portal at http://localhost:8080
echo ===================================================
cd /d "%~dp0"
node server.js
pause
