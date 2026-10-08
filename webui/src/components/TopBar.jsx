import { Icon } from './Icon.jsx'

/* INFO: Large titles for the tab pages, compact bars with a back button for sub-pages. */
export function TopBar({ title, subtitle, onBack, backLabel, trailing, large = true }) {
  return (
    <header className={large ? 'topbar topbar--large' : 'topbar topbar--compact'}>
      {onBack ? (
        <button type='button' className='icon-button' onClick={onBack} aria-label={backLabel}>
          <Icon name='back' />
        </button>
      ) : null}

      <div className='topbar-text'>
        <h1 className='topbar-title'>{title}</h1>
        {subtitle ? <p className='topbar-subtitle'>{subtitle}</p> : null}
      </div>

      {trailing ? <div className='topbar-trailing'>{trailing}</div> : null}
    </header>
  )
}
