/* =====================================================================
   Changchong City en 3D : ville holographique (style « Tony Stark »).
   createCity(el, { mode: 'presenter' | 'player', zones, lite, onPick, onUser })
   → { fly(id), setPanel(f), setPlayers(list), setCounts(c), setActive(id), ring15(on),
       quake(), setFree(on), pos(), dispose() }
   Tout est généré par le code (aucun fichier 3D à charger).
   ===================================================================== */
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const MINT = 0x6fe3b4, CYAN = 0x5fd4ff, NAVY = 0x07121f;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}

export function createCity(el, opt) {
  const presenter = opt.mode === 'presenter', lite = !!opt.lite;
  const Z = opt.zones, zone = id => Z.find(z => z.id === id);
  const R = rng(20261210);

  /* ---------- Moteur ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: !lite, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.className = 'c3-canvas';
  el.appendChild(renderer.domElement);
  const labels = document.createElement('div'); labels.className = 'c3-labels'; el.appendChild(labels);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NAVY);
  scene.fog = new THREE.FogExp2(NAVY, lite ? 0.0036 : 0.0030);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 2500);
  camera.position.set(0, 150, 210);
  const target = V(0, 0, 0);
  camera.lookAt(target);

  scene.add(new THREE.HemisphereLight(0xa8dcff, 0x0a1622, 1.0));
  const sun = new THREE.DirectionalLight(0xd6ecff, 1.3); sun.position.set(-80, 160, 70); scene.add(sun);

  let composer = null, bloom = null, bloomOn = presenter && !lite;
  if (bloomOn) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.75, 0.45, 0.72);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  /* ---------- Matériaux ---------- */
  const holo = (color = MINT, opacity = 0.35) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const lineMat = (color = MINT, opacity = 0.6) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const glass = new THREE.MeshStandardMaterial({ color: 0x15476d, metalness: 0.7, roughness: 0.18, emissive: 0x0b3a5c, emissiveIntensity: 0.7 });
  const white = new THREE.MeshStandardMaterial({ color: 0xdfe8ee, roughness: 0.6, metalness: 0.1 });
  const green = new THREE.MeshStandardMaterial({ color: 0x2f9e5f, roughness: 0.8, emissive: 0x0f5a32, emissiveIntensity: 0.35 });
  const glow = (c, i = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4 });
  function edges(mesh, color = MINT, op = 0.55) {
    const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), lineMat(color, op));
    mesh.add(l); return mesh;
  }
  function winTex() {
    const c = document.createElement('canvas'); c.width = 64; c.height = 128;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 64, 128);
    for (let y = 4; y < 128; y += 8) for (let x = 4; x < 64; x += 8) {
      const v = R(); if (v < 0.42) continue;
      g.globalAlpha = 0.45 + R() * 0.55; g.fillStyle = v < 0.86 ? '#ffcf73' : '#7fe6ff'; g.fillRect(x, y, 4, 4);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
  }
  function textSprite(text, color = '#6FE3B4', h = 3) {
    const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = '700 64px Space Grotesk, Arial';
    c.width = Math.ceil(g.measureText(text).width) + 40; c.height = 96;
    g.font = '700 64px Space Grotesk, Arial'; g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 20, 50);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(h * c.width / c.height, h, 1); return s;
  }

  /* ---------- Île, mer, ciel ---------- */
  const ground = new THREE.Mesh(new THREE.CylinderGeometry(125, 129, 4, 96), new THREE.MeshStandardMaterial({ color: 0x0c1c2d, roughness: 0.95 }));
  ground.position.y = -2; scene.add(ground);
  const grid = new THREE.PolarGridHelper(124, 24, 10, 96, MINT, MINT);
  grid.material.transparent = true; grid.material.opacity = 0.09; grid.position.y = 0.04; scene.add(grid);
  const coast = new THREE.Mesh(new THREE.RingGeometry(124.4, 125.4, 128), holo(CYAN, 0.5)); coast.rotation.x = -Math.PI / 2; coast.position.y = 0.06; scene.add(coast);
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshStandardMaterial({ color: 0x061525, roughness: 0.35, metalness: 0.4 }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -1.6; scene.add(sea);
  {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, e = 0.12 + R() * 1.3, r = 900; p[i * 3] = Math.cos(a) * Math.cos(e) * r; p[i * 3 + 1] = Math.sin(e) * r; p[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9fd8ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.7, fog: false })));
  }
  const radar = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 160), holo(MINT, 0.3));
  radar.rotation.x = -Math.PI / 2; radar.position.y = 0.1; scene.add(radar);

  /* ---------- Routes ---------- */
  const flatRing = (r1, r2, color, op = 1, y = 0.05) => { const m = new THREE.Mesh(new THREE.RingGeometry(r1, r2, 160), new THREE.MeshBasicMaterial({ color, transparent: op < 1, opacity: op })); m.rotation.x = -Math.PI / 2; m.position.y = y; scene.add(m); return m; };
  flatRing(37.5, 42.5, 0x15293e); flatRing(97.5, 102.5, 0x15293e);
  flatRing(45.3, 46.7, 0x1c7a52, 1, 0.07);
  for (const r of [40, 100]) {
    const pts = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2; pts.push(V(Math.cos(a) * r, 0.09, Math.sin(a) * r)); }
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0xffcf73, dashSize: 1.6, gapSize: 1.6, transparent: true, opacity: 0.55 }));
    l.computeLineDistances(); scene.add(l);
  }
  const SPOKES = [17, 62, 107, 147, 222, 272, 325].map(d => d * Math.PI / 180);
  const lights = [];
  SPOKES.forEach((a, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(56, 4.6), new THREE.MeshBasicMaterial({ color: 0x15293e }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = -a; m.position.set(Math.cos(a) * 70, 0.05, Math.sin(a) * 70); scene.add(m);
    // feu tricolore intelligent au croisement avec le périphérique intérieur
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4), white); const px = Math.cos(a) * 44 + Math.sin(a) * 3.2, pz = Math.sin(a) * 44 - Math.cos(a) * 3.2;
    pole.position.set(px, 2, pz); scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8), glow(0x35e08a, 2.2)); bulb.position.set(px, 4.3, pz); scene.add(bulb);
    lights.push({ bulb, ph: i * 1.7 });
  });

  /* ---------- Bâtiments de remplissage (fenêtres allumées) ---------- */
  const away = (x, z, pad) => Z.every(zz => Math.hypot(x - zz.x, z - zz.z) > zz.r + pad);
  {
    const N = lite ? 170 : 300, geo = new THREE.BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x10243a, roughness: 0.75, metalness: 0.25, emissive: 0xffffff, emissiveMap: winTex(), emissiveIntensity: 0.85 });
    const im = new THREE.InstancedMesh(geo, mat, N), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = V(1, 1, 1), P = V(0, 0, 0);
    let k = 0, tries = 0;
    while (k < N && tries++ < 9000) {
      const a = R() * Math.PI * 2, r = 22 + R() * 98, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(r - 40) < 5 || Math.abs(r - 100) < 5 || Math.abs(r - 46) < 2.5) continue;
      if (SPOKES.some(s => r > 40 && r < 100 && Math.abs(Math.sin(a - s)) * r < 4.5 && Math.cos(a - s) > 0)) continue;
      if (!away(x, z, 3)) continue;
      const w = 3 + R() * 4, d = 3 + R() * 4, h = 3 + Math.pow(R(), 2) * 24 * (1.15 - r / 140);
      Q.setFromAxisAngle(V(0, 1, 0), -a); S.set(w, h, d); P.set(x, 0, z);
      M.compose(P, Q, S); im.setMatrixAt(k++, M);
    }
    im.count = k; scene.add(im);
  }

  /* ---------- Arbres ---------- */
  const treePts = [];
  const addTree = (x, z, s = 1) => treePts.push([x, z, s]);

  /* ---------- Quartiers ---------- */
  const rec = {};       // éléments animés
  const at = (id, dx = 0, dz = 0) => { const z = zone(id); return [z.x + dx, z.z + dz]; };

  // Cœur : la tour IA
  {
    const [x, z] = at('core');
    const tower = edges(new THREE.Mesh(new THREE.CylinderGeometry(4.5, 7, 70, 6), glass), CYAN, 0.7); tower.position.set(x, 35, z); scene.add(tower);
    const rings = [];
    for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(9 + i * 3.5, 0.22, 8, 96), holo(i === 1 ? CYAN : MINT, 0.85)); r.position.set(x, 60 + i * 4, z); r.rotation.x = Math.PI / 2; scene.add(r); rings.push(r); }
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 260, 12, 1, true), holo(CYAN, 0.18)); beam.position.set(x, 130, z); scene.add(beam);
    const plaza = new THREE.Mesh(new THREE.RingGeometry(10, 17, 6), holo(MINT, 0.18)); plaza.rotation.x = -Math.PI / 2; plaza.position.set(x, 0.12, z); scene.add(plaza);
    rec.core = { rings };
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; addTree(x + Math.cos(a) * 19.5, z + Math.sin(a) * 19.5, 0.8); }
  }

  // Architecture : tours antisismiques, jardins verticaux, parcs sur les toits
  {
    const towers = [];
    const gardenGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9), gardenPos = [];
    [[0, 0, 46], [-13, 8, 36], [12, -7, 40], [-7, -15, 30], [11, 12, 28], [-16, -4, 24]].forEach(([dx, dz, h]) => {
      const [x, z] = at('archi', dx, dz);
      const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
      const abs = [];
      for (const [ax, az] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.3, 12), glow(0xff9f43, 0.5)); c.position.set(ax, 0.65, az); g.add(c); abs.push(c); }
      const t = edges(new THREE.Mesh(new THREE.BoxGeometry(7, h, 7), glass), MINT, 0.5); t.position.y = 1.3 + h / 2; g.add(t);
      for (let y = 4; y < h - 1; y += 2.2) for (let s = 0; s < 4; s++) if (R() < 0.45) {
        const f = Math.floor(R() * 4), u = (R() - 0.5) * 6;
        const p = f === 0 ? [u, y, 3.6] : f === 1 ? [u, y, -3.6] : f === 2 ? [3.6, y, u] : [-3.6, y, u];
        gardenPos.push([g, p]);
      }
      const roof = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 7), green); roof.position.y = 1.3 + h + 0.2; g.add(roof);
      for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 6), green); c.position.set((R() - 0.5) * 5, 1.3 + h + 1.6, (R() - 0.5) * 5); g.add(c); }
      towers.push({ g, abs });
    });
    const gm = glow(0x3ccf7a, 0.55);
    gardenPos.forEach(([g, p]) => { const m = new THREE.Mesh(gardenGeo, gm); m.position.set(p[0], p[1] + 1.3, p[2]); g.add(m); });
    rec.towers = towers;
  }

  // Transports : station de métro, dépôt de bus, feux
  {
    const [x, z] = at('transport');
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.4, 32), holo(CYAN, 0.5)); pad.position.set(x, 0.2, z); scene.add(pad);
    const m = textSprite('M', '#5FD4FF', 7); m.position.set(x, 7, z); scene.add(m);
    const st = edges(new THREE.Mesh(new THREE.BoxGeometry(14, 3, 6), glass), CYAN, 0.6); st.position.set(x + 9, 1.5, z - 9); scene.add(st);
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 1.4), glow(0xdff7ee, 0.25)); b.position.set(x - 10 + i * 0, 0.8, z + 6 + i * 2.6); scene.add(b); }
  }
  // bus autonomes et vélos sur les anneaux
  const buses = [], bikes = [];
  {
    const bm = new THREE.MeshStandardMaterial({ color: 0xe8fff6, emissive: 0x2fae86, emissiveIntensity: 0.6, roughness: 0.4 });
    [[40, 5, 0.12], [100, 7, -0.06]].forEach(([r, n, sp]) => { for (let i = 0; i < n; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 3.4), bm); b.position.y = 0.85; scene.add(b); buses.push({ b, r: r + (sp > 0 ? -1.2 : 1.2), a: i / n * Math.PI * 2, sp }); } });
    const km = glow(0x9cffd6, 1.4);
    for (let i = 0; i < (lite ? 14 : 26); i++) { const k = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.9), km); k.position.y = 0.3; scene.add(k); bikes.push({ b: k, a: R() * Math.PI * 2, sp: (R() < 0.5 ? -1 : 1) * (0.08 + R() * 0.05) }); }
  }
  // métro souterrain (tracé holographique) et rames
  const metro = { trains: [] };
  {
    const order = ['archi', 'security', 'transport', 'energy', 'waste', 'food', 'school', 'hospital'];
    const pts = order.map(id => { const z = zone(id), a = Math.atan2(z.z, z.x); return V(Math.cos(a) * 60, 0.3, Math.sin(a) * 60); });
    const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 240, 0.28, 6, true), holo(CYAN, 0.5)); scene.add(tube);
    pts.forEach(p => { const s = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.5, 20), holo(CYAN, 0.6)); s.position.copy(p); scene.add(s); });
    for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 3.5, 4, 8), glow(CYAN, 2)); t.rotation.z = Math.PI / 2; scene.add(t); metro.trains.push({ t, u: i / 3 }); }
    metro.curve = curve;
  }

  // Énergie : nucléaire, solaire, éolien en mer, réseau intelligent
  const turbines = [], steam = {};
  {
    const [x, z] = at('energy');
    const prof = [[9, 0], [7.6, 6], [6.1, 12], [5.6, 16], [6.2, 22], [7, 26]].map(([r, y]) => new THREE.Vector2(r, y));
    const ct = edges(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), new THREE.MeshStandardMaterial({ color: 0xcfd8de, roughness: 0.9, side: THREE.DoubleSide })), CYAN, 0.25);
    ct.position.set(x + 10, 0, z - 14); scene.add(ct);
    const dome = edges(new THREE.Mesh(new THREE.SphereGeometry(5.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), white), CYAN, 0.35); dome.position.set(x - 3, 3, z - 18); scene.add(dome);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 3, 24), white); base.position.set(x - 3, 1.5, z - 18); scene.add(base);
    // vapeur
    const n = 70, p = new Float32Array(n * 3), life = new Float32Array(n);
    for (let i = 0; i < n; i++) { life[i] = R(); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdfefff, size: 3.2, transparent: true, opacity: 0.35, depthWrite: false }));
    scene.add(pts); Object.assign(steam, { g, p, life, n, x: x + 10, z: z - 14 });
    // champ solaire
    const pg = new THREE.BoxGeometry(3, 0.15, 2), pm = new THREE.MeshStandardMaterial({ color: 0x1e58b8, metalness: 0.6, roughness: 0.25, emissive: 0x0b2f77, emissiveIntensity: 0.8 });
    const im = new THREE.InstancedMesh(pg, pm, 30), M = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.55, 0, 0));
    for (let i = 0; i < 30; i++) { M.compose(V(x - 14 + (i % 6) * 3.6, 1, z + 4 + Math.floor(i / 6) * 3), Q, V(1, 1, 1)); im.setMatrixAt(i, M); }
    scene.add(im);
    // éoliennes en mer
    const tm = new THREE.MeshStandardMaterial({ color: 0xeef4f7, roughness: 0.5 });
    for (let i = 0; i < 8; i++) {
      const tx = 148 + (i % 2) * 18 + R() * 6, tz = -70 + i * 17;
      const g2 = new THREE.Group(); g2.position.set(tx, -1.6, tz); scene.add(g2);
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.8, 28, 10), tm); tw.position.y = 14; g2.add(tw);
      const nac = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.3), tm); nac.position.y = 28.3; g2.add(nac);
      const rotor = new THREE.Group(); rotor.position.set(-1.4, 28.3, 0); g2.add(rotor);
      for (let b = 0; b < 3; b++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.15, 12, 0.6), tm); bl.position.y = 6; const arm = new THREE.Group(); arm.rotation.x = b * Math.PI * 2 / 3; arm.add(bl); rotor.add(arm); }
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), glow(0xff5a4f, 2)); tip.position.y = 29.3; g2.add(tip);
      turbines.push({ rotor, sp: 1.1 + R() * 0.5 });
    }
  }
  // réseau intelligent : impulsions d'énergie de la centrale vers la ville
  const grids = [];
  {
    const [ex, ez] = at('energy');
    [['core', 0, 0], ['archi', 0, 0], ['hospital', 0, 0], ['school', 0, 0]].forEach(([id]) => {
      const [x, z] = at(id), mid = V((ex + x) / 2, 22, (ez + z) / 2);
      const c = new THREE.QuadraticBezierCurve3(V(ex, 3, ez), mid, V(x, 3, z));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(60)), lineMat(0xffcf73, 0.35)));
      const ps = []; for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), glow(0xffcf73, 3)); scene.add(s); ps.push({ s, u: i / 3 }); }
      grids.push({ c, ps });
    });
  }

  // Déchets → énergie
  {
    const [x, z] = at('waste');
    const pl = edges(new THREE.Mesh(new THREE.BoxGeometry(14, 8, 10), new THREE.MeshStandardMaterial({ color: 0x24384d, roughness: 0.7 })), MINT, 0.4); pl.position.set(x, 4, z); scene.add(pl);
    const ch = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 24, 16), white); ch.position.set(x + 5, 12, z - 2); scene.add(ch);
    for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.18, 8, 32), holo(MINT, 0.9)); r.rotation.x = Math.PI / 2; r.position.set(x + 5, 15 + i * 3, z - 2); scene.add(r); }
    const bio = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), glow(0x3c9f6a, 0.35)); bio.position.set(x - 9, 0, z + 6); scene.add(bio);
    [0x3a7bd5, 0xf2c94c, 0x2fae6a, 0x8a96a3].forEach((c, i) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 1.4), glow(c, 0.6)); b.position.set(x - 6 + i * 2, 1, z - 9); scene.add(b); });
    // canalisations souterraines (collecte automatique)
    [[20, 20], [-5, 40], [40, 8], [30, 75]].forEach(([sx, sz]) => {
      const c = new THREE.QuadraticBezierCurve3(V(sx, 0.2, sz), V((sx + x) / 2, 0.2, (sz + z) / 2 + 6), V(x, 0.2, z));
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.18, 5), holo(MINT, 0.45)));
    });
  }

  // Restaurants robots
  const robots = [];
  {
    const [x, z] = at('food');
    const b = edges(new THREE.Mesh(new THREE.BoxGeometry(16, 5, 9), new THREE.MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.6, emissive: 0xffffff, emissiveMap: winTex(), emissiveIntensity: 0.6 })), 0xffcf73, 0.5);
    b.position.set(x, 2.5, z + 2); scene.add(b);
    const s = textSprite('ROBOT RESTAURANT', '#FFCF73', 2.4); s.position.set(x, 7.2, z + 2); scene.add(s);
    for (let i = 0; i < 2; i++) {
      const g = new THREE.Group(); g.position.set(x - 4 + i * 8, 0, z - 5); scene.add(g);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.7), white); body.position.y = 0.9; g.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), white); head.position.y = 1.85; g.add(head);
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.1), glow(CYAN, 3)); eye.position.set(0, 1.9, 0.4); g.add(eye);
      robots.push({ g, x0: x - 4 + i * 8, ph: i * 2 });
    }
    for (let i = 0; i < 4; i++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.9, 14), white); t.position.set(x - 6 + i * 4, 0.45, z - 8); scene.add(t); }
  }

  // École : professeur hologramme
  {
    const [x, z] = at('school');
    const m = new THREE.MeshStandardMaterial({ color: 0x1b3550, roughness: 0.6, emissive: 0xffffff, emissiveMap: winTex(), emissiveIntensity: 0.55 });
    [[0, -6, 18, 6, 5], [-7, 2, 5, 6, 12], [7, 2, 5, 6, 12]].forEach(([dx, dz, w, h, d]) => { const b = edges(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m), MINT, 0.35); b.position.set(x + dx, h / 2, z + dz); scene.add(b); });
    const g = new THREE.Group(); g.position.set(x, 0, z + 3); scene.add(g);
    const fig = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3.2, 6, 14), holo(MINT, 0.45)); fig.position.y = 3.6; g.add(fig);
    fig.add(new THREE.LineSegments(new THREE.WireframeGeometry(fig.geometry), lineMat(MINT, 0.25)));
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10), holo(MINT, 0.5)); head.position.y = 6.6; g.add(head);
    const base = new THREE.Mesh(new THREE.TorusGeometry(2, 0.12, 8, 40), holo(CYAN, 0.9)); base.rotation.x = Math.PI / 2; base.position.y = 0.3; g.add(base);
    rec.holo = g;
    for (let i = 0; i < 8; i++) addTree(x - 12 + R() * 24, z + 10 + R() * 5, 0.9);
  }

  // Hôpital : croix verte, drone médical
  {
    const [x, z] = at('hospital');
    const b = edges(new THREE.Mesh(new THREE.BoxGeometry(16, 12, 12), white), CYAN, 0.3); b.position.set(x, 6, z); scene.add(b);
    const w = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 14), white); w.position.set(x + 11, 3.5, z + 2); scene.add(w);
    const cm = glow(0x35e08a, 2.2);
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 1.3), cm), c2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 4.2), cm);
    c1.position.set(x, 12.4, z); c2.position.set(x, 12.4, z); scene.add(c1, c2);
    const pad = new THREE.Mesh(new THREE.RingGeometry(2, 2.6, 32), holo(0xffffff, 0.8)); pad.rotation.x = -Math.PI / 2; pad.position.set(x + 11, 7.05, z + 2); scene.add(pad);
    const dr = new THREE.Group(); scene.add(dr);
    const db = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), white); dr.add(db);
    const dl = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), glow(0x35e08a, 3)); dl.position.y = -0.3; dr.add(dl);
    rec.drone = { dr, x, z };
  }

  // Sécurité : campus « seconde chance », tour des points verts, données protégées
  {
    const [x, z] = at('security');
    const wood = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.85 });
    [[-10, -6], [-4, 6], [6, -10], [-14, 6]].forEach(([dx, dz]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 5), wood); b.position.set(x + dx, 1.75, z + dz); scene.add(b); });
    for (let i = 0; i < 26; i++) addTree(x - 18 + R() * 20, z - 16 + R() * 30, 0.9 + R() * 0.4);
    const t = edges(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 30, 8), glass), MINT, 0.6); t.position.set(x + 8, 15, z + 4); scene.add(t);
    const orbs = []; for (let i = 0; i < 8; i++) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), glow(0x3cf09a, 2.4)); scene.add(o); orbs.push(o); }
    const dc = edges(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 6), new THREE.MeshStandardMaterial({ color: 0x14202e, roughness: 0.5 })), CYAN, 0.6); dc.position.set(x + 12, 2, z - 10); scene.add(dc);
    const lock = new THREE.Group(); lock.position.set(x + 12, 9, z - 10); scene.add(lock);
    const sh = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.32, 10, 24, Math.PI), holo(CYAN, 0.9)); sh.position.y = 1.4; lock.add(sh);
    const bd = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 0.8), holo(CYAN, 0.55)); lock.add(bd);
    rec.sec = { orbs, x: x + 8, z: z + 4, lock };
  }

  // arbres supplémentaires dans les espaces libres
  for (let i = 0; i < (lite ? 30 : 60); i++) { const a = R() * Math.PI * 2, r = 25 + R() * 95, x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(r - 40) > 4 && Math.abs(r - 100) > 4 && away(x, z, 2)) addTree(x, z, 0.7 + R() * 0.5); }
  {
    const im = new THREE.InstancedMesh(new THREE.ConeGeometry(1.2, 3.2, 6).translate(0, 1.6, 0), green, treePts.length), M = new THREE.Matrix4();
    treePts.forEach(([x, z, s], i) => { M.compose(V(x, 0, z), new THREE.Quaternion(), V(s, s, s)); im.setMatrixAt(i, M); });
    scene.add(im);
  }

  /* ---------- Zones : anneaux, colonne de lumière, étiquettes, cibles de clic ---------- */
  const ZR = {}, picks = [];
  Z.forEach(z => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(z.r - 0.5, z.r, 96), holo(MINT, 0.22)); ring.rotation.x = -Math.PI / 2; ring.position.set(z.x, 0.14, z.z); scene.add(ring);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(z.r, z.r, 36, 64, 1, true), holo(MINT, 0.03)); pillar.position.set(z.x, 18, z.z); pillar.visible = false; scene.add(pillar);
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(z.r, z.r, 40, 24), new THREE.MeshBasicMaterial({ visible: false })); pick.position.set(z.x, 20, z.z); pick.userData.zone = z.id; scene.add(pick); picks.push(pick);
    const tag = document.createElement('div'); tag.className = 'c3-tag'; tag.innerHTML = `<b>${z.name}</b><span></span>`; labels.appendChild(tag);
    ZR[z.id] = { ring, pillar, tag, cnt: tag.querySelector('span'), pos: V(z.x, z.id === 'core' ? 74 : 14, z.z) };
  });
  // cercle de la ville du quart d'heure
  const r15 = new THREE.Group(); r15.visible = false; scene.add(r15);
  {
    const ring = new THREE.Mesh(new THREE.RingGeometry(83, 85, 160), holo(0xffcf73, 0.55)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.3; r15.add(ring);
    const s = textSprite('15 MIN BY BIKE', '#FFCF73', 5); s.position.set(0, 10, 86); r15.add(s);
  }

  /* ---------- Joueurs : drones ---------- */
  const players = new Map();
  const droneGeo = new THREE.OctahedronGeometry(1.5);
  function hue(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return (h % 360) / 360; }
  function setPlayers(list) {
    const seen = new Set();
    list.forEach(p => {
      seen.add(p.id);
      let o = players.get(p.id);
      if (!o) {
        const c = new THREE.Color().setHSL(hue(p.id), 0.85, 0.62);
        const m = new THREE.Mesh(droneGeo, new THREE.MeshBasicMaterial({ color: c }));
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9, 6, 1, true), holo(c, 0.5)); beam.position.y = -4.5; m.add(beam);
        m.position.set(p.x, 10, p.z); scene.add(m);
        const lab = document.createElement('div'); lab.className = 'c3-pl'; labels.appendChild(lab);
        o = { m, lab, x: p.x, z: p.z, ph: R() * 6 }; players.set(p.id, o);
      }
      o.x = p.x; o.z = p.z;
      o.lab.textContent = p.name || ''; o.lab.hidden = !p.name;
    });
    for (const [id, o] of players) if (!seen.has(id)) { scene.remove(o.m); o.lab.remove(); players.delete(id); }
  }
  function setCounts(c) { Z.forEach(z => { const n = (c && c[z.id]) || 0; ZR[z.id].cnt.textContent = n ? `👥 ${n}` : ''; }); }

  /* ---------- Caméra ---------- */
  let current = 'overview', fly = null, orbitA = 0.6, free = false, shake = 0;
  let panelF = 0, panelT = 0;
  function view(id) {
    const z = zone(id);
    if (!z) return { p: V(Math.sin(orbitA) * 215, 150, Math.cos(orbitA) * 215), q: V(0, 0, 0) };
    if (z.cam) return { p: V(z.x + z.cam[0], z.cam[1], z.z + z.cam[2]), q: V(z.x, z.look || 6, z.z) };
    // téléphone en portrait : on recule pour voir tout le quartier
    const far = camera.aspect < 1 ? Math.min(1.9, 1.15 / Math.sqrt(camera.aspect)) : 1;
    const len = Math.hypot(z.x, z.z) || 1, nx = z.x / len, nz = z.z / len, d = (z.r * 2.3 + 22) * far, s = z.r * 0.6;
    return { p: V(z.x + nx * d - nz * s, (z.r * 1.5 + 24) * far, z.z + nz * d + nx * s), q: V(z.x, 8, z.z) };
  }
  function flyTo(id, dur = 2.4) {
    if (!id) id = 'overview';
    if (id === 'overview' && current !== 'overview') orbitA = Math.atan2(camera.position.x, camera.position.z);
    current = id; const v = view(id);
    fly = { p0: camera.position.clone(), q0: target.clone(), p1: v.p, q1: v.q, s: performance.now(), d: dur };
    if (controls) controls.enabled = false;
    setActive(id);
  }
  function setActive(id) { Z.forEach(z => { const a = z.id === id; ZR[z.id].pillar.visible = a; ZR[z.id].ring.material.opacity = a ? 0.8 : 0.22; ZR[z.id].tag.classList.toggle('on', a); }); }
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let controls = null;
  {
    controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.maxPolarAngle = 1.32; controls.minDistance = 12; controls.maxDistance = 320;
    controls.screenSpacePanning = false; controls.target.copy(target);
    controls.enabled = !presenter;
    controls.addEventListener('start', () => { fly = null; if (opt.onUser) opt.onUser(); });
  }
  // tap sur un quartier
  {
    let d0 = null; const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', e => { d0 = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    renderer.domElement.addEventListener('pointerup', e => {
      if (!d0 || Math.hypot(e.clientX - d0.x, e.clientY - d0.y) > 8 || performance.now() - d0.t > 400) return;
      const r = renderer.domElement.getBoundingClientRect(); v2.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      camera.clearViewOffset(); ray.setFromCamera(v2, camera);
      const hit = ray.intersectObjects(picks)[0];
      if (hit && opt.onPick) opt.onPick(hit.object.userData.zone);
    });
  }

  /* ---------- Boucle ---------- */
  let W = 1, H = 1;
  function resize() {
    W = el.clientWidth || 1; H = el.clientHeight || 1;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
    if (composer) { composer.setSize(W, H); }
  }
  const ro = new ResizeObserver(resize); ro.observe(el); resize();

  const clock = new THREE.Clock(); let t = 0, raf = 0, slow = 0, frames = 0, dead = false;
  const tmp = V(0, 0, 0), shakeOff = V(0, 0, 0);
  function loop() {
    if (dead) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta()); t += dt;
    camera.position.sub(shakeOff); shakeOff.set(0, 0, 0);   // annule la secousse de l'image précédente
    // perf : sans halo si l'ordinateur rame
    if (bloomOn) { frames++; if (dt > 1 / 26) slow++; if (frames === 180) { if (slow > 90) bloomOn = false; frames = slow = 0; } }

    // caméra
    if (fly) {
      fly.t = (performance.now() - fly.s) / 1000 / fly.d; const k = ease(Math.min(1, fly.t));   // temps réel : même durée sur un ordi lent
      camera.position.lerpVectors(fly.p0, fly.p1, k); target.lerpVectors(fly.q0, fly.q1, k);
      camera.position.y += Math.sin(k * Math.PI) * 45;      // arc au-dessus des tours
      if (fly.t >= 1) { fly = null; if (controls) { controls.target.copy(target); controls.enabled = free || !presenter; } }
    } else if (current === 'overview' && presenter && !free) {
      orbitA += dt * 0.045; camera.position.set(Math.sin(orbitA) * 215, 150, Math.cos(orbitA) * 215); target.set(0, 0, 0);
    } else if (controls && controls.enabled) {
      controls.update(); target.copy(controls.target);
      if (target.length() > 150) { target.setLength(150); controls.target.copy(target); }
    }
    camera.lookAt(target);
    if (shake > 0) {
      shake = Math.max(0, shake - dt); const a = Math.min(1, shake / 2.6) * 0.9;
      shakeOff.set((Math.random() - 0.5) * a, (Math.random() - 0.5) * a, 0);
      camera.position.add(shakeOff);
      ground.position.y = -2 + Math.sin(t * 40) * 0.25 * a;
    }
    panelF += (panelT - panelF) * Math.min(1, dt * 3);
    if (panelF > 0.002) camera.setViewOffset(W, H, -panelF * W, 0, W, H); else camera.clearViewOffset();

    // animations
    radar.scale.setScalar(2 + ((t % 6) / 6) * 128); radar.material.opacity = 0.35 * (1 - (t % 6) / 6);
    rec.core.rings.forEach((r, i) => { r.rotation.z += dt * (0.4 + i * 0.25) * (i % 2 ? -1 : 1); r.rotation.x = Math.PI / 2 + Math.sin(t * 0.7 + i) * 0.12; });
    rec.towers.forEach((o, i) => {
      const a = Math.min(1, shake / 2.6);
      o.g.rotation.z = Math.sin(t * 13 + i) * 0.035 * a; o.g.rotation.x = Math.cos(t * 11 + i) * 0.025 * a;
      o.abs.forEach(c => { c.material.emissiveIntensity = 0.5 + a * 3; });
    });
    buses.forEach(o => { o.a += o.sp * dt; o.b.position.x = Math.cos(o.a) * o.r; o.b.position.z = Math.sin(o.a) * o.r; o.b.rotation.y = -o.a + (o.sp > 0 ? 0 : Math.PI); });
    bikes.forEach(o => { o.a += o.sp * dt; const r = 46 + (o.sp > 0 ? -0.3 : 0.3); o.b.position.x = Math.cos(o.a) * r; o.b.position.z = Math.sin(o.a) * r; o.b.rotation.y = -o.a; });
    metro.trains.forEach(o => { o.u = (o.u + dt * 0.035) % 1; metro.curve.getPointAt(o.u, tmp); o.t.position.copy(tmp); const tg = metro.curve.getTangentAt(o.u); o.t.rotation.y = Math.atan2(-tg.z, tg.x); o.t.rotation.z = Math.PI / 2; });
    lights.forEach(o => { const g = Math.sin(t * 0.8 + o.ph) > 0; o.bulb.material.color.setHex(g ? 0x35e08a : 0xff5a4f); o.bulb.material.emissive.setHex(g ? 0x35e08a : 0xff5a4f); });
    turbines.forEach(o => { o.rotor.rotation.x += dt * o.sp; });
    grids.forEach(g => g.ps.forEach(p => { p.u = (p.u + dt * 0.22) % 1; g.c.getPointAt(p.u, tmp); p.s.position.copy(tmp); }));
    for (let i = 0; i < steam.n; i++) {
      steam.life[i] += dt * 0.25; if (steam.life[i] > 1) steam.life[i] -= 1;
      const l = steam.life[i], s = 5 + l * 7;
      steam.p[i * 3] = steam.x + Math.sin(i * 12.9) * s * 0.6 + l * 10; steam.p[i * 3 + 1] = 26 + l * 26; steam.p[i * 3 + 2] = steam.z + Math.cos(i * 7.3) * s * 0.6;
    }
    steam.g.attributes.position.needsUpdate = true;
    robots.forEach(o => { o.g.position.x = o.x0 + Math.sin(t * 0.8 + o.ph) * 3; o.g.rotation.y = Math.cos(t * 0.8 + o.ph) > 0 ? Math.PI / 2 : -Math.PI / 2; });
    rec.holo.rotation.y += dt * 0.6; rec.holo.position.y = Math.sin(t * 1.6) * 0.25;
    { const d = rec.drone; d.dr.position.set(d.x + Math.cos(t * 0.6) * 14, 16 + Math.sin(t * 1.3) * 1.5, d.z + Math.sin(t * 0.6) * 14); }
    rec.sec.orbs.forEach((o, i) => { const a = t * 0.8 + i / 8 * Math.PI * 2; o.position.set(rec.sec.x + Math.cos(a) * 4, 8 + i * 2.6 + Math.sin(t * 2 + i) * 0.4, rec.sec.z + Math.sin(a) * 4); });
    rec.sec.lock.rotation.y += dt * 0.8;
    Z.forEach(z => { const p = ZR[z.id].pillar; if (p.visible) p.material.opacity = 0.03 + Math.sin(t * 2.2) * 0.015; });
    if (r15.visible) { const s = Math.min(1, r15.scale.x + dt * 0.8); r15.scale.setScalar(s); }
    for (const o of players.values()) {
      o.m.position.x += (o.x - o.m.position.x) * Math.min(1, dt * 2.5); o.m.position.z += (o.z - o.m.position.z) * Math.min(1, dt * 2.5);
      o.m.position.y = 10 + Math.sin(t * 2 + o.ph) * 0.8; o.m.rotation.y += dt * 1.5;
    }

    if (bloomOn && composer) composer.render(); else renderer.render(scene, camera);
    placeLabels();
  }
  function place(div, p, dy = 0) {
    tmp.copy(p); tmp.y += dy; tmp.project(camera);
    if (tmp.z > 1 || tmp.x < -1.2 || tmp.x > 1.2 || tmp.y < -1.2 || tmp.y > 1.2) { div.style.display = 'none'; return; }
    div.style.display = '';
    div.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * W}px,${(-tmp.y * 0.5 + 0.5) * H}px) translate(-50%,-100%)`;
  }
  function placeLabels() {
    Z.forEach(z => place(ZR[z.id].tag, ZR[z.id].pos));
    for (const o of players.values()) if (!o.lab.hidden) place(o.lab, o.m.position, 2.2);
  }
  loop();

  return {
    fly: flyTo,
    setPanel(f) { panelT = f; },
    setPlayers, setCounts, setActive,
    ring15(on) { if (on && !r15.visible) r15.scale.setScalar(0.01); r15.visible = !!on; },
    quake() { shake = 2.6; },
    setFree(on) { free = !!on; if (controls) { controls.target.copy(target); controls.enabled = free || !presenter; } if (free) { fly = null; current = '_free'; } },
    pos() { return { x: Math.round(target.x * 10) / 10, z: Math.round(target.z * 10) / 10 }; },
    current: () => current,
    bloom(on) { if (composer) bloomOn = on == null ? !bloomOn : !!on; return bloomOn; },
    dispose() { dead = true; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); el.innerHTML = ''; }
  };
}
