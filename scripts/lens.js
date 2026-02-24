document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('lens-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // --- Simulation State ---
  let lensX = 400;
  let screenX = 150;
  let subjectHeight = 80;

  let isDraggingLens = false;
  let isDraggingScreen = false;
  let isDraggingSubject = false;

  let lensType = 'convex';
  let sourceType = 'point';

  // --- Constants ---
  const centerY = canvas.height / 2;
  const subjectX = 700;
  const rayColors = ['#ff3366', '#ff9933', '#ffff66', '#66ff66', '#33ccff', '#cc66ff'];

  // Listeners for Dropdowns
  document.getElementById('lens-type').addEventListener('change', (e) => {
    lensType = e.target.value;
    drawScene();
  });

  document.getElementById('source-type').addEventListener('change', (e) => {
    sourceType = e.target.value;
    drawScene();
  });

  // --- Mouse & Touch Listeners ---
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  canvas.addEventListener('mousedown', (e) => checkDragStart(getMousePos(e)));
  canvas.addEventListener('touchstart', (e) => checkDragStart(getMousePos(e)), {passive: true});

  window.addEventListener('mousemove', (e) => handleDrag(getMousePos(e)));
  window.addEventListener('touchmove', (e) => handleDrag(getMousePos(e)), {passive: true});

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
  window.addEventListener('mouseleave', endDrag);

  function checkDragStart(pos) {
    const { x, y } = pos;
    const tipY = centerY - subjectHeight;

    if (sourceType === 'point' && Math.abs(x - subjectX) < 40 && Math.abs(y - tipY) < 40) {
      isDraggingSubject = true;
    } else if (Math.abs(x - lensX) < 40 && Math.abs(y - centerY) < 120) {
      isDraggingLens = true;
    } else if (Math.abs(x - screenX) < 30) {
      isDraggingScreen = true;
    }
  }

  function handleDrag(pos) {
    const { x, y } = pos;
    if (isDraggingSubject) {
      subjectHeight = Math.max(-160, Math.min(centerY - y, 160));
      drawScene();
    } else if (isDraggingLens) {
      lensX = Math.max(screenX + 50, Math.min(x, subjectX - 50));
      drawScene();
    } else if (isDraggingScreen) {
      screenX = Math.max(20, Math.min(x, lensX - 50));
      drawScene();
    }
  }

  function endDrag() {
    isDraggingLens = false;
    isDraggingScreen = false;
    isDraggingSubject = false;
  }

  // --- Drawing & Physics Logic ---
  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Determine Focal Length (Negative for Concave/Diverging!)
    let focalLength = 100;
    if (lensType === 'convex') focalLength = 100;
    else if (lensType === 'plano') focalLength = 150;
    else if (lensType === 'concave') focalLength = -100;
    else if (lensType === 'plano-concave') focalLength = -150;

    const lensRadius = 90;
    let screenHits = [];
    let imageX = 0;
    let isVirtual = false;

    // Draw Optical Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = '#444';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Focal Points
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lensX - Math.abs(focalLength), centerY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(lensX + Math.abs(focalLength), centerY, 3, 0, Math.PI * 2); ctx.fill();

    // --- RAY TRACING MATH ---
    if (sourceType === 'point') {
      const do_dist = subjectX - lensX;
      let di_dist = 0;
      let magnification = 0;

      if (do_dist === focalLength) {
        di_dist = Infinity;
      } else {
        di_dist = 1 / ((1 / focalLength) - (1 / do_dist));
        imageX = lensX - di_dist;
        magnification = -di_dist / do_dist;
        isVirtual = di_dist < 0; // True if diverging OR if object is inside convex focal length!
      }

      const imageTipY = centerY - (subjectHeight * magnification);
      const tipX = subjectX;
      const tipY = centerY - subjectHeight;

      for (let i = 0; i < rayColors.length; i++) {
        const hitY = (centerY - lensRadius + 15) + (i * 30);

        // Ray from subject to lens
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(lensX, hitY);
        ctx.strokeStyle = rayColors[i];
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.stroke();

        if (di_dist !== Infinity) {
          const slope = (imageTipY - hitY) / (imageX - lensX);
          const leftEdgeY = hitY + slope * (0 - lensX);

          // Draw real refracted ray (Always travels to the left)
          ctx.beginPath();
          ctx.moveTo(lensX, hitY);
          ctx.lineTo(0, leftEdgeY);
          ctx.stroke();

          // Draw dashed virtual ray (Tracing back to the right)
          if (isVirtual) {
            ctx.beginPath();
            ctx.moveTo(lensX, hitY);
            ctx.lineTo(imageX, imageTipY);
            ctx.setLineDash([5, 5]);
            ctx.globalAlpha = 0.4;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 0.8;
          }

          const screenHitY = hitY + slope * (screenX - lensX);
          screenHits.push(screenHitY);
        }
      }

      // Draw the Draggable Point Subject
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(subjectX, centerY);
      ctx.lineTo(subjectX, tipY);
      ctx.stroke();

      ctx.fillStyle = '#a9c191';
      ctx.beginPath();
      ctx.arc(subjectX, tipY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw the Projected Image Arrow (Real or Ghostly Virtual)
      if (di_dist !== Infinity) {
        ctx.strokeStyle = isVirtual ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)';
        if (isVirtual) ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(imageX, centerY);
        ctx.lineTo(imageX, imageTipY);

        const arrowDir = (subjectHeight * magnification > 0) ? 12 : -12;
        ctx.lineTo(imageX - 8, imageTipY + arrowDir);
        ctx.moveTo(imageX, imageTipY);
        ctx.lineTo(imageX + 8, imageTipY + arrowDir);
        ctx.stroke();
        ctx.setLineDash([]);
      }

    } else {
      // COHERENT SOURCE MATH (Parallel Rays)
      const focalX = lensX - focalLength; // Shifts to the right if focal length is negative

      for (let i = 0; i < rayColors.length; i++) {
        const hitY = (centerY - lensRadius + 15) + (i * 30);

        ctx.beginPath();
        ctx.moveTo(subjectX, hitY);
        ctx.lineTo(lensX, hitY);
        ctx.strokeStyle = rayColors[i];
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.stroke();

        const slope = (centerY - hitY) / (focalX - lensX);
        const leftEdgeY = hitY + slope * (0 - lensX);

        // Real refracted ray
        ctx.beginPath();
        ctx.moveTo(lensX, hitY);
        ctx.lineTo(0, leftEdgeY);
        ctx.stroke();

        const screenHitY = hitY + slope * (screenX - lensX);
        screenHits.push(screenHitY);

        // Virtual dashed ray for diverging lenses
        if (focalLength < 0) {
          ctx.beginPath();
          ctx.moveTo(lensX, hitY);
          ctx.lineTo(focalX, centerY);
          ctx.setLineDash([5, 5]);
          ctx.globalAlpha = 0.4;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 0.8;
        }
      }

      // Draw the Coherent "Laser" Emitter Box
      ctx.fillStyle = '#444';
      ctx.fillRect(subjectX - 10, centerY - lensRadius, 20, lensRadius * 2);
      ctx.strokeStyle = '#696969';
      ctx.strokeRect(subjectX - 10, centerY - lensRadius, 20, lensRadius * 2);
    }

    // --- Draw the Lens ---
    ctx.fillStyle = 'rgba(169, 193, 145, 0.4)';
    ctx.strokeStyle = '#a9c191';
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (lensType === 'convex') {
      ctx.moveTo(lensX, centerY - 100);
      ctx.quadraticCurveTo(lensX - 40, centerY, lensX, centerY + 100);
      ctx.quadraticCurveTo(lensX + 40, centerY, lensX, centerY - 100);
    } else if (lensType === 'plano') {
      ctx.moveTo(lensX + 10, centerY - 100);
      ctx.lineTo(lensX + 10, centerY + 100);
      ctx.quadraticCurveTo(lensX - 40, centerY, lensX + 10, centerY - 100);
    } else if (lensType === 'concave') {
      ctx.moveTo(lensX - 20, centerY - 100);
      ctx.quadraticCurveTo(lensX + 10, centerY, lensX - 20, centerY + 100);
      ctx.lineTo(lensX + 20, centerY + 100);
      ctx.quadraticCurveTo(lensX - 10, centerY, lensX + 20, centerY - 100);
    } else if (lensType === 'plano-concave') {
      ctx.moveTo(lensX + 10, centerY - 100);
      ctx.lineTo(lensX + 10, centerY + 100);
      ctx.lineTo(lensX - 20, centerY + 100);
      ctx.quadraticCurveTo(lensX + 10, centerY, lensX - 20, centerY - 100);
    }

    ctx.fill();
    ctx.stroke();

    // --- Draw the Draggable Projection Screen ---
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX, centerY - 140);
    ctx.lineTo(screenX, centerY + 140);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Screen", screenX, centerY - 150);

    // --- Draw Light Impacts & Check Focus ---
    if (screenHits.length > 0) {
      screenHits.forEach((hitY, index) => {
        ctx.fillStyle = rayColors[index];
        ctx.beginPath();
        ctx.arc(screenX, hitY, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Strict logic for "IN FOCUS" (Prevents false positives when pushed up against lens)
      let inFocus = false;
      if (sourceType === 'point' && !isVirtual && Math.abs(screenX - imageX) < 5) {
        inFocus = true;
      } else if (sourceType === 'coherent' && focalLength > 0 && Math.abs(screenX - (lensX - focalLength)) < 5) {
        inFocus = true;
      }

      if (inFocus) {
        ctx.fillStyle = '#a9c191';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText("IN FOCUS", screenX, centerY + 165);
      } else {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText("Out of Focus", screenX, centerY + 165);
      }
    }
  }

  // Initial draw
  drawScene();
});
