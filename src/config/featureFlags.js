function parseBooleanFlag(value) {
  if (typeof value !== 'string') {
    return false
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function isLocalRuntime() {
  if (typeof window === 'undefined') {
    return false
  }

  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function hasCalibrationQuery() {
  if (typeof window === 'undefined') {
    return false
  }

  const params = new URLSearchParams(window.location.search)

  return ['calibrate', 'calibration', 'fine-tune'].some((key) =>
    parseBooleanFlag(params.get(key)),
  )
}

function isCalibrationEnabled() {
  return (
    import.meta.env.DEV ||
    parseBooleanFlag(import.meta.env.VITE_ENABLE_CALIBRATION) ||
    isLocalRuntime() ||
    hasCalibrationQuery()
  )
}

export const featureFlags = Object.freeze({
  showCalibrationControls: isCalibrationEnabled(),
})
