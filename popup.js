const DEFAULTS = {
  contentWidth: 900,
  fontSize: 16,
  lineHeight: 1.8,
  letterSpacing: 0.01,
  codeFontSize: 14,
  fontFamily: "",
};

const FONT_STACKS = {
  "":             "system-ui, sans-serif",
  "SF Pro":       '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  "Georgia":      "Georgia, serif",
  "Palatino":     "'Palatino Linotype', Palatino, serif",
  "Verdana":      "Verdana, Geneva, sans-serif",
  "Lora":         "'Lora', Georgia, serif",
  "Merriweather": "'Merriweather', Georgia, serif",
  "Inter":        "'Inter', system-ui, sans-serif",
  "Literata":     "'Literata', Georgia, serif",
};

const SLIDERS = [
  { id: "contentWidth",  fmt: (v) => v + "px" },
  { id: "fontSize",      fmt: (v) => v + "px" },
  { id: "lineHeight",    fmt: (v) => parseFloat(v).toFixed(2) },
  { id: "letterSpacing", fmt: (v) => parseFloat(v).toFixed(3) },
  { id: "codeFontSize",  fmt: (v) => v + "px" },
];

let state = { ...DEFAULTS };

// ── Theme toggle ──────────────────────────────────────────
// Cycles: system → dark → light → system
const THEME_CYCLE = ["system", "dark", "light"];
const THEME_ICONS = { system: "Auto", dark: "☾", light: "☀" };

function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  document.getElementById("themeToggle").textContent = THEME_ICONS[theme];
  chrome.storage.sync.set({ theme });
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") ?? "system";
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];
  applyTheme(next);
});

// ── Sliders ──────────────────────────────────────────────
function setSliderFill(input) {
  const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
  input.style.setProperty("--pct", pct + "%");
}

function initSlider({ id, fmt }) {
  const input   = document.getElementById(id);
  const display = document.getElementById(id + "Val");

  input.addEventListener("input", () => {
    state[id] = Number(input.value);
    display.textContent = fmt(input.value);
    setSliderFill(input);
    chrome.storage.sync.set({ [id]: state[id] });
  });

  return (s) => {
    input.value         = s[id];
    display.textContent = fmt(s[id]);
    setSliderFill(input);
  };
}

const sliderSetters = SLIDERS.map(initSlider);

// ── Custom font picker ────────────────────────────────────
const fpTrigger = document.getElementById("fpTrigger");
const fpList    = document.getElementById("fpList");
const fpLabel   = document.getElementById("fpLabel");

function selectFont(value) {
  state.fontFamily = value;

  const label = value || "Site default";
  fpLabel.textContent  = label;
  fpLabel.style.fontFamily = FONT_STACKS[value] || "system-ui";

  document.querySelectorAll(".fp-option").forEach((el) => {
    el.classList.toggle("selected", el.dataset.value === value);
  });

  chrome.storage.sync.set({ fontFamily: value });
}

fpTrigger.addEventListener("click", () => {
  const open = fpList.classList.toggle("open");
  fpTrigger.classList.toggle("open", open);
});

fpList.addEventListener("click", (e) => {
  const opt = e.target.closest(".fp-option");
  if (!opt) return;
  selectFont(opt.dataset.value);
  fpList.classList.remove("open");
  fpTrigger.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (!document.getElementById("fontPicker").contains(e.target)) {
    fpList.classList.remove("open");
    fpTrigger.classList.remove("open");
  }
});

// ── Load / reset ──────────────────────────────────────────
function applyToUI(settings) {
  state = { ...DEFAULTS, ...settings };
  sliderSetters.forEach((set) => set(state));
  selectFont(state.fontFamily);
}

chrome.storage.sync.get({ ...DEFAULTS, theme: "system" }, (settings) => {
  applyTheme(settings.theme ?? "system");
  applyToUI(settings);
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.sync.clear(() => applyToUI(DEFAULTS));
});
