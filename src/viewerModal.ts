import { Modal } from 'obsidian'
import { buildTree, parseJson } from './jsonTree'
import { renderTree, renderTable } from './treeView'
import { toTable } from './commands'
import { SITE_URL, t } from './i18n'

export type ViewerMode = 'tree' | 'table'

export class JsonViewerModal extends Modal {
  private readonly input: string
  private readonly mode: ViewerMode

  constructor(app: unknown, input: string, mode: ViewerMode = 'tree') {
    super(app as never)
    this.input = input
    this.mode = mode
  }

  onOpen(): void {
    this.titleEl.setText('JSON Toolbox')
    this.contentEl.classList.add('json-toolbox-modal')

    const parsed = parseJson(this.input.trim())
    if (!parsed.ok) {
      this.contentEl.createEl('div', {
        cls: 'json-toolbox-error',
        text: t('modal.invalidJson') + parsed.error,
      })
      this.appendFooter()
      return
    }

    const body = this.contentEl.createDiv({ cls: 'json-toolbox-body' })

    if (this.mode === 'table') {
      const table = toTable(this.input)
      if (table.ok) renderTable(body, table.headers, table.rows)
      else body.textContent = t('modal.cannotBuildTable') + table.error
    } else {
      renderTree(body, buildTree(parsed.root))
    }

    this.appendFooter()
  }

  onClose(): void {
    this.contentEl.empty()
  }

  private appendFooter(): void {
    const footer = this.contentEl.createDiv({ cls: 'json-toolbox-footer' })
    footer.appendText('Powered by ')
    footer.createEl('a', {
      href: SITE_URL,
      text: 'JSON Toolbox',
      attr: { target: '_blank', rel: 'noopener noreferrer' },
    })
    footer.appendText(' · jsontoolbox.cc')
  }
}
