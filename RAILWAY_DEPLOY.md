# 🚂 Railway.app Deployment - Kompletní Návod

Nejrychlejší způsob nasazení Pandora Launcher backendu.

---

## 📋 Předpoklady

- GitHub účet (máš)
- Railway.app účet (bezplatný)
- 5 minut času

---

## 🚀 Deployment v 5 krocích

### Krok 1: Jdi na Railway.app

Otevři: https://railway.app

### Krok 2: Přihlášení

```
1. Klikni "Login" v horním rohu
2. Vyber "GitHub"
3. Autorizuj aplikaci (GitHub OAuth)
4. ✅ Jsi přihlášen!
```

### Krok 3: Vytvor nový projekt

```
1. Na home page: Klikni "New Project"
2. Vyber "+ Add from GitHub repo"
3. V seznamu vyber: klcenka9/PandoraLauncher
   (Pokud tam není, auth Railway na GitHub)
```

### Krok 4: Konfigurace

Railway automaticky přečte `railway.json` a nastaví:
- **Build command:** detectuje Node.js
- **Start command:** `cd backend && npm start`
- **Port:** 3001

#### Environment Variables - DŮLEŽITÝ KROK!

V Railway dashboardu přidej tyto proměnné:

```
JWT_SECRET = super-tajne-heslo-zmeni-to-na-cokoli-dlouheho-32-znaku-plus
             Príklad: "P@ssw0rd!Secret#Key$2024$Pandora$Launcher$Secure"

CORS_ORIGIN = https://tvoje-frontend-domena.com
              Nebo: http://localhost:5173 (pro dev)

NODE_ENV = production

PORT = 3001 (už by mělo být nastaveno)
```

**⚠️ DŮLEŽITÉ:**
- `JWT_SECRET` musí být minimálně 32 znaků
- Použij silné heslo - libovolné znaky (abeceda + čísla + speciální znaky)
- `CORS_ORIGIN` musí odpovídat frontendové URL

### Krok 5: Deploy!

```
1. Přidej environment variables
2. Klikni "Deploy"
3. Railway si stáhne repo
4. Buildne frontend + backend
5. ✅ Backend běží!
```

---

## 🔗 Po Nasazení - Důležité!

Jakmile je nasazeno, Railway ti dá **URL** formátu:

```
https://pandora-launcher-prod-xxxx.railway.app
```

### Tuto URL musíš vlož do frontend aplikace!

**V souboru: `src/renderer/services/socket.ts`**

```typescript
// Změní z:
const SOCKET_URL = 'http://localhost:3001'

// Na:
const SOCKET_URL = 'https://pandora-launcher-prod-xxxx.railway.app'
```

Pak znovu build frontendu:
```bash
npm run build
```

---

## 📊 Railway Dashboard

Po nasazení si můžeš v Railway dashboard vidět:

- **Logs** - Live logs backendu
- **Metrics** - CPU, RAM, Network
- **Deployments** - Historie buildů
- **Environment** - Nastavení proměnných
- **Database** - SQLite databáze

### Kontrola že vše funguje:

V Railway → Logs by mělo vidět:
```
✅ Server running on port 3001
✅ Database initialized
✅ Socket.io listening
```

---

## 🔍 Troubleshooting

### Build fails s "npm not found"
→ Railway má Node.js, ale vyzkoušej:
```
1. Delete deployment
2. Create new project
3. Railway auto-detects Node.js
```

### Backend se připojí ale crashne
→ Zkontroluj Logs v Railway:
```
Railway → Project → Deployments → Latest → Logs
```

### Databáze není přístupná
→ Railway automaticky upraví path:
```
V railway.json je: /app/backend/pandora.db
Railway to mapuje do persistence volume
```

### CORS Error v frontend aplikaci
→ Zkontroluj `CORS_ORIGIN` variable v Railway Environment:
```
Má být: https://tvoje-frontend-url.com
NE: http://localhost:5173 (pokud frontend není lokální)
```

---

## 💡 Pro-Tips

### Automatické redeployy
```
Railway sleduje GitHub repo
Každý push na main/master automaticky deployuje!
```

Nakonfiguruj:
```
Railway → Project → Environment → Source
Vyber branch který chceš deployovat
```

### Monitoring
```
Railway má vestavěný monitoring
Email notifikace když se backend podívá
```

### Logs
```
Railway → Logs
Můžeš vidět live co se v backendu děje
Ideální pro debugging
```

### Database Backup
```
Railway automaticky zálohuje databázi
Můžeš si ji stáhnout ze Dashboard
```

---

## 📞 Backend je Live!

Jakmile vidiš v Railway logu:
```
✅ Server running on port 3001
✅ Connected to database
✅ Socket.io ready
```

**Backend je ready!** 🎉

Teď stačí:
1. Update frontend na backend URL
2. Build frontend
3. Spusť aplikaci
4. Chatuj! 💬

---

## 🎯 Finální Checklist

- [ ] Railway.app účet vytvořen
- [ ] GitHub repo připojen
- [ ] Projekt nasazen
- [ ] JWT_SECRET nastaven (silné heslo)
- [ ] CORS_ORIGIN nastaven správně
- [ ] Backend běží (vidíš to v Logs)
- [ ] Backend URL je: https://...
- [ ] Frontend konfigurován na novou URL
- [ ] Frontend zbuildován
- [ ] Testoval jsi login

---

## 🆘 Help

Pokud něco nefunguje:
1. Zkontroluj Railway Logs
2. Zkontroluj Environment variables
3. Zkontroluj CORS_ORIGIN
4. Restart deployment (Re-run button v Railway)

---

**Backend je nyní na internetu! 🚀**

Libovolný počítač se může připojit na:
`https://pandora-launcher-prod-xxxx.railway.app`
