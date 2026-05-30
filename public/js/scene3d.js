import * as THREE from "three";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 8);

const ambient = new THREE.AmbientLight(0x94a3b8, 0.45);
const keyLight = new THREE.DirectionalLight(0xc9a55c, 1.1);
keyLight.position.set(4, 6, 5);
const fillLight = new THREE.DirectionalLight(0x3d8b8b, 0.55);
fillLight.position.set(-5, -2, 3);
scene.add(ambient, keyLight, fillLight);

const group = new THREE.Group();
scene.add(group);

const gold = new THREE.Color(0xc9a55c);
const slate = new THREE.Color(0x64748b);
const teal = new THREE.Color(0x3d8b8b);

function makeTorus() {
  const geo = new THREE.TorusKnotGeometry(0.55, 0.16, 120, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: gold,
    metalness: 0.75,
    roughness: 0.22,
    emissive: 0x2a2210,
    emissiveIntensity: 0.15,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(-2.2, 0.4, 0);
  mesh.userData.spin = { x: 0.003, y: 0.005 };
  return mesh;
}

function makeIcosahedron() {
  const geo = new THREE.IcosahedronGeometry(0.7, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: teal,
    metalness: 0.5,
    roughness: 0.35,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(2.4, -0.3, -0.5);
  mesh.userData.spin = { x: -0.004, y: 0.006 };
  return mesh;
}

function makeOctahedron() {
  const geo = new THREE.OctahedronGeometry(0.45, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: slate,
    metalness: 0.65,
    roughness: 0.3,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0.8, 1.4, -1);
  mesh.userData.spin = { x: 0.005, y: -0.003 };
  return mesh;
}

const shapes = [makeTorus(), makeIcosahedron(), makeOctahedron()];
shapes.forEach((shape) => group.add(shape));

const particleCount = 420;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  const radius = 3 + Math.random() * 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i3 + 2] = radius * Math.cos(phi);
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xc9a55c,
  size: 0.035,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 8, 80);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0x3d8b8b,
  transparent: true,
  opacity: 0.25,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2.4;
group.add(ring);

const clock = new THREE.Clock();
let targetMouse = new THREE.Vector2(0, 0);
let mouse = new THREE.Vector2(0, 0);

window.addEventListener("pointermove", (e) => {
  targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
});

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

window.addEventListener("resize", resize);

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  mouse.lerp(targetMouse, 0.06);
  group.rotation.y = t * 0.12 + mouse.x * 0.25;
  group.rotation.x = mouse.y * 0.15;

  shapes.forEach((shape, i) => {
    const { spin } = shape.userData;
    shape.rotation.x += spin.x;
    shape.rotation.y += spin.y;
    shape.position.y += Math.sin(t * 1.2 + i) * 0.0008;
  });

  ring.rotation.z = t * 0.08;
  particles.rotation.y = t * 0.02;

  renderer.render(scene, camera);
}

animate();
