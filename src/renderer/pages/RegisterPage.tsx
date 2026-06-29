import React, { useState } from 'react'
import '../styles/AuthPage.css'
import { API_URL } from '../services/api'

interface RegisterPageProps {
  onRegisterSuccess: (token: string, username: string, userId: string) => void
  onSwitchToLogin: () => void
}

export default function RegisterPage({
  onRegisterSuccess,
  onSwitchToLogin,
}: RegisterPageProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků')
      return
    }

    if (password !== confirmPassword) {
      setError('Hesla se neshodují')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onRegisterSuccess(data.token, data.user.username, data.user.id)
      } else {
        setError(data.message || 'Chyba při registraci')
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
        <p className="subtitle">Registrace</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Uživatelské jméno</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tvoje jméno"
              disabled={loading}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Potvrzení hesla</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registruji se...' : 'Zaregistrovat se'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Už máš účet?{' '}
            <button className="link-btn" onClick={onSwitchToLogin}>
              Přihláš se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
