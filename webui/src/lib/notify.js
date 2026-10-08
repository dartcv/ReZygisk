/* INFO: Shows a toast from code that runs outside React (error handlers, link handling). The
         ToastProvider listens for this event. */
export function notify(message) {
  window.dispatchEvent(new CustomEvent('rz:toast', { detail: message }))
}
