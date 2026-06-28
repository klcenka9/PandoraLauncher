# ⚡ Pandora Launcher - Quick Deployment Guide

Nejrychlejší způsob jak nasadit aplikaci na veřejnost.

---

## 🚀 Backend Deployment (2 minuty)

### Option 1: Railway.app (Nejjednodušší ✨)

```bash
# 1. Jdi na https://railway.app
# 2. GitHub Login
# 3. "New Project" → "Deploy from GitHub repo"
# 4. Vyber: klcenka9/pandoralauncher
# 5. Railway si přečte railway.json a automaticky nastaví

# Jakmile se nasadí:
# - Railway ti dá URL: https://pandora-xxxx.railway.app
# - Stačí vlož do frontend app
```

**Environmentální proměnné (Railway UI):**
```
JWT_SECRET = (vygeneruj silné heslo)
CORS_ORIGIN = https://tvoj-frontend-url.com
```

### Option 2: Render.com

```bash
# 1. https://render.com
# 2. GitHub Login
# 3. "New +" → "Web Service"
# 4. Vyber repo
# 5. Nastav:
#    Build: cd backend && npm install && npm run build
#    Start: cd backend && npm start
```

### Option 3: Docker (Vlastní server)

```bash
# Na tvém serveru:
git clone https://github.com/klcenka9/pandoralauncher.git
cd pandoralauncher

# Spusti backend
docker-compose up -d

# Backend běží na http://localhost:3001
```

---

## 💻 Frontend Deployment

### Windows .exe
Builds se vytváří automaticky v GitHub Actions na push.

**Stáhnout:**
1. Jdi na https://github.com/klcenka9/pandoralauncher/releases
2. Stáhni `Pandora-Launcher-0.1.0.exe`
3. Spusť instalátor

### Linux AppImage
```bash
# Stáhni z Releases nebo build lokálně:
npx electron-builder --linux

# Spusť
./dist/Pandora\ Launcher-0.1.0.AppImage
```

---

## 🔧 Konfigurace Frontend

Kam nasadíš backend, tam vlož URL do aplikace.

**V kódu (`src/renderer/services/socket.ts`):**
```typescript
const SOCKET_URL = 'https://tvuj-backend-url.com'
```

Pak znovu build:
```bash
npm run build
# Nebo pro dev:
npm run dev
```

---

## ✅ Deployment Checklist

- [ ] Backend nasazen na Railway/Render/vlastní server
- [ ] Backend URL je dostupný (curl/Postman test)
- [ ] CORS_ORIGIN je nastaven na frontend URL
- [ ] JWT_SECRET je změněn na silné heslo
- [ ] Frontend konfigurován na backend URL
- [ ] Frontend buildován a distribuován
- [ ] Testuj login a chat

---

## 🔐 Security Checklist

- [ ] JWT_SECRET je alespoň 32 znaků
- [ ] HTTPS je povoleno na backend
- [ ] CORS_ORIGIN je specifická URL (ne *)
- [ ] Database backups jsou nastaveny
- [ ] Produkční env je NODE_ENV=production

---

## 🆘 Troubleshooting

### Backend se nepřipojuje
```bash
# Zkontroluj backend je dostupný
curl https://tvoj-backend-url.com/api/health

# Zkontroluj logs (Railway):
# Railway Dashboard → projekt → Logs

# Zkontroluj Docker:
docker-compose logs -f
```

### CORS Error v aplikaci
```
Access to XMLHttpRequest blocked by CORS policy
```
→ Zkontroluj `CORS_ORIGIN` env variable na backend

### Voice calls nefungují
→ Backend MUSÍ být na HTTPS (ne http://)

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│      Desktop App (Electron)         │
│  Windows .exe | Linux AppImage      │
└──────────────┬──────────────────────┘
               │ WebSocket + REST API
               ↓
┌─────────────────────────────────────┐
│      Backend (Node.js + Express)    │
│  Railway | Render | Docker | Server │
├─────────────────────────────────────┤
│          SQLite Database            │
└─────────────────────────────────────┘
```

---

## 📚 Další Info

- `DEPLOYMENT.md` - Detailný guide
- `RELEASE_NOTES.md` - Co je nového
- `docker-compose.yml` - Lokální setup

---

**Hotovo! 🎉 Aplikace je live!**
