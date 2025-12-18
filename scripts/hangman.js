// ----- Config -----
const MAX_GUESSES = 8;
const DICTIONARY_URL = "scripts/dictionary.json"; // same folder as index.html
const HANGMAN_IMAGES = [
  "images/hangman0.png",
  "images/hangman1.png",
  "images/hangman2.png",
  "images/hangman3.png",
  "images/hangman4.png",
  "images/hangman5.png",
  "images/hangman6.png",
  "images/hangman7.png",
  "images/hangman8.png"
];
const DAILY_TIMEZONE = "America/New_York";
const LS_PREFIX = "sage_hangman_daily_v1";
const STATS_KEY = "sage_hangman_stats_v1";

// ----- State -----
let mode = "daily"; // "daily" | "practice"
let practiceIndex = null; // store current practice word index
let dictionaryEntries = []; // [ [word, definition], ... ]
let currentWord = "";
let currentDefinition = "";
let guessedLetters = new Set();
let wrongLetters = new Set();
let remainingGuesses = MAX_GUESSES;
let gameOver = false;

// ----- DOM -----
const dailyBtn = document.getElementById("daily-btn");
const practiceBtn = document.getElementById("practice-btn");
const wordDisplayEl = document.getElementById("word-display");
const remainingEl = document.getElementById("remaining");
const wrongListEl = document.getElementById("wrong-list");
const keyboardEl = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const defPanelEl = document.getElementById("definition-panel");
const finalWordEl = document.getElementById("final-word");
const finalDefEl = document.getElementById("final-definition");
const newGameBtn = document.getElementById("new-game-btn");
const hangmanImgEl = document.getElementById("hangman-image");
const modeIndicatorEl = document.getElementById("mode-indicator");
const statsBarEl = document.getElementById("stats-bar");
hangmanImgEl.addEventListener("error", () => {
  console.error("Hangman image failed to load:", hangmanImgEl.src);
});

updateModeIndicator();
renderStatsBar();

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || {
      wins: 0,
      losses: 0,
      currentStreak: 0,
      bestStreak: 0,
      days: {} // dateKey -> { win, guessesUsed, word }
    };
  } catch {
    return { wins: 0, losses: 0, currentStreak: 0, bestStreak: 0, days: {} };
  }
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function renderStatsBar() {
  if (!statsBarEl) return;
  const s = loadStats();
  statsBarEl.textContent = 
    `Wins: ${s.wins}  Losses: ${s.losses}  Percent: ${s.wins/(s.wins+s.losses)*100}%  Streak: ${s.currentStreak}  Best: ${s.bestStreak}`;
}

// Get YYYY-MM-DD in a chosen timezone (avoids "my timezone vs yours" weirdness)
function getDateKeyInTZ(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const d = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

// Simple stable string hash -> 32-bit unsigned
function hashStringToUint32(s) {
  let h = 2166136261; // FNV-1a-ish
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dailyIndexFor(dateKey, count) {
  // Salt keeps it from being "obvious" and lets you change the sequence later
  const salt = "hangman_daily_salt_v1";
  return hashStringToUint32(`${salt}:${dateKey}`) % count;
}

function saveDailyState(dateKey, index) {
  const payload = {
    dateKey,
    index,
    guessed: Array.from(guessedLetters),
    wrong: Array.from(wrongLetters),
    remainingGuesses,
    gameOver
  };
  localStorage.setItem(`${LS_PREFIX}:state`, JSON.stringify(payload));
}

function loadDailyState() {
  const raw = localStorage.getItem(`${LS_PREFIX}:state`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearDailyState() {
  localStorage.removeItem(`${LS_PREFIX}:state`);
}

function updateModeIndicator() {
  modeIndicatorEl.textContent =
    mode === "daily" ? "Mode: Daily" : "Mode: Practice";
}

function loadWordByIndex(index) {
  const [word, definition] = dictionaryEntries[index];
  currentWord = word.toLowerCase();
  currentDefinition = definition;
}

function resetRoundState() {
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
  updateHangmanImage();
}

// ----- Init -----
fetch(DICTIONARY_URL)
  .then(resp => {
    if (!resp.ok) throw new Error("Failed to load dictionary.json");
    return resp.json();
  })
  .then(data => {
    /*
      EXPECTED FORMAT (your file):

      [
        { "anarchic": "def...", "anopheles": "def...", ... },
        { "biggest": "def...", "blindstory": "def...", ... },
        ...
      ]

      i.e. an array of objects, each object holding many word: definition pairs.
    */

    const entries = [];

    if (Array.isArray(data)) {
      for (const chunk of data) {
        if (chunk && typeof chunk === "object") {
          // Add all [word, definition] pairs from this chunk
          for (const [word, def] of Object.entries(chunk)) {
            // Optional: skip weird empty keys, etc.
            if (typeof word === "string" && typeof def === "string") {
              entries.push([word, def]);
            }
          }
        }
      }
    } else if (data && typeof data === "object") {
      // Fallback in case it's just a single big object {word: def, ...}
      for (const [word, def] of Object.entries(data)) {
        if (typeof word === "string" && typeof def === "string") {
          entries.push([word, def]);
        }
      }
    } else {
      throw new Error("Unexpected dictionary format");
    }

    if (entries.length === 0) {
      throw new Error("Dictionary is empty");
    }

    dictionaryEntries = entries;

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

  if (mode === "daily") {
    const dateKey = getDateKeyInTZ(DAILY_TIMEZONE);
    const index = dailyIndexFor(dateKey, dictionaryEntries.length);

    loadWordByIndex(index);

    const saved = loadDailyState();
    const shouldRestore = saved && saved.dateKey === dateKey && saved.index === index;

    if (shouldRestore) {
      guessedLetters = new Set(saved.guessed || []);
      wrongLetters = new Set(saved.wrong || []);
      remainingGuesses = typeof saved.remainingGuesses === "number" ? saved.remainingGuesses : MAX_GUESSES;
      gameOver = !!saved.gameOver;
    } else {
      guessedLetters.clear();
      wrongLetters.clear();
      remainingGuesses = MAX_GUESSES;
      gameOver = false;
      clearDailyState();
    }

    remainingEl.textContent = remainingGuesses;
    updateWrongLettersDisplay();
    messageEl.textContent = "";
    messageEl.className = "";
    defPanelEl.classList.add("hidden");
    finalWordEl.textContent = "";
    finalDefEl.textContent = "";

    updateWordDisplay();
    updateHangmanImage();
    setKeyboardEnabled(!gameOver);

    if (gameOver) {
      finalWordEl.textContent = currentWord;
      finalDefEl.textContent = currentDefinition || "(No definition available.)";
      defPanelEl.classList.remove("hidden");
    }

    // In daily mode, “New Game” is disabled (daily is fixed)
    newGameBtn.disabled = true;
    newGameBtn.title = "Daily mode: come back tomorrow for a new word.";
    return;
  }

  // practice mode
  const idx = Math.floor(Math.random() * dictionaryEntries.length);
  practiceIndex = idx;
  loadWordByIndex(idx);

  resetRoundState();

  newGameBtn.disabled = false;
  newGameBtn.title = "New practice word";
}

function pickRandomEntry(entries) {
  const idx = Math.floor(Math.random() * entries.length);
  return entries[idx];
}

// ----- Rendering -----

function updateHangmanImage() {
  const wrongCount = MAX_GUESSES - remainingGuesses; // 0..MAX_GUESSES
  const index = Math.min(wrongCount, HANGMAN_IMAGES.length - 1);

  // cache-bust so you can *see* it change even if the browser is sticky
  hangmanImgEl.src = `${HANGMAN_IMAGES[index]}?v=${index}`;
}

function updateWordDisplay() {
  const chars = currentWord.split("");
  const displayChars = chars.map(ch => {
    if (ch === " ") {
      // return " /  ";
      return "\u00A0\u00A0";
    }

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

function recordDailyResult(win) {
  if (mode !== "daily") return;

  const dateKey = getDateKeyInTZ(DAILY_TIMEZONE);
  const stats = loadStats();

  // Don’t double-count if they reload and end screen shows again
  if (stats.days[dateKey]) return;

  const guessesUsed = MAX_GUESSES - remainingGuesses; // wrong guesses used
  stats.days[dateKey] = { win, guessesUsed, word: currentWord };

  if (win) {
    stats.wins += 1;
    stats.currentStreak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  } else {
    stats.losses += 1;
    stats.currentStreak = 0;
  }

  saveStats(stats);
  renderStatsBar();
}

function showEndState(win) {
  gameOver = true;
  setKeyboardEnabled(false);

  if (mode === "daily") {
    const dateKey = getDateKeyInTZ(DAILY_TIMEZONE);
    const index = dailyIndexFor(dateKey, dictionaryEntries.length);
    saveDailyState(dateKey, index);
  }

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

  // Save win / lose state
  recordDailyResult(win);
  renderStatsBar();
}

// ----- Keyboard -----
const KEYBOARD_ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM"
];

function buildKeyboard() {
  keyboardEl.innerHTML = "";

  for (const row of KEYBOARD_ROWS) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    for (const ch of row) {
      const btn = document.createElement("button");
      btn.className = "key-btn";
      btn.textContent = ch;
      btn.dataset.letter = ch.toLowerCase();
      btn.addEventListener("click", onLetterClick);
      rowDiv.appendChild(btn);
    }

    keyboardEl.appendChild(rowDiv);
  }

  // Optional: listen to physical keyboard as well
  window.addEventListener("keydown", onPhysicalKey);
}

function setKeyboardEnabled(enabled) {
  const buttons = keyboardEl.querySelectorAll(".key-btn");
  buttons.forEach(btn => {
    btn.disabled =
      !enabled ||
      guessedLetters.has(btn.dataset.letter) ||
      wrongLetters.has(btn.dataset.letter);
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
  if (guessedLetters.has(letter) || wrongLetters.has(letter)) return;

  if (currentWord.includes(letter)) {
    guessedLetters.add(letter);
  } else {
    console.log("WRONG GUESS:", letter, "remaining:", remainingGuesses);
    wrongLetters.add(letter);
    remainingGuesses--;
    remainingEl.textContent = remainingGuesses;
    updateWrongLettersDisplay();
    updateHangmanImage(); // <-- move here
  }

  updateWordDisplay();
  updateKeyboardButtons(letter);

  if (mode === "daily") {
    const dateKey = getDateKeyInTZ(DAILY_TIMEZONE);
    const index = dailyIndexFor(dateKey, dictionaryEntries.length);
    saveDailyState(dateKey, index);
  }

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

dailyBtn.addEventListener("click", () => {
  mode = "daily";
  updateModeIndicator();
  startNewGame();
});

practiceBtn.addEventListener("click", () => {
  mode = "practice";
  updateModeIndicator();
  startNewGame();
})

/*
});
dailyBtn.addEventListener("click", () => {
  mode = "daily";
  startNewGame();
});

practiceBtn.addEventListener("click", () => {
  mode = "practice";
  startNewGame();
});
*/

// In practice mode, this makes a new random word.
// In daily mode, it's disabled anyway.
newGameBtn.addEventListener("click", () => {
  if (mode === "practice") startNewGame();
});

/*
newGameBtn.addEventListener("click", () => {
  startNewGame();
});
*/
