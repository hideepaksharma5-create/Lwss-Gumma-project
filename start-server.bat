@echo off
title LWSS Gumma Portal Server
echo ===================================================
echo Starting LWSS Gumma Portal Web Server...
echo ===================================================
cd /d "%~dp0"
node server.js
pause
