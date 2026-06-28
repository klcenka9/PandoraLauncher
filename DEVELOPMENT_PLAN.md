# Pandora Launcher - Plán vývoje

## ✅ Hotové fáze
- [x] Základní struktura projektu (Electron + React)
- [x] Autentifikace (Login/Register, JWT tokeny)
- [x] Backend API (Express + Socket.io)
- [x] Friend systém (přidávání, žádosti, blokování)
- [x] WebRTC integrace (hlasové hovory, screen sharing)

## 🎯 Fáze 2 - Pokročilé funkce

### 1. Direct Messages (Přímé zprávy)
- [ ] Databáze pro DM
- [ ] API endpointy pro DM
- [ ] Socket.io eventy pro real-time DM
- [ ] DMList komponenta
- [ ] DMWindow komponenta
- [ ] Notifikace pro nové DM
- [ ] Read receipts (přečteno/nepřečteno)
- [ ] Online/offline stav v DM

### 2. Typing Indicators (Vidět kdo píše)
- [ ] Backend tracking
- [ ] Socket.io events
- [ ] UI indikátor v chatu
- [ ] Timeout (3 sekund bez psaní = skrytí)

### 3. Message Reactions (Emoji na zprávy)
- [ ] UI pro přidávání emoji
- [ ] Zobrazení reactions
- [ ] Backend persistence
- [ ] Real-time synchronizace

### 4. Message Management
- [ ] Editování zpráv
- [ ] Mazání zpráv
- [ ] Označení jako "edited"
- [ ] Message history/versioning
- [ ] Soft delete (hide message)

### 5. User Profiles
- [ ] Profilní stránka
- [ ] Avatar management
- [ ] Bio/Status message
- [ ] Custom status (online, away, do not disturb)
- [ ] User card (hover preview)
- [ ] Profil display name

### 6. Voice Channels
- [ ] Databáze Voice Channels
- [ ] Vytváření channels
- [ ] Join/Leave voice channel
- [ ] Multiple users ve voláním
- [ ] Voice channel list

### 7. Enhanced Notifications
- [ ] Unread message badges
- [ ] Sound notifications
- [ ] Desktop notifications
- [ ] Mention notifications (@username)
- [ ] Notification settings

### 8. Search & Filter
- [ ] Message search
- [ ] User search
- [ ] Channel search
- [ ] Search results
- [ ] Search history

### 9. Better UI/UX
- [ ] Lepší ikonky
- [ ] Animace transitions
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Modal dialogy
- [ ] Context menus
- [ ] Hovercards

### 10. Advanced Features
- [ ] Message pinning
- [ ] Thread system
- [ ] Message reactions history
- [ ] User activity log
- [ ] Rate limiting
- [ ] Message encryption (future)
- [ ] File upload (future)

## Priorita podle důležitosti
1. **KRITICKÉ** - DM, Typing indicators
2. **VYSOKÁ** - Reactions, Message edit/delete, User profiles
3. **STŘEDNÍ** - Voice channels, Notifications, Search
4. **NÍZKÁ** - Advanced features

## Timeline
- Week 1: DM + Typing indicators + Reactions
- Week 2: Message management + User profiles
- Week 3: Voice channels + Notifications
- Week 4: Search + UI improvements + Testing

## Database Schema Úpravy
Viz: backend/src/database.ts

## API Endpoints - Přehled
```
Auth:
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/me

Friends:
  POST /api/friends/request
  POST /api/friends/accept
  POST /api/friends/decline
  POST /api/friends/remove
  GET  /api/friends/list
  GET  /api/friends/pending
  POST /api/friends/block
  GET  /api/friends/blocked

Messages:
  GET  /api/messages/:channel
  POST /api/messages/:channel (new)
  PUT  /api/messages/:id (edit)
  DELETE /api/messages/:id
  GET  /api/messages/:id/reactions
  POST /api/messages/:id/reactions

DM:
  GET  /api/dm/:userId
  POST /api/dm/:userId (new message)
  GET  /api/dm/list
  DELETE /api/dm/:messageId

Users:
  GET  /api/users
  GET  /api/users/:id
  PUT  /api/users/profile
  GET  /api/users/:id/profile

Voice Channels:
  GET  /api/voice-channels
  POST /api/voice-channels (new)
  POST /api/voice-channels/:id/join
  POST /api/voice-channels/:id/leave
```

## Socket.io Events
```
Channel Messages:
  message:send
  message:new
  message:edit
  message:delete
  message:reaction:add
  message:reaction:remove

DM:
  dm:send
  dm:new
  dm:read
  dm:typing
  dm:typing:stop

User Presence:
  user:status:update
  user:online
  user:offline
  user:typing (channel)
  user:typing:stop (channel)

Friends:
  friend:request
  friend:accepted
  friend:removed

Voice:
  voice:channel:join
  voice:channel:leave
  voice:channel:users
  voice:call:start
  voice:call:end
```

## Best Practices
- ✅ TypeScript everywhere
- ✅ Error handling
- ✅ Input validation
- ✅ Rate limiting (backend)
- ✅ Security (SQL injection prevention)
- ✅ Real-time sync
- ✅ Offline support (future)
- ✅ Performance optimization
