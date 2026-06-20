const DEFAULTS = {
  contentWidth: 900,
  fontSize: 16,
  lineHeight: 1.8,
  letterSpacing: 0.01,
  codeFontSize: 14,
  fontFamily: "",
};

const FONTS = {
  "SF Pro":       { stack: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' },
  "Georgia":      { stack: "Georgia, serif" },
  "Palatino":     { stack: "'Palatino Linotype', Palatino, serif" },
  "Verdana":      { stack: "Verdana, Geneva, sans-serif" },
  "Lora":         { stack: "Lora, Georgia, serif",         gf: "Lora:ital,wght@0,400;0,700;1,400" },
  "Merriweather": { stack: "Merriweather, Georgia, serif", gf: "Merriweather:wght@300;400;700" },
  "Inter":        { stack: "Inter, system-ui, sans-serif", gf: "Inter:wght@400;500;600" },
  "Literata":     { stack: "Literata, Georgia, serif",     gf: "Literata:opsz,wght@7..72,400;7..72,700" },
};

let styleEl = null;
let fontLinkEl = null;

function applyFont(name) {
  if (fontLinkEl) { fontLinkEl.remove(); fontLinkEl = null; }
  const font = FONTS[name];
  if (!font?.gf) return;
  fontLinkEl = document.createElement("link");
  fontLinkEl.rel = "stylesheet";
  fontLinkEl.href = `https://fonts.googleapis.com/css2?family=${font.gf}&display=swap`;
  document.head.appendChild(fontLinkEl);
}

function buildCSS(s) {
  const font = FONTS[s.fontFamily];
  const fontRule = font ? `font-family: ${font.stack} !important;` : "";

  return `
    [class*="max-w-"] {
      max-width: ${s.contentWidth}px !important;
    }

    p, li, td, th, blockquote {
      font-size: ${s.fontSize}px !important;
      line-height: ${s.lineHeight} !important;
      letter-spacing: ${s.letterSpacing}em !important;
      ${fontRule}
    }

    h1, h2, h3, h4, h5, h6 {
      line-height: 1.35 !important;
      margin-top: 1.4em !important;
      margin-bottom: 0.5em !important;
      ${fontRule}
    }

    p { margin-bottom: 0.9em !important; }

    pre, code, pre *, code * {
      font-size: ${s.codeFontSize}px !important;
      line-height: 1.6 !important;
    }
  `;
}

function applySettings(settings) {
  const s = { ...DEFAULTS, ...settings };
  applyFont(s.fontFamily);

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "claude-formatter";
    (document.head || document.documentElement).appendChild(styleEl);
  }

  styleEl.textContent = buildCSS(s);
}

chrome.storage.sync.get(DEFAULTS, applySettings);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  chrome.storage.sync.get(DEFAULTS, applySettings);
});
