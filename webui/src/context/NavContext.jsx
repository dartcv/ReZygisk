import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const TABS = ['home', 'modules', 'actions', 'settings']

const NavContext = createContext(null)

/* INFO: Sub-pages (language, theme) push a history entry, so the Android back gesture closes
         them instead of leaving the WebUI. */
export function NavProvider({ children }) {
  const [tab, setTab] = useState('home')
  const [sub, setSub] = useState(null)

  useEffect(() => {
    function onPopState() {
      setSub(null)
    }

    window.addEventListener('popstate', onPopState)

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const openSub = useCallback((name) => {
    setSub(name)
    window.history.pushState({ rzSub: name }, '')
  }, [])

  const closeSub = useCallback(() => {
    setSub(null)
    if (window.history.state && window.history.state.rzSub) window.history.back()
  }, [])

  const value = useMemo(() => ({ tab, setTab, sub, openSub, closeSub }), [tab, sub, openSub, closeSub])

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav() {
  return useContext(NavContext)
}
