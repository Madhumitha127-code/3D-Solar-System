const canvas = document.getElementById('solarCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 80);

// Lighting
const light = new THREE.PointLight(0xffffff, 2, 500);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planetNames = [
  "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
];
const planetColors = [
  0xaaaaaa, 0xffcc00, 0x3399ff, 0xff3300,
  0xff9966, 0xffcc99, 0x66ffff, 0x3366ff
];
const planetSizes = [0.5, 0.8, 1, 0.7, 2, 1.8, 1.5, 1.4];
const orbitRadii = [10, 14, 18, 22, 30, 36, 42, 48];
const orbitSpeeds = [0.04, 0.015, 0.01, 0.008, 0.006, 0.005, 0.004, 0.002];

const planets = [];
const planetData = [];

// Create planets
for (let i = 0; i < 8; i++) {
  const geometry = new THREE.SphereGeometry(planetSizes[i], 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planetColors[i] });
  const planet = new THREE.Mesh(geometry, material);
  scene.add(planet);
  planets.push(planet);

  planetData.push({
    radius: orbitRadii[i],
    angle: Math.random() * Math.PI * 2,
    speed: orbitSpeeds[i]
  });

  // Speed slider
  const label = document.createElement('label');
  label.innerHTML = `${planetNames[i]}: `;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0.001';
  input.max = '0.1';
  input.step = '0.001';
  input.value = orbitSpeeds[i];
  input.oninput = (e) => {
    planetData[i].speed = parseFloat(e.target.value);
  };
  label.appendChild(input);
  document.getElementById('controls').appendChild(label);
}

// Pause/Resume
let paused = false;
document.getElementById('toggleAnimation').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('toggleAnimation').innerText = paused ? "Resume" : "Pause";
});

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    for (let i = 0; i < planets.length; i++) {
      planetData[i].angle += planetData[i].speed;
      const x = planetData[i].radius * Math.cos(planetData[i].angle);
      const z = planetData[i].radius * Math.sin(planetData[i].angle);
      planets[i].position.set(x, 0, z);
    }
  }
  renderer.render(scene, camera);
}
animate();
