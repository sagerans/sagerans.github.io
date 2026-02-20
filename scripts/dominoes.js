// 1. Setup Physics World (Cannon.js)
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// 2. Setup 3D Scene (Three.js)
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff8dc); // Matches your site background

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0x666666);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 3. Create the Floor
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floorMat = new THREE.MeshStandardMaterial({ color: 0xa9c191 }); // Sage green floor
const floorMesh = new THREE.Mesh(floorGeo, floorMat);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const floorBody = new CANNON.Body({
    mass: 0, // Mass of 0 makes it static
    shape: new CANNON.Plane()
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

// 4. Domino Logic
const dominoes = [];
const dominoDimensions = { x: 0.5, y: 2, z: 1 }; // Width, Height, Depth
let lastDominoPosition = null;

function createDomino(x, z) {
    // 3D Mesh
    const geometry = new THREE.BoxGeometry(dominoDimensions.x, dominoDimensions.y, dominoDimensions.z);
    const material = new THREE.MeshStandardMaterial({ color: 0x696969 }); // Dark gray
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    scene.add(mesh);

    // Physics Body
    const shape = new CANNON.Box(new CANNON.Vec3(dominoDimensions.x / 2, dominoDimensions.y / 2, dominoDimensions.z / 2));
    const body = new CANNON.Body({ mass: 1, shape: shape });
    body.position.set(x, dominoDimensions.y / 2, z);

    // Rotate to face the previous domino
    if (lastDominoPosition) {
        const dx = x - lastDominoPosition.x;
        const dz = z - lastDominoPosition.z;
        const angle = Math.atan2(dx, dz);
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
    }

    world.addBody(body);
    dominoes.push({ mesh, body });
    lastDominoPosition = { x, z };
}

// 5. Interaction (Clicking to place)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

container.addEventListener('click', (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(floorMesh);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        createDomino(point.x, point.z);
    }
});

// 6. Buttons
document.getElementById('topple-btn').addEventListener('click', () => {
    if (dominoes.length > 0) {
        const firstDomino = dominoes[0].body;
        // Apply a push force to the top of the first domino
        firstDomino.applyImpulse(
            new CANNON.Vec3(0, 0, -5), // Force direction
            new CANNON.Vec3(0, dominoDimensions.y / 2, 0) // Hit it at the top
        );
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    // Remove all dominoes and reset
    dominoes.forEach(d => {
        scene.remove(d.mesh);
        world.removeBody(d.body);
    });
    dominoes.length = 0;
    lastDominoPosition = null;
});

// 7. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Step the physics world
    world.step(1 / 60);

    // Update visual meshes to match physics bodies
    dominoes.forEach(d => {
        d.mesh.position.copy(d.body.position);
        d.mesh.quaternion.copy(d.body.quaternion);
    });

    renderer.render(scene, camera);
}
animate();
