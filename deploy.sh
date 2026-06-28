#!/bin/bash

# Pandora Launcher Deployment Helper
# Jednoduché nasazení na Railway nebo Render

set -e

echo "🚀 Pandora Launcher - Deployment Helper"
echo "========================================"
echo ""
echo "Vyber platformu pro nasazení:"
echo "1) Railway.app (doporučeno)"
echo "2) Render.com"
echo "3) Docker (místní)"
echo "4) Vlastní server"
echo ""
read -p "Vyber (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚂 Railway.app Deployment"
    echo "=========================="
    echo ""
    echo "1. Jdi na https://railway.app"
    echo "2. Přihlás se s GitHub"
    echo "3. Klikni 'New Project'"
    echo "4. Vyber 'Deploy from GitHub repo'"
    echo "5. Vyber 'klcenka9/pandoralauncher'"
    echo "6. V Environments vlož:"
    echo "   - JWT_SECRET: (silné heslo)"
    echo "   - CORS_ORIGIN: https://tvoj-frontend.com"
    echo ""
    echo "✅ Hotovo! Railway si auto-buildne a nasadí"
    echo ""
    read -p "Otevřít railway.app v prohlížeči? (y/n): " open_browser
    if [ "$open_browser" = "y" ]; then
      xdg-open https://railway.app 2>/dev/null || open https://railway.app
    fi
    ;;

  2)
    echo ""
    echo "🎨 Render.com Deployment"
    echo "========================"
    echo ""
    echo "1. Jdi na https://render.com"
    echo "2. Přihlás se s GitHub"
    echo "3. Klikni 'New +' → 'Web Service'"
    echo "4. Vyber 'klcenka9/pandoralauncher'"
    echo "5. Nastav Environment:"
    echo "   - NODE_ENV: production"
    echo "   - JWT_SECRET: (silné heslo)"
    echo "   - CORS_ORIGIN: https://tvoj-frontend.com"
    echo ""
    echo "✅ Render si auto-buildne a nasadí"
    echo ""
    read -p "Otevřít render.com v prohlížeči? (y/n): " open_browser
    if [ "$open_browser" = "y" ]; then
      xdg-open https://render.com 2>/dev/null || open https://render.com
    fi
    ;;

  3)
    echo ""
    echo "🐳 Docker (Místní)"
    echo "==================="
    echo ""
    echo "Kontroluji Docker..."
    if ! command -v docker &> /dev/null; then
      echo "❌ Docker není nainstalován"
      echo "Instaluj z: https://docker.com"
      exit 1
    fi

    echo "✅ Docker found"
    echo ""
    echo "Spouštím docker-compose..."
    docker-compose up -d
    echo ""
    echo "✅ Backend běží na http://localhost:3001"
    echo ""
    echo "Logs:"
    docker-compose logs -f
    ;;

  4)
    echo ""
    echo "📦 Vlastní Server Deployment"
    echo "============================="
    echo ""
    echo "1. Klonuj repo:"
    echo "   git clone https://github.com/klcenka9/pandoralauncher.git"
    echo ""
    echo "2. Instaluj Node.js (v18+)"
    echo ""
    echo "3. Instaluj dependencies:"
    echo "   npm install"
    echo "   cd backend && npm install"
    echo ""
    echo "4. Vlož .env (v backend/):"
    echo "   PORT=3001"
    echo "   NODE_ENV=production"
    echo "   JWT_SECRET=velmi-tajne-heslo"
    echo "   CORS_ORIGIN=https://tvoj-frontend.com"
    echo ""
    echo "5. Build a start:"
    echo "   cd backend"
    echo "   npm run build"
    echo "   npm start"
    echo ""
    echo "6. Setup HTTPS proxy (nginx/Apache):"
    echo "   Backend by měl běžet na HTTPS"
    echo ""
    echo "📖 Více info v DEPLOYMENT.md"
    ;;

  *)
    echo "❌ Neplatná volba"
    exit 1
    ;;
esac

echo ""
echo "👍 Potřebuješ pomoc? Viz DEPLOYMENT.md"
