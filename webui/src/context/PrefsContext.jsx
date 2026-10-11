import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BUNDLED_LANGUAGES, createTranslator, FALLBACK_LANGUAGE, isRtl, listLanguages, loadLanguage } from '../lib/i18n.js'
import { matchSystemLanguage, systemLanguages } from '../lib/locale.js'
import { notify } from '../lib/notify.js'
import { setFullScreen } from '../lib/ksu.js'
import {
  readConfig,
  readLanguage,
  readThemeMode,
  saveConfig,
  saveLanguage,
  saveThemeMode,
} from '../lib/storage.js'

const PrefsContext = createContext(null)

/* INFO: "system" follows the device setting. Every other mode is used as it is. */
function resolveTheme(mode, systemDark) {
  if (mode !== 'system') return mode

  return systemDark ? 'dark' : 'light'
}

function prefersDark() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/* INFO: Theme, language and the two toggles. Everything that the user can change is saved here
         and applied to the <html> element, so the rest of the UI only reads CSS state. */
export function PrefsProvider({ children }) {
  const [themeMode, setThemeModeState] = useState(readThemeMode)
  const [systemDark, setSystemDark] = useState(prefersDark)
  const [config, setConfig] = useState(readConfig)
  const [languageMode, setLanguageMode] = useState(readLanguage)
  const [preferredLanguages, setPreferredLanguages] = useState(systemLanguages)
  const [availableLanguages, setAvailableLanguages] = useState(BUNDLED_LANGUAGES)
  const languageCode = languageMode === 'system'
    ? matchSystemLanguage(preferredLanguages, availableLanguages)
    : languageMode
  const [fallback, setFallback] = useState(null)
  const [loaded, setLoaded] = useState({ code: null, dictionary: null })

  useEffect(() => {
    let alive = true
    listLanguages().then((codes) => {
      if (alive && codes.length) setAvailableLanguages(codes)
    }).catch(() => {
      // Keep the bundled language list if the root-manager bridge is unavailable.
    })

    return () => { alive = false }
  }, [])

  useEffect(() => {
    function updateLanguage() {
      setPreferredLanguages(systemLanguages())
    }

    function onVisible() {
      if (!document.hidden) updateLanguage()
    }

    window.addEventListener('languagechange', updateLanguage)
    window.addEventListener('focus', updateLanguage)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('languagechange', updateLanguage)
      window.removeEventListener('focus', updateLanguage)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function onChange(event) {
      setSystemDark(event.matches)
    }

    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let alive = true

    loadLanguage(FALLBACK_LANGUAGE)
      .then((data) => {
        if (alive) setFallback(data)
      })
      .catch(() => {
        if (alive) setFallback({})
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true

    loadLanguage(languageCode)
      .then((data) => {
        if (alive) setLoaded({ code: languageCode, dictionary: data })
      })
      .catch(() => {
        if (!alive) return

        setLoaded({ code: languageCode, dictionary: null })
        notify('Language not available, showing English.')
      })

    return () => {
      alive = false
    }
  }, [languageCode])

  useEffect(() => {
    saveConfig(config)
  }, [config])

  useEffect(() => {
    /* INFO: Runs once on start, like the old WebUI: fullscreen unless the user turned it off. */
    setFullScreen(!config.disableFullscreen)
  }, [])

  const resolvedTheme = resolveTheme(themeMode, systemDark)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    document.documentElement.classList.toggle('font-system', config.enableSystemFont)
  }, [config.enableSystemFont])

  useEffect(() => {
    document.documentElement.lang = languageCode.replace('_', '-')
    document.documentElement.dir = isRtl(languageCode) ? 'rtl' : 'ltr'
  }, [languageCode])

  const setThemeMode = useCallback((mode) => {
    saveThemeMode(mode)
    setThemeModeState(mode)
  }, [])

  const setLanguage = useCallback((code) => {
    saveLanguage(code)
    setPreferredLanguages(systemLanguages())
    setLanguageMode(code)
  }, [])

  const setFullscreenEnabled = useCallback((enabled) => {
    setConfig((current) => ({ ...current, disableFullscreen: !enabled }))
    setFullScreen(enabled)
  }, [])

  const setSystemFont = useCallback((enabled) => {
    setConfig((current) => ({ ...current, enableSystemFont: enabled }))
  }, [])

  const dictionary = loaded.code === languageCode ? loaded.dictionary : null
  const t = useMemo(() => createTranslator(dictionary, fallback), [dictionary, fallback])
  const languageName = (dictionary && dictionary.langName) || (fallback && fallback.langName) || languageCode

  const value = useMemo(() => ({
    ready: fallback !== null && loaded.code !== null,
    t,
    themeMode,
    resolvedTheme,
    setThemeMode,
    languageCode,
    languageMode,
    languageName,
    setLanguage,
    config,
    setFullscreenEnabled,
    setSystemFont,
  }), [
    fallback, loaded.code, t, themeMode, resolvedTheme, setThemeMode, languageCode, languageMode,
    languageName, setLanguage, config, setFullscreenEnabled, setSystemFont,
  ])

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  return useContext(PrefsContext)
}
