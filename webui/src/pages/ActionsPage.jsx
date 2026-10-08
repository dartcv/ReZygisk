import { Button, Caption, Card } from '../components/ui.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useStatus } from '../context/StatusContext.jsx'
import { monitorActionsFor, monitorReason, monitorStatus } from '../lib/rezygisk.js'

const MONITOR_TONE = { tracing: 'ok', stopping: 'warn', stopped: 'warn', exiting: 'error', unknown: 'idle' }

/* INFO: Button to ctl verb mapping is the same as the old WebUI: Start -> start, Pause -> stop
         (monitor stays alive), Stop -> exit (monitor quits). */
export function ActionsPage() {
  const { t } = usePrefs()
  const { state, pendingAction, runMonitor } = useStatus()

  const status = monitorStatus(state)
  const reason = monitorReason(state)
  const enabled = monitorActionsFor(status)
  const busy = pendingAction !== null

  return (
    <>
      <TopBar title={t('pages.actions.title')} />

      <Card tone='strong' className='monitor-card'>
        <Caption>{t('pages.actions.monitor.title')}</Caption>

        <div className={`monitor-status tone-${MONITOR_TONE[status]}`}>
          <span className='status-orb' aria-hidden='true' />
          <span className='monitor-status-text'>{t(`pages.actions.monitor.status.${status}`)}</span>
        </div>

        {reason ? <p className='muted'>{reason}</p> : null}

        <div className='monitor-buttons'>
          <Button variant='filled' icon='play' disabled={busy || !enabled.start} onClick={() => runMonitor('start')}>
            {t('pages.actions.monitor.button.start')}
          </Button>
          <Button variant='tonal' icon='pause' disabled={busy || !enabled.pause} onClick={() => runMonitor('stop')}>
            {t('pages.actions.monitor.button.pause')}
          </Button>
          <Button variant='danger' icon='stop' disabled={busy || !enabled.stop} onClick={() => runMonitor('exit')}>
            {t('pages.actions.monitor.button.stop')}
          </Button>
        </div>
      </Card>
    </>
  )
}
