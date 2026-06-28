import React, { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import CallWindow from './components/CallWindow'

type View = 'chat' | 'call'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chat')
  const [selectedChannel, setSelectedChannel] = useState('general')

  return (
    <div className="app-container">
      <Sidebar onSelectChannel={setSelectedChannel} onViewChange={setCurrentView} />
      {currentView === 'chat' ? (
        <ChatWindow channelName={selectedChannel} />
      ) : (
        <CallWindow />
      )}
    </div>
  )
}
