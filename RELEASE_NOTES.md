# 📦 Pandora Launcher v0.1.0 - Release Notes

**Release Date:** 28.6.2026

## 🎉 What's New

Kompletní Discord-like desktop aplikace s voice/video calls, screen sharing, friend system, a real-time messaging.

### ✨ Features v0.1.0

- ✅ User Authentication (JWT + bcryptjs)
- ✅ Real-time Chat v kanálech
- ✅ Direct Messages (DM)
- ✅ Voice/Video Calls (WebRTC)
- ✅ Screen Sharing 🖥️
- ✅ Friend System
- ✅ Message Reactions (18 emojis)
- ✅ User Profiles
- ✅ Search (messages + users)
- ✅ Notifications (desktop + audio)
- ✅ Settings (theme dark/light)
- ✅ SQLite Database
- ✅ Production-ready

---

## 📥 Installation

### Option 1: Linux (.AppImage)

```bash
# Stáhni z dist/
./Pandora\ Launcher-0.1.0.AppImage
```

### Option 2: Windows (.exe)

**Build na svém počítači:**

```bash
# Klonuj
git clone https://github.com/klcenka9/pandoralauncher.git
cd pandoralauncher

# Instaluj
npm install
cd backend && npm install && cd ..

# Build pro Windows
npx electron-builder --win

# .exe je v dist/
```

### Option 3: Docker (Lokální)

```bash
docker-compose up -d
# Aplikace běží na http://localhost:3001
```

---

## 🚀 Quick Start

1. **Instaluj aplikaci** (viz výše)
2. **Nasaď backend** (viz DEPLOYMENT.md)
3. **V app: Zaregistruj se** s emailem/heslem
4. **Přidej přátelé** a začni chatovat! 💬

---

## 🌐 Backend Deployment

**Nejrychlejší způsob (Railway):**

1. Jdi na https://railway.app
2. Connect GitHub repo
3. Deploy!

Viz detaily v `DEPLOYMENT.md`

---

## 🔧 System Requirements

- **OS:** Windows 10+, Linux, macOS
- **RAM:** 512 MB minimum
- **Disk:** 500 MB
- **Node.js:** v18+ (pro build)
- **Internet:** Pro voice/video calls

---

## 🐛 Known Issues

- [ ] Windows build requires local build (wine not on Linux)
- [ ] Voice calls need public backend URL (HTTPS)
- [ ] Screen sharing requires HTTPS

---

## 📝 Build Information

- **Frontend:** React 18 + TypeScript + Electron 27
- **Backend:** Express + Socket.io + SQLite
- **Build Tool:** Vite + Electron Builder
- **Package Size:** ~1.3GB (AppImage)

---

## 📚 Documentation

- `README.md` - Overview
- `SETUP_INSTRUCTIONS.md` - Setup guide
- `DEVELOPMENT_PLAN.md` - Feature roadmap
- `DEPLOYMENT.md` - Deployment guide
- `FINAL_SUMMARY.md` - Architecture & stats

---

## 🔗 Links

- **GitHub:** https://github.com/klcenka9/pandoralauncher
- **Issues:** Report bugs on GitHub

---

## 🙏 Contributing

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

**Happy Chatting! 🎊**
