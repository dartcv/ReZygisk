import { Icon } from '../components/Icon.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useNav } from '../context/NavContext.jsx'

const OPTIONS = [
  { mode: 'amoled', key: 'amoled' },
  { mode: 'dark', key: 'dark' },
  { mode: 'light', key: 'light' },
  { mode: 'system', key: 'system_based' },
]

export function ThemePage() {
  const { t, themeMode, setThemeMode } = usePrefs()
  const { closeSub } = useNav()

  function choose(mode) {
    setThemeMode(mode)
    closeSub()
  }

  return (
    <>
      <TopBar large={false} title={t('pages.mini_settings_theme.title')} onBack={closeSub} backLabel='Back' />

      <div className='choice-list'>
        {OPTIONS.map((option) => {
          const selected = option.mode === themeMode

          return (
            <button
              key={option.mode}
              type='button'
              className={selected ? 'choice is-selected' : 'choice'}
              onClick={() => choose(option.mode)}
              aria-current={selected ? 'true' : undefined}
            >
              <span className={`swatch swatch-${option.mode}`} aria-hidden='true' />
              <span className='choice-text'>
                <span className='row-title'>{t(`pages.mini_settings_theme.theme.${option.key}`)}</span>
              </span>
              {selected ? <Icon name='check' variant='filled' className='choice-check' /> : null}
            </button>
          )
        })}
      </div>
    </>
  )
}
