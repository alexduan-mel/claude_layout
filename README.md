# Claude Formatter

A Chrome extension that improves the readability of [claude.ai](https://claude.ai) by giving you control over the chat layout and typography.

> **Vibe coding project** — the idea and design decisions are by the author; the code was written entirely through conversation with [Claude Code](https://claude.ai/code), Anthropic's AI coding assistant.

## Why

Claude's default chat layout uses a narrow content column and relatively tight line spacing. When Claude outputs a long response, it can be hard to focus on and easy to skim past. This extension lets you widen the column, bump up the font size, open up the line spacing, and switch to a font that's easier on the eyes — all adjustable in real time from a popup.

## Features

| Setting | Default | Range |
|---|---|---|
| Content width | 900 px | 600 – 1400 px |
| Font size | 16 px | 12 – 24 px |
| Line height | 1.80 | 1.2 – 2.4 |
| Letter spacing | 0.01 em | 0 – 0.08 em |
| Code font size | 14 px | 10 – 20 px |
| Font family | Site default | See below |

### Available fonts

**System fonts** (no network request, always work):
- Georgia — classic serif, great for long reads
- Palatino — elegant serif, generous spacing
- Verdana — screen-optimised sans-serif, very open letterforms

**Google Fonts** (loaded on demand from Google's CDN):
- Lora — popular reading serif
- Merriweather — designed specifically for screen readability
- Inter — clean modern sans-serif, widely used in reading apps
- Literata — Google's e-reader font, optimised for long text

> **Note:** If claude.ai's Content Security Policy blocks the Google Fonts CDN, Google Font selections will silently fall back to their serif/sans-serif fallbacks. System fonts are unaffected.

All settings are saved via `chrome.storage.sync` and applied immediately without reloading the page. They also sync across Chrome profiles if you are signed in to Chrome.

## Installation

This extension is not published to the Chrome Web Store. Load it manually as an unpacked extension:

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `claude_formatter` folder.
5. Navigate to [claude.ai](https://claude.ai) — the formatting is applied automatically.
6. Click the extension icon in the toolbar to open the settings popup.

## File overview

```
claude_formatter/
├── manifest.json   — Extension manifest (Manifest V3)
├── content.css     — Minimal fallback CSS injected before JS loads
├── content.js      — Reads settings from storage, injects a <style> tag
│                     and a <link> for Google Fonts when needed
├── popup.html      — Settings UI (sliders + font dropdown)
└── popup.js        — Wires the popup controls to chrome.storage.sync
```

## Compatibility

Targets `https://claude.ai/*`. Because claude.ai uses dynamically generated class names, the extension targets stable HTML elements (`p`, `li`, `h1`–`h6`, `pre`, `code`) and Tailwind `max-w-*` utility classes for the layout override. If Anthropic ships a major redesign, the selectors in `content.js` may need updating.
