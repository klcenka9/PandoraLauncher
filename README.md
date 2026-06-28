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
src/
├── main/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # Preload script for IPC
└── renderer/
    ├── components/
    │   ├── Sidebar.tsx      # Left sidebar with channels
    │   ├── ChatWindow.tsx    # Chat interface
    │   └── CallWindow.tsx    # Voice call interface
    ├── App.tsx          # Main app component
    └── main.tsx         # React entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start both the React dev server and Electron in development mode.

### Build

```bash
npm run build
```

This will create a production build and package it with electron-builder.

## Features Explanation

### Chat Window
- View messages in channels
- Send new messages with Enter key (Shift+Enter for new line)
- Real-time message timestamps
- Support for multiple channels

### Call Window
- Start/end calls
- Mute/unmute microphone
- Share screen functionality
- Call duration timer
- Local and remote video displays

## Next Steps

1. **Backend Setup**: Create a Node.js + Express backend with WebSocket support
2. **Authentication**: Implement user registration and login
3. **WebRTC Integration**: Set up STUN/TURN servers for P2P connections
4. **Message Persistence**: Add database integration (MongoDB/PostgreSQL)
5. **Advanced Features**: Add file sharing, emoji reactions, message editing

## License

MIT
