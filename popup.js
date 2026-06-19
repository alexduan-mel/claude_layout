const DEFAULTS = {
  contentWidth: 900,
  fontSize: 16,
  lineHeight: 1.8,
  letterSpacing: 0.01,
  codeFontSize: 14,
  fontFamily: "",
};

const SLIDERS = [
  { id: "contentWidth",  label: (v) => v + "px" },
  { id: "fontSize",      label: (v) => v + "px" },
  { id: "lineHeight",    label: (v) => parseFloat(v).toFixed(2) },
  { id: "letterSpacing", label: (v) => parseFloat(v).toFixed(3) },
  { id: "codeFontSize",  label: (v) => v + "px" },
];

function initSlider({ id, label }) {
  const input = document.getElementById(id);
  const display = document.getElementById(id + "Val");

  input.addEventListener("input", () => {
    display.textContent = label(input.value);
    chrome.storage.sync.set({ [id]: Number(input.value) });
  });

  return (settings) => {
    input.value = settings[id];
    display.textContent = label(settings[id]);
  };
}

const sliderSetters = SLIDERS.map(initSlider);

// Font select
const fontSelect = document.getElementById("fontFamily");
fontSelect.addEventListener("change", () => {
  chrome.storage.sync.set({ fontFamily: fontSelect.value });
});

function applyToUI(settings) {
  sliderSetters.forEach((set) => set(settings));
  fontSelect.value = settings.fontFamily ?? "";
}

chrome.storage.sync.get(DEFAULTS, applyToUI);

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.sync.clear(() => applyToUI(DEFAULTS));
});
