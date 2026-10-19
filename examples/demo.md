# JSON Toolbox — Demo

This note shows what the **JSON Toolbox** plugin does inside Obsidian. Switch to **reading mode** (Cmd/Ctrl+E) and every `json` / `yaml` code block below is rendered as a rich, collapsible tree (or a table), with inline previews on leaf values.

> Full docs: https://jsontoolbox.cc · Repo: https://github.com/kbmjj123/json-toolbox

## 1. Rich tree (nested object)

A nested object collapses into an expandable tree.

```json
{
  "title": "JSON Toolbox demo",
  "nested": {
    "level1": {
      "level2": { "leaf": "deep value", "count": 42 }
    }
  },
  "enabled": true,
  "ratio": 0.75
}
```

## 2. Array of objects → table

When every element of a top-level array is an object with the same keys, it renders as a table.

```json
[
  { "name": "Ada Lovelace", "born": 1815, "field": "math" },
  { "name": "Alan Turing",  "born": 1912, "field": "cs" },
  { "name": "Grace Hopper", "born": 1906, "field": "cs" }
]
```

## 3. Inline previews

Leaf values are auto-detected and previewed: color swatch, image thumbnail, clickable link, email, audio / video / PDF, human-readable timestamp, decoded JWT, decoded Base64, UUID, IP, rendered Markdown, and regex.

```json
{
  "color": "#7c3aed",
  "background": "#22d3ee",
  "image": "https://raw.githubusercontent.com/kbmjj123/json-toolbox/main/logo.png",
  "website": "https://jsontoolbox.cc",
  "repo": "https://github.com/kbmjj123/json-toolbox",
  "email": "hello@jsontoolbox.cc",
  "audio": "https://www.w3.org/2008/WebVideo/TestMedia/audio.mp3",
  "video": "https://www.w3.org/2008/WebVideo/TestMedia/clip.mp4",
  "document": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "timestamp": "2026-10-19T14:30:00Z",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqc29uLXRvb2xib3giLCJuYW1lIjoiQWRhIExvdmVsYWNlIiwicm9sZSI6ImRlbW8iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTg5MzQ1NjAwMH0.PsDKpBWjl6DnutkZ7eO-bDqfBsf4bd3TL2rNrtoDPi0",
  "base64": "SGVsbG8gZnJvbSBKU09OIFRvb2xib3ghIFRoaXMgc3RyaW5nIGlzIEJhc2U2NC1kZWNvZGFibGUu",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "ip": "192.168.1.1",
  "markdown": "**bold** and [a link](https://obsidian.md)",
  "regex": "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$"
}
```

## 4. YAML support

`yaml` code blocks are rendered the same way.

```yaml
title: JSON Toolbox demo
nested:
  level1:
    level2:
      leaf: deep value
      count: 42
people:
  - name: Ada Lovelace
    born: 1815
    field: math
  - name: Alan Turing
    born: 1912
    field: cs
color: "#7c3aed"
website: https://jsontoolbox.cc
```

## 5. Keep original source

Every preview keeps the original JSON / YAML in a collapsible section below it. Turn it off in **Settings → JSON Toolbox** if you only want the preview.

## 6. Commands

Open the command palette (Cmd/Ctrl+P):

- **Open JSON Viewer** — render selected JSON as a rich tree
- **Format JSON** — pretty-print selected JSON
- **Validate JSON** — check JSON and locate the error
- **JSON ↔ YAML** — convert between JSON and YAML
- **JSON → Table/CSV** — turn a JSON array / object into a table

---

If this tool helps you, you can buy me a coffee on Ko-fi: https://ko-fi.com/kbmjj123
