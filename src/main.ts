import { Notice, Plugin } from 'obsidian'
import { JsonViewerModal } from './viewerModal'
import { JsonToolboxSettingTab } from './settings'
import { formatJson, validateJson, toggleJsonYaml } from './commands'
import { extractJsonFromText, codeBlockAtLine } from './editorInput'

const NO_INPUT = 'Select JSON, or place the cursor inside a JSON code block'
const NO_SELECTION = 'Select the text you want to transform first'

type TransformResult =
  | { ok: true; output: string; notice?: string }
  | { ok: false; error: string }

export default class JsonToolboxPlugin extends Plugin {
  onload(): void {
    this.addCommand({
      id: 'open-json-viewer',
      name: 'Open JSON Viewer',
      callback: () => {
        const input = this.readJsonInput()
        if (!input) {
          new Notice(NO_INPUT)
          return
        }
        new JsonViewerModal(this.app, input, 'tree').open()
      },
    })

    this.addCommand({
      id: 'format-json',
      name: 'Format JSON',
      callback: () => this.transformSelection((text) => formatJson(text)),
    })

    this.addCommand({
      id: 'validate-json',
      name: 'Validate JSON',
      callback: () => {
        const input = this.readJsonInput()
        if (!input) {
          new Notice(NO_INPUT)
          return
        }
        const result = validateJson(input)
        new Notice(result.ok ? '✓ Valid JSON' : `✗ ${result.error}`)
      },
    })

    this.addCommand({
      id: 'json-yaml-toggle',
      name: 'JSON ↔ YAML',
      callback: () => {
        this.transformSelection((text) => {
          const result = toggleJsonYaml(text)
          return result.ok
            ? { ok: true, output: result.output, notice: `Converted ${result.direction}` }
            : { ok: false, error: result.error }
        })
      },
    })

    this.addCommand({
      id: 'json-to-table',
      name: 'JSON → Table/CSV',
      callback: () => {
        const input = this.readJsonInput()
        if (!input) {
          new Notice(NO_INPUT)
          return
        }
        new JsonViewerModal(this.app, input, 'table').open()
      },
    })

    this.addSettingTab(new JsonToolboxSettingTab(this.app as never, this))
  }

  onunload(): void {
    // nothing to dispose
  }

  /**
   * JSON for read-only commands: the selection if there is one, otherwise the
   * code block the cursor sits in. Never falls back to the whole document —
   * that is Markdown and would always fail to parse.
   */
  private readJsonInput(): string | null {
    const editor = this.app.workspace.activeEditor?.editor
    if (!editor) return null

    const selected = editor.getSelection()
    if (selected && selected.trim()) return extractJsonFromText(selected)

    const block = codeBlockAtLine(editor.getValue(), editor.getCursor().line)
    return block ? extractJsonFromText(block) : null
  }

  /** Commands that rewrite text need a real selection to know what to replace. */
  private transformSelection(transform: (text: string) => TransformResult): void {
    const editor = this.app.workspace.activeEditor?.editor
    if (!editor) {
      new Notice('No active editor')
      return
    }

    const selected = editor.getSelection()
    if (!selected || !selected.trim()) {
      new Notice(NO_SELECTION)
      return
    }

    const input = extractJsonFromText(selected)
    if (!input) {
      new Notice(NO_SELECTION)
      return
    }

    const result = transform(input)
    if (!result.ok) {
      new Notice(`✗ ${result.error}`)
      return
    }

    editor.replaceSelection(result.output)
    new Notice(result.notice ?? '✓ Done')
  }
}
