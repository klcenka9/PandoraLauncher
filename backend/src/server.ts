import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import { initializeDatabase } from './database'
import { registerUser, loginUser, verifyToken, setUserStatus, getUserById } from './auth'
import { authMiddleware, AuthenticatedRequest } from './middleware'

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
