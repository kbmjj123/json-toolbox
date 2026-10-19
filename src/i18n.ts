import { moment } from 'obsidian'

export const SITE_URL = 'https://jsontoolbox.cc'
export const KO_FI_URL = 'https://ko-fi.com/kbmjj123'

export type Lang = 'zh' | 'en'

function detectLang(): Lang {
  let locale = ''
  try {
    if (typeof moment !== 'undefined' && typeof moment.locale === 'function') {
      locale = moment.locale() ?? ''
    }
  } catch {
    // moment unavailable — fall back to navigator below
  }
  if (!locale && typeof navigator !== 'undefined' && navigator.language) {
    locale = navigator.language
  }
  return locale.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const lang: Lang = detectLang()

type Dict = Record<string, string>

const zh: Dict = {
  'settings.about':
    '在 Obsidian 里查看和格式化 JSON/YAML 的丰富工具。完整在线版含 30+ JSON 工具。所有处理都在本地完成，无遥测。',
  'setting.readingModeRender.name': '阅读模式自动渲染',
  'setting.readingModeRender.desc':
    '在阅读模式下，把 ```json / ```yaml 代码块自动渲染为富树/表格；关闭后代码块保持源码。',
  'setting.arrayAsTable.name': '对象数组渲染为表格',
  'setting.arrayAsTable.desc':
    '当 JSON 是「对象的数组」（例如 [{"name":...}, ...]）时，用表格展示而不是树。',
  'setting.inlinePreviews.name': '内联资源预览',
  'setting.inlinePreviews.desc':
    '在值旁显示图片缩略图、颜色色块、可点击链接、时间戳/JWT/Base64 解码等；关闭则只显示纯文本。',
  'setting.expandTreeByDefault.name': '富树默认展开',
  'setting.expandTreeByDefault.desc': '阅读模式下的富树默认全部展开；否则默认折叠，点击箭头再展开。',
  'setting.keepOriginalSource.name': '保留原始源码',
  'setting.keepOriginalSource.desc': '在预览下方用折叠区保留原始 JSON/YAML，方便复制；关闭后只显示预览。',
  'setting.syncFenceLanguage.name': '转换时同步代码块语言',
  'setting.syncFenceLanguage.desc':
    '编辑模式下运行「格式化 / JSON↔YAML」时，自动把 ``` 后的语言标识同步成 json 或 yaml。',

  'setting.kofi.name': '支持作者',
  'setting.kofi.desc': '如果这个工具对你有用，欢迎在 Ko-fi 上请我喝杯咖啡 ☕',

  'notice.noInput': '请把光标放在 JSON 代码块内，或选中一段 JSON',
  'notice.noActiveEditor': '没有活动的编辑器',
  'notice.validJson': '✓ JSON 合法',
  'notice.invalidJson': '✗ 无效的 JSON：',
  'notice.convertedTo': '已转换：',
  'notice.done': '✓ 完成',
  'notice.error': '✗ ',

  'raw.title': '原始 ',

  'modal.invalidJson': '无效的 JSON：',
  'modal.cannotBuildTable': '无法生成表格：',
}

const en: Dict = {
  'settings.about':
    'Rich JSON/YAML viewing and formatting inside Obsidian. The full online version has 30+ JSON tools. All processing is local; no telemetry.',
  'setting.readingModeRender.name': 'Auto-render in reading mode',
  'setting.readingModeRender.desc':
    'In reading mode, ```json / ```yaml code blocks render as a rich tree/table automatically; off keeps the raw source.',
  'setting.arrayAsTable.name': 'Arrays of objects as table',
  'setting.arrayAsTable.desc':
    'When JSON is an array of objects (e.g. [{"name":...}, ...]), show it as a table instead of a tree.',
  'setting.inlinePreviews.name': 'Inline media previews',
  'setting.inlinePreviews.desc':
    'Show image thumbnails, colour swatches, clickable links, timestamps/JWT/Base64 decodes beside values; off shows plain text only.',
  'setting.expandTreeByDefault.name': 'Expand tree by default',
  'setting.expandTreeByDefault.desc':
    'In reading mode the tree starts fully expanded; otherwise collapsed, expand with the arrows.',
  'setting.keepOriginalSource.name': 'Keep original source',
  'setting.keepOriginalSource.desc':
    'Keep the original JSON/YAML in a collapsible section under the preview; off shows only the preview.',
  'setting.syncFenceLanguage.name': 'Sync fence language on convert',
  'setting.syncFenceLanguage.desc':
    'When formatting or converting in editing mode, also rewrite the ``` language tag to json or yaml.',

  'setting.kofi.name': 'Support the author',
  'setting.kofi.desc': 'If this tool is helpful, you can buy me a coffee on Ko-fi ☕',

  'notice.noInput': 'Place the cursor inside a JSON code block, or select some JSON',
  'notice.noActiveEditor': 'No active editor',
  'notice.validJson': '✓ Valid JSON',
  'notice.invalidJson': '✗ Invalid JSON: ',
  'notice.convertedTo': 'Converted ',
  'notice.done': '✓ Done',
  'notice.error': '✗ ',

  'raw.title': 'Raw ',

  'modal.invalidJson': 'Invalid JSON: ',
  'modal.cannotBuildTable': 'Cannot build table: ',
}

export function t(key: string): string {
  const dict = lang === 'zh' ? zh : en
  return dict[key] ?? en[key] ?? key
}
