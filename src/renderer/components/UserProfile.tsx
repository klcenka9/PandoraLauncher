import React, { useState, useEffect } from 'react'
import '../styles/UserProfile.css'
import { API_URL } from '../services/api'

interface User {
  id: string
  username: string
  email?: string
  status: string
  avatar?: string
  bio?: string
  created_at?: string
}

interface UserProfileProps {
  userId: string
  token: string
  isOwnProfile?: boolean
  onClose: () => void
}

const STATUS_OPTIONS = ['online', 'idle', 'do not disturb', 'offline']

export default function UserProfile({
  userId,
  token,
  isOwnProfile = false,
  onClose,
}: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ bio: '', status: 'online' })

  useEffect(() => {
    loadUserProfile()
  }, [userId, token])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setEditData({ bio: data.user.bio || '', status: data.user.status || 'online' })
      }
    } catch (error) {
      console.error('Chyba při načítání profilu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: editData.bio, status: editData.status }),
      })

      if (response.ok) {
        setIsEditing(false)
        loadUserProfile()
      }
    } catch (error) {
      console.error('Chyba při ukládání profilu:', error)
    }
  }

  if (loading) {
    return (
      <div className="user-profile-modal">
        <div className="profile-content">
          <p>Načítám...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-profile-modal">
        <div className="profile-content">
          <p>Uživatel nenalezen</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile-modal" onClick={onClose}>
      <div className="profile-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-body">
          <div className="avatar-large" style={{ backgroundColor: '#7289da' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>

          <h2>{user.username}</h2>
          <p className="status-badge">{user.status}</p>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  maxLength={100}
                  placeholder="O sobě..."
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  Uložit
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Zrušit
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-field">
                <label>Bio</label>
                <p>{user.bio || 'Žádné bio'}</p>
              </div>

              <div className="info-field">
                <label>E-mail</label>
                <p>{user.email}</p>
              </div>

              <div className="info-field">
                <label>Připojit se</label>
                <p>{new Date(user.created_at || '').toLocaleDateString('cs-CZ')}</p>
              </div>

              {isOwnProfile && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Upravit profil
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
