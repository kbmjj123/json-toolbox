import { Notice, Plugin } from 'obsidian'
import { JsonViewerModal } from './viewerModal'
import { JsonToolboxSettingTab } from './settings'
import { formatJson, validateJson, toggleJsonYaml } from './commands'
import { extractJsonFromText, codeBlockRangeAtLine } from './editorInput'
import { registerJsonCodeBlocks } from './jsonCodeBlock'

const NO_INPUT = 'Place the cursor inside a JSON code block, or select some JSON'

type TransformResult =
  | { ok: true; output: string; notice?: string; language?: string }
  | { ok: false; error: string }

export default class JsonToolboxPlugin extends Plugin {
  onload(): void {
    // Reading mode: ```json / ```yaml blocks render as a rich tree automatically.
    registerJsonCodeBlocks(this)

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
      callback: () => {
        this.transform((text) => {
          const result = formatJson(text)
          return result.ok ? { ...result, language: 'json' } : result
        })
      },
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
        this.transform((text) => {
          const result = toggleJsonYaml(text)
          return result.ok
            ? {
                ok: true,
                output: result.output,
                notice: `Converted ${result.direction}`,
                language: result.direction === 'json→yaml' ? 'yaml' : 'json',
              }
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

    const range = codeBlockRangeAtLine(editor.getValue(), editor.getCursor().line)
    return range ? extractJsonFromText(range.content) : null
  }

  /**
   * Rewrite JSON in place. With a selection it replaces the selection; with no
   * selection it rewrites the code block the cursor is in, and updates the
   * fence language so syntax highlighting still matches the content.
   */
  private transform(transform: (text: string) => TransformResult): void {
    const editor = this.app.workspace.activeEditor?.editor
    if (!editor) {
      new Notice('No active editor')
      return
    }

    const selected = editor.getSelection()
    if (selected && selected.trim()) {
      const input = extractJsonFromText(selected)
      if (!input) {
        new Notice(NO_INPUT)
        return
      }
      const result = transform(input)
      if (!result.ok) {
        new Notice(`✗ ${result.error}`)
        return
      }
      editor.replaceSelection(result.output)
      new Notice(result.notice ?? '✓ Done')
      return
    }

    const range = codeBlockRangeAtLine(editor.getValue(), editor.getCursor().line)
    if (!range) {
      new Notice(NO_INPUT)
      return
    }

    const input = extractJsonFromText(range.content)
    if (!input) {
      new Notice(NO_INPUT)
      return
    }

    const result = transform(input)
    if (!result.ok) {
      new Notice(`✗ ${result.error}`)
      return
    }

    const lastContentLine = range.endLine - 1
    editor.replaceRange(
      result.output,
      { line: range.startLine + 1, ch: 0 },
      { line: lastContentLine, ch: editor.getLine(lastContentLine).length },
    )

    if (result.language) {
      const fenceLine = editor.getLine(range.startLine)
      if (fenceLine.trimStart().startsWith('```')) {
        editor.replaceRange(
          `\`\`\`${result.language}`,
          { line: range.startLine, ch: 0 },
          { line: range.startLine, ch: fenceLine.length },
        )
      }
    }

    new Notice(result.notice ?? '✓ Done')
  }
}
