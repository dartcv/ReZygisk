/* INFO: Imported first in main.jsx, so it runs before React loads. Some older WebViews lack
         queueMicrotask, which React's scheduler uses. */
if (typeof window.queueMicrotask !== 'function') {
  window.queueMicrotask = (callback) => {
    Promise.resolve().then(callback)
  }
}
