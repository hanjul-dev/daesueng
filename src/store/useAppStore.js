import { create } from 'zustand'
import { DEFAULT_FLOOR_VIEW } from '../content/floorSections'

const DEFAULT_MODEL_TRANSFORM = {
  scale: 0.98,
  positionX: -1,
  positionY: 3.9,
  positionZ: -0.3,
}

const DEFAULT_LIGHT_TUNING = {
  keyAngle: 28,
  keyHeight: 29.5,
  keyIntensity: 1.87,
  fillAngle: 141,
  fillHeight: 9.5,
  fillIntensity: 2.12,
  exposure: 1.6,
}

const DEFAULT_EXPLORER_STATE = {
  localPosition: [0, 1.72, 12],
  yaw: Math.PI,
}

function clampTime(hour) {
  return Math.min(21, Math.max(6, hour))
}

function clampProgress(progress) {
  return Math.min(100, Math.max(0, progress))
}

const useAppStore = create((set) => ({
  isLoading: true,
  loadingProgress: 0,
  loadingStage: 'boot',
  setLoadingProgress: (progress) => set({ loadingProgress: clampProgress(progress) }),
  setLoadingStage: (loadingStage) => set({ loadingStage }),
  setLoaded: () => set({ isLoading: false, loadingProgress: 100, loadingStage: 'ready' }),

  navMode: 'orbit',
  setNavMode: (navMode) => set({ navMode }),
  isExperienceFullscreen: false,
  setExperienceFullscreen: (isExperienceFullscreen) => set({ isExperienceFullscreen }),
  floorView: DEFAULT_FLOOR_VIEW,
  setFloorView: (floorView) => set({ floorView }),
  explorer: DEFAULT_EXPLORER_STATE,
  setExplorer: (nextExplorer) =>
    set((state) => ({
      explorer: {
        ...state.explorer,
        ...nextExplorer,
      },
    })),
  resetExplorer: () => set({ explorer: DEFAULT_EXPLORER_STATE }),

  timeOfDay: 10.5,
  setTimeOfDay: (timeOfDay) => set({ timeOfDay: clampTime(timeOfDay) }),

  modelMode: 'glb',
  setModelMode: (modelMode) => set({ modelMode }),
  modelTransform: DEFAULT_MODEL_TRANSFORM,
  setModelTransform: (nextTransform) =>
    set((state) => ({
      modelTransform: {
        ...state.modelTransform,
        ...nextTransform,
      },
    })),
  resetModelTransform: () => set({ modelTransform: DEFAULT_MODEL_TRANSFORM }),
  lightTuning: DEFAULT_LIGHT_TUNING,
  setLightTuning: (nextLightTuning) =>
    set((state) => ({
      lightTuning: {
        ...state.lightTuning,
        ...nextLightTuning,
      },
    })),
  resetLightTuning: () => set({ lightTuning: DEFAULT_LIGHT_TUNING }),

  selectedHotspot: null,
  setSelectedHotspot: (selectedHotspot) => set({ selectedHotspot }),
  clearSelectedHotspot: () => set({ selectedHotspot: null }),
  hotspotOverlayEnabled: false,
  setHotspotOverlayEnabled: (hotspotOverlayEnabled) =>
    set((state) => ({
      hotspotOverlayEnabled,
      selectedHotspot: hotspotOverlayEnabled ? state.selectedHotspot : null,
      nearbyHotspot: hotspotOverlayEnabled ? state.nearbyHotspot : null,
    })),
  toggleHotspotOverlay: () =>
    set((state) => ({
      hotspotOverlayEnabled: !state.hotspotOverlayEnabled,
      selectedHotspot: !state.hotspotOverlayEnabled ? state.selectedHotspot : null,
      nearbyHotspot: !state.hotspotOverlayEnabled ? state.nearbyHotspot : null,
    })),
  nearbyHotspot: null,
  setNearbyHotspot: (nearbyHotspot) => set({ nearbyHotspot }),
  clearNearbyHotspot: () => set({ nearbyHotspot: null }),

  cameraPosition: [18, 12, 23],
  setCameraPosition: (cameraPosition) => set({ cameraPosition }),
  cameraRotation: 0,
  setCameraRotation: (cameraRotation) => set({ cameraRotation }),
}))

export default useAppStore
