document.addEventListener('DOMContentLoaded', () => {
  // check if mobile
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) return;

  let lastGhostTime = 0;
  const throttleDelay = 30; // drop ghost (ms)

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();

    // If we moved the mouse too recently, skip this frame to save performance
    if (now - lastGhostTime < throttleDelay) return;
    lastGhostTime = now;

    // create ghost
    const ghost = document.createElement('div');
    ghost.classList.add('cursor-ghost');

    // position ghost
    ghost.style.left = e.pageX + 'px';
    ghost.style.top = e.pageY + 'px';

    // add ghost to page
    document.body.appendChild(ghost);

    // force browser to register element before fade (trigger a reflow)
    void ghost.offsetWidth;

    // Trigger the CSS transition to fade out and shrink slightly
    // trigger CSS fade out and shrinking
    ghost.style.opacity = '0';
    ghost.style.transform = 'scale(0.5)';

    // avoid thousands of cursors by removing after animation finishes
    setTimeout(() => {
      ghost.remove();
    }, 400);
  });
});
