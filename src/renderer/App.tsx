import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import CallWindow from './components/CallWindow'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { socketService } from './services/socket'

type View = 'chat' | 'call'
type AuthView = 'login' | 'register' | null

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [isConnected, setIsConnected] = useState(false)
  const [authView, setAuthView] = useState<AuthView>('login')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUsername = localStorage.getItem('username')
    const savedUserId = localStorage.getItem('userId')

    if (savedToken && savedUsername && savedUserId) {
      setUsername(savedUsername)
      setToken(savedToken)
      setUserId(savedUserId)
      setAuthView(null)
      connectSocket(savedToken, savedUsername)
    }
  }, [])

  const connectSocket = (token: string, user: string) => {
    const socket = socketService.connect(token)
    socketService.joinUser(user)

    socket?.on('connect', () => {
      setIsConnected(true)
    })

    socket?.on('disconnect', () => {
      setIsConnected(false)
    })
  }

  const handleLoginSuccess = (token: string, user: string, id: string) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', user)
    localStorage.setItem('userId', id)
    setUsername(user)
    setToken(token)
    setUserId(id)
    setAuthView(null)
    connectSocket(token, user)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    setUsername('')
    setToken('')
    setUserId('')
    setAuthView('login')
    socketService.disconnect()
  }

  if (authView) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterPage
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </>
    )
  }

  return (
    <div className="app-container">
      <Sidebar
        onSelectChannel={setSelectedChannel}
        onViewChange={setCurrentView}
        username={username}
        onLogout={handleLogout}
        token={token}
        userId={userId}
      />
      {currentView === 'chat' ? (
        <ChatWindow channelName={selectedChannel} isConnected={isConnected} />
      ) : (
        <CallWindow isConnected={isConnected} />
      )}
      {!isConnected && <div className="connection-status">Připojuji se...</div>}
    </div>
  )
}
