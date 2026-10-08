import { commands } from './commands.js'

/* INFO: Answers for a plain browser (desktop preview, no `ksu` object). Monitor commands change
         the mock state, so the Actions buttons can be tried without a device. */
const LANGUAGE_FILES = [
  'ar_EG.json', 'de_DE.json', 'en_US.json', 'es_AR.json', 'id_ID.json', 'it_IT.json',
  'ja_JP.json', 'ko_KR.json', 'pl_PL.json', 'pt_BR.json', 'ru_RU.json', 'tr_TR.json',
  'uk_UA.json', 'vi_VN.json', 'zh_CN.json',
]

const MODULE_NAMES = {
  zygisk_lsposed: 'Zygisk - LSPosed',
  shamiko: 'Shamiko',
}

const mock = { monitor: '0' }

function mockState() {
  const modules = Object.keys(MODULE_NAMES)
  const monitor = { state: mock.monitor }
  if (mock.monitor !== '0') monitor.reason = 'user requested'

  return JSON.stringify({
    root: 'KernelSU',
    monitor,
    rezygiskd: {
      64: { state: 1, modules },
      32: { state: 1, modules },
    },
    zygote: { 64: 1, 32: 1 },
  })
}

function ok(stdout) {
  return { errno: 0, stdout, stderr: '' }
}

function runMonitor(action) {
  if (action === 'start') mock.monitor = '0'
  if (action === 'stop') mock.monitor = '2'
  if (action === 'exit') {
    mock.monitor = '3'
    setTimeout(() => {
      mock.monitor = '2'
    }, 1200)
  }

  return ok('')
}

function respond(command) {
  if (command === commands.state) return ok(mockState())
  if (command === commands.moduleProp) return ok('id=rezygisk\nname=ReZygisk\nversion=v1.0.0 (551-5b0a02b-release)\nversionCode=551\n')
  if (command === commands.kernel) return ok('4.19.325-DeepMoonX-d8a7145-128')
  if (command === commands.androidVersion) return ok('14')
  if (command === commands.languages) return ok(LANGUAGE_FILES.join('\n'))

  const monitor = /zygisk-ptrace64 ctl (start|stop|exit)$/.exec(command)
  if (monitor) return runMonitor(monitor[1])

  const moduleProp = /\/data\/adb\/modules\/([A-Za-z0-9._-]+)\/module\.prop/.exec(command)
  if (moduleProp && command.includes("grep '^name='")) {
    return ok(MODULE_NAMES[moduleProp[1]] ? `${MODULE_NAMES[moduleProp[1]]}\n` : '')
  }

  return { errno: -1, stdout: '', stderr: 'Command not found in development response' }
}

export function devExec(command) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(respond(command)), 120)
  })
}
