# Pandora Launcher - Pokyny k Nastavení a Spuštění

Kompletní Discord-like aplikace vytvořená s Electron, React a WebRTC.

## 📋 Požadavky

- Node.js 16+ a npm
- SQLite3 (součást balíčku)
- Dva terminálové okna

## 🚀 Spuštění

### 1. Krok - Klonování a instalace

```bash
# Jsi už v PandoraLauncher adresáři
cd /home/user/PandoraLauncher

# Instalace frontend závislostí
npm install

# Instalace backend závislostí
cd backend
npm install
cd ..
```

### 2. Krok - Nastavení .env souborů

**Backend** - `backend/.env`:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=tvoje-super-tajna-hesla-zmenit-v-produkcii
```

**Frontend** - `.env`:
```env
VITE_SOCKET_URL=http://localhost:3001
```

### 3. Krok - Spuštění Backend serveru

**Terminal 1:**
```bash
cd backend
npm run dev
```

Očekávaný output:
```
✅ Databáze inicializována
🚀 Server běží na portu 3001
```

### 4. Krok - Spuštění Frontend aplikace

**Terminal 2** (v hlavním adresáři):
```bash
npm run dev
```

Očekávaný output:
```
VITE v5.0.7  ready in 234 ms
➜ Local: http://localhost:5173/
(Electron se otevře automaticky)
```

## 📱 Jak to používat

### Registrace a přihlášení
1. Klikni na "Zaregistruj se"
2. Vyplň: uživatelské jméno, e-mail, heslo
3. Po registraci se automaticky přihlásíš

### Chat v kanálech
1. V levém sidebaru klikni na kanál (# general, # random, atd.)
2. Napiš zprávu a stiskni Enter
3. Zprávy se aktualizují v reálném čase

### Přímé zprávy (DM)
1. Přejdi na záložku "👥 Přátelé"
2. Klikni na přítele
3. Přejde se na DM view
4. Chatuj jako v kanálech
5. Vidíš typing indicator když tvůj přítel píše

### Přidávání přátel
1. Přejdi na "🔍 Najít uživatele"
2. Hledej jméno
3. Klikni "+ Přidat"
4. Odesle se žádost
5. Přítel ji může přijmout v záložce "Čekající žádosti"

### Hlasové hovory
1. Přejdi na "📞 Volání" v navigaci
2. Klikni "Spustit hovor"
3. Dej povolení pro kameru/mikrofon
4. Můžeš sdílet obrazovku ("🖥️")

### Message Reactions
1. Najeď na zprávu
2. Klikni na "+"
3. Vyber emoji
4. Emoji se zobrazí pod zprávou
5. Ostatní vidí tvou reakci

### Profil uživatele
1. (Příští verze - klikni na username)
2. Edituj bio a status
3. Uložit změny

## 🛠️ Struktura projektu

```
PandoraLauncher/
├── src/
│   ├── main/           # Electron main process
│   └── renderer/       # React frontend
│       ├── components/ # React komponenty
│       ├── pages/      # Přihlášení/Registrace
│       ├── services/   # Socket.io a WebRTC
│       └── styles/     # CSS soubory
├── backend/
│   ├── src/
│   │   ├── server.ts   # Express + Socket.io
│   │   ├── auth.ts     # Autentifikace
│   │   ├── database.ts # SQLite
│   │   ├── services.ts # Business logic
│   │   ├── middleware.ts
│   │   └── webrtc.ts
│   └── pandora.db      # SQLite databáze
└── DEVELOPMENT_PLAN.md # Podrobný plán
```

## 🌟 Hlavní Features

✅ **Autentifikace**
- Registrace a přihlášení
- JWT tokeny
- Bezpečné hesla (bcryptjs)

✅ **Chat**
- Kanály (general, random, atd.)
- Real-time zprávy (Socket.io)
- Typing indicators
- Message editing/deleting

✅ **Přímé zprávy (DM)**
- One-to-one komunikace
- Real-time delivery
- Typing indicators
- Read status

✅ **Přátelé**
- Přidávání přátel
- Žádosti o přátelství
- Příjmout/odmítnout
- Blokování uživatelů
- Online status

✅ **Emocje a Reactions**
- 18 populárních emoji
- Přidej reagovat na zprávy
- Vidíš kolik lidí reagovalo

✅ **Hlasové hovory**
- WebRTC peer-to-peer
- Screen sharing
- Call duration timer
- Mute/unmute

✅ **User Profily**
- Bio a Status message
- Custom status (online, idle, do not disturb)
- Joined date
- Edit vlastní profil

✅ **Voice Channels**
- Vytváření channels
- Join/leave
- Channel descriptions

## 🐛 Troubleshooting

### "Connecting..." se nezavěší
1. Zkontroluj jestli běží backend na portu 3001
2. `curl http://localhost:3001/api/health` by mělo vrátit status

### "Cannot find module 'sqlite3'"
```bash
cd backend
npm install
```

### Databáze chyba
```bash
# Smaž starou databázi
rm backend/pandora.db

# Backend se ji zase vytvoří
npm run dev
```

### Port 3001 je v použití
```bash
# Změň PORT v backend/.env
PORT=3002

# A aktualizuj VITE_SOCKET_URL v .env
VITE_SOCKET_URL=http://localhost:3002
```

## 📚 Další Čtení

- `DEVELOPMENT_PLAN.md` - Podrobný plán vývoje
- `backend/README.md` - Backend dokumentace
- `README.md` - Úvodní informace

## 🚀 Production Build

```bash
# Frontend build
npm run build

# Backend build
cd backend
npm run build
npm start
```

## 💡 Tipy

1. **Multitasking**: Otevři 2 okna aplikace pro testování chat/DM
2. **Development**: Use browser dev tools: `Ctrl+Shift+I` v Electronu
3. **Live Reload**: Změny v React se automaticky hot-reload-ují

## 📝 Poznámky

- SQLite databáze se vytváří automaticky v `backend/pandora.db`
- Všechny zprávy jsou v paměti po restartu serveru (zatím)
- Voice callling je pouze UI - WebRTC peer connections jsou připraveny
- Screen sharing funguje pomocí WebRTC getDisplayMedia API

## 🎯 Příští Verze

- [ ] Persistence databáze (zprávy se uchovávají)
- [ ] File upload a sharing
- [ ] Message search
- [ ] Advanced voice features
- [ ] Mobile app (React Native)
- [ ] End-to-end encryption
- [ ] Custom avatars
- [ ] Emoji reactions history

---

**Užívej si Pandora Launcher!** 🚀🎉
