import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // Loading
  isLoading: true,
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoaded: () => set({ isLoading: false }),

  // Navigation mode
  navMode: 'orbit', // 'orbit' | 'firstperson'
  setNavMode: (mode) => set({ navMode: mode }),
  toggleNavMode: () => set((state) => ({
    navMode: state.navMode === 'orbit' ? 'firstperson' : 'orbit'
  })),

  // Time simulation (0-24 hours)
  timeOfDay: 10,
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  // Model Scale
  modelScale: 0.9,
  setModelScale: (scale) => set({ modelScale: scale }),

  // Layer visibility
  layers: {
    structure: true,
    interior: true,
    furniture: true,
    hvac: false,
    mep: false,
  },
  toggleLayer: (layer) => set((state) => ({
    layers: { ...state.layers, [layer]: !state.layers[layer] }
  })),
  setLayerVisibility: (layer, visible) => set((state) => ({
    layers: { ...state.layers, [layer]: visible }
  })),

  // Floor selection (-1 = B1, 0 = all, 1 = 1F, 2 = 2F)
  activeFloor: 0,
  setActiveFloor: (floor) => set({ activeFloor: floor }),
  floorExplodeOffset: 0,
  setFloorExplodeOffset: (offset) => set({ floorExplodeOffset: offset }),
  isExploded: false,
  toggleExplode: () => set((state) => ({ isExploded: !state.isExploded })),

  // Hotspot / POI
  selectedHotspot: null,
  setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
  clearSelectedHotspot: () => set({ selectedHotspot: null }),

  // Material Swapping
  materialConfig: {
    lobbyFloor: 'marble-white',
    officeWalls: 'paint-warm-gray',
    hallwayFloor: 'tile-dark',
  },
  setMaterial: (area, material) => set((state) => ({
    materialConfig: { ...state.materialConfig, [area]: material }
  })),

  // Design configurator panel
  showConfigurator: false,
  toggleConfigurator: () => set((state) => ({ showConfigurator: !state.showConfigurator })),

  // Hovered object
  hoveredObject: null,
  setHoveredObject: (obj) => set({ hoveredObject: obj }),

  // Camera position for minimap
  cameraPosition: [0, 0, 0],
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  cameraRotation: 0,
  setCameraRotation: (rot) => set({ cameraRotation: rot }),

  // FPS counter
  fps: 60,
  setFps: (fps) => set({ fps }),

  // Show/hide panels
  showLayerPanel: false,
  toggleLayerPanel: () => set((state) => ({ showLayerPanel: !state.showLayerPanel })),
  showHelp: false,
  toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
}))

export default useAppStore
