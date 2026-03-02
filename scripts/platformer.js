document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const pauseMenu = document.getElementById('pause-menu');
  const resumeBtn = document.getElementById('resume-btn');
  const levelDisplay = document.getElementById('level-display');

  const scoreDisplay = document.getElementById('score-display');
  const deathDisplay = document.getElementById('death-display');
  const itemDisplay = document.getElementById('item-display');
  let score = 0;
  let deaths = 0;
  let itemsCollected = 0;
  let collectible = { active: false, x: 0, y: 0, w: 20, h: 20 };

  // ==========================================
  // 1. GAME CONFIG & COLORS
  // Change these to tweak the game's look!
  // ==========================================
  const COLORS = {
    bg: '#fffdf2',       // Cornsilk sky
    platform: '#dcdcdc', // Gray stone platforms
    water: '#88a2b5',    // Slate blue traps
    player: '#a9c191',    // Sage green player placeholder
    item: '#e8c374'
  };

  const GAME = {
    gravity: 0.6,
    terminalVelocity: 12,
    width: 1200,
    height: 600
  };

  // ==========================================
  // 2. STATE & INPUTS
  // ==========================================
  let isPaused = false;
  let currentLevel = 1;
  let platforms = [];
  let waterTraps = [];
  let leaves = [];
  let leafTimer = 0;

  const keys = {
    left: false, right: false, up: false
  };

  // The leaf images from your site
  const leafImages = [new Image(), new Image(), new Image()];
  leafImages[0].src = 'images/sageleafone.svg';
  leafImages[1].src = 'images/sageleaftwo.svg';
  leafImages[2].src = 'images/sageleafthree.svg';

  // ==========================================
  // 3. THE PLAYER
  // ==========================================
  const player = {
    x: 50, y: 300, w: 40, h: 40,
    vx: 0, vy: 0,
    speed: 6, jumpPower: -12,
    isGrounded: false
  };

  function resetPlayer(isDeath = true) {
    player.x = 50;
    player.y = 100;
    player.vx = 0;
    player.vy = 0;

    if (isDeath) {
      deaths++;
      deathDisplay.innerText = `Deaths: ${deaths}`;
    }
  }

  // ==========================================
  // 4. LEVEL GENERATION
  // ==========================================
  function generateLevel() {
    platforms = [];
    waterTraps = [];
    leaves = [];

    // Safe starting platform stretches to the bottom of the canvas
    platforms.push({ x: 0, y: 500, w: 200, h: GAME.height - 500 });

    let currentX = 200;
    let currentY = 500; // NEW: The rolling baseline elevation
    let lastType = 0;
    let layoutPlan = [];

    // STEP 1: Plan the layout
    while (currentX < GAME.width - 200) {
      let type = Math.floor(Math.random() * 3);

      // Prevent back-to-back water
      if (type === 2 && lastType === 2) {
        type = 0;
      }

      let blockWidth = 100 + Math.random() * 100;
      if (type === 2) {
          blockWidth = 100 + Math.random() * 40;
      }

      // --- CRITICAL FIX: Smart Elevation Rules ---
      let elevationShift = 0;

      if (type === 2) {
        // Current block is water: Keep the baseline flat so it aligns with the left bank
        elevationShift = 0;
      } else if (lastType === 2) {
        // Previous block was water: Force the ground to step UP (negative shift)
        // or stay flat to create a solid right bank!
        elevationShift = -(Math.random() * 40);
      } else {
        // Normal rolling terrain
        elevationShift = (Math.random() * 80) - 40;
      }

      currentY += elevationShift;

      // Clamp the elevation
      if (currentY < 350) currentY = 350;
      if (currentY > 520) currentY = 520;

      // Save the blueprint
      layoutPlan.push({ type: type, x: currentX, w: blockWidth, y: currentY });

      // Move cursor forward and remember this block for the next loop!
      currentX += blockWidth;
      lastType = type;
    }

    // STEP 2: Build the blocks and Dynamic Towers!
    let possibleItemSpots = [];

    for (let i = 0; i < layoutPlan.length; i++) {
      let block = layoutPlan[i];
      let nextType = (i < layoutPlan.length - 1) ? layoutPlan[i + 1].type : 0;
      let baseY = block.y;

      if (block.type === 0) {
        // Flat Ground
        platforms.push({ x: block.x, y: baseY, w: block.w, h: GAME.height - baseY });

        // --- NEW: Dynamic Tower Generation ---
        // Only start a tower if the next block isn't a cliff (prevents head-bonking)
        if (nextType !== 1 && Math.random() > 0.3) {

          let currentTierY = baseY - 90;
          let currentTierW = block.w - 40;
          let tierXOffset = 20;
          let tierLevel = 1; // Keep track of how high we are!

          // Keep building UP as long as there is screen space, platform width, and a lucky dice roll
          while (currentTierY > 80 && currentTierW > 40 && Math.random() > 0.2) {
            platforms.push({ x: block.x + tierXOffset, y: currentTierY, w: currentTierW, h: 20 });

            // WEIGHTED PROBABILITY: Higher tiers get added to the hat more times!
            for (let weight = 0; weight < tierLevel; weight++) {
                possibleItemSpots.push({
                  x: block.x + tierXOffset + (currentTierW / 2) - 10,
                  y: currentTierY - 30
                });
            }

            // Prep the math for the next tier up (shrinking it like a pyramid)
            currentTierY -= 90;
            currentTierW -= 40;
            tierXOffset += 20;
            tierLevel++;
          }
        } else {
          // If no tower, add the ground as a low-probability backup spot
          possibleItemSpots.push({ x: block.x + (block.w / 2) - 10, y: baseY - 30 });
        }
      } else if (block.type === 1) {
        // Cliff
        platforms.push({ x: block.x, y: baseY - 60, w: block.w, h: GAME.height - (baseY - 60) });
        possibleItemSpots.push({ x: block.x + (block.w / 2) - 10, y: baseY - 90 });
      } else if (block.type === 2) {
        // Water
        waterTraps.push({ x: block.x, y: baseY + 20, w: block.w, h: GAME.height - (baseY + 20) });
        if (Math.random() > 0.5) {
          platforms.push({ x: block.x + 20, y: baseY - 70, w: block.w - 40, h: 20 });
          possibleItemSpots.push({ x: block.x + (block.w / 2) - 10, y: baseY - 100 });
        }
      }
    }

    platforms.push({ x: currentX, y: currentY, w: 800, h: GAME.height - currentY });

    // Pick ONE spot from the weighted hat and place the yellow box!
    if (possibleItemSpots.length > 0) {
      let spot = possibleItemSpots[Math.floor(Math.random() * possibleItemSpots.length)];
      collectible = { active: true, x: spot.x, y: spot.y, w: 20, h: 20 };
    } else {
      collectible = { active: true, x: currentX / 2, y: currentY - 60, w: 20, h: 20 };
    }

    levelDisplay.innerText = `Level ${currentLevel}`;
  }

  // ==========================================
  // 5. INPUT HANDLING
  // ==========================================
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      if (player.isGrounded && !isPaused) {
        player.vy = player.jumpPower;
        player.isGrounded = false;
      }
      keys.up = true;
      e.preventDefault(); // Stop page scrolling
    }

    if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      keys.up = false;
      // Variable jump: If they release space early while moving up, cut velocity in half
      if (player.vy < 0) player.vy /= 2;
    }
  });

  function togglePause() {
    isPaused = !isPaused;
    pauseMenu.classList.toggle('hidden', !isPaused);
    if (!isPaused) requestAnimationFrame(gameLoop);
  }

  resumeBtn.addEventListener('click', togglePause);

  // ==========================================
  // 6. COLLISIONS & PHYSICS
  // ==========================================
  function checkRectCollision(r1, r2) {
    return r1.x < r2.x + r2.w &&
           r1.x + r1.w > r2.x &&
           r1.y < r2.y + r2.h &&
           r1.y + r1.h > r2.y;
  }

  function update() {
    if (isPaused) return;

    // Horizontal Movement
    if (keys.left) player.vx = -player.speed;
    else if (keys.right) player.vx = player.speed;
    else player.vx = 0;

    // Apply X and check collisions
    player.x += player.vx;

    // Prevent walking off left edge
    if (player.x < 0) player.x = 0;

    platforms.forEach(p => {
      if (checkRectCollision(player, p)) {
        if (player.vx > 0) player.x = p.x - player.w; // Hit left side
        else if (player.vx < 0) player.x = p.x + p.w; // Hit right side
      }
    });

    // Vertical Movement (Gravity)
    player.vy += GAME.gravity;
    if (player.vy > GAME.terminalVelocity) player.vy = GAME.terminalVelocity;

    player.y += player.vy;
    player.isGrounded = false;

    platforms.forEach(p => {
      if (checkRectCollision(player, p)) {
        if (player.vy > 0) { // Landing on top
          player.y = p.y - player.h;
          player.vy = 0;
          player.isGrounded = true;
        } else if (player.vy < 0) { // Hitting head on bottom
          player.y = p.y + p.h;
          player.vy = 0;
        }
      }
    });

    // Check Water Death
    waterTraps.forEach(w => {
      if (checkRectCollision(player, w)) resetPlayer(true);
    });

    // Death by falling out of the world
    if (player.y > GAME.height) resetPlayer(true);

    // Item Collection!
    if (collectible.active && checkRectCollision(player, collectible)) {
      collectible.active = false;
      itemsCollected++;
      itemDisplay.innerText = `Items: ${itemsCollected}`;

      // Let's give them a nice 5-point bonus for getting it!
      score += 5;
      scoreDisplay.innerText = `Score: ${score}`;
    }

    // Level Completion!
    if (player.x > GAME.width - player.w) {
      score++;
      scoreDisplay.innerText = `Score: ${score}`;
      currentLevel++;

      player.speed += 0.15; // lil harder each level

      generateLevel();
      resetPlayer(false);
    }

    // --- Leaves Spawning & Physics ---
    leafTimer++;
    if (leafTimer > 60) { // Spawn roughly 1 leaf per second
      leaves.push({
        x: Math.random() * GAME.width,
        y: -50,
        w: 30, h: 60,
        vy: 2 + Math.random() * 2,
        swayOffset: Math.random() * Math.PI * 2,
        img: leafImages[Math.floor(Math.random() * leafImages.length)]
      });
      leafTimer = 0;
    }

    for (let i = leaves.length - 1; i >= 0; i--) {
      let l = leaves[i];
      l.y += l.vy;
      l.x += Math.sin((Date.now() / 500) + l.swayOffset) * 2; // Gentle horizontal sway

      // Hit player?
      if (checkRectCollision(player, l)) {
        resetPlayer();
      }

      // Remove if off screen
      if (l.y > GAME.height) leaves.splice(i, 1);
    }
  }

  // ==========================================
  // 7. RENDERING
  // ==========================================
  function draw() {
    // Clear background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, GAME.width, GAME.height);

    // Draw Platforms
    ctx.fillStyle = COLORS.platform;
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

    // Draw Water
    ctx.fillStyle = COLORS.water;
    waterTraps.forEach(w => {
      ctx.fillRect(w.x, w.y, w.w, w.h);
    });
    /*
    waterTraps.forEach(w => {
      // Draw water body
      ctx.fillRect(w.x, w.y, w.w, w.h);
      // Draw some decorative waves on top
      ctx.fillStyle = '#fffdf2';
      for(let i=0; i < w.w; i+= 20) {
        ctx.fillRect(w.x + i, w.y, 10, 4);
      }
      ctx.fillStyle = COLORS.water; // reset for next trap
    });
    */

    // Draw Leaves
    leaves.forEach(l => {
      if (l.img.complete) {
        ctx.drawImage(l.img, l.x, l.y, l.w, l.h);
      }
    });

    // Draw the Collectible Item
    if (collectible.active) {
      ctx.fillStyle = COLORS.item;
      ctx.fillRect(collectible.x, collectible.y, collectible.w, collectible.h);

      // A tiny white border to make it pop against the background
      ctx.strokeStyle = '#fffdf2';
      ctx.lineWidth = 2;
      ctx.strokeRect(collectible.x, collectible.y, collectible.w, collectible.h);
    }

    // Draw Player Placeholder (A block with eyes!)
    ctx.fillStyle = COLORS.player;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = '#333'; // Dark eyes
    // If moving right or standing still, eyes on right. If left, eyes on left.
    let eyeOffsetX = (keys.left && !keys.right) ? 5 : 25;
    ctx.fillRect(player.x + eyeOffsetX, player.y + 10, 4, 8);
    ctx.fillRect(player.x + eyeOffsetX + 6, player.y + 10, 4, 8);
  }

  // ==========================================
  // 8. INITIALIZE LOOP
  // ==========================================
  function gameLoop() {
    update();
    draw();
    if (!isPaused) requestAnimationFrame(gameLoop);
  }

  generateLevel();
  requestAnimationFrame(gameLoop);
});
