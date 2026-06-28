import React from 'react'
import './Sidebar.css'

interface SidebarProps {
  onSelectChannel: (channel: string) => void
  onViewChange: (view: 'chat' | 'call') => void
}

export default function Sidebar({ onSelectChannel, onViewChange }: SidebarProps) {
  const channels = ['general', 'random', 'announcements', 'support']

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Pandora</h1>
      </div>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => onViewChange('chat')} title="Messages">
          💬
        </button>
        <button className="nav-btn" onClick={() => onViewChange('call')} title="Call">
          📞
        </button>
      </div>

      <div className="channels">
        <h3>Channels</h3>
        {channels.map((channel) => (
          <div
            key={channel}
            className="channel-item"
            onClick={() => {
              onSelectChannel(channel)
              onViewChange('chat')
            }}
          >
            # {channel}
          </div>
        ))}
      </div>

      <div className="user-profile">
        <div className="user-avatar">U</div>
        <div className="user-info">
          <p className="username">User</p>
          <p className="status">Online</p>
        </div>
      </div>
    </div>
  )
}
