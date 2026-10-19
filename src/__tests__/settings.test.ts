import { describe, it, expect } from 'vitest'
import { SETTINGS, DEFAULT_SETTINGS, type JsonToolboxSettings } from '../settings'
import { t } from '../i18n'

describe('JsonToolboxSettings', () => {
  it('has sensible, safe defaults', () => {
    expect(DEFAULT_SETTINGS.readingModeRender).toBe(true)
    expect(DEFAULT_SETTINGS.arrayAsTable).toBe(true)
    expect(DEFAULT_SETTINGS.inlinePreviews).toBe(true)
    expect(DEFAULT_SETTINGS.expandTreeByDefault).toBe(false)
    expect(DEFAULT_SETTINGS.keepOriginalSource).toBe(true)
    expect(DEFAULT_SETTINGS.syncFenceLanguage).toBe(true)
  })

  it('exposes six toggles, each key resolvable to a real string', () => {
    expect(SETTINGS.length).toBe(6)
    SETTINGS.forEach((def) => {
      const name = t(def.nameKey)
      const desc = t(def.descKey)
      expect(typeof name).toBe('string')
      expect(name.length).toBeGreaterThan(0)
      expect(name).not.toBe(def.nameKey)
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })
  })

  it('wires each toggle getter/setter to its field', () => {
    SETTINGS.forEach((def) => {
      const s: JsonToolboxSettings = { ...DEFAULT_SETTINGS }
      const before = def.get(s)
      def.set(s, !before)
      expect(def.get(s)).toBe(!before)
    })
  })
})
