import { Card, ExternalLink, Group, Row, Switch } from '../components/ui.jsx'
import { TopBar } from '../components/TopBar.jsx'
import { usePrefs } from '../context/PrefsContext.jsx'
import { useNav } from '../context/NavContext.jsx'
import { useStatus } from '../context/StatusContext.jsx'
import backgroundNotices from '../../public/THIRD_PARTY_NOTICES.txt?raw'

/* INFO: The lang files name the system theme "system_based", while the stored mode is "system". */
const THEME_KEY = { amoled: 'amoled', dark: 'dark', light: 'light', system: 'system_based' }

/* INFO: "orginalDevelopers" is spelled that way in the translation files. Keep the key unchanged. */
function CreditBlock({ label, children }) {
  return (
    <div className='credit-block'>
      <p className='caption'>{label}</p>
      <div className='credit-names'>{children}</div>
    </div>
  )
}

export function SettingsPage() {
  const { t, languageMode, languageName, themeMode, config, setFullscreenEnabled, setSystemFont } = usePrefs()
  const { openSub } = useNav()
  const { info } = useStatus()

  return (
    <>
      <TopBar title={t('pages.settings.title')} />

      <Group>
        <Row
          icon='language'
          title={t('pages.settings.language.title')}
          description={t('pages.settings.language.description')}
          value={languageMode === 'system' ? `${t('pages.mini_settings_language.system')} · ${languageName}` : languageName}
          onClick={() => openSub('language')}
        />
        <Row
          icon='palette'
          title={t('pages.settings.theme.title')}
          description={t('pages.settings.theme.description')}
          value={t(`pages.mini_settings_theme.theme.${THEME_KEY[themeMode]}`)}
          onClick={() => openSub('theme')}
        />
      </Group>

      <Group>
        <Row
          icon='fullscreen'
          title={t('pages.settings.fullscreen.title')}
          description={t('pages.settings.fullscreen.description')}
          trailing={(
            <Switch
              label={t('pages.settings.fullscreen.title')}
              checked={config.disableFullscreen}
              onChange={(disabled) => setFullscreenEnabled(!disabled)}
            />
          )}
        />
        <Row
          icon='font'
          title={t('pages.settings.font.title')}
          description={t('pages.settings.font.description')}
          trailing={(
            <Switch
              label={t('pages.settings.font.title')}
              checked={config.enableSystemFont}
              onChange={setSystemFont}
            />
          )}
        />
      </Group>

      <Card className='credits'>
        <CreditBlock label={t('pages.settings.moduleDevelopers')}>
          <ExternalLink url='https://github.com/PerformanC'>The PerformanC Organization</ExternalLink>
        </CreditBlock>

        <CreditBlock label={t('pages.settings.orginalDevelopers')}>
          <ExternalLink url='https://github.com/Dr-TSNG'>Nullptr</ExternalLink>
          <span className='credit-sep'>,</span>
          <ExternalLink url='https://github.com/5ec1cff'>5ec1cff</ExternalLink>
        </CreditBlock>

        <CreditBlock label={t('pages.settings.WebUIDevelopers')}>
          <ExternalLink url='https://github.com/ThePedroo'>ThePedroo</ExternalLink>
          <span className='credit-sep'>,</span>
          <ExternalLink url='https://github.com/RainyXeon'>RainyXeon</ExternalLink>
        </CreditBlock>

        <CreditBlock label={t('pages.settings.moduleLicense')}>
          <span className='credit-text'>AGPL 3</span>
        </CreditBlock>

        <CreditBlock label={t('pages.settings.backgroundCredits')}>
          <ExternalLink url='https://github.com/tengbao/vanta'>Vanta Waves · Teng Bao</ExternalLink>
          <span className='credit-sep'>/</span>
          <ExternalLink url='https://github.com/mrdoob/three.js'>Three.js</ExternalLink>
          <span className='credit-text'>MIT</span>
        </CreditBlock>

        <details className='background-license'>
          <summary>{t('pages.settings.backgroundLicense')}</summary>
          <p>{t('pages.settings.backgroundPermission')}</p>
          <pre>{backgroundNotices}</pre>
        </details>
      </Card>

      {info.version ? <p className='footnote'>ReZygisk {info.version}</p> : null}
    </>
  )
}
