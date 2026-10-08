/* INFO: Wraps a value in single quotes for the Android shell. Each single quote inside the
         value is closed, escaped and reopened, so the value can never break out of the quotes. */
export function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

/* INFO: Module IDs come from state.json, so they are checked before they reach a command. */
export function isSafeModuleId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9._-]{1,128}$/.test(id)
}
