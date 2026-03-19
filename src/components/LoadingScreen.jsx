import { useEffect, useState } from 'react'
import useAppStore from '../store/useAppStore'

export default function LoadingScreen() {
  const { isLoading, loadingProgress } = useAppStore()
  const [fadeOut, setFadeOut] = useState(false)
  const [tips] = useState([
    'Use WASD keys to walk through the building',
    'Scroll to zoom in orbit mode',
    'Click hotspots to view specifications',
    'Toggle layers to show/hide systems',
    'Adjust time slider to simulate sunlight',
  ])
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [tips.length])

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true)
    }
  }, [isLoading])

  if (!isLoading && fadeOut) {
    return null
  }

  return (
    <div
      className="loading-screen"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1})`,
              animation: `pulse-glow ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="loading-logo mb-8">
        <div className="relative z-10 text-3xl font-bold" style={{ color: 'var(--accent)' }}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M25 5L45 15V35L25 45L5 35V15L25 5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M25 5V45M5 15L45 35M45 15L5 35" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <circle cx="25" cy="25" r="5" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
        4D Architectural Walkthrough
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        대승건설 3D 조감도
      </p>

      {/* Progress bar */}
      <div className="loading-progress-container mb-4">
        <div
          className="loading-progress-bar"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="text-xs font-mono mb-6" style={{ color: 'var(--text-secondary)' }}>
        Loading assets... {Math.round(loadingProgress)}%
      </p>

      {/* Tips */}
      <div className="text-xs px-6 text-center" style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
        <span className="opacity-50">TIP: </span>
        <span className="transition-opacity duration-500">{tips[currentTip]}</span>
      </div>
    </div>
  )
}
