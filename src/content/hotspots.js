import * as THREE from 'three'
import { HOTSPOT_DETAILS } from './property'

export const HOTSPOT_INTERACTION_RADIUS = 1.9

export const HOTSPOTS = [
  { id: 'front-approach', position: [0.4, -1.4, -9.6] },
  { id: 'garage-access', position: [-6.2, -1.1, -7] },
  { id: 'double-height-glass', position: [4.8, 2.8, -7.4] },
  { id: 'balcony-line', position: [-1.8, 1.9, -9.2] },
  { id: 'gable-wing', position: [-7.7, 4.2, -0.8] },
]

export function buildHotspotPayload(hotspot) {
  const copy = HOTSPOT_DETAILS[hotspot.id]
  return {
    ...hotspot,
    floor: copy?.floor ?? 'Exterior',
    title: copy?.title ?? hotspot.id,
    summary: copy?.summary ?? '',
  }
}

export function findClosestHotspot(localPosition, maxDistance = HOTSPOT_INTERACTION_RADIUS) {
  const origin = new THREE.Vector3(...localPosition)
  let closestHotspot = null
  let closestDistanceSq = maxDistance * maxDistance

  HOTSPOTS.forEach((hotspot) => {
    const target = new THREE.Vector3(...hotspot.position)
    const distanceSq = origin.distanceToSquared(target)

    if (distanceSq <= closestDistanceSq) {
      closestHotspot = buildHotspotPayload(hotspot)
      closestDistanceSq = distanceSq
    }
  })

  return closestHotspot
}
