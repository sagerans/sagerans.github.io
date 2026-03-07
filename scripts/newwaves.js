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

  let waves = [];

  // --- AUDIO INIT & COMPRESSOR ---
  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
    updateMasterVolume();
  }

  function updateMasterVolume() {
    if (!masterGain) return;
    let totalAmplitude = 0;
    waves.forEach(w => {
      totalAmplitude += Math.abs(w.a);
    });
    // Auto-compress to prevent speakers from clipping
    const safeVolume = 0.5 / Math.max(1, totalAmplitude);
    masterGain.gain.setTargetAtTime(safeVolume, audioCtx.currentTime, 0.1);
  }

  // --- UI & EQUATIONS ---
  function updateEquationDisplay(wave) {
    const eqDiv = document.getElementById(`eq-${wave.id}`);
    if (!eqDiv) return;

    const A = wave.a;
    const f = wave.f;
    const phi = wave.phi; // Now perfectly in radians

    // Formatted as standard physics math: A sin(2π(f)t - φ) + D
    const latexStr = `y(t) = ${A} \\sin[2\\pi\\cdot${f}\\cdot(t - ${phi})]`;
    katex.render(latexStr, eqDiv, { throwOnError: false });
  }

  function addWave(a = 1, f = 440, phi = 0, d = 0) {
    const id = waveIdCounter++;
    const waveData = { id, a, f, phi, d, osc: null, delay: null, gain: null };
    waves.push(waveData);

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
          <label>Phase Shift (rad)</label>
          <input type="number" step="0.01" value="${phi}" data-id="${id}" data-param="phi">
        </div>
      </div>
    `;

    // Forcefully add new waves to the absolute top of the list
    if (wavesList.firstChild) {
      wavesList.insertBefore(card, wavesList.firstChild);
    } else {
      wavesList.appendChild(card);
    }

    updateEquationDisplay(waveData);
    updateMasterVolume();

    // Live update listeners
    card.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const param = e.target.dataset.param;
        const val = parseFloat(e.target.value) || 0;
        waveData[param] = val;
        updateEquationDisplay(waveData);
        updateAudioNode(waveData);
        if (param === 'a') updateMasterVolume();
      });
    });

    card.querySelector('.delete-wave-btn').addEventListener('click', () => {
      removeWave(id);
    });

    // If already playing, start this new wave synced up slightly in the future
    if (isPlaying) {
      const syncTime = audioCtx.currentTime + 0.05;
      startAudioNode(waveData, syncTime);
    }
  }

  function removeWave(id) {
    const waveIndex = waves.findIndex(w => w.id === id);
    if (waveIndex === -1) return;

    const wave = waves[waveIndex];
    if (wave.osc) {
      wave.osc.stop();
      wave.osc.disconnect();
      wave.delay.disconnect();
      wave.gain.disconnect();
    }

    waves.splice(waveIndex, 1);
    document.getElementById(`wave-card-${id}`).remove();
    updateMasterVolume();
  }

  // --- AUDIO ROUTING ---
  function startAudioNode(wave, syncTime = null) {
    if (!audioCtx) initAudio();
    if (wave.osc) return;

    wave.osc = audioCtx.createOscillator();
    wave.delay = audioCtx.createDelay(10);
    wave.gain = audioCtx.createGain();
    wave.osc.type = 'sine';

    updateAudioNode(wave);

    wave.osc.connect(wave.delay);
    wave.delay.connect(wave.gain);
    wave.gain.connect(masterGain);

    const startTime = syncTime || audioCtx.currentTime;
    wave.osc.start(startTime);
  }

  function updateAudioNode(wave) {
    if (!wave.osc) return;

    wave.osc.frequency.setTargetAtTime(wave.f, audioCtx.currentTime, 0.05);
    wave.gain.gain.setTargetAtTime(wave.a, audioCtx.currentTime, 0.05);

    // Math: Delay time based on radians
    const period = wave.f !== 0 ? Math.abs(1 / wave.f) : 0;

    // Divide the shift by 2PI to get the fraction of the period
    let phaseFraction = wave.phi / (2 * Math.PI);
    phaseFraction = phaseFraction % 1; // Keep it within 1 cycle
    if (phaseFraction < 0) phaseFraction += 1; // Handle negative phase gracefully

    const delayTime = period !== 0 ? phaseFraction * period : 0;
    wave.delay.delayTime.setTargetAtTime(delayTime, audioCtx.currentTime, 0.05);
  }

  // --- MASTER PLAY/PAUSE ---
  playBtn.addEventListener('click', () => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (isPlaying) {
      waves.forEach(w => {
        if (w.osc) {
          w.osc.stop();
          w.osc.disconnect();
          w.delay.disconnect();
          w.gain.disconnect();
          w.osc = null;
        }
      });
      playBtn.innerText = "▶ Play Tone";
      playBtn.style.background = "";
      playBtn.style.color = "";
    } else {
      // Synchronize all waves to start at the exact same digital sample!
      const syncTime = audioCtx.currentTime + 0.05;
      waves.forEach(w => startAudioNode(w, syncTime));

      playBtn.innerText = "⏸ Stop Tone";
      playBtn.style.background = "var(--error-color)";
      playBtn.style.color = "#fff";
    }
    isPlaying = !isPlaying;
  });

  addBtn.addEventListener('click', () => {
    addWave(1, 440, 0, 0);
  });

  // --- REAL-TIME VISUALIZER ---
  let timeOffset = 0;
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "rgba(136, 136, 136, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    // Read the CSS variable live so it updates instantly on dark mode toggle!
    const waveColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-main').trim() || "#a9c191";
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 3;

    // Dynamic Auto-Scaling math
    let maxPeak = 0;
    waves.forEach(w => {
      if (w.f !== 0) maxPeak += Math.abs(w.a);
    });

    const visualBoundary = Math.max(2.5, maxPeak);
    const usableHalfHeight = (canvas.height / 2) * 0.9;
    const dynamicScale = usableHalfHeight / visualBoundary;

    const timeWindow = 0.01;

    for (let x = 0; x < canvas.width; x++) {
      const t = (x / canvas.width) * timeWindow + timeOffset;
      let combinedY = 0;

      waves.forEach(w => {
        if (w.f === 0) return;
        // Perfect radian physics math
        combinedY += w.a * Math.sin(2 * Math.PI * w.f * t - w.phi);
      });

      const pixelY = (canvas.height / 2) - (combinedY * dynamicScale);

      if (x === 0) ctx.moveTo(x, pixelY);
      else ctx.lineTo(x, pixelY);
    }

    ctx.stroke();
    if (isPlaying) timeOffset += 0.0001;
    requestAnimationFrame(drawCanvas);
  }

  drawCanvas();
  addWave();

  // ==========================================
  // --- SEMITONE CALCULATOR ---
  // ==========================================
  const calcBaseInput = document.getElementById('calc-base-freq');
  const calcNInput = document.getElementById('calc-semitones');
  const calcEqDisplay = document.getElementById('calc-equation');

  function updateCalculator() {
    if (!calcBaseInput || !calcNInput || !calcEqDisplay) return;

    const f0 = parseFloat(calcBaseInput.value) || 0;
    const n = parseFloat(calcNInput.value) || 0;

    const f = f0 * Math.pow(2, n / 12);
    const latexStr = `f = ${f0} \\times 2^{\\frac{${n}}{12}} = ${f.toFixed(2)}\\text{ Hz}`;

    katex.render(latexStr, calcEqDisplay, { throwOnError: false });
  }

  if (calcBaseInput && calcNInput) {
    calcBaseInput.addEventListener('input', updateCalculator);
    calcNInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }
});
