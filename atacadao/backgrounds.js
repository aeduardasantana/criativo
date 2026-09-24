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
  button.addEventListener("click", () => selectBackground(background, button));
  grid.appendChild(button);
});

function selectBackground(background, button) {
  document.querySelectorAll(".background-card").forEach((card) => {
    const selected = card === button;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });

  const src = getSrc(background.file);
  selectedPreview.src = src;
  selectedPreview.alt = "Prévia do fundo " + background.id + " selecionado";
  selectedName.textContent = "Fundo " + String(background.id).padStart(2, "0");
  panel.hidden = false;

  sessionStorage.setItem("stickerBackground", JSON.stringify({
    id: background.id,
    file: background.file
  }));

  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

clearButton.addEventListener("click", () => {
  document.querySelectorAll(".background-card").forEach((card) => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
  });
  panel.hidden = true;
  sessionStorage.removeItem("stickerBackground");
  document.getElementById("fundos-titulo").scrollIntoView({ behavior: "smooth", block: "start" });
});

try {
  const saved = JSON.parse(sessionStorage.getItem("stickerBackground"));
  if (saved?.id) {
    const background = backgrounds.find((item) => item.id === saved.id);
    const button = grid.querySelector('[data-id="' + saved.id + '"]');
    if (background && button) selectBackground(background, button);
  }
} catch (_) {
  sessionStorage.removeItem("stickerBackground");
}