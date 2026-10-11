import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { Spinner } from '../components/ui.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useNav } from '../context/NavContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { listLanguages, loadLanguage } from '../lib/i18n.js'

/* INFO: Every language file is read once to get its langName, which is the name shown to the
         user. Files that fail to load are left out of the list. */
export function LanguagePage() {
  const { t, languageMode, setLanguage } = usePrefs()
  const { closeSub } = useNav()
  const toast = useToast()
  const [options, setOptions] = useState(null)

  useEffect(() => {
    let alive = true

    listLanguages()
      .then((codes) => Promise.all(codes.map((code) => (
        loadLanguage(code)
          .then((data) => ({ code, name: data.langName || code }))
          .catch(() => null)
      ))))
      .then((list) => {
        if (alive) setOptions(list.filter((option) => option !== null))
      })
      .catch(() => {
        if (!alive) return

        setOptions([])
        toast('Error getting language list!')
      })

    return () => {
      alive = false
    }
  }, [toast])

  function choose(code) {
    setLanguage(code)
    closeSub()
  }

  const header = <TopBar large={false} title={t('pages.mini_settings_language.title')} onBack={closeSub} backLabel='Back' />

  if (options === null) {
    return (
      <>
        {header}
        <div className='center-loader'>
          <Spinner />
        </div>
      </>
    )
  }

  return (
    <>
      {header}
      <div className='choice-list'>
        {[{ code: 'system', name: t('pages.mini_settings_language.system') }, ...options].map((option) => {
          const selected = option.code === languageMode

          return (
            <button
              key={option.code}
              type='button'
              className={selected ? 'choice is-selected' : 'choice'}
              onClick={() => choose(option.code)}
              aria-current={selected ? 'true' : undefined}
            >
              <span className='choice-text'>
                <span className='row-title'>{option.name}</span>
                <span className='row-description'>{option.code === 'system' ? t('pages.mini_settings_language.systemDescription') : option.code}</span>
              </span>
              {selected ? <Icon name='check' variant='filled' className='choice-check' /> : null}
            </button>
          )
        })}
      </div>
    </>
  )
}
