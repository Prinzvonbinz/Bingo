let cards = JSON.parse(localStorage.getItem("bingoCards")) || [];
let currentCard = null;
let currentColor = null;
const colors = ["red", "blue", "green", "purple", "orange", "gold"];

function updateMainMenu() {
  const container = document.getElementById("savedCards");
  container.innerHTML = "";
  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${card.name}</h3>
      <button onclick="editCard(${index})">📝 Bearbeiten</button>
      <button onclick="startGame(${index})">▶️ Spielen</button>
      <button onclick="deleteCard(${index})">🗑️ Löschen</button>
    `;
    container.appendChild(div);
  });
}

function deleteCard(index) {
  if (confirm(`Karte "${cards[index].name}" löschen?`)) {
    cards.splice(index, 1);
    localStorage.setItem("bingoCards", JSON.stringify(cards));
    updateMainMenu();
  }
}

function createNewCard() {
  currentCard = {
    name: "",
    fields: Array(16).fill({ category: "", description: "" })
  };
  showEditor();
}

function editCard(index) {
  currentCard = JSON.parse(JSON.stringify(cards[index]));
  showEditor();
}

function showEditor() {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("editorMenu").classList.remove("hidden");
  document.getElementById("cardNameInput").value = currentCard.name;
  const grid = document.getElementById("bingoGrid");
  grid.innerHTML = "";
  currentCard.fields.forEach((field, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    const catInput = document.createElement("input");
    catInput.value = field.category;
    catInput.placeholder = "Kategorie";
    const descInput = document.createElement("input");
    descInput.value = field.description;
    descInput.placeholder = "Beschreibung";
    catInput.oninput = () => currentCard.fields[i].category = catInput.value;
    descInput.oninput = () => currentCard.fields[i].description = descInput.value;
    cell.appendChild(catInput);
    cell.appendChild(descInput);
    grid.appendChild(cell);
  });
}

function saveCard() {
  currentCard.name = document.getElementById("cardNameInput").value || "Unbenannte Karte";
  const index = cards.findIndex(c => c.name === currentCard.name);
  if (index >= 0) {
    cards[index] = currentCard;
  } else {
    cards.push(currentCard);
  }
  localStorage.setItem("bingoCards", JSON.stringify(cards));
  backToMain();
}

function backToMain() {
  document.getElementById("editorMenu").classList.add("hidden");
  document.getElementById("gameMenu").classList.add("hidden");
  document.getElementById("mainMenu").classList.remove("hidden");
  updateMainMenu();
}

function playCard() {
  document.getElementById("editorMenu").classList.add("hidden");
  document.getElementById("gameMenu").classList.remove("hidden");
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";
  currentCard.fields.forEach((field, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    const title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.innerText = field.category;
    const desc = document.createElement("div");
    desc.innerText = field.description;
    const marking = document.createElement("div");
    marking.className = "marking";
    cell.appendChild(title);
    cell.appendChild(desc);
    cell.appendChild(marking);
    cell.addEventListener("click", () => {
      if (!currentColor) return;
      const existing = Array.from(marking.children).map(c => c.dataset.color);
      if (!existing.includes(currentColor)) {
        const stripe = document.createElement("div");
        stripe.className = "stripe";
        stripe.style.backgroundColor = currentColor;
        stripe.dataset.color = currentColor;
        marking.appendChild(stripe);
      }
    });
    grid.appendChild(cell);
  });

  const palette = document.getElementById("colorPalette");
  palette.innerHTML = "";
  colors.forEach(c => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.style.backgroundColor = c;
    btn.onclick = () => {
      currentColor = c;
      document.querySelectorAll(".color-btn").forEach(b => b.style.outline = "none");
      btn.style.outline = "3px solid black";
    };
    palette.appendChild(btn);
  });
}

function startGame(index) {
  currentCard = JSON.parse(JSON.stringify(cards[index]));
  playCard();
}

function exitGame() {
  showEditor();
}

updateMainMenu();
