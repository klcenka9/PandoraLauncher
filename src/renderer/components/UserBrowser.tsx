import React, { useState, useEffect } from 'react'
import '../styles/UserBrowser.css'
import { API_URL } from '../services/api'

interface User {
  id: string
  username: string
  status: string
  avatar?: string
}

interface UserBrowserProps {
  token: string
  currentUserId: string
}

export default function UserBrowser({ token, currentUserId }: UserBrowserProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadUsers()
  }, [token])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const [usersRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/friends/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const usersData = await usersRes.json()
      const requestsData = await requestsRes.json()

      if (usersData.success) {
        const filtered = usersData.users.filter((u: User) => u.id !== currentUserId)
        setUsers(filtered)
      }

      if (requestsData.success) {
        setSentRequests(new Set(requestsData.requests.map((r: User) => r.id)))
      }
    } catch (error) {
      console.error('Chyba při načítání uživatelů:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFriendRequest = async (targetUserId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
      })

      if (response.ok) {
        setSentRequests((prev) => new Set([...prev, targetUserId]))
      }
    } catch (error) {
      console.error('Chyba při odesílání žádosti:', error)
    }
  }

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#43b581'
      case 'offline':
        return '#72767d'
      case 'idle':
        return '#faa61a'
      default:
        return '#72767d'
    }
  }

  return (
    <div className="user-browser">
      <div className="browser-header">
        <h3>Najít uživatele</h3>
        <input
          type="text"
          placeholder="Hledat uživatele..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-container">
        {loading ? (
          <p className="loading">Načítám...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="empty-message">Žádní uživatelé nenalezeni</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="avatar-wrapper">
                  <div className="avatar" style={{ backgroundColor: '#7289da' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  />
                </div>
                <div className="user-details">
                  <p className="user-name">{user.username}</p>
                  <p className="user-status">{user.status}</p>
                </div>
              </div>
              <button
                className={`add-btn ${sentRequests.has(user.id) ? 'sent' : ''}`}
                onClick={() => handleSendFriendRequest(user.id)}
                disabled={sentRequests.has(user.id)}
              >
                {sentRequests.has(user.id) ? '✓ Posláno' : '+ Přidat'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
