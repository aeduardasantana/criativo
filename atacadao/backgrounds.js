const backgrounds = [
  { id: 1, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 1.png" },
  { id: 2, file: "ATACADÃO ELETROMÓVEIS - 2.png" },
  { id: 3, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 3.png" },
  { id: 4, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 4.png" },
  { id: 5, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 5.png" },
  { id: 6, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 6.png" },
  { id: 7, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 7.png" },
  { id: 8, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 8.png" },
  { id: 9, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 9.png" },
  { id: 10, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 10.png" },
  { id: 11, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 11.png" },
  { id: 12, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 12.png" },
  { id: 13, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 13.png" },
  { id: 14, file: "FIGURINHAS IBRAIM - ATACADÃO ELETROMÓVEIS - 14.png" }
];

const grid = document.getElementById("background-grid");
const count = document.getElementById("background-count");
const panel = document.getElementById("selection-panel");
const selectedPreview = document.getElementById("selected-preview");
const selectedName = document.getElementById("selected-name");
const clearButton = document.getElementById("clear-selection");
const editorSection = document.getElementById("editor-section");
const editorBackground = document.getElementById("editor-background");
const stickerInput = document.getElementById("sticker-input");
const stickerText = document.getElementById("sticker-text");
const stickerTextLayer = document.getElementById("sticker-text-layer");
const charCount = document.getElementById("char-count");
const fontSize = document.getElementById("font-size");
const fontSizeOutput = document.getElementById("font-size-output");
const textPosition = document.getElementById("text-position");
const textPositionOutput = document.getElementById("text-position-output");
const resetEditor = document.getElementById("reset-editor");

const getSrc = (file) => "../FIGURINHAS IBRAIM/" + encodeURIComponent(file).replaceAll("%2F", "/");
count.textContent = backgrounds.length + " fundos disponíveis";

backgrounds.forEach((background) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "background-card";
  button.dataset.id = background.id;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", "Selecionar fundo " + background.id);

  const image = document.createElement("img");
  image.src = getSrc(background.file);
  image.alt = "Fundo " + background.id + " do Atacadão Eletromóveis";
  image.loading = "lazy";
  image.decoding = "async";

  const badge = document.createElement("span");
  badge.className = "background-card__number";
  badge.textContent = String(background.id).padStart(2, "0");

  const check = document.createElement("span");
  check.className = "background-card__check";
  check.setAttribute("aria-hidden", "true");
  check.textContent = "✓";

  button.append(image, badge, check);
  button.addEventListener("click", () => selectBackground(background, button, true));
  grid.appendChild(button);
});

function selectBackground(background, button, shouldScroll = false) {
  document.querySelectorAll(".background-card").forEach((card) => {
    const selected = card === button;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });

  const src = getSrc(background.file);
  selectedPreview.src = src;
  selectedPreview.alt = "Prévia do fundo " + background.id + " selecionado";
  selectedName.textContent = "Fundo " + String(background.id).padStart(2, "0");
  editorBackground.src = src;
  panel.hidden = false;
  editorSection.hidden = false;

  sessionStorage.setItem("stickerBackground", JSON.stringify({ id: background.id, file: background.file }));

  if (shouldScroll) {
    setTimeout(() => editorSection.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }
}

function updateText() {
  const value = stickerInput.value.trim();
  stickerText.textContent = value || "SUA MENSAGEM";
  charCount.textContent = stickerInput.value.length + "/100";
  sessionStorage.setItem("stickerText", stickerInput.value);
}

function updateFontSize() {
  const value = fontSize.value;
  stickerText.style.fontSize = value + "px";
  fontSizeOutput.textContent = value;
  sessionStorage.setItem("stickerFontSize", value);
}

function updatePosition() {
  const value = textPosition.value;
  stickerTextLayer.style.top = value + "%";
  textPositionOutput.textContent = value + "%";
  sessionStorage.setItem("stickerTextPosition", value);
}

function setAlignment(value) {
  stickerTextLayer.style.textAlign = value;
  document.querySelectorAll("[data-align]").forEach((button) => button.classList.toggle("is-active", button.dataset.align === value));
  sessionStorage.setItem("stickerTextAlign", value);
}

function setTextColor(value) {
  stickerText.style.color = value;
  stickerText.style.webkitTextStroke = value === "#ffffff" ? "2px rgba(0,0,0,.55)" : "2px rgba(255,255,255,.55)";
  document.querySelectorAll("[data-color]").forEach((button) => button.classList.toggle("is-active", button.dataset.color === value));
  sessionStorage.setItem("stickerTextColor", value);
}

stickerInput.addEventListener("input", updateText);
fontSize.addEventListener("input", updateFontSize);
textPosition.addEventListener("input", updatePosition);
document.querySelectorAll("[data-align]").forEach((button) => button.addEventListener("click", () => setAlignment(button.dataset.align)));
document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => setTextColor(button.dataset.color)));

resetEditor.addEventListener("click", () => {
  stickerInput.value = "";
  fontSize.value = "44";
  textPosition.value = "50";
  updateText();
  updateFontSize();
  updatePosition();
  setAlignment("center");
  setTextColor("#ffffff");
  stickerInput.focus();
});

clearButton.addEventListener("click", () => {
  document.querySelectorAll(".background-card").forEach((card) => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
  });
  panel.hidden = true;
  editorSection.hidden = true;
  sessionStorage.removeItem("stickerBackground");
  document.getElementById("fundos-titulo").scrollIntoView({ behavior: "smooth", block: "start" });
});

try {
  const saved = JSON.parse(sessionStorage.getItem("stickerBackground"));
  if (saved?.id) {
    const background = backgrounds.find((item) => item.id === saved.id);
    const button = grid.querySelector('[data-id="' + saved.id + '"]');
    if (background && button) selectBackground(background, button, false);
  }

  stickerInput.value = sessionStorage.getItem("stickerText") || "";
  fontSize.value = sessionStorage.getItem("stickerFontSize") || "44";
  textPosition.value = sessionStorage.getItem("stickerTextPosition") || "50";
  updateText();
  updateFontSize();
  updatePosition();
  setAlignment(sessionStorage.getItem("stickerTextAlign") || "center");
  setTextColor(sessionStorage.getItem("stickerTextColor") || "#ffffff");
} catch (_) {
  sessionStorage.removeItem("stickerBackground");
}