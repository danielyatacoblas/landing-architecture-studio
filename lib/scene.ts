// Escena del estudio solar: la casa AC20-FZK-Haus (modelo BIM real del KIT, convertido de IFC a GLB),
// una terraza con celosía de madera al sur y un árbol. Renderiza solo cuando algo cambia.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type SceneApi = {
  setSun: (dir: [number, number, number], altitude: number) => void;
  shadePct: () => number;
  resize: () => void;
  dispose: () => void;
};

const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...extra });

// Material por tipo de elemento IFC (el nombre del nodo en el GLB).
const BY_TYPE: Record<string, THREE.Material> = {
  IfcWallStandardCase: mat('#ece6da'),
  IfcSlabRoof: mat('#9c4f36', { roughness: 0.85 }),
  IfcSlab: mat('#d9d2c4'),
  IfcMember: mat('#8b5a3c', { roughness: 0.8 }),
  IfcBeam: mat('#8b5a3c', { roughness: 0.8 }),
  IfcWindow: mat('#3a4a52', { roughness: 0.25, metalness: 0.2 }),
  IfcDoor: mat('#6d4a33'),
  IfcRailing: mat('#3a3530'),
  IfcStair: mat('#cfc8bb'),
};

// Terraza: piso medido para el % de sombra.
const TERRACE = { x0: -4.5, x1: 4.5, z0: 5.6, z1: 10 };

export async function createScene(canvas: HTMLCanvasElement): Promise<SceneApi> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 300);
  camera.position.set(-26, 20, 30);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 2.5, 2);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minDistance = 26;
  controls.maxDistance = 70;
  controls.maxPolarAngle = 1.36;

  scene.add(new THREE.HemisphereLight('#e3ebf2', '#b5a88f', 0.95));
  const sun = new THREE.DirectionalLight('#fff3df', 3.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 90 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const occluders = new THREE.Group();
  scene.add(occluders);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(42, 64), mat('#d7d0c3', { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), mat('#b9bf9f', { roughness: 1 }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, 0.01, 1);
  lawn.receiveShadow = true;
  scene.add(lawn);

  const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, occ = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    (occ ? occluders : scene).add(mesh);
    return mesh;
  };

  // Terraza con celosía: piso de madera, dos vigas y listones este-oeste cada 45 cm.
  const wood = mat('#8b5a3c', { roughness: 0.8 });
  box(TERRACE.x1 - TERRACE.x0, 0.12, TERRACE.z1 - TERRACE.z0, 0, 0.06, (TERRACE.z0 + TERRACE.z1) / 2, mat('#c9b79c'), false);
  for (const x of [TERRACE.x0 + 0.15, TERRACE.x1 - 0.15]) {
    box(0.16, 2.9, 0.16, x, 1.45, TERRACE.z1 - 0.15, wood);
    box(0.18, 0.28, TERRACE.z1 - TERRACE.z0, x, 3.0, (TERRACE.z0 + TERRACE.z1) / 2, wood);
  }
  for (let z = TERRACE.z0 + 0.2; z <= TERRACE.z1; z += 0.45) box(TERRACE.x1 - TERRACE.x0, 0.16, 0.09, 0, 3.22, z, wood);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 3, 8), wood);
  trunk.position.set(10, 1.5, 2.5);
  trunk.castShadow = true;
  occluders.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), mat('#6f8a5b', { flatShading: true }));
  crown.position.set(10, 3.9, 2.5);
  crown.castShadow = true;
  occluders.add(crown);

  // La casa del KIT.
  const gltf = await new GLTFLoader().loadAsync('/models/fzk-haus.glb');
  gltf.scene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      const key = Object.keys(BY_TYPE).find((k) => o.name.startsWith(k) || o.parent?.name.startsWith(k));
      o.material = key ? BY_TYPE[key] : mat('#d8d2c6');
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  // Centro del modelo en el origen; la fachada sur mira hacia la terraza (+z).
  const bb = new THREE.Box3().setFromObject(gltf.scene);
  const c = bb.getCenter(new THREE.Vector3());
  gltf.scene.position.set(-c.x, -bb.min.y + 0.12, -c.z);
  occluders.add(gltf.scene);

  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 16), new THREE.MeshBasicMaterial({ color: '#f2b544' }));
  scene.add(sunBall);

  let frame = 0;
  const render = () => { frame = 0; controls.update(); renderer.render(scene, camera); };
  const request = () => { if (!frame) frame = requestAnimationFrame(render); };
  controls.addEventListener('change', request);
  controls.addEventListener('end', () => { let n = 20; const tick = () => { controls.update(); renderer.render(scene, camera); if (--n > 0) requestAnimationFrame(tick); }; tick(); });

  let sunDir = new THREE.Vector3(0, 1, 0);
  let sunUp = true;
  function setSun(dir: [number, number, number], altitude: number) {
    sunDir = new THREE.Vector3(...dir).normalize();
    sunUp = altitude > 0;
    sun.position.copy(sunDir.clone().multiplyScalar(45));
    sun.intensity = sunUp ? 0.8 + 2.4 * Math.min(1, altitude / 35) : 0;
    sunBall.position.copy(sunDir.clone().multiplyScalar(24));
    sunBall.visible = sunUp;
    request();
  }

  const ray = new THREE.Raycaster();
  function shadePct() {
    if (!sunUp) return 100;
    let hit = 0, total = 0;
    const p = new THREE.Vector3();
    for (let x = TERRACE.x0 + 0.2; x <= TERRACE.x1 - 0.2; x += 0.4) {
      for (let z = TERRACE.z0 + 0.2; z <= TERRACE.z1 - 0.2; z += 0.4) {
        p.set(x, 0.2, z);
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
