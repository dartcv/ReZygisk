import { isSafeModuleId } from './shell.js'

/* INFO: Derives the UI state from /data/adb/rezygisk/state.json. The writer is
         loader/src/ptracer/monitor.c. Note that "monitor.state" is a string, that the daemon
         lists a 32-bit entry only on 32-bit devices, and that a zygote entry is omitted when
         that arch is not injected. */
export const ARCHES = ['64', '32']

export function parseState(text) {
  try {
    const value = JSON.parse(text)

    return value !== null && typeof value === 'object' ? value : null
  } catch {
    return null
  }
}

function daemonOf(state, arch) {
  return state && state.rezygiskd ? state.rezygiskd[arch] : undefined
}

export function supportedArches(state) {
  if (!state) return []

  const fromDaemons = ARCHES.filter((arch) => daemonOf(state, arch) !== undefined)
  if (fromDaemons.length > 0) return fromDaemons

  return ARCHES.filter((arch) => state.zygote && state.zygote[arch] !== undefined)
}

export function zygoteStatus(state, arch) {
  const value = state && state.zygote ? state.zygote[arch] : undefined

  if (value === 1) return 'injected'
  if (value === 0 || value === undefined) return 'notInjected'

  return 'unknown'
}

/* INFO: "ok" when every supported arch is injected, "partially" when only some are, and
         "notWorking" when none is. Mirrors the module description in the root manager. */
export function overallStatus(state) {
  if (!state) return 'unknown'

  const arches = supportedArches(state)
  if (arches.length === 0) return 'notWorking'

  const injected = arches.filter((arch) => zygoteStatus(state, arch) === 'injected').length
  if (injected === 0) return 'notWorking'

  return injected === arches.length ? 'ok' : 'partially'
}

const MONITOR_STATES = { 0: 'tracing', 1: 'stopping', 2: 'stopped', 3: 'exiting' }

export function monitorStatus(state) {
  const raw = state && state.monitor ? String(state.monitor.state) : ''

  return MONITOR_STATES[raw] || 'unknown'
}

export function monitorReason(state) {
  return state && state.monitor && typeof state.monitor.reason === 'string' ? state.monitor.reason : null
}

export function daemonReason(state, arch) {
  const daemon = daemonOf(state, arch)

  return daemon && typeof daemon.reason === 'string' ? daemon.reason : null
}

/* INFO: Which control verbs make sense for each state. Start resumes a paused monitor, Pause
         only applies while it is tracing, and Stop is useless once it is already exiting. */
export function monitorActionsFor(status) {
  return {
    start: status === 'stopping' || status === 'stopped',
    pause: status === 'tracing',
    stop: status !== 'exiting',
  }
}

export function collectModules(state) {
  const byId = new Map()

  for (const arch of supportedArches(state)) {
    const daemon = daemonOf(state, arch)
    const ids = daemon && Array.isArray(daemon.modules) ? daemon.modules : []

    for (const id of ids) {
      if (!isSafeModuleId(id)) continue
      if (!byId.has(id)) byId.set(id, { id, arches: [] })
      byId.get(id).arches.push(arch)
    }
  }

  return [...byId.values()]
}
