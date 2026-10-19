import { describe, it, expect } from 'vitest'
import { SETTINGS, DEFAULT_SETTINGS, type JsonToolboxSettings } from '../settings'

describe('JsonToolboxSettings', () => {
  it('has sensible, safe defaults', () => {
    expect(DEFAULT_SETTINGS.readingModeRender).toBe(true)
    expect(DEFAULT_SETTINGS.arrayAsTable).toBe(true)
    expect(DEFAULT_SETTINGS.inlinePreviews).toBe(true)
    expect(DEFAULT_SETTINGS.expandTreeByDefault).toBe(false)
    expect(DEFAULT_SETTINGS.keepOriginalSource).toBe(true)
    expect(DEFAULT_SETTINGS.syncFenceLanguage).toBe(true)
  })

  it('exposes six toggles, one per behaviour, wired to its field', () => {
    expect(SETTINGS.length).toBe(6)
    expect(SETTINGS.map((s) => s.name)).toEqual([
      '阅读模式自动渲染',
      '对象数组渲染为表格',
      '内联资源预览',
      '富树默认展开',
      '保留原始源码',
      '转换时同步代码块语言',
    ])

    // Flipping each toggle through its setter flips exactly that field.
    SETTINGS.forEach((def) => {
      const s: JsonToolboxSettings = { ...DEFAULT_SETTINGS }
      const before = def.get(s)
      def.set(s, !before)
      expect(def.get(s)).toBe(!before)
    })
  })
})
