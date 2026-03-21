function parseBooleanFlag(value) {
  if (typeof value !== 'string') {
    return false
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

export const featureFlags = Object.freeze({
  showCalibrationControls:
    import.meta.env.DEV || parseBooleanFlag(import.meta.env.VITE_ENABLE_CALIBRATION),
})
