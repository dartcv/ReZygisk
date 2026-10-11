import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { commands } from '../lib/commands.js'
import { exec } from '../lib/ksu.js'
import { parseState } from '../lib/rezygisk.js'
import { APP_NAME } from '../lib/brand.js'
import { useToast } from './ToastContext.jsx'

const POLL_INTERVAL_MS = 2000
const REFRESH_AFTER_ACTION_MS = 400

const StatusContext = createContext(null)

function propValue(text, key) {
  const line = text.split('\n').find((item) => item.startsWith(`${key}=`))

  return line ? line.slice(key.length + 1).trim() : null
}

/* INFO: Polls state.json while the page is visible and runs the monitor control verbs. The
         raw text is compared first, so unchanged polls do not re-render the whole tree. */
export function StatusProvider({ children }) {
  const toast = useToast()
  const [state, setState] = useState(null)
  const [ready, setReady] = useState(false)
  const [info, setInfo] = useState({ version: null, kernel: null, androidVersion: null })
  const [pendingAction, setPendingAction] = useState(null)

  const lastRaw = useRef(null)
  const inFlight = useRef(null)
  const failing = useRef(false)

  const refreshState = useCallback(() => {
    if (inFlight.current) return inFlight.current

    inFlight.current = exec(commands.state)
      .then((result) => {
        if (result.errno !== 0) throw new Error('state.json is not readable')

        failing.current = false
        if (result.stdout !== lastRaw.current) {
          lastRaw.current = result.stdout
          setState(parseState(result.stdout))
        }
      })
      .catch(() => {
        lastRaw.current = null
        setState(null)
        if (!failing.current) toast(`Error getting state of ${APP_NAME}!`)
        failing.current = true
      })
      .finally(() => {
        setReady(true)
        inFlight.current = null
      })

    return inFlight.current
  }, [toast])

  useEffect(() => {
    let timer = null

    function stop() {
      if (timer !== null) clearInterval(timer)
      timer = null
    }

    function start() {
      stop()
      timer = setInterval(refreshState, POLL_INTERVAL_MS)
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stop()
      } else {
        refreshState()
        start()
      }
    }

    refreshState()
    start()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [refreshState])

  useEffect(() => {
    let alive = true

    Promise.all([exec(commands.moduleProp), exec(commands.kernel), exec(commands.androidVersion)])
      .then(([prop, kernel, android]) => {
        if (!alive) return

        setInfo({
          version: prop.errno === 0 ? propValue(prop.stdout, 'version') : null,
          kernel: kernel.errno === 0 ? kernel.stdout.trim() : null,
          androidVersion: android.errno === 0 ? android.stdout.trim() : null,
        })
      })
      .catch(() => {
        /* INFO: Device info is cosmetic. The cards fall back to "Unknown". */
      })

    return () => {
      alive = false
    }
  }, [])

  const runMonitor = useCallback((action) => {
    setPendingAction(action)

    exec(commands.monitor(action))
      .then((result) => {
        if (result.errno !== 0) toast(`Monitor command "${action}" failed`)
      })
      .catch(() => toast(`Monitor command "${action}" failed`))
      .finally(() => {
        setPendingAction(null)
        window.setTimeout(refreshState, REFRESH_AFTER_ACTION_MS)
      })
  }, [refreshState, toast])

  const value = useMemo(
    () => ({ state, ready, info, pendingAction, runMonitor, refreshState }),
    [state, ready, info, pendingAction, runMonitor, refreshState],
  )

  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
}

export function useStatus() {
  return useContext(StatusContext)
}
