import React, { useState, useEffect, useRef } from 'react'
import '../styles/DMWindow.css'
import { socketService } from '../services/socket'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  edited_at?: string
  created_at: string
}

interface User {
  id: string
  username: string
  status: string
  avatar?: string
}

interface DMWindowProps {
  selectedUser: User | null
  currentUserId: string
  token: string
  isConnected: boolean
}

export default function DMWindow({
  selectedUser,
  currentUserId,
  token,
  isConnected,
}: DMWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedUser) {
      loadMessages()
      markAsRead()
    }
  }, [selectedUser, token])

  useEffect(() => {
    socketService.onDMNew((data: any) => {
      if (
        (data.senderId === selectedUser?.id && data.receiverId === currentUserId) ||
        (data.senderId === currentUserId && data.receiverId === selectedUser?.id)
      ) {
        setMessages((prev) => [...prev, data])
      }
    })

    socketService.onDMTyping((data: any) => {
      if (data.fromUserId === selectedUser?.id) {
        setIsTyping(true)
      }
    })

    socketService.onDMTypingStop((data: any) => {
      if (data.fromUserId === selectedUser?.id) {
        setIsTyping(false)
      }
    })

    return () => {
      socketService.off('dm:new')
      socketService.off('dm:typing')
      socketService.off('dm:typing:stop')
    }
  }, [selectedUser?.id, currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3001/api/dm/${selectedUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages.reverse())
      }
    } catch (error) {
      console.error('Chyba při načítání zpráv:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async () => {
    if (!selectedUser) return

    try {
      await fetch(`http://localhost:3001/api/dm/${selectedUser.id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error('Chyba při označení zpráv:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedUser || !isConnected) return

    const content = inputValue.trim()
    setInputValue('')

    try {
      const response = await fetch(
        `http://localhost:3001/api/dm/${selectedUser.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      )

      if (response.ok) {
        socketService.sendDM(selectedUser.id, content)
      }
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error)
      setInputValue(content) // Vrátit zpět
    }
  }

  const handleTyping = () => {
    if (!selectedUser || !isConnected) return

    socketService.sendDMTyping(selectedUser.id)

    if (typingTimeout) clearTimeout(typingTimeout)
    const timeout = setTimeout(() => {
      socketService.stopDMTyping(selectedUser.id)
    }, 3000)

    setTypingTimeout(timeout)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedUser) {
    return (
      <div className="dm-window empty">
        <p>Vyber přítele pro začátek konverzace</p>
      </div>
    )
  }

  return (
    <div className="dm-window">
      <div className="dm-header">
        <div className="user-header">
          <div className="avatar" style={{ backgroundColor: '#7289da' }}>
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{selectedUser.username}</h3>
            <p className="status">{selectedUser.status}</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Načítám zprávy...</div>
        ) : messages.length === 0 ? (
          <div className="empty-conversation">
            <p>Žádné zprávy zatím</p>
            <p className="secondary">Začni konverzaci se {selectedUser.username}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender_id === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-header">
                <span className="author">
                  {msg.sender_id === currentUserId ? 'Ty' : selectedUser.username}
                </span>
                <span className="timestamp">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {msg.edited_at && <span className="edited">(upraveno)</span>}
              </div>
              <p className="message-content">{msg.content}</p>
            </div>
          ))
        )}

        {isTyping && (
          <div className="typing-indicator">
            <p>{selectedUser.username} píše...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          className="message-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            handleTyping()
          }}
          onKeyPress={handleKeyPress}
          placeholder={`Zpráva pro ${selectedUser.username}...`}
          rows={3}
          disabled={!isConnected}
        />
        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={!isConnected || !inputValue.trim()}
        >
          Odeslat
        </button>
      </div>
    </div>
  )
}
