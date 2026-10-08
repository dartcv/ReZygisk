import { commands } from './commands.js'
import { exec } from './ksu.js'
import { notify } from './notify.js'

/* INFO: Uncaught errors go to the module's log file, so a bug report can include them. The
         log file is overwritten each time, the same as the old WebUI. */
export function reportError(message, detail) {
  const text = `${new Date().toISOString()} ${message}\n${detail || ''}`

  console.error(message, detail)
  notify('An error occurred. See log file.')
  exec(commands.writeLog(text)).catch(() => {
    /* INFO: Logging is best-effort. The error is already in the console. */
  })
}

export function installErrorHandlers() {
  window.addEventListener('error', (event) => {
    reportError(event.message, event.error && event.error.stack)
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    reportError('Unhandled promise rejection', reason && reason.stack ? reason.stack : String(reason))
  })
}
