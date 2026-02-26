document.addEventListener('DOMContentLoaded', () => {
  const canvasSide = document.getElementById('wave-canvas-side');
  const canvasTop = document.getElementById('wave-canvas-top');

  if (!canvasSide || !canvasTop) return;

  // --- 1. Responsive Canvas Aspect Ratio ---
  // Detect if the user is on a mobile device (screen width < 768px)
  let isMobile = window.innerWidth < 768;

  // Set internal resolution: Square (400x400) on mobile, Landscape (400x200) on desktop
  canvasSide.width = 400;
  canvasSide.height = isMobile ? 400 : 200;
  canvasTop.width = 400;
  canvasTop.height = isMobile ? 400 : 200;

  // If the user rotates their phone or drags their browser window past the desktop breakpoint,
  // reload the page so the math grid recalculates flawlessly for the new shape.
  window.addEventListener('resize', () => {
    const checkMobile = window.innerWidth < 768;
    if (isMobile !== checkMobile) {
      window.location.reload();
    }
  });

  // --- 2. Context & UI ---
  const ctxSide = canvasSide.getContext('2d');
  const ctxTop = canvasTop.getContext('2d');
  const resetBtn = document.getElementById('reset-waves');
  const slateBlue = { r: 136, g: 162, b: 181 };

  // Load sound effect
  const bloops = [
    new Audio('sounds/bloop1.mp3'),
    new Audio('sounds/bloop2.mp3'),
    new Audio('sounds/bloop3.mp3'),
    new Audio('sounds/bloop4.mp3'),
    new Audio('sounds/bloop5.mp3')
  ];

  bloops.forEach(sound => sound.volume = 0.4);

  // --- Side-On State ---
  const SPRING_COUNT = 400;
  let springs = new Float32Array(SPRING_COUNT);
  let velocities = new Float32Array(SPRING_COUNT);
  let droplets = [];
  const TENSION = 0.02;
  const DAMPENING = 0.992;
  const SPREAD = 0.25;

  // --- Top-Down State ---
  let sources = [];
  const MAX_SOURCES = 5;
  let time = 0;

  // Sizing (Now dynamically grabs the updated height from our responsive block!)
  const W = canvasSide.width;
  const H = canvasSide.height;
  let imageDataTop = ctxTop.createImageData(W, H);

  // --- Reset All ---
  resetBtn.addEventListener('click', () => {
    springs.fill(0);
    velocities.fill(0);
    droplets = [];
    sources = [];
    time = 0;
  });

  // --- Side-On Controls ---
  function handleSideInput(e) {
    e.preventDefault();
    const rect = canvasSide.getBoundingClientRect();
    const scaleX = canvasSide.width / rect.width;
    const scaleY = canvasSide.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (y < H * 0.7) {
      droplets.push({ x: x, y: y, vy: 0, radius: 4 });
    }
  }
  canvasSide.addEventListener('mousedown', handleSideInput);
  canvasSide.addEventListener('touchstart', handleSideInput, { passive: false });

  // --- Top-Down Controls ---
  function handleTopInput(e) {
    e.preventDefault();
    const rect = canvasTop.getBoundingClientRect();
    const scaleX = canvasTop.width / rect.width;
    const scaleY = canvasTop.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // Check if the user clicked an existing source
    const hitRadius = 10;
    let clickedExisting = false;

    // Loop backwards so if two sources overlap, we delete the top one
    for (let i = sources.length - 1; i >= 0; i--) {
      let s = sources[i];
      let distance = Math.sqrt((x - s.x)**2 + (y - s.y)**2);

      if (distance < hitRadius) {
        sources.splice(i, 1);
        clickedExisting = true;
        break;
      }
    }

    // If they didn't click an existing source, spawn a new one
    if (!clickedExisting && sources.length < MAX_SOURCES) {
      sources.push({ x: x, y: y, startTime: time });
    }
  }

    canvasTop.addEventListener('mousedown', handleTopInput);
    canvasTop.addEventListener('touchstart', handleTopInput, { passive: false });

  // --- Master Animation Loop ---
  function animate() {
    requestAnimationFrame(animate);

    // Clear both canvases for the next frame
    ctxSide.clearRect(0, 0, W, H);
    ctxTop.clearRect(0, 0, W, H);

    renderSideOn();
    renderTopDown();
  }

  // --- Engine 1: Side-On ---
  function renderSideOn() {
    const waterLevel = H * 0.7;

    for (let i = droplets.length - 1; i >= 0; i--) {
      let d = droplets[i];
      d.vy += 0.2;
      d.y += d.vy;

      ctxSide.fillStyle = `rgb(${slateBlue.r}, ${slateBlue.g}, ${slateBlue.b})`;
      ctxSide.beginPath();
      ctxSide.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctxSide.fill();

      if (d.y >= waterLevel) {
        const randomBloop = bloops[Math.floor(Math.random() * bloops.length)];

        randomBloop.cloneNode(true).play().catch(err => {});

        const springIndex = Math.floor((d.x / W) * SPRING_COUNT);
        const splashRadius = 5;
        for (let j = -splashRadius; j <= splashRadius; j++) {
          let idx = springIndex + j;
          if (idx >= 0 && idx < SPRING_COUNT) {
            let force = 1 - (Math.abs(j) / (splashRadius + 1));
            velocities[idx] += d.vy * force * 4.0;
          }
        }
        droplets.splice(i, 1);
      }
    }

    for (let i = 0; i < SPRING_COUNT; i++) {
      let accel = -TENSION * springs[i];
      velocities[i] += accel;
      velocities[i] *= DAMPENING;
      springs[i] += velocities[i];
    }

    let leftDeltas = new Float32Array(SPRING_COUNT);
    let rightDeltas = new Float32Array(SPRING_COUNT);

    for (let j = 0; j < 8; j++) {
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

    ctxSide.fillStyle = `rgba(${slateBlue.r}, ${slateBlue.g}, ${slateBlue.b}, 0.8)`;
    ctxSide.beginPath();
    ctxSide.moveTo(0, H);
    for (let i = 0; i < SPRING_COUNT; i++) {
      ctxSide.lineTo((i / (SPRING_COUNT - 1)) * W, waterLevel + springs[i]);
    }
    ctxSide.lineTo(W, H);
    ctxSide.closePath();
    ctxSide.fill();

    ctxSide.strokeStyle = `rgb(${slateBlue.r - 30}, ${slateBlue.g - 30}, ${slateBlue.b - 30})`;
    ctxSide.lineWidth = 2;
    ctxSide.beginPath();
    for (let i = 0; i < SPRING_COUNT; i++) {
      let x = (i / (SPRING_COUNT - 1)) * W;
      let y = waterLevel + springs[i];
      if (i === 0) ctxSide.moveTo(x, y);
      else ctxSide.lineTo(x, y);
    }
    ctxSide.stroke();
  }

  // --- Engine 2: Top-Down ---
  function renderTopDown() {
    time += 0.1;
    let data = imageDataTop.data;
    let pixelIndex = 0;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let amplitudeSum = 0;

        for (let i = 0; i < sources.length; i++) {
          let s = sources[i];
          let distance = Math.sqrt((x - s.x)**2 + (y - s.y)**2);
          let timeActive = time - s.startTime;

          if (distance < timeActive * 10) {
            let phase = (distance * 0.2) - (timeActive * 1.5);
            let attenuation = 1 / (1 + (distance * 0.02));
            amplitudeSum += Math.sin(phase) * attenuation;
          }
        }

        let r = 255, g = 253, b = 242;

        if (sources.length > 0) {
          let intensity = Math.max(-1, Math.min(1, amplitudeSum));
          if (intensity > 0) {
            r -= (r - slateBlue.r) * intensity;
            g -= (g - slateBlue.g) * intensity;
            b -= (b - slateBlue.b) * intensity;
          } else {
            let absInt = Math.abs(intensity);
            r -= (r - (slateBlue.r - 40)) * absInt;
            g -= (g - (slateBlue.g - 40)) * absInt;
            b -= (b - (slateBlue.b - 40)) * absInt;
          }
        }

        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
        pixelIndex += 4;
      }
    }

    ctxTop.putImageData(imageDataTop, 0, 0);

    ctxTop.fillStyle = '#696969';
    sources.forEach(s => {
      ctxTop.beginPath();
      ctxTop.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctxTop.fill();
    });
  }

  animate(); // Start the dual-engine loop!
});
