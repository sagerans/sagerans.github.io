document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wavesList = document.getElementById('waves-list');
  const playBtn = document.getElementById('master-play-btn');
  const addBtn = document.getElementById('add-wave-btn');

  // LFO Elements
  const lfoEnable = document.getElementById('lfo-enable');
  const lfoTargetSelect = document.getElementById('lfo-target');
  const lfoRateInput = document.getElementById('lfo-rate');
  const lfoDepthInput = document.getElementById('lfo-depth');
  const lfoRateDisplay = document.getElementById('lfo-rate-display');
  const lfoDepthDisplay = document.getElementById('lfo-depth-display');

  let audioCtx = null;
  let masterGain = null;
  let lfo = null;
  let lfoDepth = null;
  let isPlaying = false;
  let waveIdCounter = 0;
  let waves = [];

  // Dedicated visual timers so the graph actually stops when paused!
  let lastFrameTime = performance.now();
  let visualTime = 0;
  let timeOffset = 0;

  // --- AUDIO INIT & COMPRESSOR ---
  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);

    // Securely initialize LFO
    lfo = audioCtx.createOscillator();
    lfoDepth = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = parseFloat(lfoRateInput.value) || 2.0;

    lfo.connect(lfoDepth);
    lfo.start();

    updateMasterVolume();
    updateLfoRouting();
  }

  function updateMasterVolume() {
    if (!masterGain) return;
    let totalAmplitude = 0;
    waves.forEach(w => { totalAmplitude += Math.abs(w.a); });

    // Auto-compress base volume to prevent clipping
    const baseSafeVolume = 0.5 / Math.max(1, totalAmplitude);

    const isLfoOn = lfoEnable.checked;
    const target = lfoTargetSelect.value;
    const depthPercent = parseFloat(lfoDepthInput.value) / 100;

    // AM (Tremolo) modifies the LFO gain here
    if (isLfoOn && target === 'am' && lfoDepth) {
      masterGain.gain.setTargetAtTime(baseSafeVolume * (1 - depthPercent / 2), audioCtx.currentTime, 0.1);
      lfoDepth.gain.setTargetAtTime(baseSafeVolume * (depthPercent / 2), audioCtx.currentTime, 0.1);
    } else {
      masterGain.gain.setTargetAtTime(baseSafeVolume, audioCtx.currentTime, 0.1);

      // CRITICAL FIX: Only zero out the LFO depth if we are NOT using FM.
      // (Otherwise we instantly kill the Vibrato pitch bend!)
      if (lfoDepth && (!isLfoOn || target !== 'fm')) {
        lfoDepth.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
      }
    }
  }

  function updateLfoRouting() {
    if (!lfoDepth || !masterGain) return;

    const isEnabled = lfoEnable.checked;
    const target = lfoTargetSelect.value;
    const depthPercent = parseFloat(lfoDepthInput.value) / 100;

    // Disconnect everywhere to cleanly reset the routing
    lfoDepth.disconnect();

    if (!isEnabled) {
      updateMasterVolume();
      return;
    }

    if (target === 'am') {
      // Tremolo: Connect to Master Volume
      lfoDepth.connect(masterGain.gain);
      updateMasterVolume();
    } else if (target === 'fm') {
      // Vibrato: Connect directly to each oscillator's frequency
      waves.forEach(w => {
        if (w.osc) lfoDepth.connect(w.osc.frequency);
      });
      // Set the pitch bend depth (Max 50Hz bend)
      lfoDepth.gain.setTargetAtTime(depthPercent * 50, audioCtx.currentTime, 0.1);
      updateMasterVolume();
    }
  }

  // LFO Event Listeners
  lfoRateInput.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value);
    if (lfo) lfo.frequency.setTargetAtTime(rate, audioCtx.currentTime, 0.1);
    lfoRateDisplay.innerText = rate.toFixed(1);
  });

  lfoDepthInput.addEventListener('input', (e) => {
    lfoDepthDisplay.innerText = e.target.value;
    updateLfoRouting();
  });

  lfoEnable.addEventListener('change', updateLfoRouting);
  lfoTargetSelect.addEventListener('change', updateLfoRouting);

  // --- UI & EQUATIONS ---
  function updateEquationDisplay(wave) {
    const eqDiv = document.getElementById(`eq-${wave.id}`);
    if (!eqDiv) return;
    const latexStr = `y(t) = ${wave.a} \\sin[${2*wave.f}\\pi(t - ${wave.phi})]`;
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

    if (wavesList.firstChild) {
      wavesList.insertBefore(card, wavesList.firstChild);
    } else {
      wavesList.appendChild(card);
    }

    updateEquationDisplay(waveData);
    updateMasterVolume();

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

    if (isPlaying) {
      const syncTime = audioCtx.currentTime + 0.05;
      startAudioNode(waveData, syncTime);
      updateLfoRouting();
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

    const period = wave.f !== 0 ? Math.abs(1 / wave.f) : 0;
    let phaseFraction = wave.phi / (2 * Math.PI);
    phaseFraction = phaseFraction % 1;
    if (phaseFraction < 0) phaseFraction += 1;

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
      playBtn.innerText = "▶";
      playBtn.style.background = "";
      playBtn.style.color = "";
    } else {
      const syncTime = audioCtx.currentTime + 0.05;
      waves.forEach(w => startAudioNode(w, syncTime));
      updateLfoRouting();

      playBtn.innerText = "⏸";
      playBtn.style.background = "var(--error-color)";
      playBtn.style.color = "#fff";

      // Reset the time tracker so it doesn't jump forward when unpaused
      lastFrameTime = performance.now();
    }
    isPlaying = !isPlaying;
  });

  addBtn.addEventListener('click', () => addWave(1, 440, 0, 0));

  // --- REAL-TIME VISUALIZER ---
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Track time properly so animation pauses when the audio stops
    const now = performance.now();
    const dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (isPlaying) {
      visualTime += dt;         // Real-time tracker for the LFO
      timeOffset += 0.0001;     // Super slow-mo tracker for the high frequency wave
    }

    // Center Zero-Line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "rgba(136, 136, 136, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const isLfoActive = lfoEnable.checked;
    const lfoTarget = lfoTargetSelect.value;
    const lfoFreq = parseFloat(lfoRateInput.value) || 2.0;
    const lfoDepthVal = parseFloat(lfoDepthInput.value) / 100;

    // Scale the main high-frequency waves
    const timeWindow = 0.01;
    let maxPeak = 0;
    waves.forEach(w => { if (w.f !== 0) maxPeak += Math.abs(w.a); });
    const visualBoundary = Math.max(2.5, maxPeak);
    const usableHalfHeight = (canvas.height / 2) * 0.9;
    const dynamicScale = usableHalfHeight / visualBoundary;

    // We draw the LFO mapping across a full 1-second window so it's beautifully readable!
    const lfoTimeWindow = 1.0;

    // --- 1. DRAW THE GREY GHOST LFO WAVE ---
    if (isLfoActive && lfoDepthVal > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(136, 136, 136, 0.4)";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);

      for (let x = 0; x < canvas.width; x++) {
        const t_lfo = (x / canvas.width) * lfoTimeWindow + visualTime;
        const lfoVal = Math.sin(2 * Math.PI * lfoFreq * t_lfo);

        if (lfoTarget === 'am') {
          // AM Envelope (Top Boundary)
          const amMod = 1.0 - (lfoDepthVal / 2) + ((lfoDepthVal / 2) * lfoVal);
          const pixelY = (canvas.height / 2) - (visualBoundary * dynamicScale * amMod);
          if (x === 0) ctx.moveTo(x, pixelY); else ctx.lineTo(x, pixelY);
        } else if (lfoTarget === 'fm') {
          // FM Center Wave
          const pixelY = (canvas.height / 2) - (lfoVal * usableHalfHeight * lfoDepthVal * 0.5);
          if (x === 0) ctx.moveTo(x, pixelY); else ctx.lineTo(x, pixelY);
        }
      }

      // Draw Bottom boundary for AM
      if (lfoTarget === 'am') {
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x++) {
          const t_lfo = (x / canvas.width) * lfoTimeWindow + visualTime;
          const lfoVal = Math.sin(2 * Math.PI * lfoFreq * t_lfo);
          const amMod = 1.0 - (lfoDepthVal / 2) + ((lfoDepthVal / 2) * lfoVal);
          const pixelY = (canvas.height / 2) + (visualBoundary * dynamicScale * amMod);
          if (x === 0) ctx.moveTo(x, pixelY); else ctx.lineTo(x, pixelY);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --- 2. DRAW MAIN WAVES (Applying visual Slinky effect) ---
    ctx.beginPath();
    const waveColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-main').trim() || "#a9c191";
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 3;

    for (let x = 0; x < canvas.width; x++) {
      const t = (x / canvas.width) * timeWindow + timeOffset;
      const t_lfo = (x / canvas.width) * lfoTimeWindow + visualTime;
      const lfoVal = Math.sin(2 * Math.PI * lfoFreq * t_lfo);

      let fmPhaseMod = 0;
      let amMod = 1;

      if (isLfoActive && lfoDepthVal > 0) {
        if (lfoTarget === 'am') {
          amMod = 1.0 - (lfoDepthVal / 2) + ((lfoDepthVal / 2) * lfoVal);
        } else if (lfoTarget === 'fm') {
          // Visually exaggerate the FM shift so the Slinky effect spans the screen
          const visualFmDepth = 12 * lfoDepthVal;
          fmPhaseMod = visualFmDepth * Math.cos(2 * Math.PI * lfoFreq * t_lfo);
        }
      }

      let combinedY = 0;
      waves.forEach(w => {
        if (w.f === 0) return;
        combinedY += w.a * Math.sin(2 * Math.PI * w.f * t - w.phi - fmPhaseMod);
      });

      const pixelY = (canvas.height / 2) - (combinedY * dynamicScale * amMod);
      if (x === 0) ctx.moveTo(x, pixelY); else ctx.lineTo(x, pixelY);
    }

    ctx.stroke();
    requestAnimationFrame(drawCanvas);
  }

  drawCanvas();
  addWave();

  // --- SEMITONE CALCULATOR ---
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
