import {
  AmbientLight, BufferGeometry, DoubleSide, DynamicDrawUsage, Mesh, MeshPhongMaterial,
  PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer,
} from 'three'
import WAVES from 'vanta/src/vanta.waves.js'

// Only include the Three.js features used by Waves. This chunk loads after the UI.
const THREE = {
  AmbientLight, BufferGeometry, DoubleSide, DynamicDrawUsage, Mesh, MeshPhongMaterial,
  PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer,
}

export function createWaveBackground(el, color) {
  const scale = Math.max(1, window.devicePixelRatio / 1.25)
  const effect = WAVES({
    el,
    THREE,
    color,
    backgroundAlpha: 0,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minWidth: 1,
    minHeight: 1,
    scale,
    scaleMobile: scale,
    shininess: 28,
    waveHeight: 16,
    waveSpeed: 0.35,
    zoom: 0.85,
  })
  const renderer = effect.renderer
  const canvas = renderer?.domElement
  let destroyed = false

  function destroy() {
    if (destroyed) return
    destroyed = true
    canvas?.removeEventListener('webglcontextlost', destroy)
    // Vanta clears the scene, but its destroy() does not release the renderer/context.
    // Its init-error path may already have removed the canvas.
    if (canvas && canvas.parentNode !== el) effect.renderer = null
    effect.destroy()
    renderer?.dispose()
    renderer?.forceContextLoss()
  }

  // Vanta may return a partially initialized instance after a rendering failure.
  if (!effect.req) {
    destroy()
    return null
  }

  canvas.addEventListener('webglcontextlost', destroy)
  return { destroy }
}
