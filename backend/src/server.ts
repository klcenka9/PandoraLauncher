import express from 'express'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'

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
  res.json({ status: 'Server is running' })
})

app.get('/api/channels', (req, res) => {
  res.json(channels)
})

app.get('/api/messages/:channel', (req, res) => {
  const { channel } = req.params
  const channelMessages = messages.get(channel) || []
  res.json(channelMessages)
})

// Socket.io events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // User joins
  socket.on('user:join', (userData) => {
    const userId = uuidv4()
    users.set(socket.id, {
      id: userId,
      username: userData.username,
      socketId: socket.id,
      status: 'online',
    })

    console.log(`${userData.username} joined`)

    // Notify all users about new user
    io.emit('user:joined', {
      users: Array.from(users.values()),
      message: `${userData.username} joined the server`,
    })
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
  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    if (user) {
      console.log(`${user.username} disconnected`)
      users.delete(socket.id)

      io.emit('user:left', {
        users: Array.from(users.values()),
        message: `${user.username} left the server`,
      })
    }
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
