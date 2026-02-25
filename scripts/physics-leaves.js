document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('physics-container');
  if (!container) return;

  // --- 1. Setup Matter.js Aliases ---
  // NEW: Added `Events` to the list so we can hook into the physics loop
  const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events;

  // --- 2. Create the Engine & Renderer ---
  const engine = Engine.create();
  engine.world.gravity.y = 0.33;

  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      background: 'transparent',
      wireframes: false
    }
  });

  // --- 3. Build the "Room" (Side Walls Only!) ---
  const wallOptions = { isStatic: true, render: { visible: false } };
  const thick = 60;

  // We only keep the left and right walls so leaves can't be thrown out the sides
  const leftWall = Bodies.rectangle(0 - (thick / 2), container.clientHeight / 2, thick, container.clientHeight * 2, wallOptions);
  const rightWall = Bodies.rectangle(container.clientWidth + (thick / 2), container.clientHeight / 2, thick, container.clientHeight * 2, wallOptions);

  Composite.add(engine.world, [leftWall, rightWall]);

  // --- 4. The Infinite Spawner ---
  const leafImages = [
    'images/sageleafone.svg',
    'images/sageleaftwo.svg',
    'images/sageleafthree.svg'
  ];

  function spawnLeaf() {
    const randomImage = leafImages[Math.floor(Math.random() * leafImages.length)];
    const x = Math.random() * container.clientWidth;
    const y = -100; // Spawn safely above the visible screen

    const leaf = Bodies.rectangle(x, y, 40, 80, {
      restitution: 0.2,
      frictionAir: 0.04,
      friction: 0.5,
      render: {
        sprite: {
          texture: randomImage,
          xScale: 1.2,
          yScale: 1.2
        }
      }
    });

    Body.setAngularVelocity(leaf, (Math.random() - 0.5) * 0.1);
    Composite.add(engine.world, leaf);
  }

  // Pre-fill the screen with a few leaves immediately so it isn't empty on load
  for (let i = 0; i < 7; i++) {
    // Spread the initial spawn vertically so they don't all clump together
    setTimeout(spawnLeaf, i * 200);
  }

  // Spawn a new leaf every 600 milliseconds infinitely
  setInterval(spawnLeaf, 450);


  // --- 5. The Garbage Collector (Despawning) ---
  // This runs right before the engine calculates the next frame
  Events.on(engine, 'beforeUpdate', () => {
    const bodies = Composite.allBodies(engine.world);

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];

      // If the body is NOT a static wall, and it falls 200px below the screen...
      if (!body.isStatic && body.position.y > container.clientHeight + 200) {
        // ...delete it from the physics world to save memory!
        Composite.remove(engine.world, body);
      }
    }
  });


  // --- 6. Add Drag & Throw Interactivity ---
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // --- 7. Run the Engine ---
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // --- 8. Handle Window Resizing ---
  window.addEventListener('resize', () => {
    render.bounds.max.x = container.clientWidth;
    render.bounds.max.y = container.clientHeight;
    render.options.width = container.clientWidth;
    render.options.height = container.clientHeight;
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;

    // Reposition and stretch the side walls dynamically
    Body.setPosition(leftWall, { x: 0 - (thick / 2), y: container.clientHeight / 2 });
    Body.setPosition(rightWall, { x: container.clientWidth + (thick / 2), y: container.clientHeight / 2 });
  });
});
