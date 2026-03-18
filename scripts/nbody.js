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

  // ==========================================
  // --- CONFIGURATION & TWEAKS ---
  // ==========================================
  let MAX_BODIES = 40;            // FIFO limit: oldest disappears when exceeded
  let TRAIL_LENGTH = 40;          // How many historical frames to draw behind the body
  let DRAW_TRAILS = true;         // Easily toggle trails entirely on/off
  let GRAVITY_CONSTANT = 0.5;     // Global gravity strength
  const WALL_DAMPING = 0.8;         // Energy retained when bouncing off walls (1.0 = perfect bounce)

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

      // Update trail history
      if (DRAW_TRAILS) {
        b.history.push({ x: b.x, y: b.y });
        if (b.history.length > TRAIL_LENGTH) {
          b.history.shift(); // Keep array size limited
        }
      }

      // Wall Bounces
      if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -WALL_DAMPING; }
      if (b.x + b.radius > canvas.width) { b.x = canvas.width - b.radius; b.vx *= -WALL_DAMPING; }
      if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -WALL_DAMPING; }
      if (b.y + b.radius > canvas.height) { b.y = canvas.height - b.radius; b.vy *= -WALL_DAMPING; }
    }
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

    updatePhysics();
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

  // Start the engine
  draw();
});
