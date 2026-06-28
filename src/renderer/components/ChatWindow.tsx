import React, { useState, useRef, useEffect } from 'react'
import './ChatWindow.css'

interface Message {
  id: string
  author: string
  content: string
  timestamp: Date
}

interface ChatWindowProps {
  channelName: string
}

export default function ChatWindow({ channelName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'System',
      content: 'Welcome to #' + channelName,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'You',
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue('')
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
