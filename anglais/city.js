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
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const MINT = 0x7592ff, CYAN = 0x5fd4ff, NAVY = 0x07121f;   // MINT = bleu « stylo » du site Prepa01
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
  renderer.toneMappingExposure = 0.8;
  renderer.domElement.className = 'c3-canvas';
  el.appendChild(renderer.domElement);
  const labels = document.createElement('div'); labels.className = 'c3-labels'; el.appendChild(labels);

  const scene = new THREE.Scene();
  const FOG = 0x1d2c44;
  scene.background = new THREE.Color(FOG);
  scene.fog = new THREE.FogExp2(FOG, lite ? 0.0022 : 0.0018);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 2500);
  camera.position.set(0, 150, 210);
  const target = V(0, 0, 0);
  camera.lookAt(target);

  // heure bleue : soleil juste au-dessus de l'horizon, lumière chaude rasante + ciel bleu
  const SUN_EL = 1.6, SUN_AZ = 248;
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - SUN_EL), THREE.MathUtils.degToRad(SUN_AZ));
  scene.add(new THREE.HemisphereLight(0x6f8fc4, 0x1a1612, 0.75));
  const sun = new THREE.DirectionalLight(0xffb27a, 1.1); sun.position.copy(sunDir).multiplyScalar(300).setY(60); scene.add(sun);
  const sky = new Sky(); sky.scale.setScalar(2000);
  Object.assign(sky.material.uniforms.turbidity, { value: 7 }); sky.material.uniforms.rayleigh.value = 2.4;
  sky.material.uniforms.mieCoefficient.value = 0.006; sky.material.uniforms.mieDirectionalG.value = 0.82;
  sky.material.uniforms.sunPosition.value.copy(sunDir);
  // reflets : carte d'environnement tirée du ciel (verre des tours, mer)
  {
    const pm = new THREE.PMREMGenerator(renderer), env = new THREE.Scene(); env.add(sky);
    scene.environment = pm.fromScene(env, 0.02).texture; pm.dispose();
    scene.add(sky);
  }

  let composer = null, bloom = null, bloomOn = presenter && !lite;
  if (bloomOn) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.6, 0.5, 0.82);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  /* ---------- Matériaux ---------- */
  const holo = (color = MINT, opacity = 0.35) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const lineMat = (color = MINT, opacity = 0.6) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  /* Façades réalistes : fenêtres dessinées par le shader à taille réelle (étages de 2,7 m, travées de 2 m),
     allumées au hasard, rez-de-chaussée en vitrines. Marche pour les bâtiments instanciés comme pour les autres. */
  function facadeMat(color, o = {}) {
    const lit = o.lit == null ? 0.5 : o.lit, gain = o.gain == null ? 2.4 : o.gain;
    const m = new THREE.MeshStandardMaterial({ color, roughness: o.rough == null ? 0.75 : o.rough, metalness: o.metal == null ? 0.15 : o.metal, envMapIntensity: o.env == null ? 0.6 : o.env });
    m.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLP; varying vec3 vLN; varying float vWY; varying vec2 vSeed;')
        .replace('#include <project_vertex>', `#include <project_vertex>
          vec3 fsc = vec3(1.0); vec4 fwp = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            fsc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
            vSeed = instanceMatrix[3].xz; fwp = instanceMatrix * fwp;
          #else
            vSeed = modelMatrix[3].xz;
          #endif
          fwp = modelMatrix * fwp;
          vLP = transformed * fsc; vLN = objectNormal; vWY = fwp.y;`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vLP; varying vec3 vLN; varying float vWY; varying vec2 vSeed;
          float fh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          {
            vec3 an = abs(vLN);
            if (an.y < 0.5) {
              float u = an.x > an.z ? vLP.z : vLP.x;
              float side = an.x > an.z ? sign(vLN.x) : 2.0 * sign(vLN.z);
              vec2 g = vec2(u / 1.15, vWY / 1.45);
              vec2 cell = floor(g), f = fract(g);
              float win = step(0.18, f.x) * step(f.x, 0.82) * step(0.2, f.y) * step(f.y, 0.78);
              float r = fh(cell + vSeed * 0.731 + side * 13.7);
              float shop = 1.0 - step(1.45, vWY);
              float on = min(1.0, step(${(1 - lit).toFixed(3)}, r) + shop * step(0.25, r));
              vec3 col = mix(vec3(1.0, 0.66, 0.34), vec3(0.7, 0.86, 1.0), step(0.84, fh(cell * 1.31 + vSeed)));
              col = mix(col, vec3(1.0, 0.85, 0.6), shop);
              totalEmissiveRadiance += win * on * col * ${gain.toFixed(2)} * (0.45 + 0.55 * fh(cell + 7.7));
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02, 0.03, 0.05), win * 0.75);
            }
          }`);
    };
    m.customProgramCacheKey = () => 'facade-' + lit + '-' + gain;
    return m;
  }
  const glass = facadeMat(0x2c5878, { metal: 0.85, rough: 0.12, env: 1.3, lit: 0.55, gain: 2.0 });
  const white = new THREE.MeshStandardMaterial({ color: 0xdfe8ee, roughness: 0.6, metalness: 0.1 });
  const green = new THREE.MeshStandardMaterial({ color: 0x2f7a46, roughness: 0.9 });
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

  /* ---------- Île, mer, horizon ---------- */
  const ground = new THREE.Mesh(new THREE.CylinderGeometry(125, 129, 4, 96), [
    new THREE.MeshStandardMaterial({ color: 0x4a4f56, roughness: 0.9 }),        // digue en béton
    new THREE.MeshStandardMaterial({ color: 0x1b1f25, roughness: 0.95, envMapIntensity: 0.2 }),
    new THREE.MeshStandardMaterial({ color: 0x1b1f25 })]);
  ground.position.y = -2; scene.add(ground);
  const grid = new THREE.PolarGridHelper(124, 24, 10, 96, MINT, MINT);
  grid.material.transparent = true; grid.material.opacity = 0.035; grid.position.y = 0.04; scene.add(grid);
  const coast = new THREE.Mesh(new THREE.RingGeometry(124.4, 125.2, 128), holo(CYAN, 0.18)); coast.rotation.x = -Math.PI / 2; coast.position.y = 0.06; scene.add(coast);
  // mer : carte de normales générée (vagues périodiques) qui défile, reflets du ciel
  function waterNormals() {
    // bruit de valeur lissé sur plusieurs octaves (raccordable) → vagues irrégulières, pas de motif visible
    const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d'), img = g.createImageData(S, S), H = new Float32Array(S * S);
    for (const [cells, amp] of [[8, 1], [16, 0.5], [32, 0.3], [64, 0.15]]) {
      const grid = new Float32Array(cells * cells).map(() => R()), q = S / cells;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const gx = x / q, gy = y / q, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const v = (i, j) => grid[((j % cells) * cells) + (i % cells)];
        const top = v(x0, y0) * (1 - sx) + v(x0 + 1, y0) * sx, bot = v(x0, y0 + 1) * (1 - sx) + v(x0 + 1, y0 + 1) * sx;
        H[y * S + x] += (top * (1 - sy) + bot * sy) * amp;
      }
    }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = H[y * S + (x + 1) % S] - H[y * S + (x + S - 1) % S], dy = H[((y + 1) % S) * S + x] - H[((y + S - 1) % S) * S + x];
      const n = new THREE.Vector3(-dx * 7, -dy * 7, 1).normalize(), o = (y * S + x) * 4;
      img.data[o] = (n.x * 0.5 + 0.5) * 255; img.data[o + 1] = (n.y * 0.5 + 0.5) * 255; img.data[o + 2] = (n.z * 0.5 + 0.5) * 255; img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(60, 60); return t;
  }
  const seaMat = new THREE.MeshStandardMaterial({ color: 0x081a2a, roughness: 0.38, metalness: 0.7, normalMap: waterNormals(), normalScale: new THREE.Vector2(0.35, 0.35), envMapIntensity: 0.75 });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), seaMat);
  sea.rotation.x = -Math.PI / 2; sea.position.y = -1.6; scene.add(sea);
  // collines de la côte chinoise à l'horizon
  {
    const n = 26, im = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 7).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: 0x14202c, roughness: 1, flatShading: true }), n), M = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const a = THREE.MathUtils.degToRad(120 + i / n * 200 + R() * 6), r = 560 + R() * 260, w = 110 + R() * 160;
      M.compose(V(Math.cos(a) * r, -2, Math.sin(a) * r), new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), R() * 6), V(w, 50 + R() * 110, w * (0.7 + R() * 0.5)));
      im.setMatrixAt(i, M);
    }
    scene.add(im);
  }
  // pelouses
  {
    const gm = new THREE.MeshStandardMaterial({ color: 0x1f3a26, roughness: 1 });
    const spots = [[0, 0, 19.5], ...Z.filter(z => ['school', 'security', 'hospital', 'food'].includes(z.id)).map(z => [z.x, z.z, z.r * 0.9])];
    for (let i = 0; i < 24; i++) { const a = R() * Math.PI * 2, r = 50 + R() * 66; spots.push([Math.cos(a) * r, Math.sin(a) * r, 4 + R() * 5]); }
    spots.forEach(([x, z, r]) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), gm); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, z); scene.add(m); });
  }
  const radar = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 160), holo(MINT, 0.18));
  radar.rotation.x = -Math.PI / 2; radar.position.y = 0.1; scene.add(radar);

  /* ---------- Routes ---------- */
  const ASPHALT = 0x23272e;
  const flatRing = (r1, r2, color, op = 1, y = 0.05) => { const m = new THREE.Mesh(new THREE.RingGeometry(r1, r2, 200), new THREE.MeshStandardMaterial({ color, roughness: 0.92, transparent: op < 1, opacity: op })); m.rotation.x = -Math.PI / 2; m.position.y = y; scene.add(m); return m; };
  flatRing(36.6, 43.4, ASPHALT); flatRing(96.6, 103.4, ASPHALT);
  flatRing(35.2, 36.6, 0x474c54, 1, 0.06); flatRing(43.4, 44.8, 0x474c54, 1, 0.06); flatRing(95.2, 96.6, 0x474c54, 1, 0.06); flatRing(103.4, 104.8, 0x474c54, 1, 0.06);
  flatRing(119.3, 121.8, 0x53504a, 1, 0.06);                 // promenade du front de mer
  flatRing(45.3, 46.7, 0x2d6b4a, 1, 0.07);
  for (const r of [40, 100]) {
    const pts = []; for (let i = 0; i <= 200; i++) { const a = i / 200 * Math.PI * 2; pts.push(V(Math.cos(a) * r, 0.09, Math.sin(a) * r)); }
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0xd8c27a, dashSize: 1.6, gapSize: 1.8, transparent: true, opacity: 0.6 }));
    l.computeLineDistances(); scene.add(l);
  }
  const SPOKES = [17, 62, 107, 147, 222, 272, 325].map(d => d * Math.PI / 180);
  const BANDS = [[35.2, 44.8], [45.3, 46.7], [95.2, 104.8], [119.3, 121.8]];   // boulevards + trottoirs, piste cyclable, promenade
  function roadHit(x, z, pad = 0) {
    const r = Math.hypot(x, z), a = Math.atan2(z, x);
    if (BANDS.some(([a1, b1]) => r > a1 - pad && r < b1 + pad)) return true;
    return SPOKES.some(s => { const along = r * Math.cos(a - s), lat = Math.abs(r * Math.sin(a - s)); return along > 42 && along < 98 && lat < 3.9 + pad; });
  }
  const lights = [];
  SPOKES.forEach((a, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(56, 5.4), new THREE.MeshStandardMaterial({ color: ASPHALT, roughness: 0.92 }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = -a; m.position.set(Math.cos(a) * 70, 0.05, Math.sin(a) * 70); scene.add(m);
    for (const sd of [-3.3, 3.3]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(52, 1.2), new THREE.MeshStandardMaterial({ color: 0x474c54, roughness: 0.9 })); w.rotation.x = -Math.PI / 2; w.rotation.z = -a; w.position.set(Math.cos(a) * 70 - Math.sin(a) * sd, 0.055, Math.sin(a) * 70 + Math.cos(a) * sd); scene.add(w); }
    // feu tricolore intelligent au croisement avec le périphérique intérieur
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4), new THREE.MeshStandardMaterial({ color: 0x2a2f36 })); const px = Math.cos(a) * 44.6 + Math.sin(a) * 3.4, pz = Math.sin(a) * 44.6 - Math.cos(a) * 3.4;
    pole.position.set(px, 2, pz); scene.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), new THREE.MeshBasicMaterial({ color: 0x35e08a })); bulb.position.set(px, 4.2, pz); scene.add(bulb);
    lights.push({ bulb, ph: i * 1.7 });
  });

  /* ---------- Lampadaires (et leur halo au sol) ---------- */
  {
    const pts = [];
    const step = lite ? 2 : 1;
    for (const [r, n] of [[44.6, 34], [35.4, 30], [95.4, 70], [104.6, 76]]) for (let i = 0; i < n; i += step) { const a = i / n * Math.PI * 2; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    SPOKES.forEach(a => { for (let u = 50; u < 96; u += 9 * step) for (const s of [-3.85, 3.85]) pts.push([Math.cos(a) * u - Math.sin(a) * s, Math.sin(a) * u + Math.cos(a) * s]); });
    const ok = pts.filter(([x, z]) => Z.every(q => Math.hypot(x - q.x, z - q.z) > q.r + 1));
    const n = ok.length, M = new THREE.Matrix4(), Q = new THREE.Quaternion(), one = V(1, 1, 1);
    const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.1, 4.4, 5).translate(0, 2.2, 0), new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.6, metalness: 0.5 }), n);
    const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.26, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }), n);
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,190,110,0.9)'); gr.addColorStop(0.5, 'rgba(255,170,90,0.25)'); gr.addColorStop(1, 'rgba(255,160,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const pool = new THREE.InstancedMesh(new THREE.PlaneGeometry(9, 9).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.28 }), n);
    ok.forEach(([x, z], i) => {
      M.compose(V(x, 0, z), Q, one); poles.setMatrixAt(i, M);
      M.compose(V(x, 4.45, z), Q, one); heads.setMatrixAt(i, M);
      M.compose(V(x, 0.11, z), Q, one); pool.setMatrixAt(i, M);
    });
    scene.add(poles, heads, pool);
  }

  /* ---------- Bâtiments de remplissage : façades réalistes, retraits, feux d'obstacle sur les toits ---------- */
  const away = (x, z, pad) => Z.every(zz => Math.hypot(x - zz.x, z - zz.z) > zz.r + pad);
  const occ = [];                                            // emprises au sol déjà prises (x, z, rayon)
  const vacant = (x, z, r) => occ.every(o => Math.hypot(x - o[0], z - o[1]) > r + o[2]);
  const beacons = [];
  {
    const N = lite ? 170 : 290, geo = new THREE.BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    const palette = [0x8a8f96, 0x6f757d, 0x9c9488, 0x5d6670, 0x7d8a96, 0xa8a196, 0x4f5a66];
    const mats = palette.map((c, i) => facadeMat(c, { lit: 0.26 + (i % 3) * 0.07, gain: 1.5, rough: 0.8 }));
    const groups = mats.map(() => []);
    let k = 0, tries = 0;
    while (k < N && tries++ < 20000) {
      const a = R() * Math.PI * 2, r = 22 + R() * 98, x = Math.cos(a) * r, z = Math.sin(a) * r;
      const w = 3 + R() * 4, d = 3 + R() * 4, fr = 0.5 * Math.hypot(w, d);
      // trottoirs, piste cyclable, avenues, front de mer : rien ne déborde sur la chaussée
      if (Math.abs(r - 40) < 5 + fr || Math.abs(r - 100) < 5 + fr || Math.abs(r - 46) < 1 + fr || r > 118.5 - fr) continue;
      if (SPOKES.some(s => r > 36 - fr && r < 104 + fr && Math.cos(a - s) > 0 && Math.abs(Math.sin(a - s)) * r < 5.6 + fr)) continue;
      if (!away(x, z, fr + 1) || !vacant(x, z, fr + 0.7)) continue;
      let h = 3 + Math.pow(R(), 2.2) * 30 * (1.2 - r / 140);
      // couloir de vue : entre un quartier et la côte (là où se place la caméra), seulement des immeubles bas
      if (Z.some(q => { const qa = Math.atan2(q.z, q.x), qr = Math.hypot(q.x, q.z); let d = Math.abs(a - qa); d = Math.min(d, 2 * Math.PI - d); return qr > 5 && r > qr && d < 0.5; })) h = Math.min(h, 7);
      const gi = Math.floor(R() * mats.length), rot = -a;
      occ.push([x, z, fr]);
      groups[gi].push([x, 0, z, w, h, d, rot]);
      if (h > 15) {                                          // retrait au sommet des tours
        const h2 = h * (0.2 + R() * 0.25); groups[gi].push([x, h, z, w * 0.7, h2, d * 0.7, rot]);
        beacons.push(V(x, h + h2 + 0.3, z));
      }
      k++;
    }
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = V(1, 1, 1), P = V(0, 0, 0);
    groups.forEach((list, gi) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, mats[gi], list.length);
      list.forEach(([x, y, z, w, h, d, rot], i) => { Q.setFromAxisAngle(V(0, 1, 0), rot); S.set(w, h, d); P.set(x, y, z); M.compose(P, Q, S); im.setMatrixAt(i, M); });
      scene.add(im);
    });
  }
  const beaconMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2a1f }), Math.max(1, beacons.length));
  { const M = new THREE.Matrix4(); beacons.forEach((p, i) => { M.makeTranslation(p.x, p.y, p.z); beaconMesh.setMatrixAt(i, M); }); beaconMesh.count = beacons.length; scene.add(beaconMesh); }

  /* ---------- Marquages : passages piétons et lignes des avenues ---------- */
  {
    const mats = new THREE.MeshStandardMaterial({ color: 0xd9dcdf, roughness: 0.8 });
    const stripes = [], dashes = [];
    SPOKES.forEach(a => {
      const ca = Math.cos(a), sa = Math.sin(a);
      for (const r0 of [47.6, 94.4]) for (let l = -2.25; l <= 2.26; l += 0.75) stripes.push([ca * r0 - sa * l, sa * r0 + ca * l, a]);
      for (let r0 = 50; r0 < 93; r0 += 2.6) dashes.push([ca * r0, sa * r0, a]);
    });
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion();
    const zs = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 0.38).rotateX(-Math.PI / 2), mats, stripes.length);
    stripes.forEach(([x, z, a], i) => { Q.setFromAxisAngle(V(0, 1, 0), -a); M.compose(V(x, 0.075, z), Q, V(1, 1, 1)); zs.setMatrixAt(i, M); });
    const ds = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.2, 0.12).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd8c27a, roughness: 0.8 }), dashes.length);
    dashes.forEach(([x, z, a], i) => { Q.setFromAxisAngle(V(0, 1, 0), -a); M.compose(V(x, 0.075, z), Q, V(1, 1, 1)); ds.setMatrixAt(i, M); });
    scene.add(zs, ds);
  }

  /* ---------- Modèles des véhicules et des passants (couleurs par sommet, une seule géométrie par modèle) ---------- */
  function model(parts) {
    return mergeGeometries(parts.map(([g, c, x = 0, y = 0, z = 0]) => {
      g = g.toNonIndexed(); g.translate(x, y, z);
      const n = g.attributes.position.count, a = new Float32Array(n * 3), col = new THREE.Color(c);
      for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
      g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
    }));
  }
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const wheel = r => new THREE.CylinderGeometry(r, r, 0.14, 12).rotateZ(Math.PI / 2);
  const GLASS = 0x141a22, TYRE = 0x0a0a0a;
  const carGeo = model([
    [B(0.96, 0.34, 2.1), 0xffffff, 0, 0.36, 0],                 // caisse (couleur de la voiture)
    [B(0.86, 0.3, 1.05), GLASS, 0, 0.67, -0.12],                // vitres
    [B(0.8, 0.05, 0.92), 0xffffff, 0, 0.84, -0.12],             // toit
    [wheel(0.19), TYRE, -0.46, 0.19, 0.68], [wheel(0.19), TYRE, 0.46, 0.19, 0.68],
    [wheel(0.19), TYRE, -0.46, 0.19, -0.66], [wheel(0.19), TYRE, 0.46, 0.19, -0.66]]);
  const lampPair = model([[B(0.24, 0.09, 0.04), 0xffffff, -0.3, 0, 0], [B(0.24, 0.09, 0.04), 0xffffff, 0.3, 0, 0]]);
  const busGeo = model([
    [B(1.25, 1.25, 5), 0xf1f4f2, 0, 0.88, 0],
    [B(1.27, 0.42, 4.5), GLASS, 0, 1.15, 0.1], [B(1.1, 0.5, 0.04), GLASS, 0, 1.1, 2.51],
    [B(1.27, 0.1, 5.02), 0x1aa37a, 0, 0.62, 0], [B(0.9, 0.12, 2.6), 0x9aa3a8, 0, 1.56, -0.4],
    [wheel(0.27), TYRE, -0.6, 0.27, 1.7], [wheel(0.27), TYRE, 0.6, 0.27, 1.7], [wheel(0.27), TYRE, -0.6, 0.27, -1.7], [wheel(0.27), TYRE, 0.6, 0.27, -1.7]]);
  const bikeGeo = model([
    [new THREE.TorusGeometry(0.2, 0.025, 6, 16).rotateY(Math.PI / 2), TYRE, 0, 0.22, 0.34], [new THREE.TorusGeometry(0.2, 0.025, 6, 16).rotateY(Math.PI / 2), TYRE, 0, 0.22, -0.34],
    [B(0.05, 0.05, 0.7), 0x30363d, 0, 0.36, 0],
    [B(0.16, 0.32, 0.12), 0x262b33, 0, 0.52, -0.05], [B(0.26, 0.32, 0.16), 0xffffff, 0, 0.8, 0.02], [new THREE.SphereGeometry(0.1, 8, 6), 0xd9a77f, 0, 1.03, 0.06]]);
  const vehMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0.5, envMapIntensity: 1, side: THREE.DoubleSide });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfff1d0 }), tailMat = new THREE.MeshBasicMaterial({ color: 0xff2418 });

  /* ---------- Circulation : files sans chevauchement, vitesse constante par voie ---------- */
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _one = V(1, 1, 1), _s = V(1, 1, 1), _p = V(0, 0, 0), _up = V(0, 1, 0);
  // une voie = un chemin + une vitesse ; les véhicules d'une voie sont espacés régulièrement
  function onRing(r, a, dir) { return [Math.cos(a) * r, Math.sin(a) * r, -Math.sin(a) * dir, Math.cos(a) * dir]; }
  function onSpoke(s, u, off, dir) { const ca = Math.cos(s), sa = Math.sin(s), r = 44 + u * 52; return [ca * r - sa * off, sa * r + ca * off, ca * dir, sa * dir]; }
  const cars = [];
  {
    const k = lite ? 0.5 : 1;
    for (const [base, n, v] of [[40, 10, 7], [100, 22, 9]]) for (const dir of [1, -1]) {
      const r = base - dir * 0.85, m = Math.max(3, Math.round(n * k));
      for (let i = 0; i < m; i++) cars.push({ r, a: (i + R() * 0.3) / m * Math.PI * 2, w: dir * v / r, dir });
    }
    SPOKES.forEach(s => { for (const dir of [1, -1]) { const m = Math.max(2, Math.round(5 * k)); for (let i = 0; i < m; i++) cars.push({ s, u: (i + R() * 0.3) / m, du: dir * 6 / 52, off: dir * 1.35, dir }); } });
  }
  const NC = cars.length;
  const carMesh = new THREE.InstancedMesh(carGeo, vehMat, NC), carHead = new THREE.InstancedMesh(lampPair, headMat, NC), carTail = new THREE.InstancedMesh(lampPair, tailMat, NC);
  {
    const cols = [0xf2f2f2, 0x1c1c1c, 0x8a9099, 0x9b1b1b, 0x1f3f7a, 0xd8d2c4, 0x3a3f45, 0x2f6b4f, 0xc9c9c9, 0x5a1a1a];
    const col = new THREE.Color(); for (let i = 0; i < NC; i++) carMesh.setColorAt(i, col.setHex(cols[Math.floor(R() * cols.length)]));
    scene.add(carMesh, carHead, carTail);
  }
  const buses = [];
  {
    for (const [base, n] of [[40, 2], [100, 3]]) for (const dir of [1, -1]) for (let i = 0; i < n; i++) {
      const g = new THREE.Group(); scene.add(g);
      g.add(new THREE.Mesh(busGeo, vehMat));
      const h = new THREE.Mesh(lampPair, headMat); h.position.set(0, 0.55, 2.52); h.scale.set(1.6, 1, 1); g.add(h);
      const t = new THREE.Mesh(lampPair, tailMat); t.position.set(0, 0.55, -2.52); t.scale.set(1.6, 1, 1); g.add(t);
      const r = base - dir * 2.5; buses.push({ g, r, a: (i + 0.5) / n * Math.PI * 2 + (dir > 0 ? 0 : 0.4), w: dir * 5 / r, dir });
    }
  }
  const bikes = [];
  {
    const m = lite ? 8 : 14;
    for (const dir of [1, -1]) for (let i = 0; i < m; i++) bikes.push({ r: 46 - dir * 0.35, a: (i + R() * 0.4) / m * Math.PI * 2, w: dir * (3 + R() * 0.3) / 46, dir });
  }
  const bikeMesh = new THREE.InstancedMesh(bikeGeo, vehMat, bikes.length);
  { const col = new THREE.Color(); bikes.forEach((b, i) => bikeMesh.setColorAt(i, col.setHSL(R(), 0.6, 0.5))); scene.add(bikeMesh); }

  function put(mesh, i, x, z, fx, fz, y = 0, sc = 1, fwd = 0) {
    _q.setFromAxisAngle(_up, Math.atan2(fx, fz)); _p.set(x + fx * fwd, y, z + fz * fwd); _s.setScalar(sc);
    _m.compose(_p, _q, _s); mesh.setMatrixAt(i, _m);
  }
  function moveTraffic(dt) {
    cars.forEach((c, i) => {
      let P, sc = 1;
      if (c.s == null) { c.a += c.w * dt; P = onRing(c.r, c.a, c.dir); }
      else {
        c.u += c.du * dt; if (c.u > 1) c.u -= 1; if (c.u < 0) c.u += 1;
        P = onSpoke(c.s, c.u, c.off, c.dir); sc = Math.min(1, c.u / 0.05, (1 - c.u) / 0.05);   // entre et sort en douceur aux carrefours
      }
      put(carMesh, i, P[0], P[1], P[2], P[3], 0, sc);
      put(carHead, i, P[0], P[1], P[2], P[3], 0.42 * sc, sc, 1.07 * sc);
      put(carTail, i, P[0], P[1], P[2], P[3], 0.42 * sc, sc, -1.07 * sc);
    });
    carMesh.instanceMatrix.needsUpdate = carHead.instanceMatrix.needsUpdate = carTail.instanceMatrix.needsUpdate = true;
    buses.forEach(b => { b.a += b.w * dt; const P = onRing(b.r, b.a, b.dir); b.g.position.set(P[0], 0, P[1]); b.g.rotation.y = Math.atan2(P[2], P[3]); });
    bikes.forEach((b, i) => { b.a += b.w * dt; const P = onRing(b.r, b.a, b.dir); put(bikeMesh, i, P[0], P[1], P[2], P[3]); });
    bikeMesh.instanceMatrix.needsUpdate = true;
  }

  /* ---------- Passants : trottoirs, avenues, place centrale, promenade du front de mer ---------- */
  const people = [];
  {
    const k = lite ? 0.45 : 1, add = (n, f) => { for (let i = 0; i < Math.round(n * k); i++) people.push(f(i, Math.round(n * k))); };
    const v = () => 0.45 + R() * 0.35;
    for (const [r, n] of [[35.9, 26], [44.1, 30], [95.9, 46], [104.1, 50]]) add(n, () => { const dir = R() < 0.5 ? 1 : -1; return { t: 'ring', r: r + (R() - 0.5) * 0.5, a: R() * 6.283, w: dir * v() / r, dir }; });
    SPOKES.forEach(s => { for (const side of [-3.1, 3.1]) add(6, () => ({ t: 'spoke', s, off: side + (R() - 0.5) * 0.4, u: R(), du: (R() < 0.5 ? 1 : -1) * v() / 52 })); });
    add(30, () => ({ t: 'ring', r: 11.5 + R() * 5, a: R() * 6.283, w: (R() < 0.5 ? 1 : -1) * v() / 14, dir: 1, wob: R() * 6 }));
    add(80, () => { const dir = R() < 0.5 ? 1 : -1; return { t: 'ring', r: 120.5 + (R() - 0.5) * 1.4, a: R() * 6.283, w: dir * v() / 120, dir }; });
    people.forEach(p => { if (p.dir == null) p.dir = 1; p.ph = R() * 6.283; });
  }
  const clothesGeo = model([[B(0.3, 0.32, 0.17), 0xffffff, 0, 0.54, 0], [B(0.07, 0.3, 0.08), 0xffffff, -0.19, 0.53, 0], [B(0.07, 0.3, 0.08), 0xffffff, 0.19, 0.53, 0]]);
  const restGeo = model([[B(0.11, 0.38, 0.13), 0x2a2f3a, -0.065, 0.19, 0], [B(0.11, 0.38, 0.13), 0x2a2f3a, 0.065, 0.19, 0], [new THREE.SphereGeometry(0.1, 10, 8), 0xd9a77f, 0, 0.8, 0], [B(0.17, 0.06, 0.17), 0x2b2118, 0, 0.88, -0.01]]);
  const pMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
  const pClothes = new THREE.InstancedMesh(clothesGeo, pMat, people.length), pRest = new THREE.InstancedMesh(restGeo, pMat, people.length);
  {
    const col = new THREE.Color(), shirts = [0x2f5d8a, 0xb23a3a, 0xe0e0e0, 0x3a3a3a, 0xd9a441, 0x4f7a4a, 0x7a4f8a, 0x1f2a44, 0xc96b2c, 0x9fb7c9];
    people.forEach((p, i) => { pClothes.setColorAt(i, col.setHex(shirts[Math.floor(R() * shirts.length)])); const tone = 0.55 + R() * 0.5; pRest.setColorAt(i, col.setRGB(tone, tone, tone)); });
    scene.add(pClothes, pRest);
  }
  function moveTown(dt, t) {
    people.forEach((p, i) => {
      let P;
      if (p.t === 'ring') { p.a += p.w * dt; P = onRing(p.r + (p.wob ? Math.sin(t * 0.3 + p.wob) * 1.5 : 0), p.a, Math.sign(p.w)); }
      else { p.u += p.du * dt; if (p.u > 1 || p.u < 0) { p.du = -p.du; p.u = Math.min(1, Math.max(0, p.u)); } P = onSpoke(p.s, p.u * 0.96 + 0.02, p.off, Math.sign(p.du)); }
      p.ph += dt * 9; const bob = Math.abs(Math.sin(p.ph)) * 0.035;
      put(pClothes, i, P[0], P[1], P[2], P[3], bob); put(pRest, i, P[0], P[1], P[2], P[3], bob);
    });
    pClothes.instanceMatrix.needsUpdate = pRest.instanceMatrix.needsUpdate = true;
  }

  /* ---------- Bateaux autour de l'île : voiliers, bateaux à moteur, pêche, ferries, porte-conteneurs ---------- */
  const SEA = -1.6;
  const boats = [];
  {
    const navR = new THREE.MeshBasicMaterial({ color: 0xff2a1f }), navG = new THREE.MeshBasicMaterial({ color: 0x2dff7a }), navW = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
    const dot = new THREE.SphereGeometry(0.16, 6, 4);
    // sillage : dégradé blanc qui s'efface vers l'arrière
    const wc = document.createElement('canvas'); wc.width = 32; wc.height = 128;
    { const g = wc.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, 'rgba(255,255,255,0.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 128);
      const gx = g.createLinearGradient(0, 0, 32, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, 32, 128); }
    const wakeMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wc), transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
    // coque : caisson + étrave en pointe
    const hull = (w, h, l, c, stripe) => {
      const parts = [[B(w, h, l), c, 0, h / 2, 0], [new THREE.ConeGeometry(w * 0.7071, l * 0.28, 4, 1).rotateY(Math.PI / 4).rotateX(Math.PI / 2).scale(1, h / w, 1), c, 0, h / 2, l / 2 + l * 0.14]];
      if (stripe) parts.push([B(w + 0.02, h * 0.16, l + 0.02), stripe, 0, h * 0.82, 0]);
      parts.push([B(w * 0.92, 0.04, l * 0.96), 0x6b5a48, 0, h + 0.01, 0]);    // pont
      return parts;
    };
    const sail = new THREE.Shape(); sail.moveTo(0, 0); sail.lineTo(0, 5.2); sail.lineTo(2.2, 0.2); sail.lineTo(0, 0);
    const TYPES = {
      sail: () => model([...hull(1.1, 0.5, 4, 0xf2f2ee, 0x1f3f7a), [new THREE.CylinderGeometry(0.05, 0.05, 6, 6), 0xd9d9d9, 0, 3.4, 0.2], [new THREE.ShapeGeometry(sail).rotateY(-Math.PI / 2), 0xf4f1e8, 0, 0.8, 0.25], [B(0.7, 0.35, 1.1), 0xe8e6df, 0, 0.68, -0.9]]),
      motor: () => model([...hull(1.6, 0.6, 5, 0xf4f4f4, 0x23272e), [B(1.25, 0.6, 2), 0xf4f4f4, 0, 0.9, -0.4], [B(1.27, 0.26, 1.8), GLASS, 0, 0.98, -0.3]]),
      fish: () => model([...hull(1.5, 0.7, 4.6, 0x8a2a22, 0xe8e2d0), [B(1.1, 1.0, 1.4), 0xe8e2d0, 0, 1.2, -1.0], [B(1.12, 0.3, 1.2), GLASS, 0, 1.4, -0.95], [new THREE.CylinderGeometry(0.05, 0.05, 3, 6), 0x9a9a9a, 0, 2.1, 0.6]]),
      ferry: () => model([...hull(3.2, 1.3, 13, 0xf1f2f0, 0x1f4f8a), [B(2.8, 1.1, 8.5), 0xf1f2f0, 0, 1.85, -0.6], [B(2.82, 0.4, 8.2), GLASS, 0, 1.95, -0.6], [B(2.2, 0.9, 4.5), 0xf1f2f0, 0, 2.85, -1.6], [B(2.22, 0.32, 4.3), GLASS, 0, 2.9, -1.6], [new THREE.CylinderGeometry(0.35, 0.4, 1.2, 10), 0x1f4f8a, 0, 3.7, -2.6]]),
      cargo: () => {
        const parts = [...hull(5.5, 2.2, 36, 0x2a2e33, 0x8a2a22), [B(5, 4.4, 4), 0xeceae4, 0, 4.4, -15], [B(5.02, 0.5, 3.8), GLASS, 0, 6.1, -15], [B(1.2, 2.2, 1.2), 0xb23a2a, 0, 7.6, -15.5]];
        const cc = [0xb23a2a, 0x1f5f8a, 0xd9a441, 0x3f7a4a, 0x8a8f96, 0xc96b2c, 0x2f3a6a];
        for (let z = -11; z < 15; z += 2.7) for (let x = -1.8; x <= 1.81; x += 1.2) { const hgt = 1 + Math.floor(R() * 3); for (let y = 0; y < hgt; y++) parts.push([B(1.15, 1.05, 2.55), cc[Math.floor(R() * cc.length)], x, 2.75 + y * 1.07, z]); }
        return model(parts);
      }
    };
    const geos = {}; const geo = t => geos[t] || (geos[t] = TYPES[t]());
    // [type, rayon de la route, vitesse, nombre, longueur pour le sillage]
    const fleet = lite
      ? [['sail', 138, 2.2, 2, 4], ['motor', 142, 4.5, 1, 5], ['fish', 215, 2.5, 2, 4.6], ['ferry', 230, 3.2, 1, 13], ['cargo', 320, 3, 1, 36]]
      : [['sail', 136, 2.0, 3, 4], ['sail', 230, 2.4, 2, 4], ['motor', 141, 4.8, 2, 5], ['fish', 212, 2.6, 3, 4.6], ['ferry', 240, 3.4, 2, 13], ['cargo', 315, 3.2, 1, 36], ['cargo', 380, 2.6, 1, 36]];
    fleet.forEach(([type, r0, v, n, len]) => {
      for (let i = 0; i < n; i++) {
        const g = new THREE.Group(); scene.add(g);
        const body = new THREE.Mesh(geo(type), vehMat); g.add(body);
        const sc = type === 'cargo' ? 4 : type === 'ferry' ? 2.6 : 1.4;
        const side = (type === 'cargo' ? 2.8 : type === 'ferry' ? 1.65 : 0.6);
        const L = new THREE.Mesh(dot, navR); L.position.set(-side, sc * 0.5, len * 0.1); L.scale.setScalar(sc / 1.4); g.add(L);
        const Rr = new THREE.Mesh(dot, navG); Rr.position.set(side, sc * 0.5, len * 0.1); Rr.scale.setScalar(sc / 1.4); g.add(Rr);
        const top = new THREE.Mesh(dot, navW); top.position.set(0, type === 'sail' ? 6.4 : type === 'cargo' ? 8.9 : type === 'ferry' ? 4.5 : 2.4, type === 'cargo' ? -15.5 : 0); top.scale.setScalar(sc / 1.4); g.add(top);
        const wake = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), wakeMat); wake.scale.set(len * 0.45, 1, len * 2.6); wake.position.set(0, 0.05, -len * 1.75); g.add(wake);
        const dir = R() < 0.5 ? 1 : -1, r = r0 + (R() - 0.5) * 8;
        boats.push({ g, r, a: R() * Math.PI * 2, w: dir * v / r, dir, ph: R() * 6.28, big: type === 'cargo' || type === 'ferry' });
      }
    });
  }
  function moveBoats(dt, t) {
    boats.forEach(b => {
      b.a += b.w * dt;
      const x = Math.cos(b.a) * b.r, z = Math.sin(b.a) * b.r, fx = -Math.sin(b.a) * b.dir, fz = Math.cos(b.a) * b.dir;
      const k = b.big ? 0.35 : 1;
      b.g.position.set(x, SEA + Math.sin(t * 1.3 + b.ph) * 0.08 * k, z);
      b.g.rotation.set(Math.sin(t * 0.9 + b.ph) * 0.03 * k, Math.atan2(fx, fz), Math.sin(t * 1.1 + b.ph * 2) * 0.05 * k, 'YXZ');
    });
  }

  /* ---------- Arbres ---------- */
  const treePts = [];
  const addTree = (x, z, s = 1) => treePts.push([x, z, s]);

  /* ---------- Quartiers ---------- */
  const rec = {};       // éléments animés
  const D0 = scene.children.length;
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
      const t = new THREE.Mesh(new THREE.BoxGeometry(7, h, 7), glass); t.position.y = 1.3 + h / 2; g.add(t);
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
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.3, 40), new THREE.MeshStandardMaterial({ color: 0x1b4f7a, emissive: 0x2f8fd0, emissiveIntensity: 0.6, roughness: 0.4 })); pad.position.set(x, 0.15, z); scene.add(pad);
    const m = textSprite('M', '#5FD4FF', 7); m.position.set(x, 7, z); scene.add(m);
    const st = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 6), glass); st.position.set(x + 2, 1.5, z - 11); scene.add(st);
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(busGeo, vehMat); b.rotation.y = 0; b.position.set(x - 10 + i * 2.2, 0, z + 6); scene.add(b); }
  }
  // Énergie : nucléaire, solaire, éolien en mer, réseau intelligent
  const turbines = [], steam = {};
  {
    const [x, z] = at('energy');
    const prof = [[9, 0], [7.6, 6], [6.1, 12], [5.6, 16], [6.2, 22], [7, 26]].map(([r, y]) => new THREE.Vector2(r, y));
    const ct = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshStandardMaterial({ color: 0xc9cfd4, roughness: 0.95, side: THREE.DoubleSide }));
    ct.position.set(x + 8, 0, z - 8); scene.add(ct);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), white); dome.position.set(x - 6, 3, z - 12); scene.add(dome);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 3, 24), white); base.position.set(x - 6, 1.5, z - 12); scene.add(base);
    // vapeur
    const n = 70, p = new Float32Array(n * 3), life = new Float32Array(n);
    for (let i = 0; i < n; i++) { life[i] = R(); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const sc = document.createElement('canvas'); sc.width = sc.height = 64; { const g2 = sc.getContext('2d'), gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = gr; g2.fillRect(0, 0, 64, 64); }
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd9e6, size: 9, map: new THREE.CanvasTexture(sc), transparent: true, opacity: 0.22, depthWrite: false }));
    scene.add(pts); Object.assign(steam, { g, p, life, n, x: x + 8, z: z - 8 });
    // champ solaire
    const pg = new THREE.BoxGeometry(3, 0.15, 2), pm = new THREE.MeshStandardMaterial({ color: 0x1e58b8, metalness: 0.6, roughness: 0.25, emissive: 0x0b2f77, emissiveIntensity: 0.8 });
    const im = new THREE.InstancedMesh(pg, pm, 30), M = new THREE.Matrix4(), Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.55, 0, 0));
    for (let i = 0; i < 30; i++) { M.compose(V(x - 10 + (i % 6) * 3.6, 0.65, z + 4 + Math.floor(i / 6) * 3), Q, V(1, 1, 1)); im.setMatrixAt(i, M); }
    scene.add(im);
    // éoliennes en mer
    const tm = new THREE.MeshStandardMaterial({ color: 0xeef4f7, roughness: 0.5 });
    for (let i = 0; i < 8; i++) {
      const tx = 148 + (i % 2) * 18 + R() * 6, tz = -70 + i * 17;
      const g2 = new THREE.Group(); g2.position.set(tx, -1.6, tz); g2.userData.sea = true; scene.add(g2);
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
      const [x, z] = at(id), mid = V((ex + x) / 2, 58, (ez + z) / 2);
      const c = new THREE.QuadraticBezierCurve3(V(ex, 8, ez), mid, V(x, 8, z));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(60)), lineMat(0xffcf73, 0.35)));
      const ps = []; for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), glow(0xffcf73, 3)); scene.add(s); ps.push({ s, u: i / 3 }); }
      grids.push({ c, ps });
    });
  }

  // Déchets → énergie
  {
    const [x, z] = at('waste');
    const pl = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 10), facadeMat(0x5b6168, { lit: 0.35, gain: 1.6 })); pl.position.set(x, 4, z); scene.add(pl);
    const ch = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 24, 16), white); ch.position.set(x + 5, 12, z - 2); scene.add(ch);
    for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.18, 8, 32), holo(MINT, 0.9)); r.rotation.x = Math.PI / 2; r.position.set(x + 5, 15 + i * 3, z - 2); scene.add(r); }
    const bio = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), glow(0x3c9f6a, 0.35)); bio.position.set(x - 9, 0, z + 6); scene.add(bio);
    [0x3a7bd5, 0xf2c94c, 0x2fae6a, 0x8a96a3].forEach((c, i) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 1.4), glow(c, 0.6)); b.position.set(x - 6 + i * 2, 1, z - 9); scene.add(b); });
  }

  // Restaurants robots
  const robots = [];
  {
    const [x, z] = at('food');
    const b = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 9), facadeMat(0x6b5a4a, { lit: 0.8, gain: 2.0 }));
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
    const m = facadeMat(0xb7a48c, { lit: 0.65, gain: 2.2 });
    [[0, -6, 18, 6, 5], [-7, 2, 5, 6, 12], [7, 2, 5, 6, 12]].forEach(([dx, dz, w, h, d]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x + dx, h / 2, z + dz); scene.add(b); });
    const g = new THREE.Group(); g.position.set(x, 0, z + 3); scene.add(g);
    const fig = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 3.2, 6, 14), holo(MINT, 0.45)); fig.position.y = 3.6; g.add(fig);
    fig.add(new THREE.LineSegments(new THREE.WireframeGeometry(fig.geometry), lineMat(MINT, 0.25)));
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10), holo(MINT, 0.5)); head.position.y = 6.6; g.add(head);
    const base = new THREE.Mesh(new THREE.TorusGeometry(2, 0.12, 8, 40), holo(CYAN, 0.9)); base.rotation.x = Math.PI / 2; base.position.y = 0.3; g.add(base);
    rec.holo = g;
    for (let i = 0; i < 7; i++) addTree(x - 8 + i * 2.6 + R() * 0.6, z + 11 + R() * 2, 0.85);
  }

  // Hôpital : croix verte, drone médical
  {
    const [x, z] = at('hospital');
    const b = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 12), facadeMat(0xe3e8eb, { lit: 0.75, gain: 1.8, rough: 0.6 })); b.position.set(x, 6, z); scene.add(b);
    const w = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 12), white); w.position.set(x + 10, 3.5, z + 1); scene.add(w);
    const cm = glow(0x35e08a, 2.2);
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 1.3), cm), c2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 4.2), cm);
    c1.position.set(x, 12.4, z); c2.position.set(x, 12.4, z); scene.add(c1, c2);
    const pad = new THREE.Mesh(new THREE.RingGeometry(2, 2.6, 32), holo(0xffffff, 0.8)); pad.rotation.x = -Math.PI / 2; pad.position.set(x + 10, 7.05, z + 1); scene.add(pad);
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
    { const bl = [[-10, -6], [-4, 6], [6, -10], [-14, 6]]; let n = 0, k = 0;
      while (n < 26 && k++ < 400) { const dx = -17 + R() * 19, dz = -15 + R() * 30; if (Math.hypot(dx, dz) < 18 && bl.every(([bx, bz]) => Math.abs(dx - bx) > 5 || Math.abs(dz - bz) > 4) && Math.hypot(dx - 8, dz - 4) > 3) { addTree(x + dx, z + dz, 0.9 + R() * 0.4); n++; } } }
    const t = edges(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 30, 8), glass), MINT, 0.6); t.position.set(x + 8, 15, z + 4); scene.add(t);
    const orbs = []; for (let i = 0; i < 8; i++) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), glow(0x3cf09a, 2.4)); scene.add(o); orbs.push(o); }
    const dc = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 6), new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.5, metalness: 0.4 })); dc.position.set(x + 12, 2, z - 10); scene.add(dc);
    const lock = new THREE.Group(); lock.position.set(x + 12, 9, z - 10); scene.add(lock);
    const sh = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.32, 10, 24, Math.PI), holo(CYAN, 0.9)); sh.position.y = 1.4; lock.add(sh);
    const bd = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 0.8), holo(CYAN, 0.55)); lock.add(bd);
    rec.sec = { orbs, x: x + 8, z: z + 4, lock };
  }
  const D1 = scene.children.length;

  // arbres supplémentaires dans les espaces libres
  for (let i = 0; i < (lite ? 50 : 110); i++) { const a = R() * Math.PI * 2, r = 25 + R() * 95, x = Math.cos(a) * r, z = Math.sin(a) * r; if (!roadHit(x, z, 1.3) && away(x, z, 2)) addTree(x, z, 0.7 + R() * 0.5); }
  // le long des avenues
  SPOKES.forEach(a => { for (let u = 52; u < 95; u += lite ? 10 : 6) for (const s of [-4.4, 4.4]) addTree(Math.cos(a) * u - Math.sin(a) * s, Math.sin(a) * u + Math.cos(a) * s, 0.55); });
  {
    // tronc + houppier irrégulier, teintes variées (feuillus et quelques conifères)
    for (let i = treePts.length - 1; i >= 0; i--) { const [x, z] = treePts[i], r = Math.hypot(x, z); if (r > 117.5 || !vacant(x, z, 1.3)) treePts.splice(i, 1); }
    const n = treePts.length, M = new THREE.Matrix4(), Q = new THREE.Quaternion(), col = new THREE.Color();
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.24, 1.6, 5).translate(0, 0.8, 0), new THREE.MeshStandardMaterial({ color: 0x4a3a2c, roughness: 1 }), n);
    const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.3, 0).translate(0, 2.6, 0), new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }), n);
    const pines = new THREE.InstancedMesh(new THREE.ConeGeometry(1.1, 3.4, 7).translate(0, 3.0, 0), new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }), n);
    let np = 0, nc = 0;
    treePts.forEach(([x, z, s], i) => {
      const sc = s * (0.8 + R() * 0.45);
      Q.setFromEuler(new THREE.Euler((R() - 0.5) * 0.12, R() * 6.28, (R() - 0.5) * 0.12));
      M.compose(V(x, 0, z), Q, V(sc, sc, sc)); trunks.setMatrixAt(i, M);
      if (R() < 0.22) { pines.setMatrixAt(np, M); pines.setColorAt(np++, col.setHSL(0.36 + R() * 0.04, 0.45, 0.13 + R() * 0.05)); }
      else { M.compose(V(x, 0, z), Q, V(sc * (0.9 + R() * 0.3), sc * (0.8 + R() * 0.3), sc * (0.9 + R() * 0.3))); crowns.setMatrixAt(nc, M); crowns.setColorAt(nc++, col.setHSL(0.24 + R() * 0.1, 0.42, 0.14 + R() * 0.08)); }
    });
    crowns.count = nc; pines.count = np;
    scene.add(trunks, crowns, pines);
  }

  /* ---------- Contrôle du plan : rien de solide sur une route, rien qui dépasse de son îlot ---------- */
  function audit() {
    const out = [], box = new THREE.Box3();
    for (let i = D0; i < D1; i++) {
      const o = scene.children[i];
      if (o.isSprite || o.isLine || o.isPoints || o.userData.sea) continue;
      box.setFromObject(o);
      if (box.isEmpty() || box.min.y > 2.5 || box.max.y - box.min.y < 0.5) continue;      // en l'air ou posé à plat
      const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2, pts = [];
      for (let u = 0; u <= 4; u++) for (let v = 0; v <= 4; v++) pts.push([box.min.x + (box.max.x - box.min.x) * u / 4, box.min.z + (box.max.z - box.min.z) * v / 4]);
      const zz = Z.slice().sort((a, b) => Math.hypot(cx - a.x, cz - a.z) - Math.hypot(cx - b.x, cz - b.z))[0];
      const road = pts.filter(([x, z]) => roadHit(x, z)).length, outside = pts.filter(([x, z]) => Math.hypot(x - zz.x, z - zz.z) > zz.r + 0.5).length;
      if (road || outside) out.push({ zone: zz.id, at: [Math.round(cx), Math.round(cz)], size: [Math.round(box.max.x - box.min.x), Math.round(box.max.z - box.min.z)], road, outside });
    }
    treePts.forEach(([x, z]) => { if (roadHit(x, z, 0.3)) out.push({ tree: [Math.round(x), Math.round(z)] }); });
    return out;
  }

  /* ---------- Zones : anneaux, colonne de lumière, étiquettes, cibles de clic ---------- */
  const ZR = {}, picks = [];
  Z.forEach(z => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(z.r - 0.5, z.r, 96), holo(MINT, 0.14)); ring.rotation.x = -Math.PI / 2; ring.position.set(z.x, 0.14, z.z); scene.add(ring);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(z.r, z.r, 36, 64, 1, true), holo(MINT, 0.03)); pillar.position.set(z.x, 18, z.z); pillar.visible = false; scene.add(pillar);
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(z.r, z.r, 40, 24), new THREE.MeshBasicMaterial({ visible: false })); pick.position.set(z.x, 20, z.z); pick.userData.zone = z.id; scene.add(pick); picks.push(pick);
    const tag = document.createElement('div'); tag.className = 'c3-tag'; tag.innerHTML = `<b>${z.name}</b><span></span>`; labels.appendChild(tag);
    ZR[z.id] = { ring, pillar, tag, cnt: tag.querySelector('span'), pos: V(z.x, z.id === 'core' ? 74 : 14, z.z), hw: (z.name.length * 8.5 + 24) / 2 };
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
  const USERS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  function setCounts(c) { Z.forEach(z => { const n = (c && c[z.id]) || 0; ZR[z.id].cnt.innerHTML = n ? `${USERS} ${n}` : ''; }); }

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
  function setActive(id) { Z.forEach(z => { const a = z.id === id; ZR[z.id].pillar.visible = a; ZR[z.id].ring.material.opacity = a ? 0.7 : 0.14; ZR[z.id].tag.classList.toggle('on', a); }); }
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
    radar.scale.setScalar(2 + ((t % 6) / 6) * 128); radar.material.opacity = 0.18 * (1 - (t % 6) / 6);
    seaMat.normalMap.offset.set(t * 0.004, t * 0.0025);
    beaconMesh.material.color.setScalar(0).setRGB(Math.sin(t * 3) > 0.2 ? 1 : 0.25, 0.08, 0.05);
    moveTraffic(dt); moveTown(dt, t); moveBoats(dt, t);
    rec.core.rings.forEach((r, i) => { r.rotation.z += dt * (0.4 + i * 0.25) * (i % 2 ? -1 : 1); r.rotation.x = Math.PI / 2 + Math.sin(t * 0.7 + i) * 0.12; });
    rec.towers.forEach((o, i) => {
      const a = Math.min(1, shake / 2.6);
      o.g.rotation.z = Math.sin(t * 13 + i) * 0.035 * a; o.g.rotation.x = Math.cos(t * 11 + i) * 0.025 * a;
      o.abs.forEach(c => { c.material.emissiveIntensity = 0.5 + a * 3; });
    });
    lights.forEach(o => { const g = Math.sin(t * 0.8 + o.ph) > 0; o.bulb.material.color.setHex(g ? 0x35e08a : 0xff5a4f); });
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
    Z.forEach(z => { const p = ZR[z.id].pillar; if (p.visible) p.material.opacity = 0.014 + Math.sin(t * 2.2) * 0.008; });
    if (r15.visible) { const s = Math.min(1, r15.scale.x + dt * 0.8); r15.scale.setScalar(s); }
    for (const o of players.values()) {
      o.m.position.x += (o.x - o.m.position.x) * Math.min(1, dt * 2.5); o.m.position.z += (o.z - o.m.position.z) * Math.min(1, dt * 2.5);
      o.m.position.y = 10 + Math.sin(t * 2 + o.ph) * 0.8; o.m.rotation.y += dt * 1.5;
    }

    if (bloomOn && composer) composer.render(); else renderer.render(scene, camera);
    placeLabels();
  }
  // étiquette cachée si elle sort de l'écran (même en partie) ou passe sous le panneau de texte (mask)
  let mask = null;
  function place(div, p, dy = 0, hw = 0) {
    tmp.copy(p); tmp.y += dy; tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H;
    const off = tmp.z > 1 || x - hw < 8 || x + hw > W - 8 || y < 36 || y > H - 4
      || (mask && x + hw > mask.l - 16 && x - hw < mask.r + 16 && y > mask.t - 16 && y - 40 < mask.b + 16);
    if (off) { div.style.display = 'none'; return; }
    div.style.display = '';
    div.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`;
  }
  function placeLabels() {
    // présentateur sur un quartier : seule son étiquette reste, les autres distrairaient
    const focus = presenter && !free && zone(current) ? current : null;
    Z.forEach(z => { const r = ZR[z.id]; if (focus && z.id !== focus) r.tag.style.display = 'none'; else place(r.tag, r.pos, 0, r.hw); });
    for (const o of players.values()) if (!o.lab.hidden) place(o.lab, o.m.position, 2.2, 30);
  }
  loop();

  return {
    fly: flyTo,
    audit,
    // vue libre (caméra en p, regarde q) : sert aux plans rapprochés
    look(p, q, dur = 1.5) { current = '_look'; fly = { p0: camera.position.clone(), q0: target.clone(), p1: V(p[0], p[1], p[2]), q1: V(q[0], q[1], q[2]), s: performance.now(), d: dur }; },
    setPanel(f) { panelT = f; },
    setMask(r) { mask = r ? { l: r.left, r: r.right, t: r.top, b: r.bottom } : null; },
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
