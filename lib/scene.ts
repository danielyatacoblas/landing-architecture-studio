// Maqueta 3D de la Casa Patio: volúmenes, celosía de madera y árbol. Renderiza solo cuando algo cambia.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type SceneApi = {
  setSun: (dir: [number, number, number], altitude: number) => void;
  shadePct: () => number;
  resize: () => void;
  dispose: () => void;
};

const MAT = {
  plaster: new THREE.MeshStandardMaterial({ color: '#ece6da', roughness: 0.92 }),
  concrete: new THREE.MeshStandardMaterial({ color: '#c8c2b6', roughness: 0.95 }),
  wood: new THREE.MeshStandardMaterial({ color: '#8b5a3c', roughness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({ color: '#2f3a40', roughness: 0.25, metalness: 0.2 }),
  ground: new THREE.MeshStandardMaterial({ color: '#d7d0c3', roughness: 1 }),
  slab: new THREE.MeshStandardMaterial({ color: '#e1dbcf', roughness: 1 }),
  leaf: new THREE.MeshStandardMaterial({ color: '#6f8a5b', roughness: 0.9, flatShading: true }),
  sun: new THREE.MeshBasicMaterial({ color: '#f2b544' }),
};

export function createScene(canvas: HTMLCanvasElement): SceneApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 200);
  camera.position.set(30, 27, 36);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 1.2, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 34;
  controls.maxDistance = 75;
  controls.maxPolarAngle = 1.32;

  scene.add(new THREE.HemisphereLight('#e3ebf2', '#b5a88f', 0.95));
  const sun = new THREE.DirectionalLight('#fff3df', 3.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 80 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const occluders = new THREE.Group();
  scene.add(occluders);

  const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, occ = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    (occ ? occluders : scene).add(mesh);
    return mesh;
  };

  // Terreno y losa.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), MAT.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  box(16, 0.1, 19, 0, 0.05, 0, MAT.slab, false);

  // Volúmenes: ala norte de dos pisos, alas oeste y sur de un piso, muro este. El patio queda al centro.
  box(14, 6, 5.5, 0, 3, -6.25, MAT.concrete);
  box(4, 3.2, 7, -5, 1.6, 0, MAT.plaster);
  box(14, 3.2, 4.5, 0, 1.6, 5.75, MAT.plaster);
  box(0.3, 3.2, 7, 6.85, 1.6, 0, MAT.plaster);
  box(3.4, 0.25, 7, 5.15, 3.3, 0, MAT.plaster); // alero este

  // Mamparas hacia el patio.
  box(5.6, 2.4, 0.06, 0, 1.3, -3.48, MAT.glass);
  box(5.6, 2.2, 0.06, 0, 4.5, -3.48, MAT.glass);
  box(0.06, 2.4, 5.6, -2.98, 1.3, 0, MAT.glass);
  box(5.6, 2.4, 0.06, 0, 1.3, 3.48, MAT.glass);

  // Celosía: listones este-oeste cada 45 cm sobre dos vigas.
  box(0.18, 0.3, 7.4, -2.9, 3.35, 0, MAT.wood);
  box(0.18, 0.3, 7.4, 2.9, 3.35, 0, MAT.wood);
  for (let z = -3.4; z <= 3.41; z += 0.45) box(6, 0.18, 0.1, 0, 3.6, z, MAT.wood);

  // Árbol del patio.
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.2, 8), MAT.wood);
  trunk.position.set(1.6, 1.1, 1.6);
  trunk.castShadow = true;
  occluders.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), MAT.leaf);
  crown.position.set(1.6, 2.55, 1.6);
  crown.castShadow = true;
  occluders.add(crown);

  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 16), MAT.sun);
  scene.add(sunBall);

  let frame = 0;
  const render = () => {
    frame = 0;
    controls.update();
    renderer.render(scene, camera);
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(render); };
  controls.addEventListener('change', request);
  // El amortiguado necesita unos cuadros extra después de soltar.
  controls.addEventListener('end', () => { let n = 20; const tick = () => { controls.update(); renderer.render(scene, camera); if (--n > 0) requestAnimationFrame(tick); }; tick(); });

  let sunDir = new THREE.Vector3(0, 1, 0);
  let sunUp = true;

  function setSun(dir: [number, number, number], altitude: number) {
    sunDir = new THREE.Vector3(...dir).normalize();
    sunUp = altitude > 0;
    sun.position.copy(sunDir.clone().multiplyScalar(40));
    sun.intensity = sunUp ? 0.8 + 2.4 * Math.min(1, altitude / 35) : 0;
    sunBall.position.copy(sunDir.clone().multiplyScalar(19));
    sunBall.visible = sunUp;
    request();
  }

  // Porcentaje del piso del patio que no ve el sol: rayos desde una grilla de puntos hacia el sol.
  const ray = new THREE.Raycaster();
  function shadePct() {
    if (!sunUp) return 100;
    let hit = 0, total = 0;
    const p = new THREE.Vector3();
    for (let x = -2.8; x <= 2.81; x += 0.35) {
      for (let z = -3.3; z <= 3.31; z += 0.35) {
        p.set(x, 0.12, z);
        ray.set(p, sunDir);
        total++;
        if (ray.intersectObject(occluders, true).length) hit++;
      }
    }
    return Math.round((hit / total) * 100);
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    request();
  }

  return {
    setSun, shadePct, resize,
    dispose() {
      cancelAnimationFrame(frame);
      controls.dispose();
      renderer.dispose();
      scene.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
    },
  };
}
