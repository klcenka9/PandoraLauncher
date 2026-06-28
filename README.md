# Pandora Launcher

A Discord-like desktop application built with Electron and React, featuring real-time messaging, voice calling, and screen sharing capabilities.

## Features

- 💬 **Text Messaging** - Real-time chat with support for multiple channels
- 📞 **Voice Calling** - Direct voice communication using WebRTC
- 🖥️ **Screen Sharing** - Share your screen during calls
- 👥 **User Management** - User profiles and status indicators
- 🎨 **Discord-like UI** - Familiar interface inspired by Discord

## Tech Stack

- **Frontend**: Electron + React + TypeScript
- **Build Tool**: Vite
- **Real-time Communication**: WebRTC + Socket.io
- **Styling**: CSS3

## Project Structure

```
.
├── src/
│   ├── main/
│   │   ├── main.ts                 # Electron main process
│   │   └── preload.ts              # Preload script for IPC
│   └── renderer/
│       ├── components/
│       │   ├── Sidebar.tsx         # Left sidebar with channels
│       │   ├── ChatWindow.tsx       # Chat interface
│       │   └── CallWindow.tsx       # Voice call interface
│       ├── services/
│       │   ├── socket.ts           # Socket.io client service
│       │   └── webrtc.ts           # WebRTC peer connection service
│       ├── App.tsx                 # Main app component
│       └── main.tsx                # React entry point
│
├── backend/
│   ├── src/
│   │   ├── server.ts               # Express + Socket.io server
│   │   └── webrtc.ts               # WebRTC utilities
│   └── package.json
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Two terminal windows (one for backend, one for frontend)

### Installation

Frontend:
```bash
npm install
```

Backend:
```bash
cd backend
npm install
```

### Development

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

**Terminal 2 - Start Frontend (in main directory):**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173` and Electron will launch

### Build

Frontend:
```bash
npm run build
```

Backend:
```bash
cd backend
npm run build
```

This will create production builds ready for deployment.

## Features Explanation

### Chat Window
- View messages in channels
- Send new messages with Enter key (Shift+Enter for new line)
- Real-time message timestamps via Socket.io
- Support for multiple channels
- User presence indicators

### Call Window
- Start/end calls with WebRTC
- Mute/unmute microphone
- Share screen functionality
- Call duration timer
- Local and remote video displays
- Automatic ICE candidate handling

### Backend Services
- **Socket.io Server** - Real-time bidirectional communication
- **WebRTC Signaling** - Coordinates P2P connections for calls and screen sharing
- **Message Storage** - In-memory channel message history
- **User Presence** - Tracks connected users and their status

## Next Steps

1. **Backend Setup**: Create a Node.js + Express backend with WebSocket support
2. **Authentication**: Implement user registration and login
3. **WebRTC Integration**: Set up STUN/TURN servers for P2P connections
4. **Message Persistence**: Add database integration (MongoDB/PostgreSQL)
5. **Advanced Features**: Add file sharing, emoji reactions, message editing

## License

MIT
