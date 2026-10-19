import { describe, it, expect } from 'vitest'
import { extractJsonFromText, codeBlockAtLine } from '../editorInput'

describe('extractJsonFromText', () => {
  it('returns raw JSON objects and arrays as-is', () => {
    expect(extractJsonFromText('{"a":1}')).toBe('{"a":1}')
    expect(extractJsonFromText('[1,2]')).toBe('[1,2]')
  })

  it('extracts the contents of a fenced code block', () => {
    const markdown = '# Title\n\n```json\n{"a":1}\n```\n'
    expect(extractJsonFromText(markdown)).toBe('{"a":1}')
  })

  it('returns null for markdown without any JSON or code block', () => {
    // Regression: a whole Markdown note must never be treated as JSON.
    expect(extractJsonFromText('# JSON Toolbox\n\njust prose')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(extractJsonFromText('   ')).toBeNull()
  })
})

describe('codeBlockAtLine', () => {
  const doc = ['# Title', '', '```json', '{"a":1}', '```', '', 'prose'].join('\n')

  it('returns the block containing the cursor line', () => {
    expect(codeBlockAtLine(doc, 3)).toBe('{"a":1}')
  })

  it('returns null when the line sits outside every block', () => {
    expect(codeBlockAtLine(doc, 6)).toBeNull()
    expect(codeBlockAtLine(doc, 0)).toBeNull()
  })

  it('finds the right block when there are several', () => {
    const multi = ['```json', '{"first":1}', '```', '', '```json', '{"second":2}', '```'].join('\n')
    expect(codeBlockAtLine(multi, 1)).toBe('{"first":1}')
    expect(codeBlockAtLine(multi, 5)).toBe('{"second":2}')
  })
})
