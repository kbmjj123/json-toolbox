import { describe, it, expect } from 'vitest'
import {
  SETTINGS,
  DEFAULT_SETTINGS,
  JsonToolboxSettingTab,
  type JsonToolboxSettings,
} from '../settings'
import type { App, SettingDefinitionGroup } from 'obsidian'
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

  it('exposes a declarative definition per toggle (Obsidian 1.13+ search)', () => {
    const tab = new JsonToolboxSettingTab({} as App, {
      settings: { ...DEFAULT_SETTINGS },
    } as never)
    const [group] = tab.getSettingDefinitions() as SettingDefinitionGroup[]
    expect(group.heading).toBe('JSON Toolbox')

    const controls = (group.items ?? []) as unknown as {
      name: string
      desc?: string
      control: { key: string }
    }[]

    SETTINGS.forEach((def) => {
      const item = controls.find((child) => child.control?.key === def.key)
      expect(item).toBeTruthy()
      expect(item?.name).toBe(t(def.nameKey))
      expect(item?.desc).toBe(t(def.descKey))
    })
  })
})
