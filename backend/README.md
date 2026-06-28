# Pandora Launcher Backend

WebSocket server for real-time communication in Pandora Launcher.

## Features

- Real-time messaging via Socket.io
- WebRTC signaling for peer-to-peer calls
- User presence tracking
- Channel-based message storage
- ICE candidate relay for P2P connections
- Screen sharing coordination

## Architecture

### Socket.io Events

#### User Events
- `user:join` - User joins the server
- `user:joined` - Broadcast when user joins
- `user:left` - Broadcast when user disconnects
- `user:typing` - User is typing indicator

#### Message Events
- `message:send` - Send a message to a channel
- `message:new` - Broadcast new message to all users

#### Call Events
- `call:initiate` - Initiate a call with WebRTC offer
- `call:incoming` - Incoming call notification
- `call:answer` - Answer call with WebRTC answer
- `call:answered` - Call answered notification
- `call:reject` - Reject an incoming call
- `call:rejected` - Call rejection notification
- `call:end` - End the call
- `call:ended` - Call ended notification

#### ICE Candidate Events
- `ice:candidate` - Send ICE candidate to peer
- `ice:candidate` - Receive ICE candidate from peer

#### Screen Share Events
- `screen:share:start` - Start screen sharing
- `screen:share:started` - Screen sharing started
- `screen:share:stop` - Stop screen sharing
- `screen:share:stopped` - Screen sharing stopped

## API Endpoints

### GET /api/health
Check server health
```json
{
  "status": "Server is running"
}
```

### GET /api/channels
Get list of available channels
```json
["general", "random", "announcements", "support"]
```

### GET /api/messages/:channel
Get messages for a specific channel
```json
[
  {
    "id": "uuid",
    "author": "username",
    "content": "message content",
    "timestamp": "ISO-8601",
    "channel": "channel-name"
  }
]
```

## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file:

```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## STUN/TURN Servers

Current configuration uses Google's public STUN servers:
- stun:stun.l.google.com:19302
- stun:stun1.l.google.com:19302

For production, consider setting up your own TURN server for better performance and privacy.

## Deployment

The server is designed to be easily deployable on:
- Heroku
- AWS
- DigitalOcean
- Docker containers

## License

MIT
