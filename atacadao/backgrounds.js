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
const stickerPreview = document.getElementById("sticker-preview");
const stickerInput = document.getElementById("sticker-input");
const stickerText = document.getElementById("sticker-text");
const stickerTextLayer = document.getElementById("sticker-text-layer");
const charCount = document.getElementById("char-count");
const fontSize = document.getElementById("font-size");
const fontSizeOutput = document.getElementById("font-size-output");
const textPosition = document.getElementById("text-position");
const textPositionOutput = document.getElementById("text-position-output");
const resetEditor = document.getElementById("reset-editor");
const legibilityPanel = document.getElementById("legibility-panel");
const legibilityTitle = document.getElementById("legibility-title");
const legibilityMessage = document.getElementById("legibility-message");
const downloadSticker = document.getElementById("download-sticker");
const shareSticker = document.getElementById("share-sticker");

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
  applyLegibilityRules();

  if (shouldScroll) {
    setTimeout(() => editorSection.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }
}

function updateText() {
  const value = stickerInput.value.trim();
  stickerText.textContent = value || "SUA MENSAGEM";
  charCount.textContent = stickerInput.value.length + "/100";
  sessionStorage.setItem("stickerText", stickerInput.value);
  applyLegibilityRules();
}

function updateFontSize() {
  const value = fontSize.value;
  stickerText.style.fontSize = value + "px";
  fontSizeOutput.textContent = value;
  sessionStorage.setItem("stickerFontSize", value);
  applyLegibilityRules();
}

function updatePosition() {
  const value = textPosition.value;
  stickerTextLayer.style.top = value + "%";
  textPositionOutput.textContent = value + "%";
  sessionStorage.setItem("stickerTextPosition", value);
  applyLegibilityRules();
}

function setAlignment(value) {
  stickerTextLayer.style.textAlign = value;
  document.querySelectorAll("[data-align]").forEach((button) => button.classList.toggle("is-active", button.dataset.align === value));
  sessionStorage.setItem("stickerTextAlign", value);
  applyLegibilityRules();
}

function setTextColor(value) {
  stickerText.style.color = value;
  stickerText.style.webkitTextStroke = value === "#ffffff" ? "2px rgba(0,0,0,.55)" : "2px rgba(255,255,255,.55)";
  document.querySelectorAll("[data-color]").forEach((button) => button.classList.toggle("is-active", button.dataset.color === value));
  sessionStorage.setItem("stickerTextColor", value);
}

function getLineCount() {
  const computed = window.getComputedStyle(stickerText);
  let lineHeight = parseFloat(computed.lineHeight);
  if (!lineHeight || Number.isNaN(lineHeight)) lineHeight = parseFloat(computed.fontSize);
  const height = stickerText.getBoundingClientRect().height;
  return Math.max(1, Math.round(height / lineHeight));
}

function applyLegibilityRules() {
  if (!editorSection || editorSection.hidden || !stickerPreview.clientHeight) return;

  const maxHeight = stickerPreview.clientHeight * 0.62;
  const requestedFont = Number(fontSize.value);
  const minFont = 24;
  let currentFont = requestedFont;
  stickerText.style.fontSize = currentFont + "px";

  while (currentFont > minFont && stickerText.getBoundingClientRect().height > maxHeight) {
    currentFont -= 1;
    stickerText.style.fontSize = currentFont + "px";
  }

  const lineCount = getLineCount();
  legibilityPanel.classList.remove("is-good", "is-warning", "is-danger");

  if (stickerText.getBoundingClientRect().height > maxHeight || lineCount > 4) {
    legibilityPanel.classList.add("is-danger");
    legibilityTitle.textContent = "Texto longo demais para figurinha";
    legibilityMessage.textContent = "Reduza a frase para melhorar a leitura no WhatsApp.";
  } else if (currentFont < requestedFont || lineCount === 4) {
    legibilityPanel.classList.add("is-warning");
    legibilityTitle.textContent = "Ajustada automaticamente";
    legibilityMessage.textContent = "O sistema reduziu o texto para preservar a legibilidade.";
  } else {
    legibilityPanel.classList.add("is-good");
    legibilityTitle.textContent = "Ótima legibilidade";
    legibilityMessage.textContent = "O texto está bem distribuído para figurinha.";
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapCanvasText(ctx, text, maxWidth, fontPx) {
  ctx.font = `900 ${fontPx}px Arial, sans-serif`;
  const paragraphs = text.split("\n");
  const lines = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let line = "";
    words.forEach((word) => {
      const testLine = line ? line + " " + word : word;
      if (ctx.measureText(testLine).width <= maxWidth || !line) {
        line = testLine;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
  });

  return lines;
}

async function exportStickerBlob() {
  if (!editorBackground.src) {
    alert("Escolha um fundo antes de exportar.");
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const bg = await loadImage(editorBackground.src);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);
  ctx.drawImage(bg, 0, 0, 512, 512);

  const text = stickerInput.value.trim() || "SUA MENSAGEM";
  const align = sessionStorage.getItem("stickerTextAlign") || "center";
  const textColor = sessionStorage.getItem("stickerTextColor") || "#ffffff";
  const posPercent = Number(textPosition.value) / 100;
  const safeWidth = 512 * 0.86;
  const safeLeft = 512 * 0.07;
  const safeRight = 512 - safeLeft;
  const maxTextHeight = 512 * 0.62;

  let fontPx = Number(fontSize.value);
  let lines = wrapCanvasText(ctx, text, safeWidth, fontPx);
  let lineHeight = fontPx * 0.98;

  while (fontPx > 24 && (lines.length > 4 || lines.length * lineHeight > maxTextHeight)) {
    fontPx -= 1;
    lineHeight = fontPx * 0.98;
    lines = wrapCanvasText(ctx, text, safeWidth, fontPx);
  }

  ctx.font = `900 ${fontPx}px Arial, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.fillStyle = textColor;
  ctx.strokeStyle = textColor === "#111111" ? "rgba(255,255,255,.72)" : "rgba(0,0,0,.62)";
  ctx.lineWidth = Math.max(4, fontPx * 0.08);

  const blockHeight = lines.length * lineHeight;
  let y = 512 * posPercent - blockHeight / 2 + lineHeight / 2;

  lines.forEach((line) => {
    let x = 256;
    if (align === "left") {
      ctx.textAlign = "left";
      x = safeLeft;
    } else if (align === "right") {
      ctx.textAlign = "right";
      x = safeRight;
    } else {
      ctx.textAlign = "center";
    }

    ctx.strokeText(line, x, y);
    ctx.fillText(line, x, y);
    y += lineHeight;
  });

  return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

downloadSticker.addEventListener("click", async () => {
  try {
    const blob = await exportStickerBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "figurinha-atacadao-512.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  } catch (error) {
    console.error(error);
    alert("Não foi possível gerar a figurinha.");
  }
});

shareSticker.addEventListener("click", async () => {
  try {
    const blob = await exportStickerBlob();
    if (!blob) return;

    const file = new File([blob], "figurinha-atacadao-512.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Figurinha Atacadão Eletromóveis" });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "figurinha-atacadao-512.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    alert("O compartilhamento direto não está disponível neste dispositivo. A figurinha foi baixada.");
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert("Não foi possível compartilhar a figurinha.");
  }
});

stickerInput.addEventListener("input", updateText);
fontSize.addEventListener("input", updateFontSize);
textPosition.addEventListener("input", updatePosition);
document.querySelectorAll("[data-align]").forEach((button) => button.addEventListener("click", () => setAlignment(button.dataset.align)));
document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => setTextColor(button.dataset.color)));
window.addEventListener("resize", applyLegibilityRules);

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
  requestAnimationFrame(applyLegibilityRules);
} catch (_) {
  sessionStorage.removeItem("stickerBackground");
}