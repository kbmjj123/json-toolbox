import { App, PluginSettingTab, Setting } from 'obsidian'
import type JsonToolboxPlugin from './main'
import { SITE_URL } from './viewerModal'

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
  name: string
  desc: string
  get: (s: JsonToolboxSettings) => boolean
  set: (s: JsonToolboxSettings, v: boolean) => void
}

/** Data-driven list so the tab can be unit-tested without the Obsidian UI. */
export const SETTINGS: SettingDef[] = [
  {
    name: '阅读模式自动渲染',
    desc: '在阅读模式下，把 ```json / ```yaml 代码块自动渲染为富树/表格；关闭后代码块保持源码。',
    get: (s) => s.readingModeRender,
    set: (s, v) => {
      s.readingModeRender = v
    },
  },
  {
    name: '对象数组渲染为表格',
    desc: '当 JSON 是「对象的数组」（例如 [{"name":...}, ...]）时，用表格展示而不是树。',
    get: (s) => s.arrayAsTable,
    set: (s, v) => {
      s.arrayAsTable = v
    },
  },
  {
    name: '内联资源预览',
    desc: '在值旁显示图片缩略图、颜色色块、可点击链接、时间戳/JWT/Base64 解码等；关闭则只显示纯文本。',
    get: (s) => s.inlinePreviews,
    set: (s, v) => {
      s.inlinePreviews = v
    },
  },
  {
    name: '富树默认展开',
    desc: '阅读模式下的富树默认全部展开；否则默认折叠，点击箭头再展开。',
    get: (s) => s.expandTreeByDefault,
    set: (s, v) => {
      s.expandTreeByDefault = v
    },
  },
  {
    name: '保留原始源码',
    desc: '在预览下方用折叠区保留原始 JSON/YAML，方便复制；关闭后只显示预览。',
    get: (s) => s.keepOriginalSource,
    set: (s, v) => {
      s.keepOriginalSource = v
    },
  },
  {
    name: '转换时同步代码块语言',
    desc: '编辑模式下运行「格式化 / JSON↔YAML」时，自动把 ``` 后的语言标识同步成 json 或 yaml。',
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
    about.appendText('Rich JSON/YAML viewing and formatting inside Obsidian. ')
    const link = about.createEl('a', { text: SITE_URL, href: SITE_URL })
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    about.appendText(
      ' — the full online version with 30+ JSON tools. All processing happens locally; no telemetry.',
    )
    containerEl.createEl('hr')

    // ── Toggles ────────────────────────────────────────────
    for (const def of SETTINGS) {
      new Setting(containerEl)
        .setName(def.name)
        .setDesc(def.desc)
        .addToggle((t) =>
          t.setValue(def.get(this.plugin.settings)).onChange(async (v) => {
            def.set(this.plugin.settings, v)
            await this.plugin.saveSettings()
          }),
        )
    }
  }
}
