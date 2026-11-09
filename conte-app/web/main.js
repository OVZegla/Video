// Les Trois Petits Cochons — conteur 3D animé (POC borne holographique, portrait, fond blanc)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL_B64 from './RobotExpressive.glb';

// =====================================================================
// VOIX
// Les répliques sont pré-générées pendant le build (voix neuronales FR,
// une par personnage) dans assets/audio/<id>.mp3. Si un fichier manque,
// on retombe sur la synthèse vocale Android (puis Web Speech en navigateur).
// Une réplique peut commencer par [loup] ou [cochon] pour changer de voix.
// =====================================================================
function lineId(raw) { // djb2 — même fonction dans extract-lines.mjs
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h * 33) ^ raw.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
function parseLine(raw) {
  const m = raw.match(/^\[(\w+)\]\s*/);
  return { voice: m ? m[1] : 'narrateur', text: m ? raw.slice(m[0].length) : raw };
}

const pending = {};
let speechId = 0;
window.__ttsDone = (id) => { const cb = pending[id]; delete pending[id]; if (cb) cb(); };
function speakTTS(text, voice) {
  return new Promise((resolve) => {
    const id = String(++speechId);
    pending[id] = resolve;
    setTimeout(() => window.__ttsDone(id), 1500 + text.length * 80);
    if (window.Android && window.Android.speak) {
      window.Android.speak(text, id, voice === 'loup' ? 0.7 : voice === 'cochon' ? 2.0 : 1.6);
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR'; u.pitch = voice === 'loup' ? 0.6 : 1.8; u.rate = 1.05;
      u.onend = () => window.__ttsDone(id);
      speechSynthesis.speak(u);
    }
  });
}
function speak(raw) {
  const { voice, text } = parseLine(raw);
  return new Promise((resolve) => {
    const audio = new Audio('audio/' + lineId(raw) + '.mp3');
    let finished = false;
    const end = () => { if (!finished) { finished = true; resolve(); } };
    const fallback = () => { if (!finished) { finished = true; speakTTS(text, voice).then(resolve); } };
    audio.addEventListener('ended', end);
    audio.addEventListener('error', fallback);
    audio.addEventListener('loadedmetadata', () => setTimeout(end, (audio.duration + 1.5) * 1000));
    audio.play().catch(fallback);
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// =====================================================================
// RENDU
// =====================================================================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // blanc = transparent sur la borne holographique

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 10, 17);
const CAM_POS = new THREE.Vector3(0, 10, 17), CAM_LOOK = new THREE.Vector3(0, 0.6, -3.5);
const camLook = CAM_LOOK.clone();
let camFocus = null; // objet sur lequel zoomer
camera.lookAt(camLook);
function fitCamera() {
  const a = innerWidth / innerHeight;
  const hHalf = Math.tan(THREE.MathUtils.degToRad(19));
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.max(hHalf / a, Math.tan(THREE.MathUtils.degToRad(22)))));
  camera.aspect = a; camera.updateProjectionMatrix();
}
fitCamera();

scene.add(new THREE.HemisphereLight(0xffffff, 0xb0a090, 1.0));
const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(5, 12, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
scene.add(sun);

const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), new THREE.ShadowMaterial({ opacity: 0.16 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

// ---------- Style "dessin animé" : ombrage en aplats + contour ----------
const gradientMap = (() => {
  const d = new Uint8Array([90, 170, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const toonCache = {};
function toon(color) {
  return toonCache[color] || (toonCache[color] = new THREE.MeshToonMaterial({ color, gradientMap }));
}
const OUTLINE = 0x2b1d33;
const outlineMats = {};
function outlineMat(th) {
  if (outlineMats[th]) return outlineMats[th];
  const m = new THREE.MeshBasicMaterial({ color: OUTLINE, side: THREE.BackSide });
  m.onBeforeCompile = (s) => {
    s.uniforms.th = { value: th };
    s.vertexShader = 'uniform float th;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(objectNormal) * th;');
  };
  m.customProgramCacheKey = () => 'outline' + th;
  return (outlineMats[th] = m);
}
// Contour noir façon dessin animé (coque inversée) sur chaque mesh d'un objet
function outline(root, th = 0.025) {
  const meshes = [];
  root.traverse((o) => { if (o.isMesh && !o.userData.noOutline && !o.userData.isOutline) meshes.push(o); });
  meshes.forEach((o) => {
    o.castShadow = true;
    let ol;
    if (o.isSkinnedMesh) {
      ol = new THREE.SkinnedMesh(o.geometry, outlineMat(th));
      ol.bind(o.skeleton, o.bindMatrix);
      ol.position.copy(o.position); ol.quaternion.copy(o.quaternion); ol.scale.copy(o.scale);
      if (o.morphTargetInfluences) ol.morphTargetInfluences = o.morphTargetInfluences;
      ol.frustumCulled = false;
      o.parent.add(ol);
    } else {
      ol = new THREE.Mesh(o.geometry, outlineMat(th));
      o.add(ol);
    }
    ol.userData.isOutline = true;
  });
  return root;
}
function mesh(geo, mat, parent, pos, rot, scale) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  if (scale) (typeof scale === 'number' ? m.scale.setScalar(scale) : m.scale.set(...scale));
  if (parent) parent.add(m);
  return m;
}
const S = (r, w = 24, h = 18) => new THREE.SphereGeometry(r, w, h);
const CAP = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14);
const CREAM = 0xf3ead8; // pas de blanc pur (transparent sur la borne)

// ---------- Arbres ----------
function tree(x, z, s = 1) {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.18, 0.3, 1.6, 10), toon(0x8b5a2b), g, [0, 0.8, 0]);
  [[0, 2.2, 0, 1.0, 0x48a843], [0.65, 1.85, 0.2, 0.75, 0x3b9437], [-0.6, 1.9, -0.1, 0.78, 0x56b84c], [0.1, 2.85, 0.1, 0.65, 0x5cc152]]
    .forEach(([a, b, c, r, col]) => mesh(S(r, 16, 12), toon(col), g, [a, b, c]));
  g.scale.setScalar(s);
  g.position.set(x, 0, z); scene.add(outline(g, 0.03)); return g;
}
const trees = [tree(-5.5, -8, 1.3), tree(5.5, -9, 1.2), tree(-3, -12, 1.1), tree(3.5, -13, 1.4)];

// =====================================================================
// PERSONNAGES
// =====================================================================
function makeEyes(parent, { x, y, z, r, iris = 0x2b1d33, sclera = CREAM, slit = false }) {
  const eyes = [];
  [-x, x].forEach((ex) => {
    const e = new THREE.Group(); e.position.set(ex, y, z); parent.add(e);
    mesh(S(r, 18, 14), toon(sclera), e, [0, 0, 0], null, [1, 1.15, 0.7]);
    const pupil = mesh(S(r * 0.55, 14, 10), toon(iris), e, [0, 0, r * 0.55], null, slit ? [0.45, 1.1, 0.5] : [1, 1.1, 0.5]);
    pupil.userData.noOutline = true;
    const shine = mesh(S(r * 0.18, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff6c8 }), e, [r * 0.22, r * 0.3, r * 0.82]);
    shine.userData.noOutline = true;
    eyes.push(e);
  });
  return eyes;
}

function makePig(variant) {
  const root = new THREE.Group();
  const rig = new THREE.Group(); root.add(rig);
  const pink = toon(0xffa6bd), pinkDark = toon(0xf47f9e), hoof = toon(0x6b4a3a);
  const shirt = toon(variant.shirt);
  // corps + salopette
  mesh(S(0.55), pink, rig, [0, 0.68, 0], null, [1, 0.95, 0.9]);
  mesh(new THREE.SphereGeometry(0.565, 24, 18, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52), shirt, rig, [0, 0.68, 0], null, [1, 0.95, 0.9]);
  // jambes
  [-0.24, 0.24].forEach((x) => {
    mesh(CAP(0.12, 0.18), pink, rig, [x, 0.2, 0]);
    mesh(S(0.13, 12, 10), hoof, rig, [x, 0.07, 0.03], null, [1, 0.6, 1.2]);
  });
  // bras
  const arms = [-1, 1].map((sd) => {
    const pivot = new THREE.Group(); pivot.position.set(sd * 0.5, 0.95, 0); rig.add(pivot);
    mesh(CAP(0.1, 0.32), pink, pivot, [sd * 0.08, -0.22, 0], [0, 0, sd * 0.35]);
    mesh(S(0.11, 12, 10), hoof, pivot, [sd * 0.18, -0.45, 0]);
    return pivot;
  });
  // queue en tire-bouchon
  mesh(new THREE.TorusGeometry(0.1, 0.035, 8, 16, Math.PI * 1.6), pinkDark, rig, [0, 0.6, -0.52], [0, Math.PI / 2, 0]);
  // tête
  const head = new THREE.Group(); head.position.set(0, 1.42, 0.02); rig.add(head);
  mesh(S(0.5), pink, head, [0, 0, 0], null, [1.06, 0.95, 0.95]);
  [-0.3, 0.3].forEach((x) => { mesh(S(0.13, 12, 10), toon(0xff8fae), head, [x, -0.14, 0.36], null, [1, 0.7, 0.5]).userData.noOutline = true; });
  mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.2, 20), pinkDark, head, [0, -0.06, 0.46], [Math.PI / 2, 0, 0]);
  [-0.07, 0.07].forEach((x) => { mesh(S(0.04, 8, 6), toon(0x8a3550), head, [x, -0.06, 0.565], null, [1, 1.4, 0.5]).userData.noOutline = true; });
  const mouth = mesh(new THREE.TorusGeometry(0.1, 0.022, 6, 14, Math.PI), toon(0x7a2840), head, [0, -0.25, 0.42], [0, 0, Math.PI]);
  mouth.userData.noOutline = true;
  const eyes = makeEyes(head, { x: 0.17, y: 0.13, z: 0.4, r: 0.1 });
  // oreilles
  [-1, 1].forEach((sd) => mesh(new THREE.ConeGeometry(0.14, 0.32, 12), pink, head, [sd * 0.3, 0.42, 0.06], [0.5, 0, -sd * 0.55]));
  // chapeau / accessoire
  if (variant.hat === 'paille') {
    mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 24), toon(0xf2cf5b), head, [0, 0.42, -0.02], [-0.12, 0, 0]);
    mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.22, 20), toon(0xe8bd45), head, [0, 0.52, -0.03], [-0.12, 0, 0]);
    mesh(new THREE.CylinderGeometry(0.305, 0.305, 0.06, 20), toon(0xd9534f), head, [0, 0.46, -0.025], [-0.12, 0, 0]);
  } else if (variant.hat === 'casquette') {
    mesh(new THREE.SphereGeometry(0.36, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x3b82d6), head, [0, 0.3, -0.02]);
    mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 20, 1, false, -Math.PI / 2, Math.PI), toon(0x2f6bb3), head, [0, 0.31, 0.12]);
  } else {
    mesh(new THREE.SphereGeometry(0.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xf4c430), head, [0, 0.3, -0.02]);
    mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 22), toon(0xe0ab1c), head, [0, 0.31, 0.02]);
  }
  outline(rig, 0.018);
  root.userData = { rig, head, eyes, arms, mouth, blinkT: Math.random() * 3 };
  return root;
}

function makeWolf() {
  const root = new THREE.Group();
  const rig = new THREE.Group(); root.add(rig);
  const fur = toon(0x6e7896), furDark = toon(0x525a75), light = toon(0xd2d6e2), nose = toon(0x1d1626);
  // corps
  const body = new THREE.Group(); body.position.y = 1.1; rig.add(body);
  mesh(S(0.62), fur, body, [0, 0, 0], null, [0.95, 1.25, 0.85]);
  mesh(S(0.45), light, body, [0, -0.05, 0.3], null, [0.85, 1.15, 0.55]);
  // jambes + pieds
  [-0.3, 0.3].forEach((x) => {
    mesh(CAP(0.15, 0.4), furDark, rig, [x, 0.35, 0]);
    mesh(S(0.18, 12, 10), furDark, rig, [x, 0.08, 0.1], null, [1, 0.55, 1.5]);
  });
  // bras
  const arms = [-1, 1].map((sd) => {
    const pivot = new THREE.Group(); pivot.position.set(sd * 0.55, 1.55, 0); rig.add(pivot);
    mesh(CAP(0.12, 0.6), fur, pivot, [sd * 0.1, -0.35, 0], [0, 0, sd * 0.25]);
    mesh(S(0.14, 12, 10), light, pivot, [sd * 0.2, -0.72, 0.02]);
    return pivot;
  });
  // queue touffue
  const tail = new THREE.Group(); tail.position.set(0, 0.7, -0.5); rig.add(tail);
  mesh(S(0.22), fur, tail, [0, 0.15, -0.35], [0.9, 0, 0], [0.8, 1.9, 0.8]);
  mesh(S(0.15), light, tail, [0, 0.55, -0.72], null, [1, 1.2, 1]);
  // tête
  const head = new THREE.Group(); head.position.set(0, 2.25, 0.05); rig.add(head);
  mesh(S(0.5), fur, head, [0, 0, 0], null, [1.05, 0.95, 0.95]);
  mesh(S(0.3), light, head, [0, -0.15, 0.48], null, [0.85, 0.7, 1.4]); // museau
  mesh(S(0.11, 14, 10), nose, head, [0, -0.06, 0.9], null, [1.2, 0.9, 1]);
  // joues (se gonflent quand il inspire)
  const cheeks = [-1, 1].map((sd) => mesh(S(0.17, 14, 10), light, head, [sd * 0.26, -0.22, 0.42]));
  // bouche "O" pour souffler + sourire à crocs
  const mouthO = mesh(S(0.11, 14, 10), toon(0x5a1028), head, [0, -0.32, 0.78], null, [1, 1, 0.5]);
  mouthO.userData.noOutline = true;
  const grin = mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 16, Math.PI), toon(0x2b1d33), head, [0, -0.28, 0.66], [0.3, 0, Math.PI]);
  grin.userData.noOutline = true;
  [-0.1, 0.1].forEach((x) => { mesh(new THREE.ConeGeometry(0.035, 0.1, 6), toon(CREAM), head, [x, -0.36, 0.68], [Math.PI, 0, 0]).userData.noOutline = true; });
  const eyes = makeEyes(head, { x: 0.19, y: 0.14, z: 0.38, r: 0.11, sclera: 0xffd84a, slit: true });
  // sourcils méchants
  [-1, 1].forEach((sd) => mesh(new THREE.BoxGeometry(0.22, 0.05, 0.05), furDark, head, [sd * 0.19, 0.3, 0.44], [0, 0, sd * 0.4]));
  // oreilles
  [-1, 1].forEach((sd) => {
    const e = mesh(new THREE.ConeGeometry(0.17, 0.48, 14), fur, head, [sd * 0.3, 0.48, -0.02], [0, 0, -sd * 0.25]);
    mesh(new THREE.ConeGeometry(0.1, 0.3, 12), toon(0xf2a0b8), e, [0, -0.04, 0.07]).userData.noOutline = true;
  });
  outline(rig, 0.02);
  mouthO.scale.setScalar(0.001);
  root.userData = { rig, head, body, cheeks, mouthO, grin, eyes, arms, tail, blinkT: 1, puff: 0, blow: 0, talk: false, blowing: false };
  return root;
}

// =====================================================================
// MAISONS
// =====================================================================
function brickTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#7a3b2e'; x.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 8; r++) for (let i = -1; i < 5; i++) {
    const off = r % 2 ? 32 : 0;
    x.fillStyle = ['#c9573d', '#b84c35', '#d8664a'][(r * 7 + i * 3 + 9) % 3];
    x.fillRect(i * 64 + off + 3, r * 32 + 3, 58, 26);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
  t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makeHouse(type) {
  const g = new THREE.Group();
  const pieces = [];
  const add = (m) => { g.add(m); pieces.push(m); return m; };
  if (type === 'paille') {
    const cols = [0xf2d36b, 0xe6bf4c, 0xf7df86];
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      add(mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.5, 6), toon(cols[i % 3]), null, [Math.cos(a) * 0.95, 0.75, Math.sin(a) * 0.95], [Math.sin(i) * 0.05, 0, Math.cos(i) * 0.05]));
    }
    for (let k = 0; k < 3; k++) add(mesh(new THREE.ConeGeometry(1.45 - k * 0.35, 0.7, 20), toon(cols[k]), null, [0, 1.75 + k * 0.4, 0]));
    add(mesh(new THREE.TorusGeometry(0.97, 0.06, 6, 30), toon(0xb8862b), null, [0, 1.1, 0], [Math.PI / 2, 0, 0]));
  } else if (type === 'bois') {
    const cols = [0xb06d34, 0x9a5c2a, 0xc17a3d];
    for (let y = 0; y < 5; y++) {
      for (const z of [-0.9, 0.9]) add(mesh(new THREE.BoxGeometry(2.05, 0.3, 0.16), toon(cols[(y + (z > 0 ? 1 : 0)) % 3]), null, [0, 0.15 + y * 0.32, z]));
      for (const x of [-0.95, 0.95]) add(mesh(new THREE.BoxGeometry(0.16, 0.3, 1.8), toon(cols[(y + 2) % 3]), null, [x, 0.15 + y * 0.32, 0]));
    }
    add(mesh(new THREE.ConeGeometry(1.75, 1.1, 4), toon(0x7a4a22), null, [0, 2.15, 0], [0, Math.PI / 4, 0]));
    add(mesh(new THREE.BoxGeometry(0.5, 0.45, 0.06), toon(0x5ab0e6), null, [0.55, 1.0, 0.99]));
  } else {
    const tex = brickTexture();
    const brick = new THREE.MeshToonMaterial({ map: tex, gradientMap });
    add(mesh(new THREE.BoxGeometry(2.2, 1.8, 2), brick, null, [0, 0.9, 0]));
    add(mesh(new THREE.ConeGeometry(1.85, 1.2, 4), toon(0x5a3b2a), null, [0, 2.4, 0], [0, Math.PI / 4, 0]));
    g.userData.chimney = add(mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), brick, null, [0.6, 2.7, 0]));
    [-0.6, 0.6].forEach((x) => add(mesh(new THREE.BoxGeometry(0.45, 0.45, 0.06), toon(0x5ab0e6), null, [x, 1.15, 1.01])));
  }
  const door = add(mesh(new THREE.BoxGeometry(0.55, 0.85, 0.06), toon(0x5a3b2a), null, [type === 'bois' ? -0.4 : 0, 0.43, type === 'paille' ? 0.95 : 1.01]));
  mesh(S(0.04, 8, 6), toon(0xf4c430), door, [0.17, 0, 0.04]).userData.noOutline = true;
  outline(g, 0.025);
  g.userData.pieces = pieces;
  g.userData.orig = pieces.map((p) => ({ pos: p.position.clone(), rot: p.rotation.clone() }));
  return g;
}

const houses = { paille: makeHouse('paille'), bois: makeHouse('bois'), briques: makeHouse('briques') };
houses.paille.position.set(-3.6, 0, -3);
houses.bois.position.set(3.6, 0, -3);
houses.briques.position.set(0, 0, -7);
Object.values(houses).forEach((h) => { h.scale.setScalar(0.001); scene.add(h); });

const pigs = [makePig({ shirt: 0x6cc24a, hat: 'paille' }), makePig({ shirt: 0x3b82d6, hat: 'casquette' }), makePig({ shirt: 0xe0533d, hat: 'chantier' })];
pigs.forEach((p) => { p.visible = false; scene.add(p); });
const wolf = makeWolf();
wolf.visible = false; wolf.scale.setScalar(1.25); scene.add(wolf);
const W = wolf.userData;

// =====================================================================
// PARTICULES
// =====================================================================
const particles = [];
const leafGeo = new THREE.PlaneGeometry(0.26, 0.15);
const leafMats = [0x4caf50, 0xf2a93b, 0xd9562b, 0x9ccc65].map((c) => new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide }));
const strawMat = new THREE.MeshLambertMaterial({ color: 0xf2c94c, side: THREE.DoubleSide });
const sharedMats = new Set([...leafMats, strawMat]);
const strawGeo = new THREE.PlaneGeometry(0.45, 0.045);
const windGeo = new THREE.PlaneGeometry(1.8, 0.06);
const sparkGeo = new THREE.OctahedronGeometry(0.09);
const puffGeo = S(0.25, 12, 10);
const swirlGeo = new THREE.TorusGeometry(0.35, 0.03, 4, 20, Math.PI * 1.3);

function spawn(m, opts) { scene.add(m); particles.push({ mesh: m, life: 0, ...opts }); }
function emitWind(from, dir) {
  for (let i = 0; i < 2; i++) {
    const m = new THREE.Mesh(windGeo, new THREE.MeshBasicMaterial({ color: [0x5fb8ff, 0x3a9cf0][i], transparent: true, side: THREE.DoubleSide }));
    m.position.copy(from).add(new THREE.Vector3(dir.x * 0.6, (Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.9));
    m.rotation.y = Math.atan2(-dir.z, dir.x);
    spawn(m, { vel: dir.clone().multiplyScalar(9 + Math.random() * 6), spread: (Math.random() - 0.5) * 2, max: 0.9, fade: 0.8, wobble: 0.6 });
  }
  if (Math.random() < 0.5) { // tourbillons
    const m = new THREE.Mesh(swirlGeo, new THREE.MeshBasicMaterial({ color: 0x7cc4ff, transparent: true }));
    m.position.copy(from).add(new THREE.Vector3(dir.x, Math.random() - 0.5, 0));
    m.rotation.y = Math.PI / 2;
    spawn(m, { vel: dir.clone().multiplyScalar(7), max: 0.9, fade: 0.7, spin: new THREE.Vector3(14 * dir.x, 0, 0), grow: 1.2 });
  }
  // bouffée d'air
  const p = new THREE.Mesh(puffGeo, new THREE.MeshBasicMaterial({ color: 0xa8d8ff, transparent: true }));
  p.position.copy(from);
  spawn(p, { vel: dir.clone().multiplyScalar(5).add(new THREE.Vector3(0, Math.random() - 0.5, Math.random() - 0.5)), max: 0.7, fade: 0.45, grow: 3 });
}
function emitLeaves(from, dir, count = 4, mat) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(mat ? strawGeo : leafGeo, mat || leafMats[(Math.random() * leafMats.length) | 0]);
    m.position.set(from.x + (Math.random() - 0.5) * 2, from.y + Math.random() * 2, from.z + (Math.random() - 0.5) * 2);
    spawn(m, { vel: dir.clone().multiplyScalar(5 + Math.random() * 5).add(new THREE.Vector3(0, 1 + Math.random() * 2, (Math.random() - 0.5) * 2)), max: 2.5, spin: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9), gravity: -1.5, wobble: 2 });
  }
}
function emitSparkles(center, count = 20, colors = [0xffc400, 0xff8fab, 0x5fb8ff, 0xb388ff]) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true }));
    m.position.copy(center);
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9 + 0.3, Math.random() - 0.5).normalize().multiplyScalar(3 + Math.random() * 3);
    spawn(m, { vel: v, max: 1.6, gravity: -4, fade: 1, spin: new THREE.Vector3(5, 5, 0) });
  }
}
function emitDust(center, count, color) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(puffGeo, new THREE.MeshLambertMaterial({ color, transparent: true }));
    m.position.copy(center).add(new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 0.6, (Math.random() - 0.5) * 2));
    spawn(m, { vel: new THREE.Vector3((Math.random() - 0.5) * 3, 1 + Math.random(), (Math.random() - 0.5) * 2), max: 1.5, fade: 0.8, grow: 2 });
  }
}
function emitSmoke(pos, fire = false) {
  const col = fire ? [0xff7b00, 0xffb000, 0xff4500][(Math.random() * 3) | 0] : [0x8a8a95, 0x9d9daa][(Math.random() * 2) | 0];
  const m = new THREE.Mesh(S(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: col, transparent: true }));
  m.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3));
  spawn(m, { vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, 2 + Math.random(), 0), max: fire ? 0.7 : 2, fade: 0.85, grow: fire ? 0.6 : 1.5 });
}
function updateParticles(dt, t) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.gravity) p.vel.y += p.gravity * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    if (p.spread) p.mesh.position.y += p.spread * dt;
    if (p.wobble) p.mesh.position.y += Math.sin(t * 8 + i) * p.wobble * dt;
    if (p.spin) { p.mesh.rotation.x += p.spin.x * dt; p.mesh.rotation.y += p.spin.y * dt; p.mesh.rotation.z += p.spin.z * dt; }
    if (p.grow) p.mesh.scale.setScalar(1 + p.life * p.grow);
    if (p.fade) p.mesh.material.opacity = Math.max(0, 1 - p.life / p.max) * p.fade;
    if (p.life > p.max) { scene.remove(p.mesh); if (!sharedMats.has(p.mesh.material)) p.mesh.material.dispose(); particles.splice(i, 1); }
  }
}

// =====================================================================
// TWEENS
// =====================================================================
const tweens = [];
const tween = (dur, fn) => new Promise((res) => tweens.push({ t: 0, dur, fn, res }));
function updateTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i]; tw.t += dt;
    const k = Math.min(1, tw.t / tw.dur);
    tw.fn(k);
    if (k >= 1) { tweens.splice(i, 1); tw.res(); }
  }
}
const ease = (k) => k * k * (3 - 2 * k);
const pop = (obj, to = 1) => { obj.visible = true; return tween(0.6, (k) => obj.scale.setScalar(Math.max(0.001, to * (k < 0.7 ? ease(k / 0.7) * 1.15 : 1.15 - 0.15 * ((k - 0.7) / 0.3))))); };
function moveTo(obj, x, z, dur = 1.2) {
  const sx = obj.position.x, sz = obj.position.z;
  obj.rotation.y = Math.atan2(x - sx, z - sz);
  obj.userData.walking = true;
  return tween(dur, (k) => { obj.position.x = sx + (x - sx) * ease(k); obj.position.z = sz + (z - sz) * ease(k); if (k >= 1) { obj.userData.walking = false; obj.position.y = 0; } });
}
const faceCam = (obj) => { const r0 = obj.rotation.y; return tween(0.3, (k) => (obj.rotation.y = r0 * (1 - k))); };

const flying = [];
function blowAway(house, dir) {
  emitDust(house.position.clone().add(new THREE.Vector3(0, 0.3, 0)), 18, house === houses.paille ? 0xe8cf7a : 0xa77b52);
  house.userData.pieces.forEach((p) => {
    flying.push({ p, vel: dir.clone().multiplyScalar(4 + Math.random() * 6).add(new THREE.Vector3((Math.random() - 0.5) * 2, 3 + Math.random() * 4, (Math.random() - 0.5) * 3)), spin: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6), life: 0 });
  });
}
function updateFlying(dt) {
  for (let i = flying.length - 1; i >= 0; i--) {
    const f = flying[i]; f.life += dt;
    f.vel.y -= 6 * dt;
    f.p.position.addScaledVector(f.vel, dt);
    f.p.rotation.x += f.spin.x * dt; f.p.rotation.y += f.spin.y * dt;
    if (f.life > 3) { f.p.visible = false; flying.splice(i, 1); }
  }
}
function resetHouse(h) {
  h.userData.pieces.forEach((p, i) => { p.position.copy(h.userData.orig[i].pos); p.rotation.copy(h.userData.orig[i].rot); p.visible = true; });
  h.rotation.set(0, 0, 0); h.scale.setScalar(0.001); h.visible = false;
}

// =====================================================================
// NARRATEUR (modèle 3D CC0 "RobotExpressive", rendu en style cartoon)
// =====================================================================
let narrator, mixer, actions = {}, current, face;
function play(name, fade = 0.35, once = false) {
  const a = actions[name]; if (!a || a === current) return;
  a.reset();
  if (once) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
  a.fadeIn(fade).play();
  if (current) current.fadeOut(fade);
  current = a;
}
async function gesture(name, back = 'Idle') {
  play(name, 0.2, true);
  await wait((actions[name]?.getClip().duration || 1) * 1000 - 200);
  play(back);
}

const subtitle = document.getElementById('subtitle');
const titleEl = document.getElementById('title');
let speaker = null; // 'narrateur' | 'loup' | 'cochon'
async function say(raw, opts = {}) {
  const { voice, text } = parseLine(raw);
  subtitle.textContent = text;
  subtitle.className = 'on ' + voice;
  speaker = voice;
  if (voice === 'narrateur' && opts.gesture) gesture(opts.gesture);
  await speak(raw);
  speaker = null;
  subtitle.className = '';
  await wait(opts.pause ?? 200);
}

// =====================================================================
// LE CONTE
// =====================================================================
let windOn = null;
let chimneyFire = false;

// Le loup inspire (torse + joues gonflés, tête en arrière) puis souffle (bouche en O, penché en avant)
async function wolfBlow(line, target) {
  wolf.rotation.y = Math.PI / 2;
  camFocus = wolf;
  await wait(500);
  await tween(1.1, (k) => { W.puff = ease(k); });
  W.blowing = true;
  windOn = { dir: new THREE.Vector3(1, 0, 0), straw: target === houses.paille };
  const amp = target === houses.briques ? 0.015 : 0.06;
  const anim = tween(3.2, (k) => {
    W.blow = Math.min(1, k / 0.1);
    W.puff = 1 - ease(k);
    target.rotation.z = Math.sin(k * 70) * amp * k;
  });
  await Promise.all([say(line, { pause: 0 }), anim]);
  W.blowing = false; W.blow = 0; W.puff = 0;
  target.rotation.z = 0;
  setTimeout(() => { camFocus = null; }, 1600);
}

async function story() {
  Object.values(houses).forEach(resetHouse);
  pigs.forEach((p, i) => { p.position.set(-1.5 + i * 1.5, 0, 1); p.rotation.set(0, 0, 0); p.visible = false; p.scale.setScalar(0.001); p.userData.dance = false; });
  wolf.visible = false; wolf.position.set(-12, 0, -2.6); wolf.rotation.set(0, 0, 0); W.rig.rotation.set(0, 0, 0); W.puff = W.blow = 0;
  narrator.position.set(2.1, 0, 5.2); narrator.rotation.y = -0.3;
  titleEl.classList.add('on');
  play('Idle');
  await wait(800);
  await say('Bonjour les enfants ! Approchez, approchez ! Je vais vous raconter une histoire !', { gesture: 'Wave' });
  titleEl.classList.remove('on');
  await say('C\'est l\'histoire des Trois Petits Cochons !', { gesture: 'ThumbsUp' });

  emitSparkles(new THREE.Vector3(0, 1, 1), 30);
  await Promise.all(pigs.map((p) => pop(p, 0.95)));
  await say('Il était une fois trois petits cochons qui quittèrent leur maman pour construire chacun leur maison.', { gesture: 'Yes' });

  await moveTo(pigs[0], -3, -0.6); faceCam(pigs[0]);
  emitSparkles(houses.paille.position.clone().add(new THREE.Vector3(0, 1, 0)), 25, [0xf2d36b, 0xffc400]);
  pop(houses.paille);
  await say('Le premier, un peu paresseux, construisit une maison en paille. Vite fait, et hop, au lit !');

  await moveTo(pigs[1], 3, -0.6); faceCam(pigs[1]);
  emitSparkles(houses.bois.position.clone().add(new THREE.Vector3(0, 1, 0)), 25, [0xa0632f, 0xffc400]);
  pop(houses.bois);
  await say('Le deuxième construisit une maison en bois. Un peu plus solide… mais pas tellement !');

  await moveTo(pigs[2], 1.4, -4.9, 1.4); faceCam(pigs[2]);
  emitSparkles(houses.briques.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 35, [0xc0442f, 0xffc400]);
  pop(houses.briques);
  await say('Et le troisième, très courageux, construisit une maison en briques, bien solide.', { gesture: 'ThumbsUp' });

  // Arrivée du loup
  pigs[0].visible = false;
  await say('Mais dans la forêt rôdait le grand méchant loup… et il avait très, très faim !', { gesture: 'No' });
  wolf.visible = true;
  await moveTo(wolf, -5.4, -1.8, 1.8); wolf.rotation.y = Math.PI / 2;
  await say('Il frappa à la porte de la maison de paille.');
  await say('[loup]Petit cochon, petit cochon, laisse-moi entrer !');
  await say('[cochon]Non, non, par les poils de mon menton !');
  await say('[loup]Alors je vais souffler, souffler, et ta maison s\'envolera !');

  await wolfBlow('[loup]Fffffouuuuuuuuuuuuuh !', houses.paille);
  blowAway(houses.paille, new THREE.Vector3(1, 0, 0));
  pigs[0].visible = true; pigs[0].position.set(-3, 0, -0.4);
  await wait(900);
  windOn = null;
  await say('La maison de paille s\'envola ! Le petit cochon courut se cacher chez son frère.', { gesture: 'Jump' });
  await moveTo(pigs[0], 3, -0.6, 1.4);
  pigs[0].visible = false; pigs[1].visible = false;

  await moveTo(wolf, 0.4, -1.8, 1.6); wolf.rotation.y = Math.PI / 2;
  await say('[loup]Petits cochons, petits cochons, laissez-moi entrer !');
  await say('[cochon]Non, non, jamais de la vie !');
  await wolfBlow('[loup]Ffffffffouuuuuuuuuuuuuuh !', houses.bois);
  blowAway(houses.bois, new THREE.Vector3(1, 0, 0));
  pigs[0].visible = pigs[1].visible = true;
  pigs[0].position.set(3, 0, -0.4); pigs[1].position.set(3.8, 0, -0.8);
  await wait(900);
  windOn = null;
  await say('Patatras ! La maison de bois s\'écroula ! Les deux petits cochons coururent chez leur frère.', { gesture: 'Jump' });
  await Promise.all([moveTo(pigs[0], 0.4, -4.9, 1.5), moveTo(pigs[1], -0.6, -4.9, 1.5)]);
  pigs.forEach((p) => (p.visible = false));

  await moveTo(wolf, -2.8, -5.6, 1.3); wolf.rotation.y = Math.PI / 2;
  await say('Le loup, furieux, arriva devant la maison de briques. Il souffla, souffla, souffla encore…');
  await wolfBlow('[loup]Ffffffffouuuuuuuh ! Pfff… Pfff…', houses.briques);
  windOn = null;
  await say('Mais la maison de briques ne bougea pas d\'un poil !', { gesture: 'ThumbsUp' });

  await say('Alors le loup grimpa sur le toit pour descendre par la cheminée…');
  await tween(1.4, (k) => { wolf.position.set(-2.8 + 3.4 * k, Math.sin(k * Math.PI) * 2.5 + 3.4 * k, -5.6 - 1.4 * k); });
  chimneyFire = true;
  await say('Mais le petit cochon avait mis une grande marmite d\'eau bouillante sur le feu !', { gesture: 'Jump' });
  await say('[loup]Aïe aïe aïe ! Ça brûle !');
  await tween(1.6, (k) => { wolf.position.set(0.6 - 14 * k, 3.4 + Math.sin(k * Math.PI) * 4 - 3.4 * k, -7 + 4 * k); W.rig.rotation.z = k * 12; });
  chimneyFire = false; wolf.visible = false; W.rig.rotation.z = 0;
  await say('Le grand méchant loup s\'enfuit en hurlant, et on ne le revit plus jamais !', { gesture: 'Yes' });

  pigs.forEach((p, i) => { p.visible = true; p.position.set(-1.6 + i * 1.6, 0, -3.6); p.rotation.y = 0; p.userData.dance = true; });
  for (let i = 0; i < 4; i++) emitSparkles(new THREE.Vector3(-3 + i * 2, 2.5, -3), 30);
  play('Dance');
  await say('[cochon]Hourra ! Hourra ! Merci petit frère !');
  await say('Et les trois petits cochons vécurent heureux, bien à l\'abri dans leur maison de briques.');
  await say('Et voilà ! L\'histoire est finie. À bientôt les enfants !', { gesture: 'Wave' });
  pigs.forEach((p) => (p.userData.dance = false));
  play('Idle');
  await wait(4000);
}

// =====================================================================
// BOUCLE
// =====================================================================
const clock = new THREE.Clock();
let windTimer = 0, leafTimer = 0, smokeTimer = 0, ambientTimer = 0;
const tmp = new THREE.Vector3();

function blink(c, dt) {
  c.blinkT -= dt;
  const closed = c.blinkT < 0.12;
  c.eyes.forEach((e) => (e.scale.y = closed ? 0.1 : 1));
  if (c.blinkT < 0) c.blinkT = 2 + Math.random() * 3;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  if (mixer) mixer.update(dt);
  updateTweens(dt);
  updateParticles(dt, t);
  updateFlying(dt);

  // Narrateur : tête + bouche quand il parle
  if (narrator) {
    const head = narrator.getObjectByName('Head');
    const talking = speaker === 'narrateur';
    if (head) head.rotation.x = talking ? Math.sin(t * 13) * 0.08 : 0;
    if (face) face.morphTargetInfluences[1] = talking ? Math.abs(Math.sin(t * 11)) * 0.6 : 0;
  }

  // Cochons
  pigs.forEach((p, i) => {
    if (!p.visible) return;
    const u = p.userData;
    blink(u, dt);
    const hop = u.walking || u.dance;
    p.position.y = hop ? Math.abs(Math.sin(t * 11 + i)) * 0.35 : 0;
    u.rig.scale.set(1, 1 + Math.sin(t * 3 + i) * 0.02, 1); // respiration
    const swing = hop ? Math.sin(t * 11 + i) * 0.7 : 0;
    u.arms[0].rotation.x = swing; u.arms[1].rotation.x = -swing;
    if (u.dance) { p.rotation.y = Math.sin(t * 4 + i) * 0.5; u.arms[0].rotation.z = -2.4 + Math.sin(t * 8) * 0.4; u.arms[1].rotation.z = 2.4 - Math.sin(t * 8) * 0.4; }
    else { u.arms[0].rotation.z = 0; u.arms[1].rotation.z = 0; }
    const talk = speaker === 'cochon';
    u.head.rotation.x = talk ? Math.sin(t * 14 + i) * 0.1 : 0;
    u.mouth.scale.set(1, talk ? 1 + Math.abs(Math.sin(t * 12 + i)) * 1.5 : 1, 1);
  });

  // Loup
  if (wolf.visible) {
    blink(W, dt);
    if (W.walking) wolf.position.y = Math.abs(Math.sin(t * 9)) * 0.25;
    const swing = W.walking ? Math.sin(t * 9) * 0.8 : 0;
    W.arms[0].rotation.x = swing; W.arms[1].rotation.x = -swing;
    W.tail.rotation.y = Math.sin(t * 5) * 0.4;
    const puff = W.puff, blow = W.blow;
    W.body.scale.setScalar(1 + puff * 0.22);
    W.cheeks.forEach((c) => c.scale.setScalar(1 + puff * 1.3 + blow * 0.3));
    W.rig.rotation.x = -puff * 0.25 * (1 - blow) + blow * 0.3;
    W.head.rotation.x = -puff * 0.3 * (1 - blow) + blow * 0.15;
    W.arms.forEach((a, i) => (a.rotation.z = (i ? 1 : -1) * puff * 0.6 * (1 - blow)));
    if (W.blowing) {
      W.mouthO.scale.setScalar(Math.max(0.001, blow * (1 + Math.sin(t * 30) * 0.12)));
      W.grin.visible = false;
      W.rig.position.x = Math.sin(t * 40) * 0.02;
      W.head.rotation.z = 0;
    } else if (speaker === 'loup') {
      W.mouthO.scale.setScalar(Math.abs(Math.sin(t * 12)) * 0.7 + 0.001);
      W.grin.visible = true;
      W.head.rotation.z = Math.sin(t * 8) * 0.08;
      W.rig.position.x = 0;
    } else {
      W.mouthO.scale.setScalar(0.001);
      W.grin.visible = true;
      W.head.rotation.z = 0;
      W.rig.position.x = 0;
    }
  }

  // Vent : sort de la bouche du loup
  if (windOn && W.blowing) {
    W.mouthO.getWorldPosition(tmp);
    windTimer += dt; leafTimer += dt;
    if (windTimer > 0.04) { windTimer = 0; emitWind(tmp, windOn.dir); }
    if (leafTimer > 0.1) {
      leafTimer = 0;
      const base = tmp.clone().add(new THREE.Vector3(windOn.dir.x * 2.5, -1.8, 0));
      emitLeaves(base, windOn.dir, 3);
      if (windOn.straw) emitLeaves(base.add(new THREE.Vector3(windOn.dir.x, 0, 0)), windOn.dir, 5, strawMat);
    }
    trees.forEach((tr, i) => (tr.rotation.z = -windOn.dir.x * (0.12 + Math.sin(t * 10 + i) * 0.05)));
  } else {
    trees.forEach((tr, i) => { tr.rotation.z *= 0.92; tr.rotation.z += Math.sin(t * 1.3 + i) * 0.0008; });
  }

  // Cheminée
  smokeTimer += dt;
  const chim = houses.briques.userData.chimney;
  if (houses.briques.visible && smokeTimer > (chimneyFire ? 0.03 : 0.35)) {
    smokeTimer = 0;
    chim.getWorldPosition(tmp); tmp.y += 0.5;
    emitSmoke(tmp, chimneyFire);
  }
  // feuilles qui tombent (ambiance)
  ambientTimer += dt;
  if (ambientTimer > 0.6) {
    ambientTimer = 0;
    const tr = trees[(Math.random() * trees.length) | 0];
    const m = new THREE.Mesh(leafGeo, leafMats[(Math.random() * leafMats.length) | 0]);
    m.position.copy(tr.position).add(new THREE.Vector3((Math.random() - 0.5) * 2, 2.5, (Math.random() - 0.5) * 2));
    spawn(m, { vel: new THREE.Vector3(0.3, -0.6, 0.2), max: 4, spin: new THREE.Vector3(2, 3, 1), wobble: 1 });
  }

  // Caméra : zoom doux sur le loup quand il souffle
  const k = 1 - Math.exp(-2.5 * dt);
  if (camFocus) {
    camera.position.lerp(tmp.copy(camFocus.position).add(new THREE.Vector3(2.6, 3.2, 8.5)), k);
    camLook.lerp(tmp.copy(camFocus.position).add(new THREE.Vector3(2.2, 1.6, 0)), k);
  } else {
    camera.position.lerp(CAM_POS, k);
    camLook.lerp(CAM_LOOK, k);
  }
  camera.lookAt(camLook);

  renderer.render(scene, camera);
}

addEventListener('resize', () => { fitCamera(); renderer.setSize(innerWidth, innerHeight); });

// =====================================================================
// DÉMARRAGE
// =====================================================================
const bin = Uint8Array.from(atob(MODEL_B64), (c) => c.charCodeAt(0)).buffer;
new GLTFLoader().parse(bin, '', (gltf) => {
  narrator = gltf.scene;
  narrator.scale.setScalar(0.65);
  narrator.traverse((o) => {
    if (o.isMesh) o.material = new THREE.MeshToonMaterial({ color: o.material.color, gradientMap });
  });
  face = narrator.getObjectByName('Head_4');
  scene.add(narrator);
  mixer = new THREE.AnimationMixer(narrator);
  gltf.animations.forEach((clip) => (actions[clip.name] = mixer.clipAction(clip)));
  document.getElementById('loading').remove();
  animate();
  (async () => { for (;;) { try { await story(); } catch (e) { console.error(e); await wait(2000); } } })();
}, (err) => { document.getElementById('loading').textContent = 'Erreur : ' + err; });
