import { Button, Card, Caption, IconButton, Row, StatusPill } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useNav } from '../context/NavContext.jsx'
import { useStatus } from '../context/StatusContext.jsx'
import { APP_NAME } from '../lib/brand.js'
import {
  monitorReason,
  monitorStatus,
  overallStatus,
  supportedArches,
  zygoteStatus,
} from '../lib/rezygisk.js'

const OVERALL_TONE = { ok: 'ok', partially: 'warn', notWorking: 'error', unknown: 'idle' }
const MONITOR_TONE = { tracing: 'ok', stopping: 'warn', stopped: 'warn', exiting: 'error', unknown: 'idle' }
const MONITOR_ICON = { tracing: 'check', stopping: 'warn', stopped: 'warn', exiting: 'warn', unknown: 'mark' }
const ZYGOTE_TONE = { injected: 'ok', notInjected: 'error', unknown: 'idle' }

export function HomePage() {
  const { t } = usePrefs()
  const { state, info, refreshState } = useStatus()
  const { setTab } = useNav()

  const overall = overallStatus(state)
  const monitor = monitorStatus(state)
  const reason = monitorReason(state)
  const arches = supportedArches(state)
  const unknown = t('globals.unknown')

  return (
    <>
      <TopBar
        title={APP_NAME}
        subtitle={info.version || unknown}
        trailing={<IconButton icon='refresh' label='Refresh status' onClick={refreshState} />}
      />

      <section className='hero'>
        <StatusPill tone={OVERALL_TONE[overall]}>
          {overall === 'unknown' ? unknown : t(`pages.home.status.${overall}`)}
        </StatusPill>

        <div className='hero-actions'>
          <Button variant='filled' icon='play' onClick={() => setTab('actions')}>
            {t('pages.actions.title')}
          </Button>
          <Button variant='outlined' icon='modules' onClick={() => setTab('modules')}>
            {t('pages.modules.title')}
          </Button>
        </div>
      </section>

      <Card tone='strong'>
        <Caption>{t('pages.actions.monitor.title')}</Caption>
        <div className={`monitor-line tone-${MONITOR_TONE[monitor]}`}>
          <span className='tone-badge'>
            <Icon name={MONITOR_ICON[monitor]} variant='filled' />
          </span>
          <span className='monitor-value'>{t(`pages.actions.monitor.status.${monitor}`)}</span>
        </div>
        {reason ? <p className='muted'>{reason}</p> : null}
      </Card>

      <Card>
        <Caption>Zygotes</Caption>
        {arches.length === 0 ? <Row title='Zygote' value={unknown} /> : null}
        {arches.map((arch) => {
          const status = zygoteStatus(state, arch)

          return (
            <Row
              key={arch}
              title={`Zygote${arch}`}
              value={t(`pages.home.info.zygote.${status}`)}
              tone={ZYGOTE_TONE[status]}
            />
          )
        })}
      </Card>

      <Card>
        <Caption>ROM / Kernel</Caption>
        <Row title={t('pages.home.androidVersion')} value={info.androidVersion || unknown} />
        <Row title={t('pages.home.linuxKernelVersion')} value={info.kernel || unknown} />
      </Card>

      <Card>
        <Caption>Root / {APP_NAME}</Caption>
        <Row title={t('pages.home.info.version')} value={info.version || unknown} />
        <Row title={t('pages.home.info.root')} value={(state && state.root) || unknown} />
      </Card>
    </>
  )
}
