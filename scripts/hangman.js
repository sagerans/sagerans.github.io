// ----- Config -----
const MAX_GUESSES = 8;
const DICTIONARY_URL = "dictionary.json"; // same folder as index.html

// ----- State -----
let dictionaryEntries = []; // [ [word, definition], ... ]
let currentWord = "";
let currentDefinition = "";
let guessedLetters = new Set();
let wrongLetters = new Set();
let remainingGuesses = MAX_GUESSES;
let gameOver = false;

// ----- DOM -----
const wordDisplayEl = document.getElementById("word-display");
const remainingEl = document.getElementById("remaining");
const wrongListEl = document.getElementById("wrong-list");
const keyboardEl = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const defPanelEl = document.getElementById("definition-panel");
const finalWordEl = document.getElementById("final-word");
const finalDefEl = document.getElementById("final-definition");
const newGameBtn = document.getElementById("new-game-btn");

// ----- Init -----
fetch(DICTIONARY_URL)
  .then(resp => {
    if (!resp.ok) throw new Error("Failed to load dictionary.json");
    return resp.json();
  })
  .then(data => {
    /*
      Expecting: [ { "word1": "def1", "word2": "def2", ... } ]
      but you can swap this to match whatever you actually have.
    */
    if (Array.isArray(data) && typeof data[0] === "object") {
      const bigObj = data[0];
      dictionaryEntries = Object.entries(bigObj); // [ [word, definition], ... ]
    } else if (!Array.isArray(data) && typeof data === "object") {
      // fallback if it's just {word: def, ...}
      dictionaryEntries = Object.entries(data);
    } else {
      throw new Error("Unexpected dictionary format");
    }

    if (dictionaryEntries.length === 0) {
      throw new Error("Dictionary is empty");
    }

    buildKeyboard();
    startNewGame();
  })
  .catch(err => {
    console.error(err);
    wordDisplayEl.textContent = "Error loading dictionary :(";
  });

// ----- Game Setup -----
function startNewGame() {
  if (dictionaryEntries.length === 0) return;

  const [word, definition] = pickRandomEntry(dictionaryEntries);
  currentWord = word.toLowerCase();
  currentDefinition = definition;

  guessedLetters.clear();
  wrongLetters.clear();
  remainingGuesses = MAX_GUESSES;
  gameOver = false;

  remainingEl.textContent = remainingGuesses;
  wrongListEl.textContent = "None";
  messageEl.textContent = "";
  messageEl.className = "";
  defPanelEl.classList.add("hidden");
  finalWordEl.textContent = "";
  finalDefEl.textContent = "";

  updateWordDisplay();
  setKeyboardEnabled(true);
}

function pickRandomEntry(entries) {
  const idx = Math.floor(Math.random() * entries.length);
  return entries[idx];
}

// ----- Rendering -----
function updateWordDisplay() {
  const chars = currentWord.split("");
  const displayChars = chars.map(ch => {
    if (!/^[a-zA-Z]$/.test(ch)) {
      // keep punctuation/hyphen/apostrophe visible
      return ch;
    }
    return guessedLetters.has(ch) ? ch.toUpperCase() : "_";
  });
  wordDisplayEl.textContent = displayChars.join(" ");
}

function updateWrongLettersDisplay() {
  if (wrongLetters.size === 0) {
    wrongListEl.textContent = "None";
  } else {
    wrongListEl.textContent = Array.from(wrongLetters).sort().join(" ");
  }
}

function showEndState(win) {
  gameOver = true;
  setKeyboardEnabled(false);

  if (win) {
    messageEl.textContent = "You guessed it! 🎉";
    messageEl.className = "win";
  } else {
    messageEl.textContent = "Out of guesses!";
    messageEl.className = "lose";
  }

  // Reveal full word & definition regardless of win/lose
  finalWordEl.textContent = currentWord;
  finalDefEl.textContent = currentDefinition || "(No definition available.)";
  defPanelEl.classList.remove("hidden");
}

// ----- Keyboard -----
function buildKeyboard() {
  keyboardEl.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const ch of letters) {
    const btn = document.createElement("button");
    btn.className = "key-btn";
    btn.textContent = ch;
    btn.dataset.letter = ch.toLowerCase();
    btn.addEventListener("click", onLetterClick);
    keyboardEl.appendChild(btn);
  }

  // Optional: listen to physical keyboard as well
  window.addEventListener("keydown", onPhysicalKey);
}

function setKeyboardEnabled(enabled) {
  const buttons = keyboardEl.querySelectorAll(".key-btn");
  buttons.forEach(btn => {
    btn.disabled = !enabled || guessedLetters.has(btn.dataset.letter) || wrongLetters.has(btn.dataset.letter);
  });
}

function onLetterClick(e) {
  const letter = e.target.dataset.letter;
  handleGuess(letter);
}

function onPhysicalKey(e) {
  if (gameOver) return;
  const letter = e.key.toLowerCase();
  if (letter.length === 1 && letter >= "a" && letter <= "z") {
    handleGuess(letter);
  }
}

// ----- Game Logic -----
function handleGuess(letter) {
  if (gameOver) return;
  if (guessedLetters.has(letter) || wrongLetters.has(letter)) return; // already tried

  if (currentWord.includes(letter)) {
    guessedLetters.add(letter);
  } else {
    wrongLetters.add(letter);
    remainingGuesses--;
    remainingEl.textContent = remainingGuesses;
    updateWrongLettersDisplay();
  }

  updateWordDisplay();
  updateKeyboardButtons(letter);

  checkGameState();
}

function updateKeyboardButtons(letter) {
  const btn = keyboardEl.querySelector(`.key-btn[data-letter="${letter}"]`);
  if (btn) {
    btn.disabled = true;
  }
}

function checkGameState() {
  const allLettersRevealed = currentWord
    .split("")
    .filter(ch => /^[a-zA-Z]$/.test(ch))
    .every(ch => guessedLetters.has(ch.toLowerCase()));

  if (allLettersRevealed) {
    showEndState(true);
  } else if (remainingGuesses <= 0) {
    // reveal the word visually too
    guessedLetters = new Set(
      currentWord
        .split("")
        .filter(ch => /^[a-zA-Z]$/.test(ch))
        .map(ch => ch.toLowerCase())
    );
    updateWordDisplay();
    showEndState(false);
  }
}

// ----- Events -----
newGameBtn.addEventListener("click", () => {
  startNewGame();
});
