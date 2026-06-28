import React, { useState, useRef, useEffect } from 'react'
import './CallWindow.css'

interface CallWindowProps {}

export default function CallWindow({}: CallWindowProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      })
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsCallActive(true)
      setCallDuration(0)
    } catch (err) {
      console.error('Error accessing media devices:', err)
      alert('Unable to access camera/microphone')
    }
  }

  const handleEndCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsCallActive(false)
    setCallDuration(0)
    setIsScreenSharing(false)
  }

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: { cursor: 'always' },
        })
        setIsScreenSharing(true)
      } else {
        setIsScreenSharing(false)
      }
    } catch (err) {
      console.error('Error sharing screen:', err)
    }
  }

  return (
    <div className="call-window">
      {!isCallActive ? (
        <div className="call-inactive">
          <div className="idle-container">
            <h1>Ready to call</h1>
            <p>Start a new call or wait for incoming calls</p>
            <button className="start-call-btn" onClick={handleStartCall}>
              📞 Start Call
            </button>
          </div>
        </div>
      ) : (
        <div className="call-active">
          <div className="videos-container">
            <div className="video-wrapper local">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="video-element"
              />
              <div className="video-label">You</div>
            </div>

            <div className="video-wrapper remote">
              <video
                ref={remoteVideoRef}
                autoPlay
                className="video-element"
              />
              <div className="video-label">Caller</div>
            </div>
          </div>

          <div className="call-info">
            <div className="call-duration">
              <span>Call Duration: {formatTime(callDuration)}</span>
            </div>

            <div className="call-controls">
              <button
                className={`control-btn ${isMuted ? 'muted' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                🎤
              </button>

              <button
                className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                onClick={handleScreenShare}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                🖥️
              </button>

              <button
                className="control-btn end-call"
                onClick={handleEndCall}
                title="End call"
              >
                ☎️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
