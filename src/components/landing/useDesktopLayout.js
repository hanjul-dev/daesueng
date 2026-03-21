import { useEffect, useState } from 'react'

function getDesktopLayoutState() {
  if (typeof window === 'undefined') {
    return false
  }

  const wideViewport = window.matchMedia('(min-width: 900px)').matches
  const precisePointer = window.matchMedia('(pointer: fine)').matches
  const hoverEnabled = window.matchMedia('(hover: hover)').matches
  const largeDesktopShell = (window.outerWidth >= 1200 || window.screen.width >= 1280) && precisePointer

  return wideViewport || (largeDesktopShell && hoverEnabled)
}

export default function useDesktopLayout() {
  const [isDesktopLayout, setIsDesktopLayout] = useState(getDesktopLayoutState)

  useEffect(() => {
    const viewportQuery = window.matchMedia('(min-width: 900px)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const hoverQuery = window.matchMedia('(hover: hover)')

    function updateLayoutMode() {
      setIsDesktopLayout(getDesktopLayoutState())
    }

    updateLayoutMode()
    viewportQuery.addEventListener('change', updateLayoutMode)
    pointerQuery.addEventListener('change', updateLayoutMode)
    hoverQuery.addEventListener('change', updateLayoutMode)
    window.addEventListener('resize', updateLayoutMode)

    return () => {
      viewportQuery.removeEventListener('change', updateLayoutMode)
      pointerQuery.removeEventListener('change', updateLayoutMode)
      hoverQuery.removeEventListener('change', updateLayoutMode)
      window.removeEventListener('resize', updateLayoutMode)
    }
  }, [])

  return isDesktopLayout
}
