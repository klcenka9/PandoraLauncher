import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import CallWindow from './components/CallWindow'
import DMWindow from './components/DMWindow'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ToastContainer from './components/ToastContainer'
import SearchBox from './components/SearchBox'
import Settings from './components/Settings'
import { socketService } from './services/socket'
import { notificationService } from './services/notifications'

type View = 'chat' | 'call' | 'dm'
type AuthView = 'login' | 'register' | null

interface User {
  id: string
  username: string
  status: string
  avatar?: string
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [selectedDMUser, setSelectedDMUser] = useState<User | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [authView, setAuthView] = useState<AuthView>('login')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Init notifications
    notificationService.requestNotificationPermission()

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
      <ToastContainer />

      <Sidebar
        onSelectChannel={setSelectedChannel}
        onViewChange={setCurrentView}
        username={username}
        onLogout={handleLogout}
        token={token}
        userId={userId}
        onSelectDMUser={(user) => {
          setSelectedDMUser(user)
          setCurrentView('dm')
        }}
        onSearch={() => setShowSearch(true)}
        onSettings={() => setShowSettings(true)}
      />

      {currentView === 'chat' ? (
        <ChatWindow channelName={selectedChannel} isConnected={isConnected} />
      ) : currentView === 'call' ? (
        <CallWindow isConnected={isConnected} />
      ) : (
        <DMWindow
          selectedUser={selectedDMUser}
          currentUserId={userId}
          token={token}
          isConnected={isConnected}
        />
      )}

      {showSearch && (
        <SearchBox token={token} onClose={() => setShowSearch(false)} />
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      {!isConnected && <div className="connection-status">Připojuji se...</div>}
    </div>
  )
}
