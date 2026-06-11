@echo off
REM Démarre le frontend
cd /d "c:\Users\HP\Videos\Projet Application Web\universite-frontend"

echo ================================
echo Installation des dépendances...
echo ================================

REM Installe les dépendances
call npm install

echo.
echo ================================
echo Démarrage du Frontend...
echo ================================
echo Application sur: http://localhost:4200
echo.

REM Démarre l'app
call npm start
