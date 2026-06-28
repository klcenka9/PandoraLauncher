import React, { useState, useEffect } from 'react'
import '../styles/Settings.css'
import { notificationService } from '../services/notifications'

interface SettingsProps {
  onClose: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false'
  })
  const [desktopNotifications, setDesktopNotifications] = useState(() => {
    return localStorage.getItem('desktopNotifications') !== 'false'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    notificationService.setTheme(theme === 'dark')
  }, [theme])

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString())
  }, [soundEnabled])

  useEffect(() => {
    localStorage.setItem('desktopNotifications', desktopNotifications.toString())
  }, [desktopNotifications])

  const handleRequestNotificationPermission = async () => {
    const permission = await notificationService.requestNotificationPermission()
    if (permission === 'granted') {
      setDesktopNotifications(true)
    }
  }

  const testSound = () => {
    notificationService.playNotificationSound()
  }

  const testNotification = () => {
    notificationService.showDesktopNotification('Pandora Launcher', {
      body: 'Toto je testovací notifikace!',
      tag: 'test-notification',
    })
  }

  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Nastavení</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* Appearance Settings */}
          <div className="settings-section">
            <h3>🎨 Vzhled</h3>
            <div className="setting-item">
              <label>Motiv</label>
              <div className="theme-buttons">
                <button
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  🌙 Tmavý
                </button>
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  ☀️ Světlý
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <h3>🔔 Notifikace</h3>

            <div className="setting-item">
              <div className="setting-label">
                <label>Desktop notifikace</label>
                <input
                  type="checkbox"
                  checked={desktopNotifications}
                  onChange={(e) => setDesktopNotifications(e.target.checked)}
                />
              </div>
              <p className="setting-description">
                Přijímej desktop notifikace pro nové zprávy
              </p>
              {desktopNotifications && (
                <button className="action-btn" onClick={testNotification}>
                  🧪 Test notifikace
                </button>
              )}
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>Zvuky</label>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
              </div>
              <p className="setting-description">Přehrávej zvuky pro nové zprávy</p>
              {soundEnabled && (
                <button className="action-btn" onClick={testSound}>
                  🔊 Test zvuku
                </button>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="settings-section">
            <h3>🔐 Oprávnění</h3>

            <div className="setting-item">
              <p className="setting-description">
                Chcete-li dostávat desktop notifikace, musíte aplikaci udělit oprávnění.
              </p>
              <button className="action-btn primary" onClick={handleRequestNotificationPermission}>
                🔔 Požádat o oprávnění
              </button>
            </div>
          </div>

          {/* About */}
          <div className="settings-section">
            <h3>ℹ️ O aplikaci</h3>
            <div className="setting-item">
              <p className="setting-description">
                <strong>Pandora Launcher</strong> v0.1.0
              </p>
              <p className="setting-description">
                Discord-like aplikace vytvořená s Electron, React a WebRTC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
