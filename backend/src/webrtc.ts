// WebRTC configuration and utilities

export const TURN_SERVERS = [
  {
    urls: 'stun:stun.l.google.com:19302',
  },
  {
    urls: 'stun:stun1.l.google.com:19302',
  },
]

export const ICE_SERVERS = {
  iceServers: TURN_SERVERS,
}

export interface RTCSignal {
  type: 'offer' | 'answer'
  sdp: string
}

export interface ICECandidate {
  candidate: string
  sdpMLineIndex: number
  sdpMid: string
}

export const validateOffer = (offer: RTCSignal): boolean => {
  return !!(offer && offer.type === 'offer' && offer.sdp !== undefined)
}

export const validateAnswer = (answer: RTCSignal): boolean => {
  return !!(answer && answer.type === 'answer' && answer.sdp !== undefined)
}

export const validateCandidate = (candidate: ICECandidate): boolean => {
  return !!(
    candidate &&
    candidate.candidate &&
    candidate.sdpMLineIndex !== undefined &&
    candidate.sdpMid !== undefined
  )
}
