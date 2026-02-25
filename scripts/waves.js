document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // --- UI Elements ---
  const modeSelect = document.getElementById('wave-mode');
  const resetBtn = document.getElementById('reset-waves');
  const instructions = document.getElementById('wave-instructions');

  // --- Global State ---
  let mode = 'side'; // 'side' or 'top'
  const slateBlue = { r: 136, g: 162, b: 181 }; // #88a2b5

  // --- Side-On State (1D Springs) ---
  const SPRING_COUNT = 400;
  let springs = new Float32Array(SPRING_COUNT);
  let velocities = new Float32Array(SPRING_COUNT);
  let droplets = [];
  const TENSION = 0.020;
  const DAMPENING = 0.990;
  const SPREAD = 0.25;

  // --- Top-Down State (2D Wave Equation) ---
  let sources = [];
  const MAX_SOURCES = 5;
  let time = 0;

  // --- Canvas Sizing (Internal vs Display) ---
  const W = canvas.width;
  const H = canvas.height;
  let imageData = ctx.createImageData(W, H);

  // --- Listeners ---
  modeSelect.addEventListener('change', (e) => {
    mode = e.target.value;
    resetSim();
    instructions.innerText = mode === 'side'
      ? "Click above the ocean to drop water. Height = impact strength."
      : `Click to create up to ${MAX_SOURCES} continuous wave sources.`;
  });

  resetBtn.addEventListener('click', resetSim);

  function resetSim() {
    springs.fill(0);
    velocities.fill(0);
    droplets = [];
    sources = [];
    time = 0;
  }

  // Handle Clicks / Touches
  function handleInput(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (mode === 'side') {
      // Spawn a falling droplet!
      if (y < H * 0.7) { // Only drop if clicking above the water line
        droplets.push({ x: x, y: y, vy: 0, radius: 4 });
      }
    } else {
      // Spawn a Top-Down continuous wave source
      if (sources.length < MAX_SOURCES) {
        sources.push({ x: x, y: y, startTime: time });
      }
    }
  }

  canvas.addEventListener('mousedown', handleInput);
  canvas.addEventListener('touchstart', handleInput, { passive: false });


  // --- PHYSICS & RENDER LOOP ---
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    if (mode === 'side') {
      renderSideOn();
    } else {
      renderTopDown();
    }
  }

  // --- ENGINE 1: Side-On (Droplets & Springs) ---
  function renderSideOn() {
    const waterLevel = H * 0.7;

    // 1. Update Droplet Physics (Gravity)
    for (let i = droplets.length - 1; i >= 0; i--) {
      let d = droplets[i];
      d.vy += 0.2; // Gravity acceleration
      d.y += d.vy;

      // Draw droplet
      ctx.fillStyle = `rgb(${slateBlue.r}, ${slateBlue.g}, ${slateBlue.b})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();

      // Check collision with water surface
      if (d.y >= waterLevel) {
        // Find which spring it hit
        const springIndex = Math.floor((d.x / W) * SPRING_COUNT);
        const splashRadius = 5;
        for (let j = -splashRadius; j <= splashRadius; j++) {
          let idx = springIndex + j;
          if (idx >= 0 && idx < SPRING_COUNT) {
            // Calculates falloff so the exact center hits the hardest
            let force = 1 - (Math.abs(j) / (splashRadius + 1));

            // Multiply by 4 for an exaggerated, massive wave!
            velocities[idx] += d.vy * force * 4.0;
          }
        }
        if (springIndex >= 0 && springIndex < SPRING_COUNT) {
          // Impact strength relies heavily on droplet velocity (height)
          velocities[springIndex] += d.vy * 2.5;
        }
        droplets.splice(i, 1); // Delete droplet
      }
    }

    // 2. Update Water Spring Physics
    for (let i = 0; i < SPRING_COUNT; i++) {
      // Hooke's Law: pull towards baseline (0)
      let accel = -TENSION * springs[i];
      velocities[i] += accel;
      velocities[i] *= DAMPENING;
      springs[i] += velocities[i];
    }

    // Pass waves to left and right neighbors
    let leftDeltas = new Float32Array(SPRING_COUNT);
    let rightDeltas = new Float32Array(SPRING_COUNT);

    for (let j = 0; j < 8; j++) { // Multiple passes for smoother propagation
      for (let i = 0; i < SPRING_COUNT; i++) {
        if (i > 0) {
          leftDeltas[i] = SPREAD * (springs[i] - springs[i - 1]);
          velocities[i - 1] += leftDeltas[i];
        }
        if (i < SPRING_COUNT - 1) {
          rightDeltas[i] = SPREAD * (springs[i] - springs[i + 1]);
          velocities[i + 1] += rightDeltas[i];
        }
      }
      for (let i = 0; i < SPRING_COUNT; i++) {
        if (i > 0) springs[i - 1] += leftDeltas[i];
        if (i < SPRING_COUNT - 1) springs[i + 1] += rightDeltas[i];
      }
    }

    // 3. Draw the Water Polygon
    ctx.fillStyle = `rgba(${slateBlue.r}, ${slateBlue.g}, ${slateBlue.b}, 0.8)`;
    ctx.beginPath();
    ctx.moveTo(0, H);

    for (let i = 0; i < SPRING_COUNT; i++) {
      let x = (i / (SPRING_COUNT - 1)) * W;
      let y = waterLevel + springs[i];
      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Draw a dark surface line for contrast
    ctx.strokeStyle = `rgb(${slateBlue.r - 30}, ${slateBlue.g - 30}, ${slateBlue.b - 30})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < SPRING_COUNT; i++) {
      let x = (i / (SPRING_COUNT - 1)) * W;
      let y = waterLevel + springs[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // --- ENGINE 2: Top-Down (Wave Summation) ---
  function renderTopDown() {
    time += 0.1;
    let data = imageData.data;

    // Loop through every pixel in our 400x200 grid
    let pixelIndex = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {

        let amplitudeSum = 0;

        // Calculate interference from all active sources
        for (let i = 0; i < sources.length; i++) {
          let s = sources[i];
          let dx = x - s.x;
          let dy = y - s.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // Only render waves that have travelled outward from the start time
          let timeActive = time - s.startTime;
          let waveRadius = timeActive * 10;

          if (distance < waveRadius) {
            // Calculate the Sine wave.
            // 0.2 is wavelength (k), 1.5 is speed (omega)
            let phase = (distance * 0.2) - (timeActive * 1.5);

            // Attenuate (fade out) the wave the further it gets from the source
            let attenuation = 1 / (1 + (distance * 0.02));

            amplitudeSum += Math.sin(phase) * attenuation;
          }
        }

        // Base color (Cornsilk sky/floor)
        let r = 255, g = 253, b = 242;

        // If waves are interacting here, blend them into the Slate Blue
        if (sources.length > 0) {
          // Normalize sum (which can be negative or positive due to interference)
          let intensity = Math.max(-1, Math.min(1, amplitudeSum));

          if (intensity > 0) {
            // Constructive interference (Peaks) -> Blend towards Slate Blue
            r = r - (r - slateBlue.r) * intensity;
            g = g - (g - slateBlue.g) * intensity;
            b = b - (b - slateBlue.b) * intensity;
          } else {
            // Destructive/Troughs -> Blend towards a darker, deeper blue
            let darkR = slateBlue.r - 40;
            let darkG = slateBlue.g - 40;
            let darkB = slateBlue.b - 40;
            let absInt = Math.abs(intensity);
            r = r - (r - darkR) * absInt;
            g = g - (g - darkG) * absInt;
            b = b - (b - darkB) * absInt;
          }
        }

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255; // Alpha
        pixelIndex += 4;
      }
    }

    // Paint the calculated pixels directly to the canvas
    ctx.putImageData(imageData, 0, 0);

    // Draw little dots to show where the user clicked the sources
    ctx.fillStyle = '#696969';
    sources.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  animate(); // Start the loop
});
