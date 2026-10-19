# JSON Toolbox — Obsidian Plugin

View JSON in Obsidian as a collapsible **rich tree** with inline previews for
images, colors, links, timestamps, JWTs, Base64 and more — then format,
validate, convert to YAML, or turn it into a table.

🌐 **Full online version with 30+ JSON tools:** https://jsontoolbox.cc

## Commands

| Command | What it does |
|---|---|
| Open JSON Viewer | View selected JSON as a collapsible rich tree with inline previews |
| Format JSON | Pretty-print selected JSON (2-space indent) |
| Validate JSON | Validate selected JSON and locate the error |
| JSON ↔ YAML | Convert selection between JSON and YAML (auto-detects direction) |
| JSON → Table/CSV | Turn a JSON array/object into a table |

## Inline previews

Detected automatically on leaf values: color, image, audio, video, pdf, url,
email, timestamp, jwt, base64, uuid, ip, markdown, regex.

## Privacy

All processing (parsing, formatting, validation, conversion) happens locally in
Obsidian. No telemetry, no accounts, no cloud sync.

One exception: **inline media previews** (image / audio / video / PDF) load the
remote URL found in your JSON, so rendering those previews makes a network
request to that URL. Nothing is uploaded — the URL is only fetched in order to
render the preview.

## Install

Copy `main.js`, `manifest.json`, `styles.css` into
`<vault>/.obsidian/plugins/json-toolbox/`.
