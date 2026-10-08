import { useEffect, useMemo, useState } from 'react'
import { Avatar, Card } from '../components/ui.jsx'
import { Icon } from '../components/Icon.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useStatus } from '../context/StatusContext.jsx'
import { commands } from '../lib/commands.js'
import { exec } from '../lib/ksu.js'
import { collectModules } from '../lib/rezygisk.js'

/* INFO: Module names come from each module's module.prop. They load after the list is known,
         and the ID is shown until then. */
function useModuleNames(modules) {
  const [names, setNames] = useState({})
  const key = modules.map((module) => module.id).join(',')

  useEffect(() => {
    let alive = true
    const ids = key ? key.split(',') : []

    Promise.all(ids.map((id) => {
      const command = commands.moduleName(id)
      if (!command) return Promise.resolve([id, ''])

      return exec(command).then(
        (result) => [id, result.errno === 0 ? result.stdout.trim() : ''],
        () => [id, ''],
      )
    })).then((pairs) => {
      if (!alive) return

      setNames(pairs.reduce((all, [id, name]) => {
        all[id] = name
        return all
      }, {}))
    })

    return () => {
      alive = false
    }
  }, [key])

  return names
}

export function ModulesPage() {
  const { t } = usePrefs()
  const { state } = useStatus()
  const modules = useMemo(() => collectModules(state), [state])
  const names = useModuleNames(modules)

  return (
    <>
      <TopBar title={t('pages.modules.title')} />

      {modules.length === 0 ? (
        /* INFO: The key is spelled "notAvaliable" in every translation file. Keep the spelling, or the translated text stops loading. */
        <Card className='empty-card'>
          <Icon name='modules' variant='filled' />
          <p>{t('pages.modules.notAvaliable')}</p>
        </Card>
      ) : (
        <div className='module-list'>
          {modules.map((module) => {
            const name = names[module.id] || module.id

            return (
              <Card key={module.id} className='module-card'>
                <Avatar label={name} seed={module.id} />
                <div className='module-text'>
                  <span className='row-title'>{name}</span>
                  <span className='module-id'>{module.id}</span>
                  <span className='module-arch'>{t('pages.modules.arch')}{module.arches.join(' / ')}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
