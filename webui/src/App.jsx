import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { Wallpaper } from './components/Wallpaper.jsx'
import { Splash } from './components/ui.jsx'
import { NavProvider, TABS, useNav } from './context/NavContext.jsx'
import { PrefsProvider, usePrefs } from './context/PrefsContext.jsx'
import { StatusProvider } from './context/StatusContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ActionsPage } from './pages/ActionsPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LanguagePage } from './pages/LanguagePage.jsx'
import { ModulesPage } from './pages/ModulesPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { ThemePage } from './pages/ThemePage.jsx'

const PAGES = {
  home: HomePage,
  modules: ModulesPage,
  actions: ActionsPage,
  settings: SettingsPage,
}

const SUB_PAGES = {
  language: LanguagePage,
  theme: ThemePage,
}

const SUB_LEAVE_MS = 300

function directionOf(index, activeIndex) {
  if (index < activeIndex) return -1
  if (index > activeIndex) return 1

  return 0
}

/* INFO: All four tab pages stay mounted, so scroll position and loaded data survive a switch.
         Each page slides in from the side it came from. */
function TabStage() {
  const { tab } = useNav()
  const activeIndex = TABS.indexOf(tab)

  return (
    <div className='tab-stage'>
      {TABS.map((id, index) => {
        const Page = PAGES[id]
        const active = index === activeIndex

        return (
          <section
            key={id}
            className={active ? 'tab-page is-active' : 'tab-page'}
            style={{ '--dx': directionOf(index, activeIndex) }}
            inert={!active}
          >
            <div className='page-column'>
              <Page />
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* INFO: Sub-pages cover the tabs and slide in from the right. The page stays mounted for a
         moment after it closes, so the slide-out animation can finish. */
function SubStage() {
  const { sub } = useNav()
  const [rendered, setRendered] = useState(sub)

  useEffect(() => {
    if (sub) {
      setRendered(sub)

      return undefined
    }

    const timer = setTimeout(() => setRendered(null), SUB_LEAVE_MS)

    return () => clearTimeout(timer)
  }, [sub])

  if (!rendered) return null

  const Page = SUB_PAGES[rendered]

  return (
    <div className={sub ? 'sub-stage is-entering' : 'sub-stage is-leaving'}>
      <Wallpaper local />
      <div className='sub-scroll'>
        <div className='page-column'>
          <Page />
        </div>
      </div>
    </div>
  )
}

function Shell() {
  const { ready } = usePrefs()
  const { sub } = useNav()

  if (!ready) {
    return (
      <>
        <Wallpaper />
        <Splash />
      </>
    )
  }

  return (
    <>
      <Wallpaper />
      <div className={sub ? 'shell has-sub' : 'shell'}>
        <TabStage />
      </div>
      <BottomNav />
      <SubStage />
    </>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <PrefsProvider>
        <ToastProvider>
          <StatusProvider>
            <NavProvider>
              <Shell />
            </NavProvider>
          </StatusProvider>
        </ToastProvider>
      </PrefsProvider>
    </ErrorBoundary>
  )
}

export default App
