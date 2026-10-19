import { App, PluginSettingTab, Setting, type SettingDefinitionItem, type SettingGroupItem } from 'obsidian'
import type JsonToolboxPlugin from './main'
import { SITE_URL, KO_FI_URL, t } from './i18n'

const KO_FI_BUTTON = 'https://ko-fi.com/img/githubbutton_sm.svg'

/** Official Ko-fi brand button, appended into a setting's control area. */
function appendKofiButton(controlEl: HTMLElement): void {
  controlEl.createEl(
    'a',
    {
      cls: 'json-toolbox-kofi',
      href: KO_FI_URL,
      attr: { target: '_blank', rel: 'noopener noreferrer' },
    },
    (link) => link.createEl('img', { attr: { src: KO_FI_BUTTON, alt: 'Ko-fi' } }),
  )
}

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
  /** Field name in `JsonToolboxSettings`, also used by the declarative API. */
  key: keyof JsonToolboxSettings
  nameKey: string
  descKey: string
  get: (s: JsonToolboxSettings) => boolean
  set: (s: JsonToolboxSettings, v: boolean) => void
}

/** Data-driven list so the tab can be unit-tested without the Obsidian UI. */
export const SETTINGS: SettingDef[] = [
  {
    key: 'readingModeRender',
    nameKey: 'setting.readingModeRender.name',
    descKey: 'setting.readingModeRender.desc',
    get: (s) => s.readingModeRender,
    set: (s, v) => {
      s.readingModeRender = v
    },
  },
  {
    key: 'arrayAsTable',
    nameKey: 'setting.arrayAsTable.name',
    descKey: 'setting.arrayAsTable.desc',
    get: (s) => s.arrayAsTable,
    set: (s, v) => {
      s.arrayAsTable = v
    },
  },
  {
    key: 'inlinePreviews',
    nameKey: 'setting.inlinePreviews.name',
    descKey: 'setting.inlinePreviews.desc',
    get: (s) => s.inlinePreviews,
    set: (s, v) => {
      s.inlinePreviews = v
    },
  },
  {
    key: 'expandTreeByDefault',
    nameKey: 'setting.expandTreeByDefault.name',
    descKey: 'setting.expandTreeByDefault.desc',
    get: (s) => s.expandTreeByDefault,
    set: (s, v) => {
      s.expandTreeByDefault = v
    },
  },
  {
    key: 'keepOriginalSource',
    nameKey: 'setting.keepOriginalSource.name',
    descKey: 'setting.keepOriginalSource.desc',
    get: (s) => s.keepOriginalSource,
    set: (s, v) => {
      s.keepOriginalSource = v
    },
  },
  {
    key: 'syncFenceLanguage',
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

    new Setting(containerEl).setName('JSON Toolbox').setHeading()

    // ── About ──────────────────────────────────────────────
    const about = containerEl.createDiv({ cls: 'json-toolbox-footer' })
    about.appendText(t('settings.about') + ' ')
    about.createEl('a', {
      text: SITE_URL,
      href: SITE_URL,
      attr: { target: '_blank', rel: 'noopener noreferrer' },
    })
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

    // ── Ko-fi donation (official brand button) ───────────
    const kofiSetting = new Setting(containerEl)
      .setName(t('setting.kofi.name'))
      .setDesc(t('setting.kofi.desc'))
    appendKofiButton(kofiSetting.controlEl)
  }

  /**
   * Declarative definitions used by Obsidian 1.13+ so these settings are
   * indexed by the settings search. Older versions keep using `display()`.
   */
  getSettingDefinitions(): SettingDefinitionItem[] {
    const toggles: SettingGroupItem[] = SETTINGS.map((def) => ({
      name: t(def.nameKey),
      desc: t(def.descKey),
      control: {
        type: 'toggle',
        key: def.key,
        defaultValue: def.get(DEFAULT_SETTINGS),
      },
    }))

    return [
      {
        type: 'group',
        heading: 'JSON Toolbox',
        items: [
          {
            name: 'JSON Toolbox',
            desc: t('settings.about'),
            searchable: false,
            render: (setting) => {
              setting.controlEl.createEl('a', {
                text: SITE_URL,
                href: SITE_URL,
                attr: { target: '_blank', rel: 'noopener noreferrer' },
              })
            },
          },
          ...toggles,
          {
            name: t('setting.kofi.name'),
            desc: t('setting.kofi.desc'),
            render: (setting) => appendKofiButton(setting.controlEl),
          },
        ],
      },
    ]
  }
}
