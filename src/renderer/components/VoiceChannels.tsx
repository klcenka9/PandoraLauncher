import React, { useState, useEffect } from 'react'
import '../styles/VoiceChannels.css'
import { API_URL } from '../services/api'

interface VoiceChannel {
  id: string
  name: string
  description?: string
  user_limit: number
  created_at: string
}

interface VoiceChannelsProps {
  token: string
  onSelectChannel?: (channel: VoiceChannel) => void
}

export default function VoiceChannels({ token, onSelectChannel }: VoiceChannelsProps) {
  const [channels, setChannels] = useState<VoiceChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [newChannelName, setNewChannelName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadChannels()
  }, [token])

  const loadChannels = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/voice-channels`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setChannels(data.channels)
      }
    } catch (error) {
      console.error('Chyba při načítání voice channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return

    setCreating(true)
    try {
      const response = await fetch(`${API_URL}/api/voice-channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newChannelName.trim() }),
      })

      if (response.ok) {
        setNewChannelName('')
        setShowCreateForm(false)
        loadChannels()
      }
    } catch (error) {
      console.error('Chyba při vytváření channel:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="voice-channels">
      <div className="channels-header">
        <h3>Hlasové kanály</h3>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          title="Nový kanál"
        >
          +
        </button>
      </div>

      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreateChannel}>
          <input
            type="text"
            placeholder="Název kanálu..."
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            maxLength={32}
            disabled={creating}
          />
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={creating}>
              {creating ? 'Vytvářím...' : 'Vytvořit'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowCreateForm(false)}
            >
              Zrušit
            </button>
          </div>
        </form>
      )}

      <div className="channels-list">
        {loading ? (
          <p className="loading">Načítám kanály...</p>
        ) : channels.length === 0 ? (
          <p className="empty">Žádné hlasové kanály</p>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="channel-item"
              onClick={() => onSelectChannel?.(channel)}
            >
              <div className="channel-icon">🎤</div>
              <div className="channel-info">
                <h4>{channel.name}</h4>
                {channel.description && <p>{channel.description}</p>}
              </div>
              <button className="join-btn">Připojit</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
