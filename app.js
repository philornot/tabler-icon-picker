const ICONS = [
  ["heart-handshake", "wolontariat"],
  ["heart", "serce"],
  ["users", "wolontariusze"],
  ["user-heart", "opiekun"],
  ["baby-carriage", "dzieci"],
  ["wheelchair", "niepełnosp."],
  ["walk", "aktywność"],
  ["hand-stop", "pomoc"],
  ["hands-helping", "wsparcie"],
  ["mood-smile", "radość"],
  ["mood-happy", "szczęście"],

  ["leaf", "ekologia"],
  ["tree", "drzewo"],
  ["plant", "roślina"],
  ["recycle", "recykling"],
  ["droplet", "woda"],
  ["sun", "słońce"],
  ["cloud", "środowisko"],
  ["paw", "zwierzęta"],

  ["book-open", "edukacja"],
  ["school", "szkoła"],
  ["pencil", "nauka"],
  ["certificate", "certyfikat"],
  ["notebook", "notatki"],
  ["presentation", "wykład"],
  ["bulb", "pomysł"],

  ["stethoscope", "zdrowie"],
  ["first-aid-kit", "apteczka"],
  ["pill", "leki"],
  ["heartbeat", "tętno"],
  ["brain", "zdrowie psych."],
  ["bandage", "opatrunek"],

  ["building-community", "społeczność"],
  ["home", "dom"],
  ["tools", "remonty"],
  ["hammer", "budownictwo"],
  ["soup", "kuchnia"],
  ["shopping-cart", "zakupy"],
  ["gift", "prezent"],
  ["package", "paczka"],

  ["calendar-event", "wydarzenie"],
  ["map-pin", "lokalizacja"],
  ["flag", "inicjatywa"],
  ["trophy", "osiągnięcia"],
  ["star", "wyróżnienie"],
  ["medal", "medal"],
  ["speakerphone", "ogłoszenia"],
  ["music", "muzyka"],
  ["palette", "sztuka"],
  ["camera", "foto"],

  ["mail", "email"],
  ["phone", "telefon"],
  ["message-circle", "rozmowa"],
  ["world", "globalnie"],
  ["share", "udostępnij"]
];

const grid = document.getElementById("grid");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");
const emptyTerm = document.getElementById("empty-term");

const selBar = document.getElementById("selected-bar");
const selPreview = document.getElementById("selected-preview");
const selName = document.getElementById("selected-name");
const clearBtn = document.getElementById("clear-btn");

let currentValue = "";

function emitValue(value) {
  window.parent.postMessage({
    action: "field-plugin:set-value",
    value
  }, "*");
}

function applySelection(value) {
  currentValue = value;

  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === value);
  });

  if (value) {
    selPreview.className = `ti ${value}`;
    selName.textContent = value;
    selBar.classList.add("visible");
  } else {
    selBar.classList.remove("visible");
  }
}

function renderGrid(query = "") {
  const q = query.toLowerCase();

  const filtered = ICONS.filter(([suffix, label]) =>
    suffix.includes(q) || label.includes(q)
  );

  grid.innerHTML = "";

  if (!filtered.length) {
    emptyEl.style.display = "block";
    emptyTerm.textContent = query;
    return;
  }

  emptyEl.style.display = "none";

  filtered.forEach(([suffix, label]) => {
    const fullClass = `ti-${suffix}`;

    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.dataset.value = fullClass;

    btn.innerHTML = `
      <i class="ti ${fullClass}"></i>
      <span>${label}</span>
    `;

    if (currentValue === fullClass) btn.classList.add("active");

    btn.addEventListener("click", () => {
      applySelection(fullClass);
      emitValue(fullClass);
    });

    grid.appendChild(btn);
  });
}

searchEl.addEventListener("input", () => {
  renderGrid(searchEl.value);
});

clearBtn.addEventListener("click", () => {
  applySelection("");
  emitValue("");
});

window.addEventListener("message", e => {
  if (e.data?.action === "field-plugin:init") {
    applySelection(e.data.field?.value || "");
  }
});

window.parent.postMessage({ action: "field-plugin:ready" }, "*");

renderGrid("");