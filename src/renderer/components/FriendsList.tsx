import React, { useState, useEffect } from 'react'
import '../styles/FriendsList.css'
import { API_URL } from '../services/api'

interface Friend {
  id: string
  username: string
  status: string
  avatar?: string
}

interface FriendsListProps {
  token: string
  onSelectFriend?: (friend: Friend) => void
}

export default function FriendsList({ token, onSelectFriend }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([])
  const [showRequests, setShowRequests] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFriends()
    const interval = setInterval(loadFriends, 5000) // Refresh každých 5 sekund
    return () => clearInterval(interval)
  }, [token])

  const loadFriends = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/friends/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/friends/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const friendsData = await friendsRes.json()
      const requestsData = await requestsRes.json()

      if (friendsData.success) setFriends(friendsData.friends)
      if (requestsData.success) setPendingRequests(requestsData.requests)
    } catch (error) {
      console.error('Chyba při načítání přátel:', error)
    }
  }

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      })

      if (response.ok) {
        loadFriends()
      }
    } catch (error) {
      console.error('Chyba při přijetí žádosti:', error)
    }
  }

  const handleDeclineRequest = async (requesterId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      })

      if (response.ok) {
        loadFriends()
      }
    } catch (error) {
      console.error('Chyba při odmítnutí žádosti:', error)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!window.confirm('Opravdu chceš odstranit tohoto přítele?')) return

    try {
      const response = await fetch(`${API_URL}/api/friends/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friendId }),
      })

      if (response.ok) {
        loadFriends()
      }
    } catch (error) {
      console.error('Chyba při odstraňování přítele:', error)
    }
  }

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
    <div className="friends-list">
      <div className="friends-header">
        <h3>Přátelé ({friends.length})</h3>
        {pendingRequests.length > 0 && (
          <button
            className="requests-btn"
            onClick={() => setShowRequests(!showRequests)}
          >
            📥 {pendingRequests.length}
          </button>
        )}
      </div>

      {showRequests && pendingRequests.length > 0 && (
        <div className="pending-requests">
          <h4>Čekající žádosti</h4>
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-item">
              <div className="request-info">
                <div className="avatar" style={{ backgroundColor: '#7289da' }}>
                  {request.username.charAt(0).toUpperCase()}
                </div>
                <span className="username">{request.username}</span>
              </div>
              <div className="request-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  ✓
                </button>
                <button
                  className="decline-btn"
                  onClick={() => handleDeclineRequest(request.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="friends-container">
        {friends.length === 0 ? (
          <p className="empty-message">Zatím nemáš žádné přátele</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="friend-item"
              onClick={() => onSelectFriend?.(friend)}
              style={{ cursor: onSelectFriend ? 'pointer' : 'default' }}
            >
              <div className="friend-info">
                <div className="avatar-wrapper">
                  <div className="avatar" style={{ backgroundColor: '#7289da' }}>
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(friend.status) }}
                  />
                </div>
                <div className="friend-details">
                  <p className="friend-name">{friend.username}</p>
                  <p className="friend-status">{friend.status}</p>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFriend(friend.id)
                }}
                title="Odstranit přítele"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
