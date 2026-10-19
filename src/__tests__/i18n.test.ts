import { describe, it, expect } from 'vitest'
import { t, lang, SITE_URL } from '../i18n'

describe('i18n', () => {
  it('resolves a known key to a real (non-key) string', () => {
    const v = t('setting.readingModeRender.name')
    expect(typeof v).toBe('string')
    expect(v.length).toBeGreaterThan(0)
    expect(v).not.toBe('setting.readingModeRender.name')
  })

  it('falls back to the key when a key is missing', () => {
    expect(t('this.key.does.not.exist')).toBe('this.key.does.not.exist')
  })

  it('exposes a supported language', () => {
    expect(['zh', 'en']).toContain(lang)
  })

  it('exposes the canonical site URL', () => {
    expect(SITE_URL).toBe('https://jsontoolbox.cc')
  })
})
