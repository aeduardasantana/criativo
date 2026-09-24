const formats = {
  story: { ratio: 9 / 16, width: 1080, height: 1920, label: "9:16 • 1080 × 1920 px", file: "criativo-9x16.png" },
  portrait: { ratio: 4 / 5, width: 1080, height: 1350, label: "4:5 • 1080 × 1350 px", file: "criativo-4x5.png" },
  square: { ratio: 1, width: 1200, height: 1200, label: "1:1 • 1200 × 1200 px", file: "criativo-1x1.png" },
  wide: { ratio: 16 / 9, width: 1920, height: 1080, label: "16:9 • 1920 × 1080 px", file: "criativo-16x9.png" }
};

let activeFormat = "story";
let uploadedImage = null;
let fitMode = "cover";
let backgroundColor = "#ffffff";
let textColor = "#ffffff";
let textAlign = "center";
let textX = 50;
let textY = 50;

const preview = document.getElementById("generic-preview");
const previewCanvas = document.getElementById("preview-canvas");
const previewImage = document.getElementById("uploaded-image-preview");
const textLayer = document.getElementById("generic-text-layer");
const textPreview = document.getElementById("generic-text-preview");
const textInput = document.getElementById("generic-text-input");
const charCount = document.getElementById("generic-char-count");
const fontSize = document.getElementById("generic-font-size");
const fontOutput = document.getElementById("generic-font-output");
const position = document.getElementById("generic-position");
const positionOutput = document.getElementById("generic-position-output");
const imageUpload = document.getElementById("image-upload");
const imageActions = document.getElementById("image-actions");
const removeImage = document.getElementById("remove-image");
const formatCaption = document.getElementById("format-caption");
const downloadNote = document.getElementById("download-note");
const downloadButton = document.getElementById("download-creative");
const exportStatus = document.getElementById("generic-export-status");
const customColor = document.getElementById("background-color");

function currentFormat() {
  return formats[activeFormat];
}

function applyFormat() {
  const format = currentFormat();
  preview.style.setProperty("--preview-ratio", format.width + " / " + format.height);
  formatCaption.textContent = format.label;
  downloadNote.textContent = "PNG • " + format.width + " × " + format.height + " px";
  scalePreviewText();
}

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFormat = button.dataset.format;
    document.querySelectorAll("[data-format]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    applyFormat();
  });
});

function readUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

imageUpload.addEventListener("change", async () => {
  const file = imageUpload.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await readUpload(file);
    const image = new Image();
    image.onload = () => {
      uploadedImage = image;
      previewImage.src = dataUrl;
      previewImage.hidden = false;
      imageActions.hidden = false;
      updateFit();
    };
    image.src = dataUrl;
  } catch {
    alert("Não foi possível carregar a imagem.");
  }
});

removeImage.addEventListener("click", () => {
  uploadedImage = null;
  imageUpload.value = "";
  previewImage.removeAttribute("src");
  previewImage.hidden = true;
  imageActions.hidden = true;
});

function updateFit() {
  previewImage.style.objectFit = fitMode;
}

document.querySelectorAll("[data-fit]").forEach((button) => {
  button.addEventListener("click", () => {
    fitMode = button.dataset.fit;
    document.querySelectorAll("[data-fit]").forEach((item) => item.classList.toggle("is-active", item === button));
    updateFit();
  });
});

function setBackground(value) {
  backgroundColor = value;
  previewCanvas.style.background = value;
  document.querySelectorAll("[data-bg]").forEach((button) => button.classList.toggle("is-active", button.dataset.bg.toLowerCase() === value.toLowerCase()));
}

document.querySelectorAll("[data-bg]").forEach((button) => {
  button.addEventListener("click", () => setBackground(button.dataset.bg));
});

customColor.addEventListener("input", () => setBackground(customColor.value));

function updateText() {
  const value = textInput.value.trim();
  textPreview.textContent = value || "SEU TEXTO";
  charCount.textContent = textInput.value.length + "/180";
}

function scalePreviewText() {
  const format = currentFormat();
  const baseWidth = format.width;
  const scale = previewCanvas.clientWidth / baseWidth;
  textPreview.style.fontSize = Number(fontSize.value) * scale + "px";
  textPreview.style.webkitTextStrokeWidth = Math.max(1, Number(fontSize.value) * 0.035 * scale) + "px";
}

function updateFont() {
  fontOutput.textContent = fontSize.value;
  scalePreviewText();
}

function applyTextPosition() {
  textLayer.style.left = textX + "%";
  textLayer.style.top = textY + "%";
}

function updatePosition() {
  textY = Number(position.value);
  applyTextPosition();
  positionOutput.textContent = position.value + "%";
}

function setAlign(value) {
  textAlign = value;
  textLayer.style.textAlign = value;
  document.querySelectorAll("[data-generic-align]").forEach((button) => button.classList.toggle("is-active", button.dataset.genericAlign === value));
}

function setTextColor(value) {
  textColor = value;
  textPreview.style.color = value;
  textPreview.style.webkitTextStrokeColor = value === "#ffffff" ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.58)";
  document.querySelectorAll("[data-generic-color]").forEach((button) => button.classList.toggle("is-active", button.dataset.genericColor === value));
}

textInput.addEventListener("input", updateText);
fontSize.addEventListener("input", updateFont);
position.addEventListener("input", updatePosition);
document.querySelectorAll("[data-generic-align]").forEach((button) => button.addEventListener("click", () => setAlign(button.dataset.genericAlign)));
document.querySelectorAll("[data-generic-color]").forEach((button) => button.addEventListener("click", () => setTextColor(button.dataset.genericColor)));

function wrapText(ctx, text, maxWidth, fontPx) {
  const paragraphs = text.split("\n");
  const lines = [];
  ctx.font = "800 " + fontPx + "px Arial, sans-serif";

  paragraphs.forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let line = "";
    for (const word of words) {
      const candidate = line ? line + " " + word : word;
      if (ctx.measureText(candidate).width <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  });

  return lines;
}

function drawImage(ctx, image, width, height, mode) {
  const ir = image.naturalWidth / image.naturalHeight;
  const cr = width / height;
  let dw, dh, dx, dy;

  if (mode === "cover") {
    if (ir > cr) {
      dh = height;
      dw = height * ir;
      dx = (width - dw) / 2;
      dy = 0;
    } else {
      dw = width;
      dh = width / ir;
      dx = 0;
      dy = (height - dh) / 2;
    }
  } else {
    if (ir > cr) {
      dw = width;
      dh = width / ir;
      dx = 0;
      dy = (height - dh) / 2;
    } else {
      dh = height;
      dw = height * ir;
      dx = (width - dw) / 2;
      dy = 0;
    }
  }

  ctx.drawImage(image, dx, dy, dw, dh);
}

async function exportCreative() {
  const format = currentFormat();
  const canvas = document.createElement("canvas");
  canvas.width = format.width;
  canvas.height = format.height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (uploadedImage) drawImage(ctx, uploadedImage, canvas.width, canvas.height, fitMode);

  const content = textInput.value.trim();
  if (content) {
    let fontPx = Number(fontSize.value);
    const maxWidth = canvas.width * 0.86;
    const maxHeight = canvas.height * 0.72;
    let lines = wrapText(ctx, content, maxWidth, fontPx);
    let lineHeight = fontPx * 1.05;

    while (fontPx > 24 && (lines.length * lineHeight > maxHeight || lines.some((line) => ctx.measureText(line).width > maxWidth))) {
      fontPx -= 2;
      lineHeight = fontPx * 1.05;
      lines = wrapText(ctx, content, maxWidth, fontPx);
    }

    ctx.font = "800 " + fontPx + "px Arial, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = textAlign;
    ctx.lineJoin = "round";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = textColor === "#ffffff" ? "rgba(0,0,0,.58)" : "rgba(255,255,255,.62)";
    ctx.lineWidth = Math.max(3, fontPx * 0.035);

    const centerX = canvas.width * (textX / 100);
    const blockHalfWidth = maxWidth / 2;
    const x = textAlign === "left" ? centerX - blockHalfWidth : textAlign === "right" ? centerX + blockHalfWidth : centerX;
    const blockHeight = lines.length * lineHeight;
    let y = canvas.height * (textY / 100) - blockHeight / 2 + lineHeight / 2;

    lines.forEach((line) => {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      y += lineHeight;
    });
  }

  return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

downloadButton.addEventListener("click", async () => {
  try {
    downloadButton.disabled = true;
    exportStatus.textContent = "Gerando arte…";
    const blob = await exportCreative();
    if (!blob) throw new Error("Falha ao gerar arquivo");

    const format = currentFormat();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = format.file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 600);
    exportStatus.textContent = "Arte baixada.";
  } catch (error) {
    console.error(error);
    exportStatus.textContent = "Não foi possível gerar a arte.";
  } finally {
    downloadButton.disabled = false;
  }
});

let draggingText = false;

function moveGenericText(clientX, clientY) {
  const rect = previewCanvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  textX = Math.max(7, Math.min(93, x));
  textY = Math.max(8, Math.min(92, y));
  position.value = String(Math.round(textY));
  positionOutput.textContent = Math.round(textY) + "%";
  applyTextPosition();
}

textLayer.addEventListener("pointerdown", (event) => {
  draggingText = true;
  textLayer.setPointerCapture(event.pointerId);
  textLayer.classList.add("is-dragging");
  moveGenericText(event.clientX, event.clientY);
  event.preventDefault();
});

textLayer.addEventListener("pointermove", (event) => {
  if (!draggingText) return;
  moveGenericText(event.clientX, event.clientY);
  event.preventDefault();
});

function stopGenericDrag(event) {
  if (!draggingText) return;
  draggingText = false;
  textLayer.classList.remove("is-dragging");
  if (event.pointerId !== undefined && textLayer.hasPointerCapture(event.pointerId)) {
    textLayer.releasePointerCapture(event.pointerId);
  }
}

textLayer.addEventListener("pointerup", stopGenericDrag);
textLayer.addEventListener("pointercancel", stopGenericDrag);

window.addEventListener("resize", scalePreviewText);

setBackground("#ffffff");
setTextColor("#ffffff");
setAlign("center");
updateText();
updateFont();
updatePosition();
applyFormat();