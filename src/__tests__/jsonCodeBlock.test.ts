import { describe, it, expect, beforeEach } from 'vitest'
import { matchJsonBlock, processCodeElement } from '../jsonCodeBlock'

describe('matchJsonBlock', () => {
  it('matches an explicit json block', () => {
    const result = matchJsonBlock('json', '{"a":1}')
    expect(result?.language).toBe('json')
    expect(result?.root).toEqual({ a: 1 })
  })

  it('rejects broken json', () => {
    expect(matchJsonBlock('json', '{oops')).toBeNull()
  })

  it('parses yaml blocks into data', () => {
    const result = matchJsonBlock('yaml', 'a: 1\nb: x\n')
    expect(result?.language).toBe('yaml')
    expect(result?.root).toEqual({ a: 1, b: 'x' })
  })

  it('auto-detects json when no language is set', () => {
    expect(matchJsonBlock('', '{"a":1}')).not.toBeNull()
    expect(matchJsonBlock('', '[1,2]')).not.toBeNull()
  })

  it('leaves ordinary code blocks alone', () => {
    expect(matchJsonBlock('bash', 'echo hi')).toBeNull()
    expect(matchJsonBlock('', 'just prose')).toBeNull()
  })

  it('keeps the original source text', () => {
    const raw = '{\n  "a": 1\n}'
    expect(matchJsonBlock('json', raw)?.rawText).toBe(raw)
  })
})

describe('processCodeElement', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  function makePre(lang: string, text: string): { pre: HTMLElement; code: HTMLElement } {
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    if (lang) code.className = `language-${lang}`
    code.textContent = text
    pre.appendChild(code)
    document.body.appendChild(pre)
    return { pre, code }
  }

  it('replaces a json block with tree + collapsed original', () => {
    const source = '{"a":1,"b":"#ff0000"}'
    const { pre, code } = makePre('json', source)

    expect(processCodeElement(code)).toBe(true)

    const block = document.querySelector('.json-toolbox-block')
    expect(block).toBeTruthy()
    // rich preview rendered (colour swatch proves inline preview ran)
    expect(block?.querySelector('.json-toolbox-swatch')).toBeTruthy()
    // original source preserved, untouched
    expect(block?.querySelector('.json-toolbox-raw-pre')?.textContent).toBe(source)
    // the original <pre> was replaced (detached from the document)
    expect(pre.parentElement).toBeNull()
  })

  it('renders yaml blocks too', () => {
    const { code } = makePre('yaml', 'title: hi\n')
    expect(processCodeElement(code)).toBe(true)
    expect(document.querySelector('.json-toolbox-block')?.textContent).toContain('title')
  })

  it('does nothing for non-json blocks', () => {
    const { pre, code } = makePre('bash', 'echo hi')
    expect(processCodeElement(code)).toBe(false)
    expect(document.querySelector('.json-toolbox-block')).toBeNull()
    expect(pre.parentElement).toBe(document.body)
  })

  it('renders an array of objects as a table', () => {
    const { code } = makePre('json', '[{"name":"Ada","year":1843},{"name":"Alan","year":1936}]')
    expect(processCodeElement(code)).toBe(true)
    const table = document.querySelector('.json-toolbox-table')
    expect(table).toBeTruthy()
    const headers = document.querySelectorAll('.json-toolbox-table th')
    expect(headers[0]?.textContent).toBe('name')
    expect(headers[1]?.textContent).toBe('year')
  })

  it('renders a plain object as a tree, not a table', () => {
    const { code } = makePre('json', '{"name":"Ada","year":1843}')
    expect(processCodeElement(code)).toBe(true)
    expect(document.querySelector('.json-toolbox-table')).toBeNull()
    expect(document.querySelector('.json-toolbox-tree')).toBeTruthy()
  })

  it('renders an array of scalars as a tree (table only fits object rows)', () => {
    const { code } = makePre('json', '["a","b","c"]')
    expect(processCodeElement(code)).toBe(true)
    expect(document.querySelector('.json-toolbox-table')).toBeNull()
    expect(document.querySelector('.json-toolbox-tree')).toBeTruthy()
  })

  it('does nothing when the code element is not inside a <pre>', () => {
    const code = document.createElement('code')
    document.body.appendChild(code)
    expect(processCodeElement(code)).toBe(false)
  })
})
