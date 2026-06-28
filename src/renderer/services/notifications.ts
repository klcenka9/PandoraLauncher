export class NotificationService {
  private audioContext: AudioContext | null = null
  private isDarkMode = true

  constructor() {
    this.initAudioContext()
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.log('AudioContext nije dostupan')
      }
    }
  }

  // Desktop Notification
  showDesktopNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return new Notification(title, {
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%237289da" width="100" height="100"/><text x="50" y="50" font-size="60" fill="white" text-anchor="middle" dominant-baseline="central">P</text></svg>',
          ...options,
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, options)
          }
        })
      }
    }
  }

  // Sound Notification
  playNotificationSound() {
    if (!this.audioContext) return

    const now = this.audioContext.currentTime
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.connect(gain)
    gain.connect(this.audioContext.destination)

    osc.frequency.setValueAtTime(800, now)
    osc.frequency.setValueAtTime(600, now + 0.1)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.setValueAtTime(0, now + 0.1)

    osc.start(now)
    osc.stop(now + 0.1)
  }

  // Request Permission
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      return Notification.requestPermission()
    }
    return Promise.resolve(Notification.permission)
  }

  // Theme
  setTheme(isDark: boolean) {
    this.isDarkMode = isDark
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  getCurrentTheme() {
    return this.isDarkMode ? 'dark' : 'light'
  }
}

export const notificationService = new NotificationService()
