#!/bin/bash

# Script d'installation automatique pour Studio Web
# Bash Script pour Linux/Mac

echo "========================================"
echo "  Studio Web - Installation Automatique"
echo "========================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo -e "${YELLOW}Vérification de Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installé: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org${NC}"
    exit 1
fi

# Vérifier npm
echo -e "${YELLOW}Vérification de npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installé: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm n'est pas installé${NC}"
    exit 1
fi

# Vérifier PostgreSQL
echo -e "${YELLOW}Vérification de PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version)
    echo -e "${GREEN}✓ PostgreSQL installé: $PG_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL n'est pas détecté. Assurez-vous qu'il est installé${NC}"
fi

echo ""
echo "========================================"
echo "  Installation des dépendances"
echo "========================================"
echo ""

# Installation Backend
echo -e "${YELLOW}Installation des dépendances backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dépendances backend installées${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'installation des dépendances backend${NC}"
    exit 1
fi

# Installation Frontend
echo ""
echo -e "${YELLOW}Installation des dépendances frontend...${NC}"
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dépendances frontend installées${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'installation des dépendances frontend${NC}"
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "  Configuration"
echo "========================================"
echo ""

# Copier les fichiers .env.example
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Création du fichier backend/.env...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Fichier backend/.env créé${NC}"
    echo -e "${YELLOW}⚠ N'oubliez pas de configurer les variables d'environnement dans backend/.env${NC}"
else
    echo -e "${GREEN}✓ Le fichier backend/.env existe déjà${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Création du fichier frontend/.env.local...${NC}"
    cp frontend/.env.example frontend/.env.local
    echo -e "${GREEN}✓ Fichier frontend/.env.local créé${NC}"
    echo -e "${YELLOW}⚠ N'oubliez pas de configurer les variables d'environnement dans frontend/.env.local${NC}"
else
    echo -e "${GREEN}✓ Le fichier frontend/.env.local existe déjà${NC}"
fi

echo ""
echo "========================================"
echo "  Installation terminée !"
echo "========================================"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo -e "${NC}1. Configurer PostgreSQL:${NC}"
echo -e "   ${CYAN}- Créer la base de données: CREATE DATABASE studioweb;${NC}"
echo -e "   ${CYAN}- Exécuter le schéma: psql -U postgres -d studioweb -f backend/database/schema.sql${NC}"
echo -e "   ${CYAN}- Insérer les données de test: psql -U postgres -d studioweb -f backend/database/seed.sql${NC}"
echo ""
echo -e "${NC}2. Configurer les variables d'environnement:${NC}"
echo -e "   ${CYAN}- Éditer backend/.env avec vos credentials${NC}"
echo -e "   ${CYAN}- Éditer frontend/.env.local avec vos clés API${NC}"
echo ""
echo -e "${NC}3. Démarrer l'application:${NC}"
echo -e "   ${CYAN}- Backend: cd backend && npm run dev${NC}"
echo -e "   ${CYAN}- Frontend: cd frontend && npm run dev${NC}"
echo ""
echo -e "${NC}4. Accéder à l'application:${NC}"
echo -e "   ${CYAN}- Frontend: http://localhost:3000${NC}"
echo -e "   ${CYAN}- Backend API: http://localhost:5000${NC}"
echo ""
echo -e "${CYAN}Pour plus d'informations, consultez le README.md${NC}"
echo ""