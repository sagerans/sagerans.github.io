document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('c4-game-area');
  const hoverZone = document.getElementById('c4-hover-zone');
  const boardWrapper = document.getElementById('c4-board-wrapper');
  const boardLayer = document.getElementById('c4-board-layer');
  const piecesLayer = document.getElementById('c4-pieces-layer');
  const hoverPiece = document.getElementById('c4-hover-piece');
  const p1Counter = document.getElementById('p1-counter');
  const p2Counter = document.getElementById('p2-counter');

  const victoryOverlay = document.getElementById('c4-victory-overlay');
  const victoryMsg = document.getElementById('c4-victory-msg');
  const overlayResetBtn = document.getElementById('c4-overlay-reset-btn');

  const COLS = 7;
  const ROWS = 6;
  const CHAOS_CHANCE = 0.20; // 20% chance of a chaos event happening after a drop

  let board = [];
  let domBoard = [];
  let currentPlayer = 1;
  let piecesLeft = { 1: 21, 2: 21 };
  let isGameOver = false;
  let isAnimating = false;

  function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    domBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    piecesLeft = { 1: 21, 2: 21 };
    currentPlayer = 1;
    isGameOver = false;
    isAnimating = false;

    boardLayer.innerHTML = '';
    piecesLayer.innerHTML = '';
    victoryOverlay.classList.remove('show');

    for (let i = 0; i < ROWS * COLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'c4-cell';
      boardLayer.appendChild(cell);
    }

    hoverPiece.style.opacity = 1;
    hoverPiece.className = `p1-color`;
    updateUI();
  }

  // Hover Mechanics
  gameArea.addEventListener('mousemove', (e) => {
    if (isGameOver || isAnimating) return;

    const rect = boardWrapper.getBoundingClientRect();
    let col = Math.floor((e.clientX - rect.left) / (rect.width / COLS));
    col = Math.max(0, Math.min(col, COLS - 1));

    const hoverRect = hoverZone.getBoundingClientRect();
    let y = Math.max(0, Math.min(e.clientY - hoverRect.top, hoverRect.height - 20));

    hoverPiece.style.left = `calc((100% / 7) * ${col})`;
    hoverPiece.style.setProperty('--hover-y', `${y}px`);
  });

  gameArea.addEventListener('click', (e) => {
    if (isGameOver || isAnimating) return;

    const rect = boardWrapper.getBoundingClientRect();
    let col = Math.floor((e.clientX - rect.left) / (rect.width / COLS));
    col = Math.max(0, Math.min(col, COLS - 1));

    dropPiece(col);
  });

  function dropPiece(col) {
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1 || piecesLeft[currentPlayer] === 0) return;

    isAnimating = true;
    hoverPiece.style.opacity = 0;

    board[targetRow][col] = currentPlayer;
    piecesLeft[currentPlayer]--;

    const piece = document.createElement('div');
    piece.className = `c4-piece p${currentPlayer}-color`;
    piece.style.left = `calc((100% / 7) * ${col})`;
    piecesLayer.appendChild(piece);

    domBoard[targetRow][col] = piece; // Track it!

    void piece.offsetWidth;
    piece.style.setProperty('--drop-y', `${(targetRow + 1) * 100}%`);

    setTimeout(() => {
      let winner = checkAllWins();
      if (winner) {
        endGame(winner);
      } else if (piecesLeft[1] === 0 && piecesLeft[2] === 0) {
        endGame('Tie');
      } else {

        // --- ROLL FOR CHAOS ---
        if (Math.random() < CHAOS_CHANCE) {
          triggerChaos(() => {
            // Chaos might have created a win! Check again.
            let postChaosWinner = checkAllWins();
            if (postChaosWinner) endGame(postChaosWinner);
            else nextTurn();
          });
        } else {
          nextTurn();
        }

      }
    }, 750);
  }

  function nextTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateUI();
    isAnimating = false;
    hoverPiece.className = `p${currentPlayer}-color`;
    hoverPiece.style.opacity = 1;
  }

  // --- GRAVITY ENGINE ---
  // Restores standard Connect 4 physics after a chaos event
  function applyGravity() {
    let dropped = false;
    for (let c = 0; c < COLS; c++) {
      let writeRow = ROWS - 1; // Start filling from the bottom
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][c] !== 0) {
          if (r !== writeRow) {
            // Move the piece down in our data arrays
            board[writeRow][c] = board[r][c];
            domBoard[writeRow][c] = domBoard[r][c];
            board[r][c] = 0;
            domBoard[r][c] = null;

            // Trigger the physical drop animation
            if (domBoard[writeRow][c]) {
              domBoard[writeRow][c].style.setProperty('--drop-y', `${(writeRow + 1) * 100}%`);
            }
            dropped = true;
          }
          writeRow--;
        }
      }
    }
    return dropped;
  }

  // --- THE CHAOS ENGINE ---
  function triggerChaos(callback) {
    let occupied = [];
    for (let r=0; r<ROWS; r++) {
      for (let c=0; c<COLS; c++) {
        if (board[r][c] !== 0) occupied.push({r, c});
      }
    }

    if (occupied.length < 2) {
      callback();
      return;
    }

    const events = ['swap-cols', 'swap-rows', 'delete-row', 'swap-pieces'];
    const event = events[Math.floor(Math.random() * events.length)];

    function highlightCells(cells, colorClass) {
      cells.forEach(({r, c}) => {
        boardLayer.children[r * COLS + c].classList.add(colorClass);
      });
      setTimeout(() => {
        cells.forEach(({r, c}) => {
          boardLayer.children[r * COLS + c].classList.remove(colorClass);
        });
      }, 1000);
    }

    if (event === 'swap-cols') {
      let c1 = Math.floor(Math.random() * COLS);
      let c2;
      do { c2 = Math.floor(Math.random() * COLS); } while (c1 === c2);

      let highlight = [];
      for (let r=0; r<ROWS; r++) {
         highlight.push({r, c: c1}, {r, c: c2});
         let temp = board[r][c1]; board[r][c1] = board[r][c2]; board[r][c2] = temp;
         let tempDom = domBoard[r][c1]; domBoard[r][c1] = domBoard[r][c2]; domBoard[r][c2] = tempDom;

         if (domBoard[r][c1]) domBoard[r][c1].style.left = `calc((100% / 7) * ${c1})`;
         if (domBoard[r][c2]) domBoard[r][c2].style.left = `calc((100% / 7) * ${c2})`;
      }
      highlightCells(highlight, 'chaos-glow-green');
    }

    else if (event === 'swap-rows') {
      let r1 = Math.floor(Math.random() * ROWS);
      let r2;
      do { r2 = Math.floor(Math.random() * ROWS); } while (r1 === r2);

      let highlight = [];
      for (let c=0; c<COLS; c++) highlight.push({r: r1, c}, {r: r2, c});

      let temp = board[r1]; board[r1] = board[r2]; board[r2] = temp;
      let tempDom = domBoard[r1]; domBoard[r1] = domBoard[r2]; domBoard[r2] = tempDom;

      for (let c=0; c<COLS; c++) {
        if (domBoard[r1][c]) domBoard[r1][c].style.setProperty('--drop-y', `${(r1 + 1) * 100}%`);
        if (domBoard[r2][c]) domBoard[r2][c].style.setProperty('--drop-y', `${(r2 + 1) * 100}%`);
      }
      highlightCells(highlight, 'chaos-glow-green');

      // NEW: Wait for the rows to finish swapping, then trigger Gravity!
      setTimeout(() => {
        let piecesDropped = applyGravity();
        if (piecesDropped) {
          setTimeout(callback, 800); // Give the gravity drop time to animate
        } else {
          callback(); // Move on immediately if nothing had to fall
        }
      }, 800);
      return; // Skip the default callback trigger at the bottom
    }

    else if (event === 'delete-row') {
      let rowsWithPieces = [];
      for (let r=0; r<ROWS; r++) {
        if (board[r].some(val => val !== 0)) rowsWithPieces.push(r);
      }
      let rDel = rowsWithPieces[Math.floor(Math.random() * rowsWithPieces.length)];

      let highlight = [];
      for (let c=0; c<COLS; c++) highlight.push({r: rDel, c});
      highlightCells(highlight, 'chaos-glow-red');

      for (let c=0; c<COLS; c++) {
        if (domBoard[rDel][c]) {
            domBoard[rDel][c].style.opacity = 0;
            setTimeout((el) => el.remove(), 500, domBoard[rDel][c]);
        }
      }

      board.splice(rDel, 1);
      board.unshift(Array(COLS).fill(0));
      domBoard.splice(rDel, 1);
      domBoard.unshift(Array(COLS).fill(null));

      for (let r=0; r<=rDel; r++) {
        for (let c=0; c<COLS; c++) {
          if (domBoard[r][c]) domBoard[r][c].style.setProperty('--drop-y', `${(r + 1) * 100}%`);
        }
      }
    }

    else if (event === 'swap-pieces') {
      let idx1 = Math.floor(Math.random() * occupied.length);
      let idx2;
      do { idx2 = Math.floor(Math.random() * occupied.length); } while (idx1 === idx2);

      let p1 = occupied[idx1], p2 = occupied[idx2];
      highlightCells([p1, p2], 'chaos-glow-green');

      let temp = board[p1.r][p1.c]; board[p1.r][p1.c] = board[p2.r][p2.c]; board[p2.r][p2.c] = temp;
      let tempDom = domBoard[p1.r][p1.c]; domBoard[p1.r][p1.c] = domBoard[p2.r][p2.c]; domBoard[p2.r][p2.c] = tempDom;

      if (domBoard[p1.r][p1.c]) {
        domBoard[p1.r][p1.c].style.left = `calc((100% / 7) * ${p1.c})`;
        domBoard[p1.r][p1.c].style.setProperty('--drop-y', `${(p1.r + 1) * 100}%`);
      }
      if (domBoard[p2.r][p2.c]) {
        domBoard[p2.r][p2.c].style.left = `calc((100% / 7) * ${p2.c})`;
        domBoard[p2.r][p2.c].style.setProperty('--drop-y', `${(p2.r + 1) * 100}%`);
      }
    }

    setTimeout(callback, 1000);
  }

  // --- GLOBAL WIN SCANNER ---
  function checkAllWins() {
    let p1Wins = false;
    let p2Wins = false;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let p = board[r][c];
        if (p === 0) continue;

        for (let [dr, dc] of directions) {
          let count = 1;
          for (let i = 1; i <= 3; i++) {
            let nr = r + dr * i, nc = c + dc * i;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === p) count++;
            else break;
          }
          if (count >= 4) {
            if (p === 1) p1Wins = true;
            if (p === 2) p2Wins = true;
          }
        }
      }
    }

    if (p1Wins && p2Wins) return 'Tie';
    if (p1Wins) return 1;
    if (p2Wins) return 2;
    return null;
  }

  function updateUI() {
    p1Counter.innerText = `P1: ${piecesLeft[1]}`;
    p2Counter.innerText = `P2: ${piecesLeft[2]}`;

    if (currentPlayer === 1) {
      p1Counter.classList.add('active-turn');
      p1Counter.classList.remove('inactive-turn');
      p2Counter.classList.add('inactive-turn');
      p2Counter.classList.remove('active-turn');
    } else {
      p2Counter.classList.add('active-turn');
      p2Counter.classList.remove('inactive-turn');
      p1Counter.classList.add('inactive-turn');
      p1Counter.classList.remove('active-turn');
    }
  }

  function endGame(winner) {
    isGameOver = true;
    hoverPiece.style.opacity = 0;

    if (winner === 'Tie') {
      p1Counter.classList.remove('inactive-turn', 'active-turn');
      p2Counter.classList.remove('inactive-turn', 'active-turn');
      victoryMsg.innerText = "It's a Tie!";
      victoryMsg.style.color = "var(--text-main)";
    } else {
      if (winner === 1) {
        p1Counter.classList.add('active-turn');
        p2Counter.classList.remove('active-turn', 'inactive-turn');
        p2Counter.classList.add('inactive-turn');
        victoryMsg.style.color = 'var(--accent-main)';
      } else {
        p2Counter.classList.add('active-turn');
        p1Counter.classList.remove('active-turn', 'inactive-turn');
        p1Counter.classList.add('inactive-turn');
        victoryMsg.style.color = '#e76f51';
      }
      victoryMsg.innerText = `Player ${winner} Wins! 🎉`;
    }

    victoryOverlay.classList.add('show');
  }

  // overlayResetBtn.addEventListener('click', initGame);
  overlayResetBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // This stops the click from piercing through to the board!
    initGame();
  });
  initGame();
});
