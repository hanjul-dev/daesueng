import { create } from 'zustand'

const DEFAULT_MODEL_TRANSFORM = {
  scale: 0.98,
  positionX: -1,
  positionY: 3.9,
  positionZ: -0.3,
}

const DEFAULT_LIGHT_TUNING = {
  keyAngle: 49,
  keyHeight: 20,
  keyIntensity: 0.52,
  fillAngle: -11,
  fillHeight: 8,
  fillIntensity: 1.35,
  exposure: 0.92,
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

  cameraPosition: [18, 12, 23],
  setCameraPosition: (cameraPosition) => set({ cameraPosition }),
  cameraRotation: 0,
  setCameraRotation: (cameraRotation) => set({ cameraRotation }),
}))

export default useAppStore
