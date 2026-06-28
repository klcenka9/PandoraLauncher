import React, { useState } from 'react'
import './Sidebar.css'
import FriendsList from './FriendsList'
import UserBrowser from './UserBrowser'

interface SidebarProps {
  onSelectChannel: (channel: string) => void
  onViewChange: (view: 'chat' | 'call') => void
  username: string
  onLogout: () => void
  token: string
  userId: string
}

type SidebarView = 'channels' | 'friends' | 'users'

export default function Sidebar({
  onSelectChannel,
  onViewChange,
  username,
  onLogout,
  token,
  userId,
}: SidebarProps) {
  const [sidebarView, setSidebarView] = useState<SidebarView>('channels')
  const channels = ['general', 'random', 'announcements', 'support']

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Pandora</h1>
      </div>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => onViewChange('chat')} title="Zprávy">
          💬
        </button>
        <button className="nav-btn" onClick={() => onViewChange('call')} title="Volání">
          📞
        </button>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`tab-btn ${sidebarView === 'channels' ? 'active' : ''}`}
          onClick={() => setSidebarView('channels')}
          title="Kanály"
        >
          #
        </button>
        <button
          className={`tab-btn ${sidebarView === 'friends' ? 'active' : ''}`}
          onClick={() => setSidebarView('friends')}
          title="Přátelé"
        >
          👥
        </button>
        <button
          className={`tab-btn ${sidebarView === 'users' ? 'active' : ''}`}
          onClick={() => setSidebarView('users')}
          title="Najít uživatele"
        >
          🔍
        </button>
      </div>

      {sidebarView === 'channels' && (
        <div className="channels">
          <h3>Kanály</h3>
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
      )}

      {sidebarView === 'friends' && <FriendsList token={token} />}

      {sidebarView === 'users' && <UserBrowser token={token} currentUserId={userId} />}

      <div className="user-profile">
        <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="username">{username}</p>
          <p className="status">Online</p>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Odhlásit se">
          🚪
        </button>
      </div>
    </div>
  )
}
