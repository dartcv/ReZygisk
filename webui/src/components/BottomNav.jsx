import { Icon } from './Icon.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useNav } from '../context/NavContext.jsx'

const ITEMS = [
  { id: 'home', icon: 'home' },
  { id: 'modules', icon: 'modules' },
  { id: 'actions', icon: 'actions' },
  { id: 'settings', icon: 'settings' },
]

/* INFO: Floating bar like the reference design. The active item gets a filled icon and a
         soft pill behind it. The bar slides away while a sub-page is open. */
export function BottomNav() {
  const { t } = usePrefs()
  const { tab, setTab, sub } = useNav()

  return (
    <nav className={sub ? 'bottom-nav is-hidden' : 'bottom-nav'} aria-label='Main'>
      {ITEMS.map((item) => {
        const active = item.id === tab

        return (
          <button
            key={item.id}
            type='button'
            className={active ? 'nav-item is-active' : 'nav-item'}
            onClick={() => setTab(item.id)}
            aria-current={active ? 'page' : undefined}
          >
            <span className='nav-pill'>
              <Icon name={item.icon} variant={active ? 'filled' : 'outlined'} />
            </span>
            <span className='nav-label'>{t(`pages.${item.id}.title`)}</span>
          </button>
        )
      })}
    </nav>
  )
}
