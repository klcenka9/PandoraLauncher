# 🚀 Pandora Launcher - Deployment Guide

## Quick Start - Backend Deployment

### Option 1: Railway.app (Nejjednodušší - 1 klik)

1. Jdi na https://railway.app
2. Přihlás se s GitHub
3. Klikni "New Project"
4. Vyber "Deploy from GitHub repo"
5. Vyber `klcenka9/pandoralauncher`
6. V environment variables vlož:
   ```
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://tvoj-frontend-url.com
   JWT_SECRET=zmeni-na-silne-heslo-v-produkcii
   ```
7. ✅ Backend běží! Railway ti dá URL

### Option 2: Render.com

1. Jdi na https://render.com
2. Klikni "New +" → "Web Service"
3. Vyber GitHub repo `klcenka9/pandoralauncher`
4. Nastavení:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Přidej stejné variables jako u Railway
5. Deploy!

### Option 3: Docker (Lokální nebo vlastní server)

```bash
# Build image
docker build -t pandora-backend .

# Spustit container
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e JWT_SECRET="tvoje-tajne-heslo" \
  pandora-backend
```

Nebo s docker-compose:
```bash
docker-compose up -d
```

---

## Frontend - Electron Aplikace

### Windows .exe (Build na Windows nebo macOS)

```bash
# 1. Klonuj repo
git clone https://github.com/klcenka9/pandoralauncher.git
cd pandoralauncher

# 2. Instaluj
npm install
cd backend && npm install && cd ..

# 3. Build pro Windows
npx electron-builder --win

# .exe soubor je v dist/
# - Portable: dist/Pandora Launcher-0.1.0.exe
# - Installer: dist/Pandora Launcher 0.1.0.nsis.exe
```

### Linux (.AppImage)

```bash
npm install
npx electron-builder --linux

# AppImage je v dist/
```

### Konfigurování backendu URL

Vlož backendovou URL do `src/renderer/services/socket.ts`:

```typescript
const SOCKET_URL = 'https://tvoj-backend-url.railway.app'
// nebo
const SOCKET_URL = 'http://localhost:3001'
```

---

## Production Deployment Checklist

- [ ] JWT_SECRET je změněno na silné heslo
- [ ] CORS_ORIGIN odpovídá frontend URL
- [ ] Database je zálohovaná
- [ ] HTTPS je povoleno
- [ ] Node_env je `production`
- [ ] Frontend je zkonfigurován na backend URL
- [ ] Testuj login a zprávy

---

## Troubleshooting

### "Cannot connect to backend"
- Zkontroluj CORS_ORIGIN v backend settings
- Zkontroluj že backend běží: `curl https://backend-url/api/health`
- V frontend app si nastav správnou backend URL

### "WebRTC calls nefungují"
- STUN servery potřebují HTTPS backend
- Zkontroluj firewall - port 3001 musí být otevřený

### Database se resetla
- Zkontroluj volume settings v docker-compose
- Ujisti se že `pandora.db` je v `.gitignore`

---

## Production URLs Příklady

Jakmile máš backend nasazený:

```
Backend: https://pandora-backend-XXXX.railway.app
Aplikace: stahuješ z Release na GitHub nebo buildíš lokálně
```

**Hotovo! 🎉**
