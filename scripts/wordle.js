const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
// Simple word list (expand or load from JSON)
const wordList = ["bitch", "cunts", "fucks", "skank", "sluts", "shits", "dummy", "fucky", "ninja", "sigma", "cunty", "clits", "gspot", "chink", "titty", "boobs", "poons", "wanks", "jerks", "blown", "trash", "tramp", "whore", "queef", "tards", "pissa", "shite", "droog", "spank", "daddy", "mommy", "erect", "shart"];
let validWords = [];
let solution;
let currentGuess = "";
let currentRow = 0;
let isGameOver = false;

Promise.all([
  fetch("/scripts/valid-guesses.json").then(r => r.json())
]).then(([valids]) => {
  validWords = valids;
});

console.log(validWords);


function pickSolution() {
  solution = wordList[Math.floor(Math.random() * wordList.length)];
  console.log("Solution (for dev):", solution);
}

function init() {
  pickSolution();
  const grid = document.getElementById('grid');
  for (let i = 0; i < MAX_GUESSES; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < WORD_LENGTH; j++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }
  initKeyboard();
  document.addEventListener('keydown', handleKey);
}
/*
function initKeyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
  const kb = document.getElementById('keyboard');
  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.textContent = k;
    btn.className = 'key';
    btn.onclick = () => handleKey({key: k});
    kb.appendChild(btn);
  });
  // Add Enter and Backspace
  ['Enter','Backspace'].forEach(k => {
    const btn = document.createElement('button');
    btn.textContent = k;
    btn.className = 'key';
    btn.onclick = () => handleKey({key: k});
    kb.appendChild(btn);
  });
}
*/
function initKeyboard() {
  const keyboard = document.getElementById("keyboard");
  // 1) nuke any existing buttons or rows
  keyboard.innerHTML = "";

  // 2) define your three rows
  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"]
  ];

  // 3) build the rows + keys
  rows.forEach(keyArray => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    keyArray.forEach(key => {
      const btn = document.createElement("button");
      btn.classList.add("key");
      btn.dataset.key = key;
      btn.textContent = key === "BACKSPACE" ? "⌫" : key;
      rowDiv.appendChild(btn);
    });
    keyboard.appendChild(rowDiv);
  });

  // 4) wire up clicks to your existing handler
  keyboard.addEventListener("click", e => {
    if (!e.target.matches(".key")) return;
    handleKey(e.target.dataset.key);
  });
}
function handleKey(e) {
  if (isGameOver) return;
  const key = e.key;
  if (key === 'Backspace') {
    currentGuess = currentGuess.slice(0, -1);
  } else if (key === 'Enter') {
    if (currentGuess.length !== WORD_LENGTH) return;
    if (!validWords.includes(currentGuess)) { alert('Not in word list'); return; }
    const colors = evaluateGuess(currentGuess);
    updateUI(currentRow, currentGuess, colors);
    currentRow++;
    currentGuess = '';
    if (colors.every(c => c === 'correct')) { endGame(true); return; }
    if (currentRow === MAX_GUESSES) { endGame(false); return; }
    return;
  } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
    currentGuess += key.toLowerCase();
  } else {
    return;
  }
  updateCurrentRow();
}

function updateCurrentRow() {
  const row = document.getElementsByClassName('row')[currentRow];
  Array.from(row.children).forEach((tile, idx) => {
    tile.textContent = currentGuess[idx] || '';
    tile.className = 'tile';
  });
}

function evaluateGuess(guess) {
  const result = Array(WORD_LENGTH).fill('absent');
  const solArr = solution.split('');
  // First pass: correct
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solArr[i]) { result[i] = 'correct'; solArr[i] = null; }
  }
  // Second pass: present
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    const idx = solArr.indexOf(guess[i]);
    if (idx > -1) { result[i] = 'present'; solArr[idx] = null; }
  }
  return result;
}

function updateUI(rowIdx, guess, colors) {
  const row = document.getElementsByClassName('row')[rowIdx];
  Array.from(row.children).forEach((tile, idx) => {
    tile.textContent = guess[idx].toUpperCase();
    tile.classList.add(colors[idx]);
  });
  // Update keyboard
  guess.toUpperCase().split('').forEach((k, i) => updateKey(k, colors[i]));
}

function updateKey(k, color) {
  const btn = Array.from(document.getElementsByClassName('key')).find(b => b.textContent === k);
  if (!btn || btn.classList.contains('correct')) return;
  if (color === 'correct') btn.classList.add('correct');
  else if (color === 'present' && !btn.classList.contains('present')) btn.classList.add('present');
  else if (color === 'absent') btn.classList.add('absent');
}

function endGame(win) {
  isGameOver = true;
  setTimeout(() => {
    alert(win ? '𓂺 you\'ve won, you filthy slut 𓂺': `Game over! Word was: ${solution.toUpperCase()}`);
  }, 100);
}

document.addEventListener('DOMContentLoaded', init);
