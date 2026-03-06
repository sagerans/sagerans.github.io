document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wavesList = document.getElementById('waves-list');
  const playBtn = document.getElementById('master-play-btn');
  const addBtn = document.getElementById('add-wave-btn');

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let waveIdCounter = 0;

  // State array to hold all our wave data
  let waves = [];

  // Initialize the Web Audio API (Must be triggered by a user click)
  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5; // Master volume
    masterGain.connect(audioCtx.destination);
    updateMasterVolume();
  }

  // --- NEW: Auto-Compressor to prevent speaker clipping ---
  function updateMasterVolume() {
    if (!masterGain) return;

    let totalAmplitude = 0;
    waves.forEach(w => {
      totalAmplitude += Math.abs(w.a);
    });

    // Baseline volume is 0.5. If total amplitude exceeds 1, scale it down proportionally.
    const safeVolume = 0.5 / Math.max(1, totalAmplitude);

    // Smoothly ramp to the new volume over 0.1 seconds to prevent audio "pops" or clicking
    masterGain.gain.setTargetAtTime(safeVolume, audioCtx.currentTime, 0.1);
  }

  // Generate the LaTeX string for KaTeX
  function updateEquationDisplay(wave) {
    const eqDiv = document.getElementById(`eq-${wave.id}`);
    if (!eqDiv) return;

    // Format the math: y(t) = A * sin( 2pi(f)(t - phi) ) + D
    const A = wave.a;
    const f = wave.f;
    const phi = wave.phi;
    const D = wave.d;

    // We use 2\pi(f) so it looks clean, e.g., 2π(440)
    const latexStr = `y(t) = ${A} \\sin(2\\pi(${f})(t - ${phi})) ${D >= 0 ? '+' : '-'} ${Math.abs(D)}`;

    // Render the math!
    katex.render(latexStr, eqDiv, { throwOnError: false });
  }

  function addWave(a = 1, f = 440, phi = 0, d = 0) { // Default is now cleanly 440 Hz!
    const id = waveIdCounter++;

    const waveData = { id, a, f, phi, d, osc: null, delay: null, gain: null };
    waves.push(waveData);

    // Create the UI Card
    const card = document.createElement('div');
    card.className = 'wave-card';
    card.id = `wave-card-${id}`;

    card.innerHTML = `
      <div class="wave-card-header">
        <div id="eq-${id}" class="wave-equation"></div>
        <button class="delete-wave-btn" data-id="${id}">Delete</button>
      </div>
      <div class="wave-inputs">
        <div class="wave-input-group">
          <label>Amplitude (A)</label>
          <input type="number" step="0.1" value="${a}" data-id="${id}" data-param="a">
        </div>
        <div class="wave-input-group">
          <label>Frequency (Hz)</label>
          <input type="number" step="1" value="${f}" data-id="${id}" data-param="f">
        </div>
        <div class="wave-input-group">
          <label>Phase Shift (φ)</label>
          <input type="number" step="0.001" value="${phi}" data-id="${id}" data-param="phi">
        </div>
        <div class="wave-input-group">
          <label>Vertical Shift (D)</label>
          <input type="number" step="0.1" value="${d}" data-id="${id}" data-param="d">
        </div>
      </div>
    `;

    wavesList.prepend(card);
    updateEquationDisplay(waveData);
    updateMasterVolume();

    // Event listeners for live updates
    card.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const param = e.target.dataset.param;
        const val = parseFloat(e.target.value) || 0;
        waveData[param] = val;
        updateEquationDisplay(waveData);
        updateAudioNode(waveData);

        if (param === 'a' || param === 'd') {
          updateMasterVolume();
        }
      });
    });

    card.querySelector('.delete-wave-btn').addEventListener('click', () => {
      removeWave(id);
    });

    if (isPlaying) startAudioNode(waveData);
  }

  function removeWave(id) {
    const waveIndex = waves.findIndex(w => w.id === id);
    if (waveIndex === -1) return;

    const wave = waves[waveIndex];
    if (wave.osc) {
      wave.osc.stop();
      wave.osc.disconnect();
      wave.gain.disconnect();
    }

    waves.splice(waveIndex, 1);
    document.getElementById(`wave-card-${id}`).remove();
    updateMasterVolume();
  }

  // --- AUDIO ROUTING ---
  function startAudioNode(wave) {
    if (!audioCtx) initAudio();
    if (wave.osc) return; // Already playing

    wave.osc = audioCtx.createOscillator();
    wave.delay = audioCtx.createDelay(10); // Max 10s delay
    wave.gain = audioCtx.createGain();

    wave.osc.type = 'sine';

    updateAudioNode(wave);

    // Route: Osc -> Delay -> Gain -> Master
    wave.osc.connect(wave.delay);
    wave.delay.connect(wave.gain);
    wave.gain.connect(masterGain);

    wave.osc.start();
  }

  function updateAudioNode(wave) {
    if (!wave.osc) return;

    // We can now pass the frequency directly without dividing!
    wave.osc.frequency.setTargetAtTime(wave.f, audioCtx.currentTime, 0.05);

    // Amplitude mapping
    wave.gain.gain.setTargetAtTime(wave.a, audioCtx.currentTime, 0.05);

    // Phase shift translates to a time delay in Web Audio.
    // We modulo the delay by the period (1/f) so it doesn't try to delay for minutes if they type a big number.
    const period = wave.f !== 0 ? Math.abs(1 / wave.f) : 0;
    const delayTime = period !== 0 ? Math.abs(wave.phi) % period : 0;
    wave.delay.delayTime.setTargetAtTime(delayTime, audioCtx.currentTime, 0.05);
  }

  // --- PLAY/PAUSE LOGIC ---
  playBtn.addEventListener('click', () => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (isPlaying) {
      waves.forEach(w => {
        if (w.osc) {
          w.osc.stop();
          w.osc.disconnect();
          w.osc = null;
        }
      });
      playBtn.innerText = "▶ Play Tone";
      playBtn.style.background = "";
      playBtn.style.color = "";
    } else {
      waves.forEach(w => startAudioNode(w));
      playBtn.innerText = "⏸ Stop Tone";
      playBtn.style.background = "var(--error-color)";
      playBtn.style.color = "#fff";
    }
    isPlaying = !isPlaying;
  });

  addBtn.addEventListener('click', () => {
    addWave(1, 440, 0, 0); // Adds a new A440 wave
  });

  // --- REAL-TIME VISUALIZER ---
  let timeOffset = 0;
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "rgba(136, 136, 136, 0.3)"; // Muted axis
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    const waveColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-main').trim();
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 3;

    // --- NEW: Dynamic Auto-Scaling ---
    // Calculate the absolute maximum peak possible with the current active waves
    let maxPeak = 0;
    waves.forEach(w => {
      if (w.f !== 0) {
        maxPeak += Math.abs(w.a) + Math.abs(w.d);
      }
    });

    // Set a baseline boundary (e.g., 2.5 units).
    // This prevents a tiny wave (Amplitude 0.1) from aggressively zooming in to fill the whole screen.
    const visualBoundary = Math.max(2.5, maxPeak);

    // Calculate the scale to leave a 10% safety margin at the top and bottom of the canvas
    const usableHalfHeight = (canvas.height / 2) * 0.9;
    const dynamicScale = usableHalfHeight / visualBoundary;
    // ---------------------------------

    const timeWindow = 0.01;

    for (let x = 0; x < canvas.width; x++) {
      const t = (x / canvas.width) * timeWindow + timeOffset;

      let combinedY = 0;

      waves.forEach(w => {
        if (w.f === 0) return;
        combinedY += w.a * Math.sin(2 * Math.PI * w.f * (t - w.phi)) + w.d;
      });

      // Map mathematical Y to pixel Y using our new dynamicScale!
      const pixelY = (canvas.height / 2) - (combinedY * dynamicScale);

      if (x === 0) ctx.moveTo(x, pixelY);
      else ctx.lineTo(x, pixelY);
    }

    ctx.stroke();

    if (isPlaying) timeOffset += 0.0001;

    requestAnimationFrame(drawCanvas);
  }
  // Start the render loop and load the default wave
  drawCanvas();
  addWave(); // Pre-loads the A440 wave on page load

  // ==========================================
  // --- SEMITONE FREQUENCY CALCULATOR ---
  // ==========================================
  const calcBaseInput = document.getElementById('calc-base-freq');
  const calcNInput = document.getElementById('calc-semitones');
  const calcEqDisplay = document.getElementById('calc-equation');

  function updateCalculator() {
    if (!calcBaseInput || !calcNInput || !calcEqDisplay) return;

    const f0 = parseFloat(calcBaseInput.value) || 0;
    const n = parseFloat(calcNInput.value) || 0;

    // The math: f = f0 * 2^(n/12)
    const f = f0 * Math.pow(2, n / 12);

    // Format it beautifully for KaTeX.
    // We use .toFixed(2) to round the final frequency so the UI stays clean.
    const latexStr = `f = ${f0} \\times 2^{\\frac{${n}}{12}} = ${f.toFixed(2)}\\text{ Hz}`;

    katex.render(latexStr, calcEqDisplay, { throwOnError: false });
  }

  // Attach event listeners and run once on page load
  if (calcBaseInput && calcNInput) {
    calcBaseInput.addEventListener('input', updateCalculator);
    calcNInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }
});
