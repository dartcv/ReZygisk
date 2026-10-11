export const FALLBACK_LANGUAGE = 'en_US'

function normalize(code) {
  return String(code || '').replace(/_/g, '-').toLowerCase()
}

/* INFO: WebViews expose BCP 47 tags (zh-CN, zh-Hans-CN), while Crowdin uses zh_CN.
         Respect the preferred-language order, then fall back to a supported region. */
export function matchSystemLanguage(preferred, available) {
  const options = available.map((code) => ({ code, tag: normalize(code) }))

  for (const locale of preferred) {
    const tag = normalize(locale)
    if (!tag) continue

    const exact = options.find((option) => option.tag === tag)
    if (exact) return exact.code

    const [language, ...parts] = tag.split('-')
    const region = parts.find((part) => /^[a-z]{2}$|^\d{3}$/.test(part))
    const regional = region && options.find((option) => option.tag === `${language}-${region}`)
    if (regional) return regional.code

    const related = options.find((option) => option.tag.split('-')[0] === language)
    if (related) return related.code
  }

  return FALLBACK_LANGUAGE
}

export function systemLanguages() {
  return navigator.languages?.length ? Array.from(navigator.languages) : [navigator.language]
}
