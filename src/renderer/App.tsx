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

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const savedUsername = localStorage.getItem('username')

    if (token && savedUsername) {
      setUsername(savedUsername)
      setAuthView(null)
      connectSocket(token, savedUsername)
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

  const handleLoginSuccess = (token: string, user: string) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', user)
    setUsername(user)
    setAuthView(null)
    connectSocket(token, user)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    setUsername('')
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
