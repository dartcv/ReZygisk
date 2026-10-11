/* INFO: Keys match the old WebUI, so an update keeps the theme, language and toggles. The
         language key used to be written under the framework's name; it is still read as a
         fallback. */
export const STORAGE_KEYS = {
  theme: '/ReZygisk/theme',
  language: '/ReZygisk/language',
  config: '/ReZygisk/webui_config',
  legacyLanguage: '/TreatWheel/language',
}

export const THEME_MODES = ['system', 'light', 'dark', 'amoled']

const DEFAULT_CONFIG = {
  disableFullscreen: false,
  enableSystemFont: false,
}

function read(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* INFO: Some WebViews block storage. The choice then lasts until the page is reloaded. */
  }
}

export function readThemeMode() {
  const value = read(STORAGE_KEYS.theme)

  return THEME_MODES.includes(value) ? value : 'system'
}

export function saveThemeMode(mode) {
  write(STORAGE_KEYS.theme, mode)
}

export function readLanguage() {
  return read(STORAGE_KEYS.language) || read(STORAGE_KEYS.legacyLanguage) || 'system'
}

export function saveLanguage(code) {
  write(STORAGE_KEYS.language, code)
}

export function readConfig() {
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(read(STORAGE_KEYS.config) || '{}') }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function saveConfig(config) {
  write(STORAGE_KEYS.config, JSON.stringify(config))
}
