import type { JsonNode } from './jsonTree'
import {
  detectValueKind,
  decodeJwt,
  decodeBase64,
  formatTimestamps,
  isColorValue,
  getColorStyle,
  truncate,
} from './mediaPreview'

/** Create a child element through Obsidian's DOM helper. */
function el(
  parent: HTMLElement,
  tag: string,
  className?: string,
  text?: string,
): HTMLElement {
  return parent.createEl(tag as keyof HTMLElementTagNameMap, { cls: className, text })
}

function valueClass(value: unknown): string {
  if (value === null) return 'json-toolbox-val-null'
  if (value === undefined) return 'json-toolbox-val-null'
  switch (typeof value) {
    case 'string': return 'json-toolbox-val-string'
    case 'number': return 'json-toolbox-val-number'
    case 'boolean': return 'json-toolbox-val-boolean'
    default: return ''
  }
}

function formatPrimitive(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

/** Append a small chip such as `jwt`, `uuid`, `ip`, or a decoded timestamp. */
function appendKindChip(parent: HTMLElement, label: string): void {
  el(parent, 'span', 'json-toolbox-kind', label)
}

/**
 * Append an image thumbnail inside the value row. Rendered only for values
 * detected as `image` — never for arbitrary URLs, so the plugin does not fire
 * third-party requests for links that merely look like they might be images.
 */
function appendThumbnail(parent: HTMLElement, src: string): void {
  const img = parent.createEl('img', {
    cls: 'json-toolbox-thumb',
    attr: { src, alt: '' },
  })
  img.addEventListener('error', () => img.remove())
}

function renderValue(parent: HTMLElement, value: unknown, previews = true): void {
  if (!previews) {
    el(parent, 'span', valueClass(value), formatPrimitive(value))
    return
  }
  const kind = detectValueKind(value)

  if (isColorValue(value)) {
    const swatch = el(parent, 'span', 'json-toolbox-swatch')
    swatch.style.backgroundColor = getColorStyle(String(value)) ?? ''
  }

  el(parent, 'span', valueClass(value), formatPrimitive(value))

  if (!kind) return

  if (kind === 'image') {
    appendThumbnail(parent, String(value))
    appendKindChip(parent, 'image')
    return
  }

  if (kind === 'url' || kind === 'audio' || kind === 'video' || kind === 'pdf') {
    parent.createEl('a', {
      cls: 'json-toolbox-kind',
      href: String(value),
      text: 'open',
      attr: { target: '_blank', rel: 'noopener noreferrer' },
    })
    if (kind !== 'url') appendKindChip(parent, kind)
    return
  }

  if (kind === 'email') {
    parent.createEl('a', {
      cls: 'json-toolbox-kind',
      href: `mailto:${String(value)}`,
      text: 'mailto',
    })
    return
  }

  if (kind === 'timestamp') {
    const views = formatTimestamps(value as string | number)
    if (views) appendKindChip(parent, views.iso)
    return
  }

  if (kind === 'jwt') {
    const parts = decodeJwt(String(value))
    appendKindChip(parent, 'jwt')
    if (parts) {
      appendKindChip(parent, truncate(JSON.stringify(parts.payload), 80))
    }
    return
  }

  if (kind === 'base64') {
    const decoded = decodeBase64(String(value))
    appendKindChip(parent, 'base64')
    if (decoded?.kind === 'image' && decoded.dataUrl) {
      appendThumbnail(parent, decoded.dataUrl)
    } else if (decoded?.kind === 'text') {
      appendKindChip(parent, truncate(decoded.text ?? '', 80))
    }
    return
  }

  appendKindChip(parent, kind)
}

function renderNode(
  parent: HTMLElement,
  node: JsonNode,
  depth: number,
  options: RenderOptions,
): void {
  const row = el(parent, 'div', 'json-toolbox-node')
  row.style.paddingLeft = `${depth * 14}px`

  const expandable = node.children.length > 0

  if (expandable) {
    const toggle = el(row, 'span', 'json-toolbox-toggle', options.expandByDefault ? '▾' : '▸')
    const childBox = el(parent, 'div')
    let expanded = options.expandByDefault

    toggle.addEventListener('click', (event) => {
      event.stopPropagation()
      expanded = !expanded
      toggle.textContent = expanded ? '▾' : '▸'
      childBox.style.display = expanded ? '' : 'none'
    })

    if (node.key !== null) {
      el(row, 'span', 'json-toolbox-key', String(node.key))
      el(row, 'span', 'json-toolbox-punct', ': ')
    }
    el(
      row,
      'span',
      'json-toolbox-punct',
      node.kind === 'array' ? `[${node.children.length}]` : `{${node.children.length}}`,
    )

    childBox.style.display = options.expandByDefault ? '' : 'none'
    node.children.forEach((child) => renderNode(childBox, child, depth + 1, options))
    return
  }

  el(row, 'span')
  if (node.key !== null) {
    el(row, 'span', 'json-toolbox-key', String(node.key))
    el(row, 'span', 'json-toolbox-punct', ': ')
  }
  renderValue(row, node.value, options.previews)
}

export interface RenderOptions {
  /** Expand every collapsible node on first render. */
  expandByDefault?: boolean
  /** Render inline media previews (image, colour, link, jwt, base64...). */
  previews?: boolean
}

export function renderTree(
  container: HTMLElement,
  root: JsonNode,
  options: RenderOptions = {},
): void {
  const opts: RenderOptions = {
    expandByDefault: options.expandByDefault ?? false,
    previews: options.previews ?? true,
  }
  container.empty()
  container.classList.add('json-toolbox-tree')
  root.children.forEach((child) => renderNode(container, child, 0, opts))
  if (root.children.length === 0 && root.kind === 'primitive') {
    renderNode(container, root, 0, opts)
  }
}

export function renderTable(container: HTMLElement, headers: string[], rows: string[][]): void {
  container.empty()
  const table = container.createEl('table', { cls: 'json-toolbox-table' })

  const thead = table.createEl('thead')
  const headRow = thead.createEl('tr')
  headers.forEach((header) => el(headRow, 'th', undefined, header))
  table.appendChild(thead)

  const tbody = table.createEl('tbody')
  rows.forEach((row) => {
    const tr = tbody.createEl('tr')
    row.forEach((cell) => el(tr, 'td', undefined, cell))
  })
  table.appendChild(tbody)
}
