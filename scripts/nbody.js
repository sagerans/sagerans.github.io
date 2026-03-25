document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('nbody-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const playPauseBtn = document.getElementById('nbody-play-btn');
  const resetBtn = document.getElementById('nbody-reset-btn');
  const massInput = document.getElementById('nbody-mass');
  const massDisplay = document.getElementById('nbody-mass-display');
  const trailsToggle = document.getElementById('nbody-trails-toggle');
  const trailLengthInput = document.getElementById('nbody-trail-length');
  const trailDisplay = document.getElementById('nbody-trail-display');
  const gravityInput = document.getElementById('nbody-gravity');
  const gravityDisplay = document.getElementById('nbody-gravity-display');
  const maxBodiesInput = document.getElementById('nbody-max-bodies');
  const maxDisplay = document.getElementById('nbody-max-display');
  const wallsToggle = document.getElementById('nbody-walls-toggle');
  const mergeToggle = document.getElementById('nbody-merge-toggle');
  const countDisplay = document.getElementById('nbody-count-display');
  const speedInput = document.getElementById('nbody-speed');
  const speedDisplay = document.getElementById('nbody-speed-display');

  // ==========================================
  // --- CONFIGURATION & TWEAKS ---
  // ==========================================
  let MAX_BODIES = 40;            // FIFO limit: oldest disappears when exceeded
  let TRAIL_LENGTH = 40;          // How many historical frames to draw behind the body
  let DRAW_TRAILS = true;         // Easily toggle trails entirely on/off
  let GRAVITY_CONSTANT = 0.5;     // Global gravity strength
  let USE_WALLS = false;          // Toggle walls on/off
  let MERGE_COLLISIONS = false;   // Mergers on/off
  let SIMULATION_SPEED = 1.0;     // For impatient users
  const BLACK_HOLE_MASS = 1000;   // threshold for turning into a black hole
  const WALL_DAMPING = 0.8;       // Energy retained when bouncing off walls (1.0 = perfect bounce)
  const CULLING_MARGIN = 3000;    // Where to delete stray bodies

  // Your Site Aesthetic Palette
  const BODY_COLORS = [
    '#a9c191', // Sage Green
    '#e76f51', // Terracotta
    '#f4a261', // Sandy Orange
    '#2a9d8f', // Teal
    '#e9c46a'  // Muted Yellow
  ];
  // ==========================================

  let bodies = [];
  let isPlaying = true;
  let animationFrameId;
  let physicsAccumulator = 0;

  // Slingshot State
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let dragCurrent = { x: 0, y: 0 };

  // --- CANVAS SIZING ---
  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --- PHYSICS ENGINE ---
  function updatePhysics() {
    if (!isPlaying) return;

    // Calculate gravitational forces (O(N^2) complexity)
    for (let i = 0; i < bodies.length; i++) {
      let fx = 0;
      let fy = 0;

      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;

        const b1 = bodies[i];
        const b2 = bodies[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distSq = (dx * dx) + (dy * dy);

        // Softening parameter prevents infinite gravity when bodies overlap
        const softenedDistSq = distSq + 100;
        const dist = Math.sqrt(softenedDistSq);

        const force = (GRAVITY_CONSTANT * b1.mass * b2.mass) / softenedDistSq;

        fx += force * (dx / dist);
        fy += force * (dy / dist);
      }

      // F = ma -> a = F/m
      bodies[i].vx += fx / bodies[i].mass;
      bodies[i].vy += fy / bodies[i].mass;
    }

    // Apply velocities and wall collisions
    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      b.x += b.vx;
      b.y += b.vy;

      /* commenting out to work on sim speed
      // Update trail history
      if (DRAW_TRAILS) {
        b.history.push({ x: b.x, y: b.y });
        if (b.history.length > TRAIL_LENGTH) {
          b.history.shift(); // Keep array size limited
        }
      }
      */

      if (USE_WALLS) {
        // We add a 'maxDepth' so it only bounces bodies actively hitting the wall,
        // completely ignoring bodies that are hundreds of pixels away.
        const maxDepth = 200;

        if (b.x - b.radius < 0 && b.x > -maxDepth) { b.x = b.radius; b.vx *= -WALL_DAMPING; }
        if (b.x + b.radius > canvas.width && b.x < canvas.width + maxDepth) { b.x = canvas.width - b.radius; b.vx *= -WALL_DAMPING; }
        if (b.y - b.radius < 0 && b.y > -maxDepth) { b.y = b.radius; b.vy *= -WALL_DAMPING; }
        if (b.y + b.radius > canvas.height && b.y < canvas.height + maxDepth) { b.y = canvas.height - b.radius; b.vy *= -WALL_DAMPING; }
      }
    }

    // Cull the distant bodies
    // If walls are ON, the box is sealed. Delete anything outside immediately.
    const currentMargin = USE_WALLS ? 10 : CULLING_MARGIN;

    // NEW: The Merge Engine
    if (MERGE_COLLISIONS) {
      // We iterate backward so that when we delete a body, it doesn't break the loop index
      for (let i = bodies.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          const b1 = bodies[i];
          const b2 = bodies[j];
          if (!b1 || !b2) continue;

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy;
          const collisionDist = b1.radius + b2.radius;

          // If their distance is less than their combined radii, they have collided
          if (distSq < collisionDist * collisionDist) {

            // 1. Conservation of Mass
            const newMass = b1.mass + b2.mass;

            // 2. Conservation of Momentum (m1v1 + m2v2 = mTotal * vFinal)
            const newVx = ((b1.vx * b1.mass) + (b2.vx * b2.mass)) / newMass;
            const newVy = ((b1.vy * b1.mass) + (b2.vy * b2.mass)) / newMass;

            // 3. Center of Mass Position
            const newX = ((b1.x * b1.mass) + (b2.x * b2.mass)) / newMass;
            const newY = ((b1.y * b1.mass) + (b2.y * b2.mass)) / newMass;

            const isBlackHole = newMass >= BLACK_HOLE_MASS;
            let newRadius;

            if (isBlackHole) {
              newRadius = Math.max(3, Math.cbrt(newMass) * 0.33);
            } else {
              newRadius = Math.max(3, Math.sqrt(newMass) * 1.5);
            }

            // The larger body dictates the color of the new merged planet
            const newColor = b1.mass > b2.mass ? b1.color : b2.color;

            // Update the surviving body (b2) with the merged data
            b2.mass = newMass;
            b2.vx = newVx;
            b2.vy = newVy;
            b2.x = newX;
            b2.y = newY;
            b2.radius = newRadius;
            b2.color = newColor;
            b2.isBlackHole = isBlackHole;

            // Delete the consumed body (b1) from the simulation
            bodies.splice(i, 1);
            break; // b1 is gone, break out of the inner loop and move to the next 'i'
          }
        }
      }
    }

    bodies = bodies.filter(b => {
      return (
        b.x > -currentMargin &&
        b.x < canvas.width + currentMargin &&
        b.y > -currentMargin &&
        b.y < canvas.height + currentMargin
      );
    });
  }

  // --- RENDER ENGINE ---
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Trails
    if (DRAW_TRAILS) {
      bodies.forEach(b => {
        if (b.history.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = b.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < b.history.length - 1; i++) {
          const pt1 = b.history[i];
          const pt2 = b.history[i+1];
          // Fade opacity based on how old the history point is
          ctx.globalAlpha = (i / b.history.length) * 0.6;
          ctx.lineWidth = b.radius * 0.5 * (i / b.history.length);

          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0; // Reset alpha
      });
    }

    // 2. Draw Bodies
    bodies.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
    });

    // 3. Draw Slingshot UI
    if (isDragging) {
      // Draw the "ghost" body where the user clicked
      const selectedMass = parseFloat(massInput.value);
      const ghostRadius = Math.max(3, Math.sqrt(selectedMass) * 1.5);

      ctx.beginPath();
      ctx.arc(dragStart.x, dragStart.y, ghostRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(169, 193, 145, 0.4)'; // Faded Sage Green
      ctx.fill();
      ctx.strokeStyle = 'var(--accent-main)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw the pull-back line
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(dragCurrent.x, dragCurrent.y);
      ctx.strokeStyle = 'var(--text-muted)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // updatePhysics();
    // NEW: The Time Accumulator Loop
    if (isPlaying) {
      physicsAccumulator += SIMULATION_SPEED;
      let physicsStepped = false;

      // If speed is 3.0, this loops 3 times. If speed is 0.5, it loops every other frame.
      while (physicsAccumulator >= 1) {
        updatePhysics();
        physicsAccumulator -= 1;
        physicsStepped = true;
      }

      // Record trail dots ONLY once per visual frame, so they stretch beautifully
      if (physicsStepped && DRAW_TRAILS) {
        bodies.forEach(b => {
          b.history.push({ x: b.x, y: b.y });
          if (b.history.length > TRAIL_LENGTH) {
            b.history.shift();
          }
        });
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // --- INTERACTION (SLINGSHOT) ---
  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrag(e) {
    e.preventDefault(); // Prevent scrolling on mobile
    isDragging = true;
    dragStart = getMousePos(e);
    dragCurrent = { ...dragStart };
  }

  function doDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    dragCurrent = getMousePos(e);
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    const mass = parseFloat(massInput.value);
    const radius = Math.max(3, Math.sqrt(mass) * 1.5); // Area scales with mass
    const color = BODY_COLORS[Math.floor(Math.random() * BODY_COLORS.length)];

    // Velocity is proportional to the drag distance (Slingshot math)
    const velocityScale = 0.05;
    const vx = (dragStart.x - dragCurrent.x) * velocityScale;
    const vy = (dragStart.y - dragCurrent.y) * velocityScale;

    addBody(dragStart.x, dragStart.y, vx, vy, mass, radius, color);
  }

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', endDrag);

  // Mobile Touch Support
  canvas.addEventListener('touchstart', startDrag, { passive: false });
  canvas.addEventListener('touchmove', doDrag, { passive: false });
  window.addEventListener('touchend', endDrag);

  function addBody(x, y, vx, vy, mass, radius, color) {
    if (bodies.length >= MAX_BODIES) {
      bodies.shift(); // FIFO: Destroy the oldest body
    }
    const isBlackHole = mass >= BLACK_HOLE_MASS;
    if (isBlackHole) {
      radius = Math.max(3, Math.cbrt(mass) * 0.33);
    }
    bodies.push({ x, y, vx, vy, mass, radius, color, history: [] });
  }

  // --- UI CONTROLS ---
  playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtn.innerText = isPlaying ? "⏸" : "▶";
    playPauseBtn.style.background = isPlaying ? "var(--error-color)" : "";
    playPauseBtn.style.color = isPlaying ? "#fff" : "";
  });

  // --- HUD CONTROLS ---
  const floatingCard = document.getElementById('nbody-floating-controls');
  const toggleControlsBtn = document.getElementById('nbody-toggle-controls');

  // Prevent clicking/dragging on the HUD from firing the slingshot behind it!
  floatingCard.addEventListener('mousedown', (e) => e.stopPropagation());
  floatingCard.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: false});

  // Expand/Collapse Toggle
  toggleControlsBtn.addEventListener('click', () => {
    floatingCard.classList.toggle('collapsed');
    // Change the arrow direction
    toggleControlsBtn.innerText = floatingCard.classList.contains('collapsed') ? '▼' : '▲';
  });

  resetBtn.addEventListener('click', () => {
    bodies = [];
  });

  massInput.addEventListener('input', (e) => {
    massDisplay.innerText = e.target.value;
  });

  trailsToggle.addEventListener('change', (e) => {
    DRAW_TRAILS = e.target.checked;
  });

  trailLengthInput.addEventListener('input', (e) => {
    TRAIL_LENGTH = parseInt(e.target.value);
    trailDisplay.innerText = TRAIL_LENGTH;

    // Instantly trim existing trails if the user lowers the length
    bodies.forEach(b => {
      if (b.history.length > TRAIL_LENGTH) {
        b.history.splice(0, b.history.length - TRAIL_LENGTH);
      }
    });
  });

  gravityInput.addEventListener('input', (e) => {
    GRAVITY_CONSTANT = parseFloat(e.target.value);
    gravityDisplay.innerText = GRAVITY_CONSTANT.toFixed(1);
  });

  maxBodiesInput.addEventListener('input', (e) => {
    MAX_BODIES = parseInt(e.target.value);
    maxDisplay.innerText = MAX_BODIES;

    // Instantly vaporize excess bodies if the user lowers the cap
    while (bodies.length > MAX_BODIES) {
      bodies.shift();
    }
  });

  wallsToggle.addEventListener('change', (e) => {
    USE_WALLS = e.target.checked;
  });

  // Add this near your other toggle listeners at the bottom
  mergeToggle.addEventListener('change', (e) => {
    MERGE_COLLISIONS = e.target.checked;
  });

  // Inside your draw() function (right before requestAnimationFrame):
  if (countDisplay) {
    countDisplay.innerText = bodies.length;
  }

  speedInput.addEventListener('input', (e) => {
    SIMULATION_SPEED = parseFloat(e.target.value);
    speedDisplay.innerText = SIMULATION_SPEED.toFixed(1);
  });

  // --- SCENARIO PRESETS ---
  const presetDropdown = document.getElementById('nbody-presets');

  // Helper to construct a body with proper radius and black hole tags
  function spawnPresetBody(x, y, vx, vy, mass, color) {
    const isBlackHole = mass >= BLACK_HOLE_MASS;
    const radius = isBlackHole
      ? Math.max(5, Math.sqrt(mass) * 0.5)
      : Math.max(3, Math.sqrt(mass) * 1.5);
    bodies.push({ x, y, vx, vy, mass, radius, color, isBlackHole, history: [] });
  }

  presetDropdown.addEventListener('change', (e) => {
    const scenario = e.target.value;
    if (scenario === 'none') return;

    // Reset the board and standardize the physics so the math works!
    bodies = [];
    GRAVITY_CONSTANT = 0.5;
    gravityInput.value = 0.5;
    gravityDisplay.innerText = "0.5";

    // Find the exact center of the user's current screen
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (scenario === 'solar') {
      // Massive central star
      spawnPresetBody(cx, cy, 0, 0, 200, '#e9c46a');

      // Keplerian Velocity: v = sqrt(G * M / r)
      // Planet 1 (Close, Fast)
      spawnPresetBody(cx + 150, cy, 0, 0.81, 10, '#2a9d8f');
      // Planet 2 (Medium, Opposite direction)
      spawnPresetBody(cx - 250, cy, 0, -0.63, 15, '#e76f51');
      // Planet 3 (Far, Slow)
      spawnPresetBody(cx, cy + 350, -0.53, 0, 5, '#a9c191');
    }

    else if (scenario === 'binary') {
      // Two equal mass stars orbiting a common barycenter
      spawnPresetBody(cx - 120, cy, 0, 0.4, 150, '#e76f51');
      spawnPresetBody(cx + 120, cy, 0, -0.4, 150, '#f4a261');

      // A small circumbinary planet orbiting BOTH stars from far away
      spawnPresetBody(cx, cy - 400, 0.6, 0, 5, '#a9c191');
    }

    else if (scenario === 'trinary') {
      // Three equal bodies in a symmetric triangle, pushing outward tangentially
      const dist = 150;
      const v = 0.45;
      const m = 80;

      // Top
      spawnPresetBody(cx, cy - dist, v, 0, m, '#2a9d8f');
      // Bottom Right
      spawnPresetBody(cx + (dist * 0.866), cy + (dist * 0.5), -v * 0.5, v * 0.866, m, '#e76f51');
      // Bottom Left
      spawnPresetBody(cx - (dist * 0.866), cy + (dist * 0.5), -v * 0.5, -v * 0.866, m, '#e9c46a');
    }

    // Reset dropdown so user can click it again later
    presetDropdown.value = 'none';
  });

  // Start the engine
  draw();
});
