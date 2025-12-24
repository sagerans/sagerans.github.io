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
const GALLOWS_WIN = [
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
⬜️🧥⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
💪🧥⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
💪🧥🤳🟫⬜️
⬜️⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
💪🧥🤳🟫⬜️
🦵⬜️⬜️🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️☹️⬜️🟫⬜️
💪🧥🤳🟫⬜️
🦵⬜️🦿🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`,
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️😵⬜️🟫⬜️
💪🧥🤳🟫⬜️
🦵⬜️🦿🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`
]

const GALLOWS_LOSE = 
`⬜️🟫🟫🟫⬜️
⬜️🟫⬜️🟫⬜️
⬜️💀⬜️🟫⬜️
💪🧥🤳🟫⬜️
🦵⬜️🦿🟫⬜️
⬜️⬜️⬜️🟫⬜️
🟫🟫🟫🟫🟫`;

const DAILY_TIMEZONE = "America/New_York";
const LS_PREFIX = "sage_hangman_daily_v1";
const STATS_KEY = "sage_hangman_stats_v1";
const NGRAM_CACHE_PREFIX = "sage_ngram_cache_v1";

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
const shareBtn = document.getElementById("share-btn");
shareBtn.textContent = "Share";
const shareStatusEl = document.getElementById("share-status");
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
const ngramPanelEl = document.getElementById("ngram-panel");
const ngramCanvasEl = document.getElementById("ngram-canvas");
const ngramNoteEl = document.getElementById("ngram-note");
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
    gameOver,
    lastWin // ADDED LAST WIN RECALL
  };
  localStorage.setItem(`${LS_PREFIX}:state`, JSON.stringify(payload));
}

function loadDailyState() {
  const raw = localStorage.getItem(`${LS_PREFIX}:state`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearDailyState() {
  localStorage.removeItem(`${LS_PREFIX}:state`);
}

// begin added share text functions
function buildDailyShareText() {
  const dateKey = getDateKeyInTZ(DAILY_TIMEZONE);

  const wrongUsed = Math.max(0, Math.min(MAX_GUESSES, MAX_GUESSES - remainingGuesses));
  // **old won** const won = (mode === "daily") && gameOver && (remainingGuesses > 0); 
  const won = !!gameOver && remainingGuesses > 0;
  // NOTE: if you store win/loss explicitly, use that instead.
  // Alternative: track lastWin in showEndState(win) (recommended below).

  // **old resultLabel** const resultLabel = (lastWin === true) ? "WIN" : "LOSS";
  const resultLabel = won ? "WIN" : "LOSS";
  const gallows = won // (lastWin === true)
    ? GALLOWS_WIN[Math.min(wrongUsed, 7)]
    : GALLOWS_LOSE;

  // Wordle-ish header line
  // Example: "Sage Hangman (Daily) 2025-12-20 WIN 3/8"
  return [
    `Hangmandle ${dateKey}\nWrong Guesses: ${wrongUsed}/${MAX_GUESSES}\n${resultLabel}`,
    ``,
    gallows
  ].join("\n");
}

async function copyTextToClipboard(text) {
  // Modern async clipboard API (works on https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function setShareEnabled(enabled) {
  if (!shareBtn) return;
  shareBtn.disabled = !enabled;
  shareBtn.title = enabled ? "Copy your result to clipboard" : "Finish today's game to share";
  shareBtn.textContent = "Share";
}

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    if (mode !== "daily") {
      shareStatusEl.textContent = "Sharing is only enabled for Daily mode.";
      return;
    }
    if (!gameOver) {
      shareStatusEl.textContent = "Finish today's game first, then share.";
      return;
    }

    try {
      const text = buildDailyShareText();
      await copyTextToClipboard(text);
      shareStatusEl.textContent = "Copied to clipboard!";
      setTimeout(() => { shareStatusEl.textContent = ""; }, 2000);
    } catch (e) {
      console.warn("Share failed:", e);
      shareStatusEl.textContent = "Couldn’t copy automatically — your browser blocked it.";
    }
  });
}

// end share text functions

function updateModeIndicator() {
  modeIndicatorEl.textContent =
    mode === "daily" ? "Mode: Daily" : "Mode: Practice";
}

function loadWordByIndex(index) {
  const [word, definition] = dictionaryEntries[index];
  currentWord = word.toLowerCase();
  currentDefinition = definition;
}

// Ngram JS starts here
function ngramCacheKey(term) {
  return `${NGRAM_CACHE_PREFIX}:${term.toLowerCase()}:en:1500:2022:s3`;
}

async function fetchNgramSeries(term) {
  const cleaned = term.trim();
  if (!cleaned) throw new Error("Empty term");

  // cache
  const ck = ngramCacheKey(cleaned);
  const cached = localStorage.getItem(ck);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  const params = new URLSearchParams({
    content: cleaned,          // URLSearchParams handles spaces
    year_start: "1500",
    year_end: "2022",
    corpus: "en",
    smoothing: "3"
  });

  const url = `https://ngram-viewer.sage-r-stew.workers.dev/ngrams?${params.toString()}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Ngram HTTP ${resp.status}`);

  const data = await resp.json();

  // data: [ { ngram, timeseries: [...] }, ... ]
  const first = Array.isArray(data) ? data[0] : null;
  if (!first || !Array.isArray(first.timeseries)) {
    // no data for this term
    const empty = { term: cleaned, years: [], values: [] };
    localStorage.setItem(ck, JSON.stringify(empty));
    return empty;
  }

  const years = [];
  const values = [];
  for (let y = 1500; y <= 2022; y++) years.push(y);
  for (const v of first.timeseries) values.push(v);

  const out = { term: first.ngram || cleaned, years, values };
  localStorage.setItem(ck, JSON.stringify(out));
  return out;
}

function drawNgramChart(canvas, years, values) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // handle empty/no-data
  if (!values || values.length === 0 || values.every(v => v === 0)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "14px Courier New, sans-serif";
    ctx.fillStyle = "#696969";
    ctx.fillText("No measurable data for this term in the selected corpus.", 12, 28);
    return;
  }

  const W = canvas.width;
  const H = canvas.height;

  // padding for axes labels
  const padL = 42, padR = 10, padT = 10, padB = 26;

  const x0 = padL, x1 = W - padR;
  const y0 = H - padB, y1 = padT;

  const n = values.length;
  const maxV = Math.max(...values);
  const minV = 0;

  const xFor = (i) => x0 + (i / (n - 1)) * (x1 - x0);
  const yFor = (v) => y0 - ((v - minV) / (maxV - minV)) * (y0 - y1);

  // background
  ctx.clearRect(0, 0, W, H);

  // axes
  ctx.strokeStyle = "#a9c191";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y1);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.stroke();

  // line
  ctx.strokeStyle = "#696969";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = xFor(i);
    const y = yFor(values[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // labels (simple)
  ctx.fillStyle = "#696969";
  ctx.font = "12px Courier New, sans-serif";

  const startYear = 1500;
  const endYear = 2022;

  for (let year = 1500; year < 2000; year += 100) {
    const t = (year - startYear) / (endYear - startYear);
    const x = x0 + t * (x1 - x0);

    ctx.strokeStyle = "#a9c191";
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y0 + 4);
    ctx.stroke();

    ctx.fillText(String(year), x - 14, y0 + 18);
  }

  ctx.fillText("2022", x1 - 30, y0 + 18);
  // ctx.fillText("1500", x0, H - 8);
  // ctx.fillText("2022", x1 - 30, H - 8);
  ctx.fillText(maxV.toExponential(2), 6, y1 + 10);
}
// Ngram JS ends here

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
      
      if (typeof saved.lastWin === "boolean") lastWin = saved.lastWin; // REMEMBER FOR SHARING
    } else {
      guessedLetters.clear();
      wrongLetters.clear();
      remainingGuesses = MAX_GUESSES;
      gameOver = false;
      lastWin = null;
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

    setShareEnabled(gameOver);
    // setShareEnabled(mode ==="daily" && gameOver);

    if (gameOver) {
      finalWordEl.textContent = currentWord;
      finalDefEl.textContent = currentDefinition || "(No definition available.)";
      defPanelEl.classList.remove("hidden");
      setShareEnabled(gameOver); // ADDED GAME OVER SHARE LINE
      showNgramForCurrentWord();
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
  setShareEnabled(false);
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

  // Ngram view
  showNgramForCurrentWord().catch(err => {
    console.warn("Ngram fetch failed:", err);
    if (ngramPanelEl) ngramPanelEl.classList.add("hidden");
  });

  lastWin = !!win;
  setShareEnabled(mode === "daily");
  saveDailyState(dateKey, index);
}

async function showNgramForCurrentWord() {
  if (!ngramPanelEl || !ngramCanvasEl || !ngramNoteEl) return;

  ngramNoteEl.textContent = "Loading usage chart...";
  ngramPanelEl.classList.remove("hidden");

  try {
    const { term, years, values } = await fetchNgramSeries(currentWord);

    // saveDailyNgramCache(getDateKeyInTZ(DAILY_TIMEZONE), { term, years, values });

    drawNgramChart(ngramCanvasEl, years, values);

    ngramNoteEl.textContent = 
      `Source: Google Books Ngram Viewer (English corpus), smoothing 3.`;
  } catch (e) {
    ngramPanelEl.classList.add("hidden");
    throw e;
  }
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

// In practice mode, this makes a new random word.
// In daily mode, it's disabled anyway.
newGameBtn.addEventListener("click", () => {
  if (mode === "practice") startNewGame();
});
