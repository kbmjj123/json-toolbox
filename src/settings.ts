import { App, PluginSettingTab, Setting } from 'obsidian'
import type JsonToolboxPlugin from './main'
import { SITE_URL, t } from './i18n'

export interface JsonToolboxSettings {
  /** Reading mode: auto-render ```json / ```yaml blocks as a rich tree/table. */
  readingModeRender: boolean
  /** Render arrays of plain objects as a table instead of a tree. */
  arrayAsTable: boolean
  /** Show inline media previews: image, colour, link, timestamp, jwt, base64... */
  inlinePreviews: boolean
  /** Expand every collapsible node on first render. */
  expandTreeByDefault: boolean
  /** Keep the original JSON/YAML in a collapsed section under the preview. */
  keepOriginalSource: boolean
  /** Sync the fence language (```json / ```yaml) when formatting or converting. */
  syncFenceLanguage: boolean
}

export const DEFAULT_SETTINGS: JsonToolboxSettings = {
  readingModeRender: true,
  arrayAsTable: true,
  inlinePreviews: true,
  expandTreeByDefault: false,
  keepOriginalSource: true,
  syncFenceLanguage: true,
}

export interface SettingDef {
  nameKey: string
  descKey: string
  get: (s: JsonToolboxSettings) => boolean
  set: (s: JsonToolboxSettings, v: boolean) => void
}

/** Data-driven list so the tab can be unit-tested without the Obsidian UI. */
export const SETTINGS: SettingDef[] = [
  {
    nameKey: 'setting.readingModeRender.name',
    descKey: 'setting.readingModeRender.desc',
    get: (s) => s.readingModeRender,
    set: (s, v) => {
      s.readingModeRender = v
    },
  },
  {
    nameKey: 'setting.arrayAsTable.name',
    descKey: 'setting.arrayAsTable.desc',
    get: (s) => s.arrayAsTable,
    set: (s, v) => {
      s.arrayAsTable = v
    },
  },
  {
    nameKey: 'setting.inlinePreviews.name',
    descKey: 'setting.inlinePreviews.desc',
    get: (s) => s.inlinePreviews,
    set: (s, v) => {
      s.inlinePreviews = v
    },
  },
  {
    nameKey: 'setting.expandTreeByDefault.name',
    descKey: 'setting.expandTreeByDefault.desc',
    get: (s) => s.expandTreeByDefault,
    set: (s, v) => {
      s.expandTreeByDefault = v
    },
  },
  {
    nameKey: 'setting.keepOriginalSource.name',
    descKey: 'setting.keepOriginalSource.desc',
    get: (s) => s.keepOriginalSource,
    set: (s, v) => {
      s.keepOriginalSource = v
    },
  },
  {
    nameKey: 'setting.syncFenceLanguage.name',
    descKey: 'setting.syncFenceLanguage.desc',
    get: (s) => s.syncFenceLanguage,
    set: (s, v) => {
      s.syncFenceLanguage = v
    },
  },
]

export class JsonToolboxSettingTab extends PluginSettingTab {
  plugin: JsonToolboxPlugin

  constructor(app: App, plugin: JsonToolboxPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    containerEl.createEl('h2', { text: 'JSON Toolbox' })

    // ── About ──────────────────────────────────────────────
    const about = containerEl.createDiv({ cls: 'json-toolbox-footer' })
    about.appendText(t('settings.about') + ' ')
    const link = about.createEl('a', { text: SITE_URL, href: SITE_URL })
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    containerEl.createEl('hr')

    // ── Toggles ────────────────────────────────────────────
    for (const def of SETTINGS) {
      new Setting(containerEl)
        .setName(t(def.nameKey))
        .setDesc(t(def.descKey))
        .addToggle((toggle) =>
          toggle.setValue(def.get(this.plugin.settings)).onChange(async (v) => {
            def.set(this.plugin.settings, v)
            await this.plugin.saveSettings()
          }),
        )
    }
  }
}
