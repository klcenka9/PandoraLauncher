import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import CallWindow from './components/CallWindow'
import { socketService } from './services/socket'

type View = 'chat' | 'call'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = socketService.connect()
    socketService.joinUser('User' + Math.floor(Math.random() * 10000))

    socket?.on('connect', () => {
      setIsConnected(true)
    })

    socket?.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socketService.disconnect()
    }
  }, [])

  return (
    <div className="app-container">
      <Sidebar onSelectChannel={setSelectedChannel} onViewChange={setCurrentView} />
      {currentView === 'chat' ? (
        <ChatWindow channelName={selectedChannel} isConnected={isConnected} />
      ) : (
        <CallWindow isConnected={isConnected} />
      )}
      {!isConnected && <div className="connection-status">Connecting...</div>}
    </div>
  )
}
