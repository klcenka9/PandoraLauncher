import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3001'

class SocketService {
  private socket: Socket | null = null

  connect(token?: string) {
    if (this.socket) return this.socket

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        token: token || localStorage.getItem('authToken') || '',
      },
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  // User events
  joinUser(username: string) {
    this.socket?.emit('user:join', { username })
  }

  // Message events
  sendMessage(channel: string, content: string, username: string) {
    this.socket?.emit('message:send', { channel, content, username })
  }

  onMessageNew(callback: (message: any) => void) {
    this.socket?.on('message:new', callback)
  }

  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user:joined', callback)
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user:left', callback)
  }

  // Call events
  initiateCall(targetUserId: string, offer: any) {
    this.socket?.emit('call:initiate', { targetUserId, offer })
  }

  onCallIncoming(callback: (data: any) => void) {
    this.socket?.on('call:incoming', callback)
  }

  answerCall(callerId: string, answer: any) {
    this.socket?.emit('call:answer', { callerId, answer })
  }

  onCallAnswered(callback: (data: any) => void) {
    this.socket?.on('call:answered', callback)
  }

  rejectCall(callerId: string) {
    this.socket?.emit('call:reject', { callerId })
  }

  onCallRejected(callback: (data: any) => void) {
    this.socket?.on('call:rejected', callback)
  }

  endCall() {
    this.socket?.emit('call:end')
  }

  onCallEnded(callback: (data: any) => void) {
    this.socket?.on('call:ended', callback)
  }

  // ICE candidate events
  sendICECandidate(targetSocketId: string, candidate: any) {
    this.socket?.emit('ice:candidate', { targetSocketId, candidate })
  }

  onICECandidate(callback: (data: any) => void) {
    this.socket?.on('ice:candidate', callback)
  }

  // Screen share events
  startScreenShare(stream: any) {
    this.socket?.emit('screen:share:start', { stream })
  }

  stopScreenShare() {
    this.socket?.emit('screen:share:stop')
  }

  onScreenShareStarted(callback: (data: any) => void) {
    this.socket?.on('screen:share:started', callback)
  }

  onScreenShareStopped(callback: (data: any) => void) {
    this.socket?.on('screen:share:stopped', callback)
  }

  // Typing indicator
  sendTyping(channel: string, username: string, isTyping: boolean) {
    this.socket?.emit('user:typing', { channel, username, isTyping })
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user:typing', callback)
  }

  // Friend events
  sendFriendRequest(targetUserId: string) {
    this.socket?.emit('friend:request', { targetUserId })
  }

  onFriendRequest(callback: (data: any) => void) {
    this.socket?.on('friend:request:received', callback)
  }

  acceptFriend(requesterId: string) {
    this.socket?.emit('friend:accept', { requesterId })
  }

  onFriendAccepted(callback: (data: any) => void) {
    this.socket?.on('friend:accepted', callback)
  }

  removeFriend(friendId: string) {
    this.socket?.emit('friend:remove', { friendId })
  }

  onFriendRemoved(callback: (data: any) => void) {
    this.socket?.on('friend:removed', callback)
  }

  updateStatus(status: string) {
    this.socket?.emit('user:status:update', { status })
  }

  onStatusUpdate(callback: (data: any) => void) {
    this.socket?.on('user:status:changed', callback)
  }

  // Direct Message events
  sendDM(receiverId: string, content: string) {
    this.socket?.emit('dm:send', { receiverId, content })
  }

  onDMNew(callback: (data: any) => void) {
    this.socket?.on('dm:new', callback)
  }

  sendDMTyping(receiverId: string) {
    this.socket?.emit('dm:typing', { receiverId })
  }

  stopDMTyping(receiverId: string) {
    this.socket?.emit('dm:typing:stop', { receiverId })
  }

  onDMTyping(callback: (data: any) => void) {
    this.socket?.on('dm:typing', callback)
  }

  onDMTypingStop(callback: (data: any) => void) {
    this.socket?.on('dm:typing:stop', callback)
  }

  markDMAsRead(fromUserId: string) {
    this.socket?.emit('dm:read', { fromUserId })
  }

  onDMReadAck(callback: (data: any) => void) {
    this.socket?.on('dm:read:ack', callback)
  }

  // DM Voice Call events
  initiateDMCall(targetUserId: string) {
    this.socket?.emit('dm:call:initiate', { targetUserId })
  }

  onDMCallIncoming(callback: (data: any) => void) {
    this.socket?.on('dm:call:incoming', callback)
  }

  answerDMCall(callerId: string, answer: any) {
    this.socket?.emit('dm:call:answer', { callerId, answer })
  }

  onDMCallAnswered(callback: (data: any) => void) {
    this.socket?.on('dm:call:answered', callback)
  }

  endDMCall(targetUserId: string) {
    this.socket?.emit('dm:call:end', { targetUserId })
  }

  onDMCallEnded(callback: (data: any) => void) {
    this.socket?.on('dm:call:ended', callback)
  }

  rejectDMCall(callerId: string) {
    this.socket?.emit('dm:call:reject', { callerId })
  }

  onDMCallRejected(callback: (data: any) => void) {
    this.socket?.on('dm:call:rejected', callback)
  }

  // Screen share in DM
  startDMScreenShare(targetUserId: string, stream: any) {
    this.socket?.emit('dm:screen:share:start', { targetUserId, stream })
  }

  stopDMScreenShare(targetUserId: string) {
    this.socket?.emit('dm:screen:share:stop', { targetUserId })
  }

  onDMScreenShareStarted(callback: (data: any) => void) {
    this.socket?.on('dm:screen:share:started', callback)
  }

  onDMScreenShareStopped(callback: (data: any) => void) {
    this.socket?.on('dm:screen:share:stopped', callback)
  }

  sendDMICECandidate(targetUserId: string, candidate: any) {
    this.socket?.emit('dm:ice:candidate', { targetUserId, candidate })
  }

  onDMICECandidate(callback: (data: any) => void) {
    this.socket?.on('dm:ice:candidate', callback)
  }

  // Remove event listener
  off(event: string) {
    this.socket?.off(event)
  }
}

export const socketService = new SocketService()
