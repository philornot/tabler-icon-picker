const ICONS = [
  ["heart-handshake", "wolontariat"],
  ["heart", "serce"],
  ["users", "wolontariusze"],
  ["leaf", "ekologia"],
  ["tree", "drzewo"],
  ["book-open", "edukacja"],
  ["school", "szkoła"],
  ["stethoscope", "zdrowie"],
  ["first-aid-kit", "apteczka"],
  ["home", "dom"],
  ["gift", "prezent"],
  ["calendar-event", "wydarzenie"],
  ["map-pin", "lokalizacja"],
  ["mail", "email"],
  ["phone", "telefon"]
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

/* Storyblok emit */
function emitValue(value) {
  window.parent.postMessage(
    {
      action: "field-plugin:set-value",
      value
    },
    "*"
  );
}

/* selection */
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

/* render */
function renderGrid(query = "") {
  const q = query.toLowerCase();

  const filtered = ICONS.filter(([suffix, label]) =>
    suffix.includes(q) || label.includes(q)
  );

  grid.innerHTML = "";

  if (filtered.length === 0) {
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

/* search */
searchEl.addEventListener("input", () => {
  renderGrid(searchEl.value);
});

/* clear */
clearBtn.addEventListener("click", () => {
  applySelection("");
  emitValue("");
});

/* Storyblok init */
window.addEventListener("message", e => {
  if (e.data?.action === "field-plugin:init") {
    const value = e.data.field?.value || "";
    applySelection(value);
  }
});

/* READY handshake */
window.parent.postMessage(
  { action: "field-plugin:ready" },
  "*"
);

/* init */
renderGrid("");