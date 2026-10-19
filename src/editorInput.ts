/**
 * Turn whatever the editor gives us into JSON text.
 *
 * The active editor contains Markdown, not JSON: a note may hold several fenced
 * code blocks plus prose. These helpers isolate the JSON so commands never try
 * to parse a whole Markdown document.
 */

/** Fenced code block opener, e.g. ```` ```json ```` or a plain ```` ``` ````. */
const FENCE = /^\s*```/

/**
 * Pull JSON out of arbitrary text.
 *
 * Accepts raw JSON (`{...}` / `[...]`), otherwise falls back to the contents of
 * the first fenced code block. Returns `null` when neither is present, so the
 * caller can tell the user what to do instead of parsing garbage.
 */
export function extractJsonFromText(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed

  const match = /```[^\n]*\n([\s\S]*?)```/.exec(text)
  if (match && match[1].trim()) return match[1].trim()

  return null
}

export interface CodeBlockRange {
  /** Index of the opening fence line. */
  startLine: number
  /** Index of the closing fence line. */
  endLine: number
  /** Everything between the two fences. */
  content: string
}

/**
 * The fenced code block containing `line` (0-based), with its fence line numbers.
 *
 * Commands run without a selection: the cursor simply sits inside a block, and
 * the caller needs both the content and the range so it can write back into it.
 */
export function codeBlockRangeAtLine(value: string, line: number): CodeBlockRange | null {
  const lines = value.split('\n')
  let start: number | null = null

  for (let i = 0; i < lines.length; i++) {
    if (!FENCE.test(lines[i])) continue

    if (start === null) {
      start = i
    } else {
      if (line > start && line < i) {
        return { startLine: start, endLine: i, content: lines.slice(start + 1, i).join('\n') }
      }
      start = null
    }
  }

  return null
}

/** Just the contents of the code block containing `line`, if any. */
export function codeBlockAtLine(value: string, line: number): string | null {
  return codeBlockRangeAtLine(value, line)?.content ?? null
}
