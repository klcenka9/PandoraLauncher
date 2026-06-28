import React, { useState, useRef, useEffect } from 'react'
import './ChatWindow.css'
import { socketService } from '../services/socket'

interface Message {
  id: string
  author: string
  content: string
  timestamp: Date
  channel: string
}

interface ChatWindowProps {
  channelName: string
  isConnected: boolean
}

export default function ChatWindow({ channelName, isConnected }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'System',
      content: 'Welcome to #' + channelName,
      timestamp: new Date(),
      channel: channelName,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [username, setUsername] = useState('You')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUsername('User' + Math.floor(Math.random() * 10000))
  }, [])

  useEffect(() => {
    socketService.onMessageNew((message: Message) => {
      if (message.channel === channelName) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socketService.off('message:new')
    }
  }, [channelName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() && isConnected) {
      socketService.sendMessage(channelName, inputValue, username)
      setInputValue('')
    } else if (!isConnected) {
      alert('Not connected to server')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2># {channelName}</h2>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="message-header">
              <span className="author">{msg.author}</span>
              <span className="timestamp">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          className="message-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message #${channelName}`}
          rows={3}
        />
        <button className="send-btn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}
