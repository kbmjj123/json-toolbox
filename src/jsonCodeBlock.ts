import type { Plugin } from 'obsidian'
import yaml from 'js-yaml'
import { parseJson, buildTree } from './jsonTree'
import { renderTree, renderTable, type RenderOptions } from './treeView'
import { toTable } from './commands'
import type { JsonToolboxSettings } from './settings'

export type BlockLanguage = 'json' | 'yaml'

export interface ParsedBlock {
  root: unknown
  language: BlockLanguage
  /** Untouched source text, kept so the original JSON is never lost. */
  rawText: string
}

function languageOf(codeEl: HTMLElement): string {
  const match = /(?:^|\s)language-([\w+-]+)/.exec(codeEl.className || '')
  return match ? match[1].toLowerCase() : ''
}

/**
 * Decide whether a code block should become a rich preview.
 *
 * Explicit `json` / `yaml` languages always win. Without a language we only
 * guess JSON when the content actually starts like JSON, so ordinary code
 * blocks are never touched.
 */
export function matchJsonBlock(lang: string, text: string): ParsedBlock | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  if (lang === 'yaml' || lang === 'yml') {
    try {
      const loaded = yaml.load(trimmed)
      if (loaded !== null && typeof loaded === 'object') {
        return { root: loaded, language: 'yaml', rawText: text }
      }
    } catch {
      return null
    }
    return null
  }

  const explicitJson = lang === 'json'
  const looksJson = trimmed.startsWith('{') || trimmed.startsWith('[')
  if (!explicitJson && !looksJson) return null

  const parsed = parseJson(trimmed)
  if (!parsed.ok) return null

  return { root: parsed.root, language: 'json', rawText: text }
}

/**
 * Replace one fenced code block with the rich tree/table, keeping the original
 * source in a collapsed section underneath (unless disabled in settings).
 */
export function processCodeElement(codeEl: HTMLElement, settings: JsonToolboxSettings): boolean {
  const pre = codeEl.parentElement
  if (!pre || pre.tagName !== 'PRE') return false

  const parsed = matchJsonBlock(languageOf(codeEl), codeEl.textContent ?? '')
  if (!parsed) return false

  const wrapper = document.createElement('div')
  wrapper.className = 'json-toolbox-block'

  const treeBox = document.createElement('div')

  // An array of plain objects reads best as a table; everything else as a tree.
  const isObjectArray =
    Array.isArray(parsed.root) &&
    parsed.root.length > 0 &&
    parsed.root.every(
      (item) => item !== null && typeof item === 'object' && !Array.isArray(item),
    )

  const treeOptions: RenderOptions = {
    previews: settings.inlinePreviews,
    expandByDefault: settings.expandTreeByDefault,
  }

  if (isObjectArray && settings.arrayAsTable) {
    const table = toTable(parsed.rawText)
    if (table.ok) renderTable(treeBox, table.headers, table.rows)
    else renderTree(treeBox, buildTree(parsed.root), treeOptions)
  } else {
    renderTree(treeBox, buildTree(parsed.root), treeOptions)
  }

  wrapper.appendChild(treeBox)

  if (settings.keepOriginalSource) {
    const details = document.createElement('details')
    details.className = 'json-toolbox-raw'
    const summary = document.createElement('summary')
    summary.textContent = `原始 ${parsed.language.toUpperCase()}`
    details.appendChild(summary)

    const raw = document.createElement('pre')
    raw.className = 'json-toolbox-raw-pre'
    raw.textContent = parsed.rawText
    details.appendChild(raw)

    wrapper.appendChild(details)
  }

  pre.replaceWith(wrapper)
  return true
}

/** Auto-render JSON/YAML code blocks while reading (no command needed). */
export function registerJsonCodeBlocks(plugin: Plugin): void {
  const getSettings = () =>
    (plugin as unknown as { settings: JsonToolboxSettings }).settings

  plugin.registerMarkdownPostProcessor((el: HTMLElement) => {
    if (!getSettings().readingModeRender) return

    const codes: HTMLElement[] = []

    if (el.tagName === 'PRE') {
      const code = el.querySelector('code')
      if (code) codes.push(code as HTMLElement)
    } else {
      el.querySelectorAll('pre > code').forEach((code) => codes.push(code as HTMLElement))
    }

    const settings = getSettings()
    codes.forEach((code) => processCodeElement(code, settings))
  })
}
