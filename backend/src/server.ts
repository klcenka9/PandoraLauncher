import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import { initializeDatabase } from './database'
import { registerUser, loginUser, verifyToken, setUserStatus, getUserById } from './auth'
import { authMiddleware, AuthenticatedRequest } from './middleware'
import {
  getVoiceChannels,
  createVoiceChannel,
  getDMConversation,
  sendDirectMessage,
  getUnreadDMs,
  markDMAsRead,
  addReaction,
  removeReaction,
  getMessageReactions,
  getAllUsers,
  updateUserProfile,
  editMessage,
  deleteMessage,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendsList,
  getPendingRequests,
  getSentRequests,
  blockUser,
  unblockUser,
  getBlockedUsers,
  isUserBlocked,
} from './services'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

// Store connected users
const users = new Map<string, any>()
const messages = new Map<string, any[]>()
const channels = ['general', 'random', 'announcements', 'support']

// Initialize message storage for channels
channels.forEach((channel) => {
  messages.set(channel, [])
})

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server je spuštěn' })
})

// Autentifikační routy
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Všechna pole jsou povinná',
    })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Hesla se neshodují',
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Heslo musí mít alespoň 6 znaků',
    })
  }

  const result = await registerUser(username, email, password)
  res.status(result.success ? 201 : 400).json(result)
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'E-mail a heslo jsou povinné',
    })
  }

  const result = await loginUser(email, password)
  res.status(result.success ? 200 : 401).json(result)
})

app.get('/api/auth/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  })
})

// ===== Friend Routes =====
app.post('/api/friends/request', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { targetUserId } = req.body
  const result = await sendFriendRequest(req.userId!, targetUserId)
  res.status(result.success ? 200 : 400).json(result)
})

app.post('/api/friends/accept', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { requesterId } = req.body
  const result = await acceptFriendRequest(req.userId!, requesterId)
  res.status(result.success ? 200 : 400).json(result)
})

app.post('/api/friends/decline', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { requesterId } = req.body
  const result = await declineFriendRequest(req.userId!, requesterId)
  res.status(result.success ? 200 : 400).json(result)
})

app.post('/api/friends/remove', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { friendId } = req.body
  const result = await removeFriend(req.userId!, friendId)
  res.status(result.success ? 200 : 400).json(result)
})

app.get('/api/friends/list', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const friends = await getFriendsList(req.userId!)
  res.json({ success: true, friends })
})

app.get('/api/friends/pending', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const requests = await getPendingRequests(req.userId!)
  res.json({ success: true, requests })
})

app.get('/api/friends/sent', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const requests = await getSentRequests(req.userId!)
  res.json({ success: true, requests })
})

app.post('/api/friends/block', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { blockUserId } = req.body
  const result = await blockUser(req.userId!, blockUserId)
  res.status(result.success ? 200 : 400).json(result)
})

app.post('/api/friends/unblock', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { blockedUserId } = req.body
  const result = await unblockUser(req.userId!, blockedUserId)
  res.status(result.success ? 200 : 400).json(result)
})

app.get('/api/friends/blocked', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const blocked = await getBlockedUsers(req.userId!)
  res.json({ success: true, blocked })
})

// ===== Users Routes =====
app.get('/api/users', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const users = await getAllUsers()
  res.json({ success: true, users })
})

app.put('/api/users/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { username, avatar, bio } = req.body
  await updateUserProfile(req.userId!, { username, avatar, bio })
  res.json({ success: true, message: 'Profil aktualizován' })
})

app.get('/api/channels', (req, res) => {
  res.json(channels)
})

app.get('/api/messages/:channel', (req, res) => {
  const { channel } = req.params
  const channelMessages = messages.get(channel) || []
  res.json(channelMessages)
})

// Socket.io middleware pro autentifikaci
io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('Chybí autentifikační token'))
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return next(new Error('Neplatný token'))
  }

  socket.data.userId = decoded.userId
  next()
})

// Socket.io events
io.on('connection', (socket) => {
  console.log(`Uživatel připojen: ${socket.id}`)

  // User joins
  socket.on('user:join', async (userData) => {
    const userId = socket.data.userId
    const dbUser = await getUserById(userId)

    if (dbUser) {
      await setUserStatus(userId, 'online')
      users.set(socket.id, {
        id: userId,
        username: dbUser.username,
        socketId: socket.id,
        status: 'online',
      })

      console.log(`${dbUser.username} se připojil`)

      // Oznamení všem uživatelům
      io.emit('user:joined', {
        users: Array.from(users.values()),
        message: `${dbUser.username} se připojil na server`,
      })
    }
  })

  // Handle chat messages
  socket.on('message:send', (data) => {
    const { channel, content, username } = data
    const message = {
      id: uuidv4(),
      author: username,
      content,
      timestamp: new Date(),
      channel,
    }

    const channelMessages = messages.get(channel) || []
    channelMessages.push(message)
    messages.set(channel, channelMessages)

    // Broadcast message to all users
    io.emit('message:new', message)
  })

  // Handle call initiation
  socket.on('call:initiate', (data) => {
    const { targetUserId, offer } = data
    const user = users.get(socket.id)

    io.emit('call:incoming', {
      from: user,
      offer,
      callerId: socket.id,
    })
  })

  // Handle call answer
  socket.on('call:answer', (data) => {
    const { callerId, answer } = data
    io.to(callerId).emit('call:answered', {
      answer,
      answererId: socket.id,
    })
  })

  // Handle ICE candidates
  socket.on('ice:candidate', (data) => {
    const { targetSocketId, candidate } = data
    io.to(targetSocketId).emit('ice:candidate', {
      candidate,
      from: socket.id,
    })
  })

  // Handle call rejection
  socket.on('call:reject', (data) => {
    const { callerId } = data
    io.to(callerId).emit('call:rejected', {
      rejecterId: socket.id,
    })
  })

  // Handle call end
  socket.on('call:end', () => {
    io.emit('call:ended', {
      userId: socket.id,
    })
  })

  // Handle screen share
  socket.on('screen:share:start', (data) => {
    const user = users.get(socket.id)
    io.emit('screen:share:started', {
      user,
      stream: data.stream,
    })
  })

  socket.on('screen:share:stop', () => {
    io.emit('screen:share:stopped', {
      userId: socket.id,
    })
  })

  // User typing indicator
  socket.on('user:typing', (data) => {
    const { channel, username, isTyping } = data
    socket.broadcast.emit('user:typing', {
      channel,
      username,
      isTyping,
    })
  })

  // Friend system events
  socket.on('friend:request', (data) => {
    const { targetUserId } = data
    io.emit('friend:request:received', {
      fromUserId: socket.data.userId,
      toUserId: targetUserId,
    })
  })

  socket.on('friend:accept', (data) => {
    const { requesterId } = data
    io.emit('friend:accepted', {
      userId: socket.data.userId,
      friendId: requesterId,
    })
  })

  socket.on('friend:remove', (data) => {
    const { friendId } = data
    io.emit('friend:removed', {
      userId: socket.data.userId,
      removedFriendId: friendId,
    })
  })

  socket.on('user:status:update', async (data) => {
    const { status } = data
    await setUserStatus(socket.data.userId, status)
    io.emit('user:status:changed', {
      userId: socket.data.userId,
      status,
    })
  })

  // User disconnection
  socket.on('disconnect', async () => {
    const user = users.get(socket.id)
    if (user) {
      await setUserStatus(user.id, 'offline')
      console.log(`${user.username} se odpojil`)
      users.delete(socket.id)

      io.emit('user:left', {
        users: Array.from(users.values()),
        message: `${user.username} opustil server`,
      })
    }
  })
})

// Spuštění serveru
async function startServer() {
  try {
    await initializeDatabase()
    server.listen(PORT, () => {
      console.log(`🚀 Server běží na portu ${PORT}`)
    })
  } catch (error) {
    console.error('Chyba při spuštění serveru:', error)
    process.exit(1)
  }
}

startServer()
