import { commands } from './commands.js'
import { devExec } from './devMock.js'
import { notify } from './notify.js'

/* INFO: KernelSU, APatch and WebUI X inject a `ksu` object into the page. Without it the UI
         runs as a plain web page (desktop preview) and answers from devMock.js instead. */
export function hasKsu() {
  return typeof window.ksu !== 'undefined'
}

const EXEC_TIMEOUT_MS = 15000
let callbackCounter = 0

export function exec(command) {
  if (!hasKsu()) return devExec(command)

  return new Promise((resolve, reject) => {
    const callbackName = `rzExec_${Date.now()}_${callbackCounter++}`

    function cleanup() {
      clearTimeout(timer)
      delete window[callbackName]
    }

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(`exec timed out: ${command}`))
    }, EXEC_TIMEOUT_MS)

    window[callbackName] = (errno, stdout, stderr) => {
      cleanup()
      resolve({ errno, stdout, stderr })
    }

    try {
      window.ksu.exec(command, '{}', callbackName)
    } catch (error) {
      cleanup()
      reject(error)
    }
  })
}

export function setFullScreen(enabled) {
  if (!hasKsu() || typeof window.ksu.fullScreen !== 'function') return

  window.ksu.fullScreen(enabled)
}

/* INFO: Only https links to these hosts can leave the WebUI. Anything else is refused, so the
         page cannot be used to open arbitrary URLs. */
const ALLOWED_LINK_HOSTS = ['github.com']

/* INFO: Returns the normalized URL when it is an https link to an allowed host, otherwise null. */
export function toAllowedLink(url) {
  let parsed = null

  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (parsed.protocol !== 'https:') return null
  if (!ALLOWED_LINK_HOSTS.includes(parsed.hostname)) return null

  return parsed.href
}

/* INFO: Click handler for <a> links. On KernelSU the link opens through an Android intent so
         it leaves the WebView. Without the bridge (desktop preview) the anchor keeps its normal
         behaviour and opens in a new tab. */
export function handleExternalLink(event) {
  const target = toAllowedLink(event.currentTarget.href)
  if (target === null) {
    event.preventDefault()
    return
  }

  if (!hasKsu()) return

  event.preventDefault()
  exec(commands.openUrl(target)).then((result) => {
    if (result.errno !== 0) notify('Could not open the link.')
  }).catch(() => notify('Could not open the link.'))
}
