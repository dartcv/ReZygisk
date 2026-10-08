import { Icon } from './Icon.jsx'
import { handleExternalLink } from '../lib/ksu.js'

/* INFO: Small building blocks shared by every page. Keeping them here keeps the page files
         about content, not markup. */

export function Card({ children, tone = 'glass', className = '' }) {
  return <div className={`card card--${tone} ${className}`}>{children}</div>
}

export function Caption({ children }) {
  return <p className='caption'>{children}</p>
}

export function Group({ caption, children }) {
  return (
    <section className='group'>
      {caption ? <Caption>{caption}</Caption> : null}
      <div className='card card--glass group-card'>{children}</div>
    </section>
  )
}

export function Button({ variant = 'filled', icon, children, className = '', ...rest }) {
  return (
    <button type='button' className={`btn btn--${variant} ${className}`} {...rest}>
      {icon ? <Icon name={icon} /> : null}
      <span>{children}</span>
    </button>
  )
}

export function IconButton({ icon, label, onClick }) {
  return (
    <button type='button' className='icon-button' onClick={onClick} aria-label={label}>
      <Icon name={icon} />
    </button>
  )
}

export function Switch({ checked, onChange, label }) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={label}
      className={checked ? 'switch is-on' : 'switch'}
      onClick={() => onChange(!checked)}
    >
      <span className='switch-thumb' />
    </button>
  )
}

export function StatusPill({ tone, children }) {
  return (
    <span className={`status-pill tone-${tone}`}>
      <span className='status-dot' aria-hidden='true' />
      <span>{children}</span>
    </span>
  )
}

const AVATAR_TONES = ['blue', 'violet', 'teal', 'amber']

function hashText(text) {
  let hash = 0
  for (let index = 0; index < text.length; index++) hash = (hash * 31 + text.charCodeAt(index)) >>> 0

  return hash
}

export function Avatar({ label, seed }) {
  const letter = (label || '?').trim().charAt(0).toUpperCase()
  const tone = AVATAR_TONES[hashText(seed || label || '?') % AVATAR_TONES.length]

  return <span className={`avatar avatar--${tone}`} aria-hidden='true'>{letter}</span>
}

/* INFO: A list row. It is a button when it has an onClick, otherwise a plain block. A row with a
         description puts its value on a line of its own, so a long value cannot squeeze the text. */
export function Row({ icon, title, description, value, onClick, trailing, tone }) {
  const hasValue = value !== undefined && value !== null
  const stacked = Boolean(description)
  const valueClass = `row-value${stacked ? ' row-value--stacked' : ''}${tone ? ` tone-text tone-${tone}` : ''}`

  const body = (
    <>
      {icon ? (
        <span className='icon-bubble' aria-hidden='true'>
          <Icon name={icon} />
        </span>
      ) : null}

      <span className='row-text'>
        <span className='row-title'>{title}</span>
        {description ? <span className='row-description'>{description}</span> : null}
        {hasValue && stacked ? <span className={valueClass}>{value}</span> : null}
      </span>

      {hasValue && !stacked ? <span className={valueClass}>{value}</span> : null}

      {trailing}
      {onClick ? <Icon name='chevron' className='row-chevron' /> : null}
    </>
  )

  if (onClick) {
    return <button type='button' className='row' onClick={onClick}>{body}</button>
  }

  return <div className='row'>{body}</div>
}

/* INFO: Links to GitHub profiles. The click goes through handleExternalLink, which checks the
         host and opens the link through the root manager when it is available. */
export function ExternalLink({ url, children }) {
  return (
    <a className='external-link' href={url} target='_blank' rel='noopener noreferrer' onClick={handleExternalLink}>
      {children}
    </a>
  )
}

export function Spinner({ label = 'Loading' }) {
  return <span className='spinner' role='status' aria-label={label} />
}

export function Splash() {
  return (
    <div className='splash' role='status' aria-label='Loading ReZygisk'>
      <span className='splash-title'>ReZygisk</span>
      <Spinner />
    </div>
  )
}
