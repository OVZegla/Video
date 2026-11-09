// Les Trois Petits Cochons — conteur 3D animé (POC borne Android)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL_B64 from './RobotExpressive.glb';

// ---------- Voix ----------
// Sur Android : TTS natif via window.Android (voix aiguë = "dessin animé").
// Dans un navigateur : Web Speech API en secours.
const pending = {};
let speechId = 0;
window.__ttsDone = (id) => { const cb = pending[id]; delete pending[id]; if (cb) cb(); };
function speak(text) {
  return new Promise((resolve) => {
    const id = String(++speechId);
    pending[id] = resolve;
    const fallbackMs = 1500 + text.length * 75; // sécurité si le TTS ne répond pas
    setTimeout(() => window.__ttsDone(id), fallbackMs);
    if (window.Android && window.Android.speak) {
      window.Android.speak(text, id);
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR'; u.pitch = 1.8; u.rate = 1.05;
      u.onend = () => window.__ttsDone(id);
      speechSynthesis.speak(u);
    }
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Scène ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fd8ff);
scene.fog = new THREE.Fog(0x9fd8ff, 25, 60);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 4.2, 13);
camera.lookAt(0, 2, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x6a8f3a, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(6, 12, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 });
scene.add(sun);

// Sol + décor
const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), new THREE.MeshLambertMaterial({ color: 0x7ccf5a }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const path = new THREE.Mesh(new THREE.PlaneGeometry(30, 2.2), new THREE.MeshLambertMaterial({ color: 0xd9b77a }));
path.rotation.x = -Math.PI / 2; path.position.set(0, 0.01, 1.5); scene.add(path);

function tree(x, z, s = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.3 * s, 1.6 * s), new THREE.MeshLambertMaterial({ color: 0x8b5a2b }));
  trunk.position.y = 0.8 * s; g.add(trunk);
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x3f9b3a });
  [[0, 2.2, 0, 1.1], [0.6, 1.9, 0.2, 0.8], [-0.6, 1.9, -0.1, 0.8]].forEach(([a, b, c, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r * s, 12, 10), leafMat);
    m.position.set(a * s, b * s, c * s); m.castShadow = true; g.add(m);
  });
  g.position.set(x, 0, z); scene.add(g); return g;
}
const trees = [tree(-11, -6, 1.4), tree(-8, -9, 1.1), tree(10, -8, 1.3), tree(13, -4, 1), tree(-14, -2, 1.2), tree(6, -12, 1.5)];

// Nuages
const clouds = [];
for (let i = 0; i < 6; i++) {
  const c = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color: 0xffffff });
  for (let j = 0; j < 4; j++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.9 + Math.random() * 0.6, 10, 8), m);
    p.position.set(j * 1.1, Math.random() * 0.4, Math.random() * 0.5); c.add(p);
  }
  c.position.set(-25 + i * 9, 10 + Math.random() * 3, -18 - Math.random() * 6);
  scene.add(c); clouds.push(c);
}

// ---------- Petits personnages procéduraux ----------
function makePig(hatColor) {
  const g = new THREE.Group();
  const pink = new THREE.MeshLambertMaterial({ color: 0xffa3b8 });
  const dark = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), pink);
  body.scale.set(1, 1.1, 1); body.position.y = 0.6; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), pink);
  head.position.set(0, 1.4, 0.05); g.add(head);
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.15, 14), new THREE.MeshLambertMaterial({ color: 0xff7f9c }));
  snout.rotation.x = Math.PI / 2; snout.position.set(0, 1.35, 0.46); g.add(snout);
  [-0.15, 0.15].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), dark); eye.position.set(x, 1.52, 0.38); g.add(eye);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 8), pink); ear.position.set(x * 1.8, 1.8, 0); ear.rotation.z = -x * 2; g.add(ear);
  });
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.2, 14), new THREE.MeshLambertMaterial({ color: hatColor }));
  hat.position.set(0, 1.85, 0); g.add(hat);
  [-0.25, 0.25].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8), pink); leg.position.set(x, 0.12, 0); g.add(leg);
  });
  g.userData.head = head;
  g.scale.setScalar(0.9);
  return g;
}

function makeWolf() {
  const g = new THREE.Group();
  const grey = new THREE.MeshLambertMaterial({ color: 0x6b6f80 });
  const light = new THREE.MeshLambertMaterial({ color: 0xc9cbd6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 12), grey);
  body.scale.set(1, 1.35, 0.9); body.position.y = 1; body.castShadow = true; g.add(body);
  const head = new THREE.Group(); head.position.set(0, 2.15, 0); g.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), grey));
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.7, 12), light);
  muzzle.rotation.x = Math.PI / 2; muzzle.position.set(0, -0.1, 0.6); head.add(muzzle);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshLambertMaterial({ color: 0x111111 }));
  nose.position.set(0, -0.1, 0.95); head.add(nose);
  [-0.2, 0.2].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshLambertMaterial({ color: 0xffdd33, emissive: 0x553300 }));
    eye.position.set(x, 0.12, 0.42); head.add(eye);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.45, 8), grey); ear.position.set(x * 1.5, 0.5, 0); head.add(ear);
  });
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 10), grey);
  tail.position.set(0, 0.8, -0.7); tail.rotation.x = -2.2; g.add(tail);
  [-0.3, 0.3].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 8), grey); leg.position.set(x, 0.2, 0); g.add(leg);
  });
  g.userData.head = head;
  return g;
}

// ---------- Maisons ----------
function makeHouse(type) {
  const g = new THREE.Group();
  const pieces = [];
  const colors = { paille: [0xf2d36b, 0xe0b94a], bois: [0xa0632f, 0x7a4a22], briques: [0xc0442f, 0x8f2f20] };
  const [wallC, roofC] = colors[type];
  const add = (mesh) => { mesh.castShadow = true; g.add(mesh); pieces.push(mesh); return mesh; };
  if (type === 'paille') {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const s = add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 5), new THREE.MeshLambertMaterial({ color: i % 2 ? wallC : roofC })));
      s.position.set(Math.cos(a) * 0.9, 0.8, Math.sin(a) * 0.9);
    }
    add(new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.3, 18), new THREE.MeshLambertMaterial({ color: roofC }))).position.y = 2.2;
  } else if (type === 'bois') {
    for (let y = 0; y < 5; y++) for (const z of [-0.9, 0.9]) {
      const p = add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.15), new THREE.MeshLambertMaterial({ color: y % 2 ? wallC : roofC })));
      p.position.set(0, 0.15 + y * 0.32, z);
    }
    for (let y = 0; y < 5; y++) for (const x of [-0.95, 0.95]) {
      const p = add(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 1.8), new THREE.MeshLambertMaterial({ color: y % 2 ? roofC : wallC })));
      p.position.set(x, 0.15 + y * 0.32, 0);
    }
    const roof = add(new THREE.Mesh(new THREE.ConeGeometry(1.7, 1.2, 4), new THREE.MeshLambertMaterial({ color: roofC })));
    roof.position.y = 2.2; roof.rotation.y = Math.PI / 4;
  } else {
    const body = add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 2), new THREE.MeshLambertMaterial({ color: wallC })));
    body.position.y = 0.9;
    // joints de briques
    const lineMat = new THREE.MeshLambertMaterial({ color: 0xe8d8c8 });
    for (let y = 1; y < 6; y++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.03, 2.02), lineMat); l.position.y = y * 0.3; g.add(l);
    }
    const roof = add(new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.2, 4), new THREE.MeshLambertMaterial({ color: 0x5a3b2a })));
    roof.position.y = 2.4; roof.rotation.y = Math.PI / 4;
    const chim = add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), new THREE.MeshLambertMaterial({ color: roofC })));
    chim.position.set(0.6, 2.7, 0); g.userData.chimney = chim;
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.05), new THREE.MeshLambertMaterial({ color: 0x5a3b2a }));
    door.position.set(0, 0.45, 1.01); g.add(door);
  }
  if (type !== 'briques') {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), new THREE.MeshLambertMaterial({ color: 0x3a2a1a }));
    door.position.set(0, 0.4, type === 'paille' ? 0.92 : 1.0); g.add(door); pieces.push(door);
  }
  g.userData.pieces = pieces;
  g.userData.orig = pieces.map((p) => ({ pos: p.position.clone(), rot: p.rotation.clone() }));
  return g;
}

const houses = {
  paille: makeHouse('paille'),
  bois: makeHouse('bois'),
  briques: makeHouse('briques'),
};
houses.paille.position.set(-6, 0, -2.5);
houses.bois.position.set(6, 0, -2.5);
houses.briques.position.set(0, 0, -5.5);
Object.values(houses).forEach((h) => { h.scale.setScalar(0.001); scene.add(h); });

const pigs = [makePig(0xffd23f), makePig(0x3fa7ff), makePig(0xff5a3f)];
pigs.forEach((p, i) => { p.position.set(-1.5 + i * 1.5, 0, 3); p.visible = false; scene.add(p); });
const wolf = makeWolf();
wolf.visible = false; scene.add(wolf);

// ---------- Particules ----------
const particles = [];
const leafGeo = new THREE.PlaneGeometry(0.25, 0.15);
const leafMats = [0x4caf50, 0xf2a93b, 0xd9562b, 0x9ccc65].map((c) => new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide }));
const strawMat = new THREE.MeshLambertMaterial({ color: 0xf2d36b, side: THREE.DoubleSide });
const windMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
const windGeo = new THREE.PlaneGeometry(1.6, 0.05);
const strawGeo = new THREE.PlaneGeometry(0.4, 0.04);
const sparkGeo = new THREE.OctahedronGeometry(0.08);

function spawn(mesh, opts) {
  scene.add(mesh);
  particles.push({ mesh, life: 0, ...opts });
}
function emitWind(from, dir, count = 6) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(windGeo, windMat.clone());
    m.position.set(from.x + (Math.random() - 0.5), from.y + (Math.random() - 0.3) * 1.6, from.z + (Math.random() - 0.5) * 1.5);
    m.rotation.y = Math.atan2(-dir.z, dir.x);
    spawn(m, { vel: dir.clone().multiplyScalar(10 + Math.random() * 6), max: 0.9, fade: true, wobble: 0.5 });
  }
}
function emitLeaves(from, dir, count = 4, mat) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(mat ? strawGeo : leafGeo, mat || leafMats[(Math.random() * leafMats.length) | 0]);
    m.position.set(from.x + (Math.random() - 0.5) * 2, from.y + Math.random() * 2, from.z + (Math.random() - 0.5) * 2);
    spawn(m, { vel: dir.clone().multiplyScalar(5 + Math.random() * 5).add(new THREE.Vector3(0, 1 + Math.random() * 2, 0)), max: 2.5, spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8), gravity: -1.5, wobble: 2 });
  }
}
function emitSparkles(center, count = 20, colors = [0xffe066, 0xff8fab, 0x8fd3ff, 0xb388ff]) {
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true }));
    m.position.copy(center);
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9 + 0.3, Math.random() - 0.5).normalize().multiplyScalar(3 + Math.random() * 3);
    spawn(m, { vel: v, max: 1.6, gravity: -4, fade: true, spin: new THREE.Vector3(5, 5, 0) });
  }
}
function emitSmoke(pos, fire = false) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: fire ? (Math.random() < 0.5 ? 0xff7b00 : 0xffd000) : 0x888888, transparent: true, opacity: 0.8 }));
  m.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3));
  spawn(m, { vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, 2 + Math.random(), 0), max: fire ? 0.7 : 2, fade: true, grow: fire ? 0.5 : 1.5 });
}

function updateParticles(dt, t) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.gravity) p.vel.y += p.gravity * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    if (p.wobble) p.mesh.position.y += Math.sin(t * 8 + i) * p.wobble * dt;
    if (p.spin) { p.mesh.rotation.x += p.spin.x * dt; p.mesh.rotation.y += p.spin.y * dt; p.mesh.rotation.z += p.spin.z * dt; }
    if (p.grow) p.mesh.scale.setScalar(1 + p.life * p.grow);
    if (p.fade && p.mesh.material.transparent) p.mesh.material.opacity = Math.max(0, 1 - p.life / p.max) * 0.85;
    if (p.life > p.max) { scene.remove(p.mesh); particles.splice(i, 1); }
  }
}

// ---------- Tweens simples ----------
const tweens = [];
function tween(dur, fn) {
  return new Promise((res) => tweens.push({ t: 0, dur, fn, res }));
}
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
const moveTo = (obj, x, z, dur = 1.2) => { const sx = obj.position.x, sz = obj.position.z; return tween(dur, (k) => { obj.position.x = sx + (x - sx) * ease(k); obj.position.z = sz + (z - sz) * ease(k); obj.userData.walking = k < 1; }); };

// Effondrement d'une maison : chaque pièce s'envole avec le vent
const flying = [];
function blowAway(house, dir) {
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
  h.scale.setScalar(0.001); h.visible = false;
}

// ---------- Narrateur (modèle 3D CC0 "RobotExpressive") ----------
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

let talking = false;
async function say(text, opts = {}) {
  subtitle.textContent = text;
  subtitle.classList.add('on');
  talking = true;
  if (opts.gesture) gesture(opts.gesture);
  await speak(text);
  talking = false;
  subtitle.classList.remove('on');
  await wait(opts.pause ?? 250);
}

const subtitle = document.getElementById('subtitle');
const titleEl = document.getElementById('title');

// ---------- Effets en continu ----------
let windOn = null; // { from, dir, leaves, straw }
let chimneyFire = false;

// ---------- Le conte ----------
async function blowSequence(house, label) {
  const dir = new THREE.Vector3(1, 0, 0).multiplyScalar(house.position.x > wolf.position.x ? 1 : -1);
  await say('Alors le loup prit une grande inspiration…', { pause: 100 });
  await tween(0.8, (k) => wolf.scale.setScalar(1 + 0.25 * Math.sin(k * Math.PI / 2)));
  windOn = { from: wolf.position.clone().add(new THREE.Vector3(dir.x * 0.8, 1.8, 0.3)), dir, straw: label === 'paille' };
  await say('… et il souffla, souffla, souffla de toutes ses forces ! Fffffffouuuuuuuu !', { pause: 0 });
  await tween(0.3, (k) => wolf.scale.setScalar(1.25 - 0.25 * k));
  return dir;
}

async function story() {
  // remise à zéro
  Object.values(houses).forEach(resetHouse);
  pigs.forEach((p, i) => { p.position.set(-1.5 + i * 1.5, 0, 3); p.visible = false; p.scale.setScalar(0.001); });
  wolf.visible = false; wolf.position.set(-14, 0, 1); wolf.rotation.set(0, 0, 0);
  narrator.position.set(4.6, 0, 3.2); narrator.rotation.y = -0.45;
  titleEl.classList.add('on');
  play('Idle');
  await wait(800);
  await say('Bonjour les enfants ! Venez vite, je vais vous raconter une histoire !', { gesture: 'Wave' });
  titleEl.classList.remove('on');
  await say('C\'est l\'histoire des Trois Petits Cochons !', { gesture: 'ThumbsUp' });

  emitSparkles(new THREE.Vector3(0, 1, 3), 30);
  await Promise.all(pigs.map((p) => pop(p, 0.9)));
  await say('Il était une fois trois petits cochons qui partirent de chez leur maman pour construire chacun leur maison.', { gesture: 'Yes' });

  // Maison de paille
  await moveTo(pigs[0], -5.2, 0.2);
  emitSparkles(houses.paille.position.clone().add(new THREE.Vector3(0, 1, 0)), 25, [0xf2d36b, 0xffffff]);
  pop(houses.paille);
  await say('Le premier petit cochon, un peu paresseux, construisit une maison en paille. Vite fait, et hop, au lit !');

  // Maison de bois
  await moveTo(pigs[1], 5.2, 0.2);
  emitSparkles(houses.bois.position.clone().add(new THREE.Vector3(0, 1, 0)), 25, [0xa0632f, 0xffffff]);
  pop(houses.bois);
  await say('Le deuxième construisit une maison en bois. Un peu plus solide… mais pas tellement !');

  // Maison de briques
  await moveTo(pigs[2], 1.4, -3.4, 1.4);
  emitSparkles(houses.briques.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 35, [0xc0442f, 0xffe066]);
  pop(houses.briques);
  await say('Et le troisième, très courageux, travailla dur pour construire une maison en briques, bien solide.', { gesture: 'ThumbsUp' });

  // Arrivée du loup
  pigs[0].visible = false; // entré dans sa maison
  await say('Mais dans la forêt… rôdait un grand méchant loup, qui avait très, très faim !', { gesture: 'No' });
  wolf.visible = true; wolf.rotation.y = Math.PI / 2;
  await moveTo(wolf, -9, 0.5, 1.6);
  await say('Il frappa à la porte de la maison de paille : « Petit cochon, petit cochon, laisse-moi entrer ! »');
  await say('« Non, non, par les poils de mon menton ! » répondit le petit cochon.', { gesture: 'No' });
  await say('« Alors je vais souffler, et ta maison s\'envolera ! »');

  let dir = await blowSequence(houses.paille, 'paille');
  blowAway(houses.paille, dir);
  pigs[0].visible = true; pigs[0].position.set(-5, 0, 0.6);
  await wait(800);
  windOn = null;
  await say('La maison de paille s\'envola ! Le petit cochon courut se cacher chez son frère, dans la maison de bois.', { gesture: 'Jump' });
  pigs[0].rotation.y = Math.PI / 2;
  await moveTo(pigs[0], 4.6, 0.3, 1.6);
  pigs[0].visible = false; pigs[1].visible = false;

  await moveTo(wolf, 1.5, 0.5, 1.6);
  await say('Le loup arriva devant la maison de bois : « Petits cochons, laissez-moi entrer ! » « Non, non, jamais ! »');
  dir = await blowSequence(houses.bois, 'bois');
  blowAway(houses.bois, dir);
  pigs[0].visible = pigs[1].visible = true;
  pigs[0].position.set(5, 0, 0.8); pigs[1].position.set(5.8, 0, 0.4);
  await wait(800);
  windOn = null;
  await say('Patatras ! La maison de bois s\'écroula aussi ! Les deux petits cochons coururent chez leur frère, dans la maison de briques.', { gesture: 'Jump' });
  pigs.slice(0, 2).forEach((p) => (p.rotation.y = -Math.PI / 2));
  await Promise.all([moveTo(pigs[0], 0.4, -3.4, 1.5), moveTo(pigs[1], -0.6, -3.4, 1.5)]);
  pigs.forEach((p) => (p.visible = false));

  wolf.rotation.y = -Math.PI / 2;
  await moveTo(wolf, -2.6, -2.8, 1.3);
  wolf.rotation.y = Math.PI / 2;
  await say('Le loup, furieux, arriva devant la maison de briques. Il souffla, souffla, souffla encore…');
  windOn = { from: wolf.position.clone().add(new THREE.Vector3(0.8, 1.8, 0.3)), dir: new THREE.Vector3(1, 0, 0) };
  const shake = tween(4, (k) => { houses.briques.position.x = Math.sin(k * 60) * 0.03 * (1 - k); });
  await say('Mais la maison de briques ne bougea pas d\'un poil !', { gesture: 'ThumbsUp', pause: 0 });
  await shake; windOn = null;

  await say('Alors le loup grimpa sur le toit pour descendre par la cheminée…');
  await tween(1.4, (k) => { wolf.position.set(-2.6 + 3.2 * k, Math.sin(k * Math.PI) * 2.5 + 3.4 * k, -2.8 - 2.7 * k); });
  chimneyFire = true;
  await say('Mais le petit cochon avait mis une grande marmite d\'eau bouillante sur le feu ! Plouf ! Aïe aïe aïe !', { gesture: 'Jump' });
  // le loup s'enfuit
  await tween(1.6, (k) => { wolf.position.set(0.6 - 16 * k, 3.4 + Math.sin(k * Math.PI) * 4 - 3.4 * k, -5.5 + 4 * k); wolf.rotation.z = k * 12; });
  chimneyFire = false; wolf.visible = false;
  await say('Le grand méchant loup s\'enfuit en hurlant, et on ne le revit plus jamais !', { gesture: 'Yes' });

  pigs.forEach((p, i) => { p.visible = true; p.position.set(-1.6 + i * 1.6, 0, -2.6); p.rotation.y = 0; });
  pigs.forEach((p) => (p.userData.dance = true));
  for (let i = 0; i < 4; i++) emitSparkles(new THREE.Vector3(-3 + i * 2, 2.5, -1), 30);
  play('Dance');
  await say('Et les trois petits cochons vécurent heureux, bien à l\'abri dans leur maison de briques.');
  await say('Et voilà ! L\'histoire est finie. À bientôt les enfants !', { gesture: 'Wave' });
  pigs.forEach((p) => (p.userData.dance = false));
  play('Idle');
  await wait(4000);
}

// ---------- Boucle de rendu ----------
const clock = new THREE.Clock();
let windTimer = 0, leafTimer = 0, smokeTimer = 0, ambientTimer = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  if (mixer) mixer.update(dt);
  updateTweens(dt);
  updateParticles(dt, t);
  updateFlying(dt);

  clouds.forEach((c, i) => { c.position.x += dt * (0.3 + i * 0.05); if (c.position.x > 30) c.position.x = -30; });

  // Tête du narrateur qui bouge quand il parle + bouche (morph)
  if (narrator) {
    const head = narrator.getObjectByName('Head');
    if (head) head.rotation.x = talking ? Math.sin(t * 14) * 0.08 : 0;
    if (face) face.morphTargetInfluences[1] = talking ? Math.abs(Math.sin(t * 12)) * 0.6 : 0; // "Surprised" = bouche ouverte
  }

  // petits rebonds des cochons
  pigs.forEach((p, i) => {
    if (!p.visible) return;
    const bounce = p.userData.walking || p.userData.dance;
    p.position.y = bounce ? Math.abs(Math.sin(t * 10 + i)) * 0.35 : Math.abs(Math.sin(t * 2 + i)) * 0.05;
    if (p.userData.dance) p.rotation.y = Math.sin(t * 4 + i) * 0.6;
  });
  if (wolf.visible && wolf.userData.walking) wolf.position.y = Math.abs(Math.sin(t * 9)) * 0.2;
  if (wolf.visible) wolf.userData.head.rotation.z = Math.sin(t * 3) * 0.1;

  // Vent : traînées blanches + feuilles + arbres qui se penchent
  if (windOn) {
    windTimer += dt; leafTimer += dt;
    if (windTimer > 0.05) { windTimer = 0; emitWind(windOn.from, windOn.dir, 3); }
    if (leafTimer > 0.12) { leafTimer = 0; emitLeaves(windOn.from.clone().add(new THREE.Vector3(windOn.dir.x * 2, -1.5, 0)), windOn.dir, 3); if (windOn.straw) emitLeaves(windOn.from.clone().add(new THREE.Vector3(windOn.dir.x * 3, -1.5, 0)), windOn.dir, 4, strawMat); }
    trees.forEach((tr, i) => (tr.rotation.z = -windOn.dir.x * (0.12 + Math.sin(t * 10 + i) * 0.05)));
  } else {
    trees.forEach((tr, i) => (tr.rotation.z *= 0.92, tr.rotation.z += Math.sin(t + i) * 0.0008));
  }
  // Fumée / feu de cheminée
  smokeTimer += dt;
  const chim = houses.briques.userData.chimney;
  if (houses.briques.visible && smokeTimer > (chimneyFire ? 0.03 : 0.35)) {
    smokeTimer = 0;
    const pos = new THREE.Vector3(); chim.getWorldPosition(pos); pos.y += 0.5;
    emitSmoke(pos, chimneyFire);
  }
  // Petites feuilles qui tombent tout le temps (ambiance)
  ambientTimer += dt;
  if (ambientTimer > 0.6) {
    ambientTimer = 0;
    const tr = trees[(Math.random() * trees.length) | 0];
    const m = new THREE.Mesh(leafGeo, leafMats[(Math.random() * leafMats.length) | 0]);
    m.position.copy(tr.position).add(new THREE.Vector3((Math.random() - 0.5) * 2, 2.5, (Math.random() - 0.5) * 2));
    spawn(m, { vel: new THREE.Vector3(0.3, -0.6, 0.2), max: 4, spin: new THREE.Vector3(2, 3, 1), wobble: 1 });
  }

  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------- Démarrage ----------
const bin = Uint8Array.from(atob(MODEL_B64), (c) => c.charCodeAt(0)).buffer;
new GLTFLoader().parse(bin, '', (gltf) => {
  narrator = gltf.scene;
  narrator.scale.setScalar(0.75);
  narrator.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  face = narrator.getObjectByName('Head_4');
  scene.add(narrator);
  mixer = new THREE.AnimationMixer(narrator);
  gltf.animations.forEach((clip) => (actions[clip.name] = mixer.clipAction(clip)));
  document.getElementById('loading').remove();
  animate();
  (async () => { for (;;) { try { await story(); } catch (e) { console.error(e); await wait(2000); } } })();
}, (err) => { document.getElementById('loading').textContent = 'Erreur : ' + err; });
