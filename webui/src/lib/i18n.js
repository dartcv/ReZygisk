import { commands } from './commands.js'
import { exec } from './ksu.js'

export { FALLBACK_LANGUAGE } from './locale.js'

// Build the default list from shipped files so detection works before the device responds.
export const BUNDLED_LANGUAGES = Object.keys(import.meta.glob('../../public/lang/*.json', {
  eager: true,
  import: 'langName',
})).map((path) => path.split('/').pop().replace(/\.json$/, ''))

/* INFO: Only these language prefixes are written right to left. */
const RTL_PREFIXES = ['ar', 'fa', 'he', 'ur']
const LANGUAGE_FILE = /^[A-Za-z0-9_-]+\.json$/

export function isRtl(code) {
  return RTL_PREFIXES.includes(String(code).split(/[_-]/)[0])
}

/* INFO: Translation files are the Crowdin output. They are loaded as-is, so the key layout
         (pages.*, globals.*) must stay the same. */
export async function loadLanguage(code) {
  const response = await fetch(`lang/${code}.json`)
  if (!response.ok) throw new Error(`Language ${code} is not available (HTTP ${response.status})`)

  return response.json()
}

/* INFO: The list comes from the device, so languages added to the module show up without a
         rebuild of the UI. */
export async function listLanguages() {
  const result = await exec(commands.languages)
  if (result.errno !== 0) throw new Error('Could not list the language files')

  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((file) => LANGUAGE_FILE.test(file))
    .map((file) => file.replace(/\.json$/, ''))
}

function lookup(dictionary, path) {
  return path.split('.').reduce((node, key) => (node && typeof node === 'object' ? node[key] : undefined), dictionary)
}

/* INFO: Missing keys fall back to English, and a key missing everywhere is shown as its path,
         which makes gaps easy to spot. */
export function createTranslator(dictionary, fallback) {
  return (path) => {
    const value = lookup(dictionary, path) ?? lookup(fallback, path)

    return typeof value === 'string' ? value : path
  }
}
