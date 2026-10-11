import { useEffect, useRef } from 'react'
import { usePrefs } from '../context/PrefsContext.jsx'

const WAVE_COLORS = { light: 0x729ec9, dark: 0x25436b, amoled: 0x111c30 }

/* INFO: Vanta Waves is bundled locally under MIT; see THIRD_PARTY_NOTICES.txt.
         Keep the CSS backdrop when motion is reduced or WebGL is unavailable. */
export function Wallpaper({ local = false, active = true }) {
  const container = useRef(null)
  const { resolvedTheme } = usePrefs()

  useEffect(() => {
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let effect = null
    let disposed = false
    let generation = 0

    function stop() {
      generation += 1
      effect?.destroy()
      effect = null
    }

    async function sync() {
      stop()
      if (!active || document.hidden || motion?.matches) return

      const current = generation
      try {
        const { createWaveBackground } = await import('../lib/waveBackground.js')
        if (disposed || current !== generation) return

        effect = createWaveBackground(container.current, WAVE_COLORS[resolvedTheme])
      } catch {
        // A failed optional background must not interrupt the module controls.
        stop()
      }
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    if (motion?.addEventListener) motion.addEventListener('change', sync)
    else motion?.addListener(sync)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', sync)
      if (motion?.removeEventListener) motion.removeEventListener('change', sync)
      else motion?.removeListener(sync)
      stop()
    }
  }, [active, resolvedTheme])

  return (
    <div className={local ? 'wallpaper is-local' : 'wallpaper'} aria-hidden='true'>
      <div className='wallpaper-motion' ref={container} />
      <div className='wallpaper-veil' />
    </div>
  )
}
