# 🚀 DEPLOY NOW - 1 Click Deployment

## ⚡ Backend Deploy - Klikni tady!

### 🚂 Railway.app (FREE TIER)

**👉 [KLIKNI TADY - Deploy na Railway](https://railway.app/new?githubRepo=klcenka9/PandoraLauncher)**

---

## Po kliknutí na link:

1. **GitHub Login** (pokud nejsi přihlášen)
2. **Autorizuj Railway** pro přístup k repo
3. **Railway si automaticky přečte konfiguraci z `railway.json`**
4. **Přidej tyto 3 proměnné v Railway Enviroment:**

```
JWT_SECRET = super-tajne-heslo-zmeni-na-cokoliv-dlouheho
             (měl by mít minimálně 32 znaků, např: P@ssw0rd!Secret#Key$2024$Launcher)

CORS_ORIGIN = http://localhost:5173
              (později změníš na tvoji frontend URL)

NODE_ENV = production
```

5. **Klikni "Deploy"**
6. **Čekej ~3-5 minut**
7. ✅ **Backend běží!**

---

## Po úspěšném Nasazení

Railway ti dá **Backend URL** formátu:
```
https://pandora-launcher-prod-xxxx.railway.app
```

### Tuto URL musíš vlož do frontend aplikace!

Soubor: `src/renderer/services/socket.ts`

```typescript
// Změní z:
const SOCKET_URL = 'http://localhost:3001'

// Na:
const SOCKET_URL = 'https://pandora-launcher-prod-xxxx.railway.app'
```

Pak znovu build:
```bash
npm run build
```

---

## 📱 Postup na Mobilu

1. Klikni na link výše
2. GitHub Login
3. Autorizuj Railway
4. Přidej 3 environment variables
5. Deploy!

**Hotovo za 5 minut!** ✅

---

## 🔗 Všechny Linky

| Co | Odkaz |
|---|---|
| **DEPLOY BACKEND TEĎKA** | https://railway.app/new?githubRepo=klcenka9/PandoraLauncher |
| Repository | https://github.com/klcenka9/PandoraLauncher |
| Railway Docs | https://docs.railway.app |
| Detailný Guide | `RAILWAY_DEPLOY.md` |

---

## ❓ Když se něco neujetí

**Error v Railway:**
```
1. Railway Dashboard → Logs
2. Podívej se co je chyba
3. Zkontroluj environment variables
4. Restart deployment (Re-run button)
```

**CORS Error v aplikaci:**
```
→ Zkontroluj CORS_ORIGIN proměnnou
→ Měla by být tvoje frontend URL
```

**Database Error:**
```
→ Railway automaticky spravuje databázi
→ Zkontroluj v Logs co se děje
```

---

**Jsi připravený? Klikni na link a deployuj!** 🚀

Budu tady pokud budeš potřebovat pomoct! 💬
