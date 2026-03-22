import { useRef, useState, useCallback, useEffect } from 'react'
import useAppStore from '../store/useAppStore'

const JOYSTICK_SIZE = 120
const KNOB_SIZE = 50
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2

export default function VirtualJoystick() {
  const navMode = useAppStore((s) => s.navMode)
  const isExperienceFullscreen = useAppStore((s) => s.isExperienceFullscreen)
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(false)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const [lookActive, setLookActive] = useState(false)
  const baseRef = useRef(null)
  const lookStartRef = useRef({ x: 0, y: 0 })
  const touchIdRef = useRef(null)
  const lookTouchIdRef = useRef(null)

  const setElevationInput = useCallback((nextValue) => {
    if (window.__elevationInput !== undefined) {
      window.__elevationInput = nextValue
    }
  }, [])

  // Detect mobile/touch device
  useEffect(() => {
    const check = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Expose joystick input to global so FirstPersonController can read it
  useEffect(() => {
    window.__joystickInput = { x: 0, y: 0 }
    window.__lookInput = { x: 0, y: 0 }
    window.__elevationInput = 0
    return () => {
      delete window.__joystickInput
      delete window.__lookInput
      delete window.__elevationInput
    }
  }, [])

  useEffect(() => {
    if (window.__joystickInput) {
      const maxD = MAX_DISTANCE
      window.__joystickInput = {
        x: knobPos.x / maxD,
        y: -knobPos.y / maxD,  // Invert Y: up = forward
      }
    }
  }, [knobPos])

  const handleTouchStart = useCallback((e) => {
    if (touchIdRef.current !== null) return
    const touch = e.changedTouches[0]
    touchIdRef.current = touch.identifier
    setActive(true)
    setKnobPos({ x: 0, y: 0 })
  }, [])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    if (!baseRef.current) return

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier === touchIdRef.current) {
        const rect = baseRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        let dx = touch.clientX - centerX
        let dy = touch.clientY - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > MAX_DISTANCE) {
          dx = (dx / dist) * MAX_DISTANCE
          dy = (dy / dist) * MAX_DISTANCE
        }
        setKnobPos({ x: dx, y: dy })
      }
    }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null
        setActive(false)
        setKnobPos({ x: 0, y: 0 })
        if (window.__joystickInput) {
          window.__joystickInput = { x: 0, y: 0 }
        }
      }
    }
  }, [])

  // Look pad (right side)
  const handleLookStart = useCallback((e) => {
    const touch = e.changedTouches[0]
    lookTouchIdRef.current = touch.identifier
    lookStartRef.current = { x: touch.clientX, y: touch.clientY }
    setLookActive(true)
  }, [])

  const handleLookMove = useCallback((e) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (touch.identifier === lookTouchIdRef.current) {
        const dx = touch.clientX - lookStartRef.current.x
        const dy = touch.clientY - lookStartRef.current.y
        lookStartRef.current = { x: touch.clientX, y: touch.clientY }
        if (window.__lookInput) {
          window.__lookInput = { x: dx * 0.003, y: dy * 0.003 }
        }
      }
    }
  }, [])

  const handleLookEnd = useCallback((e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null
        setLookActive(false)
        if (window.__lookInput) {
          window.__lookInput = { x: 0, y: 0 }
        }
      }
    }
  }, [])

  const elevationButtonStyle = {
    width: '58px',
    height: '58px',
    borderRadius: '9999px',
    border: '2px solid rgba(255,255,255,0.15)',
    background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)',
    color: 'rgba(255,255,255,0.88)',
    fontSize: '18px',
    fontWeight: 700,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    touchAction: 'none',
  }

  if (!isMobile || !isExperienceFullscreen || navMode !== 'walk') return null

  return (
    <>
      <div
        className="fixed z-[60] pointer-events-auto"
        style={{
          left: '30px',
          bottom: '100px',
          width: JOYSTICK_SIZE + 'px',
          height: JOYSTICK_SIZE + 'px',
          touchAction: 'none',
        }}
      >
        <div
          ref={baseRef}
          className="w-full h-full rounded-full relative"
          style={{
            background: active
              ? 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0.05) 100%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: `2px solid ${active ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>W</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>S</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>A</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>D</div>

          <div
            className="absolute rounded-full"
            style={{
              width: KNOB_SIZE + 'px',
              height: KNOB_SIZE + 'px',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`,
              background: active
                ? 'radial-gradient(circle, rgba(0,212,255,0.6) 0%, rgba(0,212,255,0.3) 100%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
              border: `2px solid ${active ? 'rgba(0,212,255,0.7)' : 'rgba(255,255,255,0.2)'}`,
              boxShadow: active ? '0 0 20px rgba(0,212,255,0.3)' : 'none',
              transition: active ? 'none' : 'transform 0.15s ease-out',
            }}
          />
        </div>
        <div className="text-center mt-1 text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          MOVE
        </div>
      </div>

      <div
        className="fixed z-[60] pointer-events-auto"
        style={{
          right: '30px',
          bottom: '100px',
          width: JOYSTICK_SIZE + 'px',
          height: JOYSTICK_SIZE + 'px',
          touchAction: 'none',
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: lookActive
              ? 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0.05) 100%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: `2px solid ${lookActive ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onTouchStart={handleLookStart}
          onTouchMove={handleLookMove}
          onTouchEnd={handleLookEnd}
          onTouchCancel={handleLookEnd}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
               style={{ color: lookActive ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.15)' }}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 5v2M12 17v2M5 12h2M17 12h2"/>
            <path d="M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41"/>
          </svg>
        </div>
        <div className="text-center mt-1 text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          LOOK
        </div>
      </div>

      <div
        className="fixed z-[60] pointer-events-auto flex flex-col items-center gap-3"
        style={{
          right: '64px',
          bottom: '248px',
        }}
      >
        <button
          type="button"
          aria-label="위로 이동"
          style={elevationButtonStyle}
          onTouchStart={() => setElevationInput(1)}
          onTouchEnd={() => setElevationInput(0)}
          onTouchCancel={() => setElevationInput(0)}
          onMouseDown={() => setElevationInput(1)}
          onMouseUp={() => setElevationInput(0)}
          onMouseLeave={() => setElevationInput(0)}
        >
          Q
        </button>
        <button
          type="button"
          aria-label="아래로 이동"
          style={elevationButtonStyle}
          onTouchStart={() => setElevationInput(-1)}
          onTouchEnd={() => setElevationInput(0)}
          onTouchCancel={() => setElevationInput(0)}
          onMouseDown={() => setElevationInput(-1)}
          onMouseUp={() => setElevationInput(0)}
          onMouseLeave={() => setElevationInput(0)}
        >
          E
        </button>
        <div className="text-center text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          HEIGHT
        </div>
      </div>
    </>
  )
}
