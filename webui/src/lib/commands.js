import { isSafeModuleId, shellQuote } from './shell.js'

export const MODULE_DIR = '/data/adb/modules/rezygisk'
export const DATA_DIR = '/data/adb/rezygisk'
export const ERROR_LOG = `${DATA_DIR}/webui_error.log`

/* INFO: Same control verbs as the C ptracer (loader/src/ptracer/main.c). */
export const MONITOR_ACTIONS = ['start', 'stop', 'exit']

export const commands = {
  state: `/system/bin/cat ${DATA_DIR}/state.json`,
  moduleProp: `/system/bin/cat ${MODULE_DIR}/module.prop`,
  kernel: '/system/bin/uname -r',
  androidVersion: '/system/bin/getprop ro.build.version.release',
  languages: `/system/bin/ls ${MODULE_DIR}/webroot/lang`,

  monitor(action) {
    if (!MONITOR_ACTIONS.includes(action)) throw new Error(`Unknown monitor action: ${action}`)

    return `${MODULE_DIR}/bin/zygisk-ptrace64 ctl ${action}`
  },

  moduleName(id) {
    if (!isSafeModuleId(id)) return null

    const propPath = shellQuote(`/data/adb/modules/${id}/module.prop`)

    return `/system/bin/grep '^name=' ${propPath} | /system/bin/cut -d '=' -f 2-`
  },

  openUrl(url) {
    return `am start -a android.intent.action.VIEW -d ${shellQuote(url)}`
  },

  writeLog(text) {
    return `printf '%s\\n' ${shellQuote(text)} > ${shellQuote(ERROR_LOG)}`
  },
}
