import { useState, useCallback } from 'react'
import useAppStore from '../store/useAppStore'

// Icons as simple SVG components
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
)

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const PaletteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r="2"/>
    <circle cx="17.5" cy="10.5" r="2"/>
    <circle cx="8.5" cy="7.5" r="2"/>
    <circle cx="6.5" cy="12" r="2"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)

const ExplodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const WalkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="2"/>
    <path d="M10 22V18L7 15V10L10 8H14L17 10V15L14 18V22"/>
  </svg>
)

const OrbitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/>
  </svg>
)

// Time formatter
function formatTime(hour) {
  const h = Math.floor(hour)
  const m = Math.floor((hour - h) * 60)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`
}

// Sky gradient based on time
function getSkyGradient(hour) {
  if (hour < 5 || hour > 20) return 'linear-gradient(180deg, #0a0e27, #1a1f3a)'
  if (hour < 7) return 'linear-gradient(180deg, #1a1040, #ff6b35, #ffb347)'
  if (hour < 10) return 'linear-gradient(180deg, #3a7bd5, #87ceeb)'
  if (hour < 16) return 'linear-gradient(180deg, #2196f3, #87ceeb)'
  if (hour < 18) return 'linear-gradient(180deg, #87ceeb, #ffb347, #ff6b35)'
  return 'linear-gradient(180deg, #1a1040, #2d1b69, #ff4500)'
}

function TimeAndScaleSliders() {
  const { timeOfDay, setTimeOfDay, modelScale, setModelScale } = useAppStore()
  const isNight = timeOfDay < 6 || timeOfDay > 18

  return (
    <div className="hud-panel glass rounded-xl p-3" id="time-slider">
      {/* --- Scale Slider --- */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Model Scale</span>
        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>
          {modelScale.toFixed(2)}x
        </span>
      </div>
      <input
        type="range"
        min="0.1"
        max="15"
        step="0.1"
        value={modelScale}
        onChange={(e) => setModelScale(parseFloat(e.target.value))}
        className="w-full mb-4"
      />

      {/* --- Time Slider --- */}
      <div className="flex items-center justify-between mb-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--accent)' }}>{isNight ? <MoonIcon /> : <SunIcon />}</span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>4D Time</span>
        </div>
        <span className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>
          {formatTime(timeOfDay)}
        </span>
      </div>

      {/* Sky preview */}
      <div
        className="rounded-md mb-2 h-2"
        style={{ background: getSkyGradient(timeOfDay) }}
      />

      <input
        type="range"
        min="0"
        max="24"
        step="0.25"
        value={timeOfDay}
        onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        className="w-full"
      />

      {/* Time labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>12AM</span>
        <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>6AM</span>
        <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>12PM</span>
        <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>6PM</span>
        <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>12AM</span>
      </div>
    </div>
  )
}

// ========== FLOOR SELECTOR ==========
function FloorSelector() {
  const { activeFloor, setActiveFloor, isExploded, toggleExplode } = useAppStore()

  const floors = [
    { id: 0, label: 'ALL', sublabel: '전체' },
    { id: 2, label: '2F', sublabel: '2층' },
    { id: 1, label: '1F', sublabel: '1층' },
    { id: -1, label: 'B1', sublabel: '지하' },
  ]

  return (
    <div className="hud-panel glass rounded-xl p-3" id="floor-selector">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Floor</span>
        <button
          className={`hud-btn flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${
            isExploded ? 'active' : ''
          }`}
          style={{ borderColor: 'var(--glass-border)' }}
          onClick={toggleExplode}
        >
          <ExplodeIcon />
          <span className="hidden sm:inline">Explode</span>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {floors.map((floor) => (
          <button
            key={floor.id}
            className={`floor-tab text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeFloor === floor.id ? 'active' : ''
            }`}
            style={{
              background: activeFloor === floor.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
              color: activeFloor === floor.id ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onClick={() => setActiveFloor(floor.id)}
          >
            <span className="font-semibold">{floor.label}</span>
            <span className="ml-2 opacity-60">{floor.sublabel}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ========== LAYER TOGGLE ==========
function LayerToggle() {
  const { layers, toggleLayer, showLayerPanel, toggleLayerPanel } = useAppStore()

  const layerConfig = [
    { key: 'structure', label: 'Structure', sublabel: '구조', color: '#a0aec0' },
    { key: 'interior', label: 'Interior', sublabel: '인테리어', color: '#e8e4dc' },
    { key: 'furniture', label: 'Furniture', sublabel: '가구', color: '#8B6914' },
    { key: 'hvac', label: 'HVAC', sublabel: '냉난방', color: '#63b3ed' },
    { key: 'mep', label: 'MEP', sublabel: '배관', color: '#48bb78' },
  ]

  return (
    <div className="hud-panel glass rounded-xl p-3" id="layer-toggle">
      <button
        className="flex items-center gap-2 w-full mb-2"
        onClick={toggleLayerPanel}
      >
        <span style={{ color: 'var(--accent)' }}><LayersIcon /></span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Layers</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {showLayerPanel ? '▲' : '▼'}
        </span>
      </button>

      {showLayerPanel && (
        <div className="flex flex-col gap-1 animate-fadeIn">
          {layerConfig.map((layer) => (
            <button
              key={layer.key}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              onClick={() => toggleLayer(layer.key)}
            >
              <div
                className="w-3 h-3 rounded-sm flex items-center justify-center transition-all"
                style={{
                  background: layers[layer.key] ? layer.color : 'transparent',
                  border: `1.5px solid ${layers[layer.key] ? layer.color : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {layers[layer.key] && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: layers[layer.key] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {layer.label}
              </span>
              <span className="ml-auto opacity-50 text-[10px]">{layer.sublabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ========== NAV MODE TOGGLE ==========
function NavModeToggle() {
  const { navMode, setNavMode } = useAppStore()

  return (
    <div className="hud-panel glass rounded-xl p-3" id="nav-toggle">
      <span className="text-xs font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>Navigation</span>
      <div className="flex gap-1">
        <button
          className={`hud-btn flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs border ${
            navMode === 'orbit' ? 'active' : ''
          }`}
          style={{ borderColor: 'var(--glass-border)' }}
          onClick={() => setNavMode('orbit')}
        >
          <OrbitIcon />
          <span>Orbit</span>
        </button>
        <button
          className={`hud-btn flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs border ${
            navMode === 'firstperson' ? 'active' : ''
          }`}
          style={{ borderColor: 'var(--glass-border)' }}
          onClick={() => setNavMode('firstperson')}
        >
          <WalkIcon />
          <span>Walk</span>
        </button>
      </div>
    </div>
  )
}

// ========== MINIMAP ==========
function Minimap() {
  const cameraPosition = useAppStore((s) => s.cameraPosition)
  const cameraRotation = useAppStore((s) => s.cameraRotation)
  const activeFloor = useAppStore((s) => s.activeFloor)

  // Map camera world position to minimap coordinates
  const mapX = ((cameraPosition[0] + 15) / 30) * 100
  const mapY = ((cameraPosition[2] + 10) / 20) * 100

  const floorLabel = activeFloor === 0 ? 'ALL' : activeFloor === -1 ? 'B1' : `${activeFloor}F`

  return (
    <div className="hud-panel glass rounded-xl p-2" id="minimap" style={{ width: '140px' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>Minimap</span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--accent)' }}>{floorLabel}</span>
      </div>
      <div
        className="minimap-container relative"
        style={{
          width: '124px',
          height: '82px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {/* Building outline */}
        <div
          className="absolute border"
          style={{
            left: '10%',
            top: '10%',
            width: '80%',
            height: '80%',
            borderColor: 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
          }}
        />
        {/* Interior walls */}
        <div className="absolute" style={{ left: '50%', top: '10%', width: '1px', height: '55%', background: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute" style={{ left: '25%', top: '20%', width: '1px', height: '60%', background: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute" style={{ left: '75%', top: '20%', width: '1px', height: '60%', background: 'rgba(255,255,255,0.1)' }} />

        {/* Camera position dot */}
        <div
          className="minimap-dot"
          style={{
            left: `${Math.min(95, Math.max(5, mapX))}%`,
            top: `${Math.min(95, Math.max(5, mapY))}%`,
          }}
        />

        {/* Direction indicator */}
        <div
          className="absolute"
          style={{
            left: `${Math.min(95, Math.max(5, mapX))}%`,
            top: `${Math.min(95, Math.max(5, mapY))}%`,
            width: '12px',
            height: '2px',
            background: 'var(--accent)',
            transformOrigin: '0 50%',
            transform: `rotate(${-cameraRotation * (180 / Math.PI) + 90}deg)`,
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  )
}

// ========== MATERIAL CONFIGURATOR ==========
function MaterialConfigurator() {
  const { materialConfig, setMaterial, showConfigurator, toggleConfigurator } = useAppStore()

  const areas = [
    {
      key: 'lobbyFloor',
      label: 'Lobby Floor',
      sublabel: '로비 바닥',
      options: [
        { id: 'marble-white', label: 'White Marble', color: '#f0ece4' },
        { id: 'marble-black', label: 'Black Marble', color: '#2d2d2d' },
        { id: 'marble-beige', label: 'Beige Marble', color: '#d4c5a9' },
        { id: 'wood-oak', label: 'Oak Wood', color: '#b8860b' },
        { id: 'wood-walnut', label: 'Walnut', color: '#5c3317' },
      ],
    },
    {
      key: 'officeWalls',
      label: 'Office Walls',
      sublabel: '사무실 벽면',
      options: [
        { id: 'paint-warm-gray', label: 'Warm Gray', color: '#d6d0c4' },
        { id: 'paint-cool-blue', label: 'Cool Blue', color: '#c5d5e4' },
        { id: 'paint-sage-green', label: 'Sage Green', color: '#c5d4c0' },
      ],
    },
    {
      key: 'hallwayFloor',
      label: 'Hallway Floor',
      sublabel: '복도 바닥',
      options: [
        { id: 'tile-dark', label: 'Dark Tile', color: '#4a4a4a' },
        { id: 'tile-light', label: 'Light Tile', color: '#e0ddd5' },
        { id: 'tile-terracotta', label: 'Terracotta', color: '#c8735b' },
      ],
    },
  ]

  return (
    <div className="hud-panel glass rounded-xl p-3" id="configurator">
      <button
        className="flex items-center gap-2 w-full"
        onClick={toggleConfigurator}
      >
        <span style={{ color: 'var(--accent)' }}><PaletteIcon /></span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Design Configurator
        </span>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {showConfigurator ? '▲' : '▼'}
        </span>
      </button>

      {showConfigurator && (
        <div className="mt-3 space-y-3 animate-fadeIn">
          {areas.map((area) => (
            <div key={area.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {area.label}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  {area.sublabel}
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {area.options.map((opt) => (
                  <button
                    key={opt.id}
                    className="group relative"
                    onClick={() => setMaterial(area.key, opt.id)}
                    title={opt.label}
                  >
                    <div
                      className="w-7 h-7 rounded-md transition-all"
                      style={{
                        background: opt.color,
                        border: materialConfig[area.key] === opt.id
                          ? '2px solid var(--accent)'
                          : '2px solid transparent',
                        boxShadow: materialConfig[area.key] === opt.id
                          ? '0 0 8px rgba(0, 212, 255, 0.4)'
                          : 'none',
                        transform: materialConfig[area.key] === opt.id ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                         style={{ color: 'var(--text-secondary)' }}>
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ========== HOTSPOT POPUP ==========
function HotspotPopup() {
  const { selectedHotspot, clearSelectedHotspot } = useAppStore()

  if (!selectedHotspot) return null

  return (
    <div className="popup-overlay" onClick={clearSelectedHotspot}>
      <div className="popup-content glass rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-2xl mr-2">{selectedHotspot.icon}</span>
            <h2 className="text-lg font-semibold inline" style={{ color: 'var(--text-primary)' }}>
              {selectedHotspot.title}
            </h2>
          </div>
          <button
            className="text-lg px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={clearSelectedHotspot}
          >
            ✕
          </button>
        </div>

        {/* Floor badge */}
        <div className="mb-4">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                style={{ background: 'rgba(0, 212, 255, 0.15)', color: 'var(--accent)' }}>
            {selectedHotspot.floor}
          </span>
        </div>

        {/* Specs */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1"
                  style={{ color: 'var(--accent)' }}>
              Material
            </span>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {selectedHotspot.specs.material}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1"
                  style={{ color: 'var(--accent)' }}>
              Dimensions
            </span>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {selectedHotspot.specs.dimensions}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1"
                  style={{ color: 'var(--accent)' }}>
              Details
            </span>
            <div className="text-sm space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
              {selectedHotspot.specs.details.split('\n').map((line, i) => (
                <p key={i} className="flex items-start gap-1.5">
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 2D overlay placeholder */}
        <div className="mt-4 p-3 rounded-lg text-center text-xs"
             style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--glass-border)', color: 'var(--text-secondary)' }}>
          📐 2D DWG Overlay Available
        </div>
      </div>
    </div>
  )
}

// ========== FPS COUNTER ==========
function FPSCounter() {
  const fps = useAppStore((s) => s.fps)
  return (
    <div className="text-[10px] font-mono px-2 py-1 rounded-md"
         style={{
           background: 'rgba(0,0,0,0.4)',
           color: fps > 50 ? 'var(--success)' : fps > 30 ? 'var(--warning)' : 'var(--danger)',
         }}>
      {fps} FPS
    </div>
  )
}

// ========== HELP OVERLAY ==========
function HelpOverlay() {
  const { showHelp, toggleHelp } = useAppStore()

  if (!showHelp) return null

  return (
    <div className="popup-overlay" onClick={toggleHelp} style={{ zIndex: 150 }}>
      <div className="popup-content glass rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Controls & Help
          </h2>
          <button className="text-lg px-2 py-1 rounded-lg hover:bg-white/10"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={toggleHelp}>✕</button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Orbit Mode</h3>
            <div className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>🖱️ Left Click + Drag: Rotate view</p>
              <p>🖱️ Right Click + Drag: Pan view</p>
              <p>🖱️ Scroll: Zoom in/out</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Walk Mode</h3>
            <div className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>⌨️ W/A/S/D: Move forward/left/back/right</p>
              <p>🖱️ Mouse: Look around</p>
              <p>⎋ Esc: Exit pointer lock</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Interaction</h3>
            <div className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>🔵 Click glowing markers for specifications</p>
              <p>🎨 Use Design Configurator to swap materials</p>
              <p>⏱️ Drag time slider to simulate sun movement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== MAIN HUD ==========
export default function HUD() {
  const navMode = useAppStore((s) => s.navMode)
  const toggleHelp = useAppStore((s) => s.toggleHelp)

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 pointer-events-none">
          {/* Logo / Title */}
          <div className="hud-panel glass rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}>
              <svg width="18" height="18" viewBox="0 0 50 50" fill="none">
                <path d="M25 5L45 15V35L25 45L5 35V15L25 5Z" stroke="white" strokeWidth="3" fill="none"/>
                <circle cx="25" cy="25" r="4" fill="white"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                4D WALKTHROUGH
              </h1>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                대승건설 · 3D Visualization
              </p>
            </div>
          </div>

          {/* Top right: Minimap + FPS */}
          <div className="flex flex-col items-end gap-2">
            <Minimap />
            <div className="flex items-center gap-2">
              <FPSCounter />
              <button
                className="hud-btn text-xs px-2 py-1 rounded-md border"
                style={{ borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }}
                onClick={toggleHelp}
              >
                ?
              </button>
            </div>
          </div>
        </div>

        {/* Left sidebar */}
        <div className="absolute left-3 top-20 flex flex-col gap-2 w-48">
          <FloorSelector />
          <NavModeToggle />
          <LayerToggle />
          <MaterialConfigurator />
        </div>

        {/* Bottom center: Time and Scale sliders */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 max-w-[calc(100%-2rem)]">
          <TimeAndScaleSliders />
        </div>

        {/* Walk mode crosshair */}
        {navMode === 'firstperson' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="absolute w-px h-4" style={{ background: 'rgba(0, 212, 255, 0.6)' }} />
              <div className="absolute w-4 h-px" style={{ background: 'rgba(0, 212, 255, 0.6)' }} />
              <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(0, 212, 255, 0.4)' }} />
            </div>
          </div>
        )}

        {/* Walk mode instructions */}
        {navMode === 'firstperson' && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center animate-fadeIn">
            <div className="glass rounded-lg px-3 py-1.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-mono" style={{ color: 'var(--accent)' }}>WASD</span> Move · 
              <span className="font-mono" style={{ color: 'var(--accent)' }}> Mouse</span> Look · 
              <span className="font-mono" style={{ color: 'var(--accent)' }}> ESC</span> Exit
            </div>
          </div>
        )}
      </div>

      {/* Popup overlays */}
      <HotspotPopup />
      <HelpOverlay />
    </>
  )
}
