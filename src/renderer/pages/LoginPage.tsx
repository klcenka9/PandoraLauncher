import React, { useState } from 'react'
import '../styles/AuthPage.css'
import { API_URL } from '../services/api'

interface LoginPageProps {
  onLoginSuccess: (token: string, username: string, userId: string) => void
  onSwitchToRegister: () => void
}

export default function LoginPage({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        onLoginSuccess(data.token, data.user.username, data.user.id)
      } else {
        setError(data.message || 'Chyba při přihlášení')
      }
    } catch (err) {
      setError('Chyba při připojení na server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Pandora Launcher</h1>
        <p className="subtitle">Přihlášení</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tvuj@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Heslo</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Přihlašuji se...' : 'Přihlásit se'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Nemáš účet?{' '}
            <button className="link-btn" onClick={onSwitchToRegister}>
              Zaregistruj se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
