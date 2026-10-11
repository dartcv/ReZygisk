import assert from 'node:assert/strict'
import test from 'node:test'
import { matchSystemLanguage } from './locale.js'

const available = ['ar_EG', 'de_DE', 'en_US', 'es_AR', 'ja_JP', 'pt_BR', 'zh_CN']

test('matches WebView tags and Crowdin locale names, including script subtags', () => {
  assert.equal(matchSystemLanguage(['zh-CN'], available), 'zh_CN')
  assert.equal(matchSystemLanguage(['ZH_hans_CN'], available), 'zh_CN')
  assert.equal(matchSystemLanguage(['pt-BR'], available), 'pt_BR')
  assert.equal(matchSystemLanguage(['zh-Hant-TW'], ['zh_CN', 'zh_TW', 'en_US']), 'zh_TW')
})

test('honors the preferred-language order and uses available regional translations', () => {
  assert.equal(matchSystemLanguage(['fr-FR', 'ja-JP', 'en-US'], available), 'ja_JP')
  assert.equal(matchSystemLanguage(['en-GB', 'zh-CN'], available), 'en_US')
  assert.equal(matchSystemLanguage(['es-MX'], available), 'es_AR')
  assert.equal(matchSystemLanguage(['ar-SA'], available), 'ar_EG')
  assert.equal(matchSystemLanguage(['zh-Hant-TW'], available), 'zh_CN')
})

test('uses English if preferences are absent or no translation is supported', () => {
  assert.equal(matchSystemLanguage([], available), 'en_US')
  assert.equal(matchSystemLanguage(['fr-FR', 'nb-NO'], available), 'en_US')
  assert.equal(matchSystemLanguage([undefined, ''], available), 'en_US')
  assert.equal(matchSystemLanguage(['zh-CN'], []), 'en_US')
})
