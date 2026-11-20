/**
 * CHARIS – premium 3D gift scene (Three.js).
 * Procedural satin ribbons, hinged lid, tissue paper, golden dust and a camera dive.
 * Everything is driven by the plain `state` object, so GSAP (or scrubbing/skip) controls it.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface GiftSceneOptions {
  low?: boolean;
  /** called when the visitor pulls the ribbon tail far enough */
  onPullOpen?: () => void;
}

export interface GiftState {
  antic: number; knot: number; loops: number; rel: number;
  lidLift: number; lid: number; glow: number; tissue: number;
  dust: number; dive: number; flood: number;
}

export interface GiftScene {
  state: GiftState;
  /** 3D part of the opening sequence (≈6.7s). Locks drag/pull input. */
  createTimeline(): gsap.core.Timeline;
  resize(): void;
  dispose(): void;
}

type V3 = THREE.Vector3;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/* ───────────────────────── procedural textures ───────────────────────── */

function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d')!, size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** subtle embossed diamond lattice + fine grain, used as bump map on the packaging */
function patternTexture() {
  const t = canvasTex(256, (g, s) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);
    g.strokeStyle = '#a2a2a2'; g.lineWidth = 2.5;
    for (let k = -s; k <= s * 2; k += 64) {
      g.beginPath(); g.moveTo(k, 0); g.lineTo(k + s, s); g.stroke();
      g.beginPath(); g.moveTo(k, s); g.lineTo(k + s, 0); g.stroke();
    }
    g.fillStyle = '#b4b4b4';
    for (let x = 0; x < s; x += 64) for (let y = 0; y < s; y += 64) { g.beginPath(); g.arc(x + 32, y + 32, 3.2, 0, 6.3); g.fill(); }
    const img = g.getImageData(0, 0, s, s);
    for (let i = 0; i < img.data.length; i += 4) { const n = (Math.random() - 0.5) * 14; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
    g.putImageData(img, 0, 0);
  }, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  return t;
}

function sealTexture(bump: boolean) {
  return canvasTex(256, (g) => {
    if (bump) { g.fillStyle = '#707070'; g.fillRect(0, 0, 256, 256); }
    else {
      const gr = g.createRadialGradient(100, 90, 10, 128, 128, 140);
      gr.addColorStop(0, '#f2d28a'); gr.addColorStop(0.6, '#c99a45'); gr.addColorStop(1, '#85602a');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    }
    g.strokeStyle = bump ? '#d8d8d8' : '#f7e2a6'; g.lineWidth = 7;
    g.beginPath(); g.arc(128, 128, 104, 0, 6.3); g.stroke();
    g.lineWidth = 2.5; g.beginPath(); g.arc(128, 128, 90, 0, 6.3); g.stroke();
    g.fillStyle = bump ? '#ffffff' : '#74511a';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 118px "Cormorant Garamond", Georgia, serif'; g.fillText('C', 128, 126);
    g.font = '700 15px Georgia, serif'; g.fillText('C H A R I S', 128, 192);
  }, !bump);
}

const radialTex = (stops: [number, string][]) => canvasTex(128, (g, s) => {
  const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  stops.forEach(([o, c]) => gr.addColorStop(o, c));
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
});

/* ───────────────────────── ribbon strip (3 verts across → crowned satin) ───────────────────────── */

class Strip {
  mesh: THREE.Mesh;
  geo = new THREE.BufferGeometry();
  P: V3[]; W: V3[]; tw: number[];
  n: number;
  width: number;
  private pos: Float32Array;
  constructor(n: number, width: number, mat: THREE.Material) {
    this.n = n; this.width = width;
    this.P = Array.from({ length: n }, () => new THREE.Vector3());
    this.W = Array.from({ length: n }, () => new THREE.Vector3(1, 0, 0));
    this.tw = new Array(n).fill(0);
    this.pos = new Float32Array(n * 9);
    const uv = new Float32Array(n * 6); const idx: number[] = [];
    for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) { uv[(i * 3 + c) * 2] = c / 2; uv[(i * 3 + c) * 2 + 1] = i / (n - 1); }
    for (let i = 0; i < n - 1; i++) for (let c = 0; c < 2; c++) { const a = i * 3 + c; idx.push(a, a + 1, a + 3, a + 1, a + 4, a + 3); }
    const attr = new THREE.BufferAttribute(this.pos, 3); attr.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('position', attr);
    this.geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.geo.setIndex(idx);
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.frustumCulled = false; this.mesh.castShadow = true;
  }
  commit() {
    const { P, W, tw, n, pos, width } = this;
    const T = new THREE.Vector3(), N = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      T.subVectors(P[Math.min(n - 1, i + 1)], P[Math.max(0, i - 1)]).normalize();
      t.copy(W[i]).addScaledVector(T, -W[i].dot(T)).normalize();
      if (tw[i]) t.applyAxisAngle(T, tw[i]);
      N.crossVectors(T, t).normalize();
      const p = P[i], o = i * 9, h = width / 2;
      pos[o] = p.x - t.x * h; pos[o + 1] = p.y - t.y * h; pos[o + 2] = p.z - t.z * h;
      pos[o + 3] = p.x + N.x * 0.009; pos[o + 4] = p.y + N.y * 0.009; pos[o + 5] = p.z + N.z * 0.009;
      pos[o + 6] = p.x + t.x * h; pos[o + 7] = p.y + t.y * h; pos[o + 8] = p.z + t.z * h;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

/** shared "ribbon let go" motion: lift off → drift outward → fall under gravity with sway & twist. Returns twist angle. */
function release(P: V3, N: V3, drift: V3, tau: number, i: number, ph: number, g = 1) {
  if (tau <= 0) return 0;
  P.addScaledVector(N, 0.5 * (1 - Math.exp(-3.2 * tau)));
  P.addScaledVector(drift, 1.05 * (1 - Math.exp(-1.7 * tau)));
  const tf = Math.max(0, tau - 0.1);
  P.y -= 2.4 * g * tf * tf;
  const a = sm(tau / 0.7);
  P.x += Math.sin(tau * 2.7 + i * 0.13 + ph) * 0.16 * a;
  P.z += Math.cos(tau * 2.1 + i * 0.09 + ph * 1.3) * 0.13 * a;
  return Math.sin(i * 0.17 + ph) * tau * 1.3 + tau * 0.5;
}

/** ribbon path over the lid and down the sides, in a plane (u = horizontal axis, y). */
function wrapPath(axis: 'x' | 'z', off: number, n: number) {
  const bu = 1.016 + off, lu = 1.076 + off, lt = 1.036 + off; // sit just above the surface (avoids z-fighting)
  const raw: [number, number][] = [[bu, -0.69], [bu, 0.545], [lu, 0.548], [lu, lt - 0.035], [lu - 0.035, lt],
    [-lu + 0.035, lt], [-lu, lt - 0.035], [-lu, 0.548], [-bu, 0.545], [-bu, -0.69]];
  let pts: [number, number][] = [];
  for (let i = 0; i < raw.length - 1; i++) {
    const [a, b] = [raw[i], raw[i + 1]]; const len = Math.hypot(b[0] - a[0], b[1] - a[1]); const k = Math.max(1, Math.ceil(len / 0.1));
    for (let j = 0; j < k; j++) pts.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
  }
  pts.push(raw[raw.length - 1]);
  const sm1: [number, number][] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    sm1.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  sm1.push(pts[pts.length - 1]); pts = sm1;
  const acc = [0]; for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = acc[acc.length - 1];
  const out: { p: V3; N: V3; u: number; y: number }[] = [];
  const t2: [number, number][] = [];
  for (let r = 0, k = 0; r < n; r++) {
    const s = total * r / (n - 1); while (k < acc.length - 2 && acc[k + 1] < s) k++;
    const f = (s - acc[k]) / Math.max(1e-6, acc[k + 1] - acc[k]);
    t2.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]);
  }
  for (let r = 0; r < n; r++) {
    const a = t2[Math.max(0, r - 1)], b = t2[Math.min(n - 1, r + 1)];
    let tu = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tu, ty) || 1; tu /= l; ty /= l;
    const nu = ty, ny = -tu, [u, y] = t2[r];
    out.push(axis === 'z' ? { p: new THREE.Vector3(0, y, u), N: new THREE.Vector3(0, ny, nu), u, y }
      : { p: new THREE.Vector3(u, y, 0), N: new THREE.Vector3(nu, ny, 0), u, y });
  }
  let mid = 0, best = 9; out.forEach((o, i) => { if (o.y > 0.9 && Math.abs(o.u) < best) { best = Math.abs(o.u); mid = i; } });
  const step = total / (n - 1);
  return { rows: out, mid, d: out.map((_, i) => Math.abs(i - mid) * step), W: axis === 'z' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1) };
}

/* ───────────────────────── shaders ───────────────────────── */

const PT_VERT = `attribute float aSize; attribute float aAlpha; uniform float uScale; varying float vA;
void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=max(1.0,aSize*uScale/(-mv.z)); vA=aAlpha; }`;
const PT_FRAG = `uniform float uBokeh; uniform vec3 uCol; varying float vA;
void main(){ vec2 c=gl_PointCoord-.5; float d=length(c); if(d>.5) discard;
 float a = uBokeh>.5 ? (0.3+0.7*smoothstep(.28,.47,d))*smoothstep(.5,.43,d) : pow(smoothstep(.5,0.,d),2.0)*1.3;
 gl_FragColor=vec4(uCol,a*vA); }`;

/* ───────────────────────── scene ───────────────────────── */

export function createGiftScene(canvas: HTMLCanvasElement, opts: GiftSceneOptions = {}): GiftScene {
  const low = !!opts.low;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = !low; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex; scene.environmentIntensity = 0.5;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);

  const S: GiftState = { antic: 0, knot: 0, loops: 0, rel: 0, lidLift: 0, lid: 0, glow: 0, tissue: 0, dust: 0, dive: 0, flood: 0 };
  const textures: THREE.Texture[] = [envTex];
  const tex = <T extends THREE.Texture>(t: T) => { textures.push(t); return t; };

  /* materials */
  const pat = tex(patternTexture());
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x100f0e, roughness: 0.56, metalness: 0.08, bumpMap: pat, bumpScale: 0.9 });
  const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xd9a64a, metalness: 1, roughness: 0.33, clearcoat: 0.25, clearcoatRoughness: 0.4, envMapIntensity: 1.6, side: THREE.DoubleSide });

  /* ── box ── */
  const root = new THREE.Group(); scene.add(root);
  const body = new THREE.Mesh(new RoundedBoxGeometry(2, 1.32, 2, 4, 0.045), blackMat);
  body.position.y = -0.04; body.castShadow = body.receiveShadow = true; root.add(body);

  const lidGroup = new THREE.Group(); lidGroup.position.set(0, 0.54, -1.06); root.add(lidGroup);
  const lidMesh = new THREE.Mesh(new RoundedBoxGeometry(2.12, 0.48, 2.12, 4, 0.04), blackMat);
  lidMesh.position.set(0, 0.24, 1.06); lidMesh.castShadow = lidMesh.receiveShadow = true; lidGroup.add(lidMesh);

  // wax-style gold seal with GiftCharis monogram, part of the lid
  const sealTop = new THREE.MeshStandardMaterial({ map: tex(sealTexture(false)), bumpMap: tex(sealTexture(true)), bumpScale: 2.2, metalness: 0.75, roughness: 0.38, envMapIntensity: 1.2 });
  const sealSide = new THREE.MeshStandardMaterial({ color: 0xb98a3a, metalness: 0.8, roughness: 0.4 });
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.215, 0.045, 48), [sealSide, sealTop, sealSide]);
  seal.position.set(0, 0.48 + 0.02, 1.06 + 0.6); seal.rotation.y = Math.PI / 2; seal.castShadow = true; lidGroup.add(seal);
  const sealRim = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.022, 12, 48), sealSide);
  sealRim.rotation.x = Math.PI / 2; sealRim.position.copy(seal.position); sealRim.position.y += 0.012; lidGroup.add(sealRim);

  /* ── ribbons ── */
  const NW = low ? 70 : 110;
  const wraps = [wrapPath('z', 0, NW), wrapPath('x', 0.006, NW)];
  const wrapStrips = wraps.map(() => new Strip(NW, 0.3, goldMat));
  wrapStrips.forEach((s) => root.add(s.mesh));

  const NT = 48;
  const tailCurves = [
    [[0.05, 1.05, 0.03], [0.45, 1.04, 0.22], [0.85, 1.04, 0.42], [1.07, 1.03, 0.55], [1.16, 0.95, 0.62], [1.2, 0.7, 0.7], [1.19, 0.35, 0.78], [1.17, 0.05, 0.82], [1.18, -0.2, 0.84]],
    [[-0.05, 1.05, 0.03], [-0.2, 1.04, 0.45], [-0.35, 1.04, 0.85], [-0.42, 1.03, 1.06], [-0.46, 0.95, 1.16], [-0.5, 0.7, 1.22], [-0.48, 0.35, 1.26], [-0.46, 0.05, 1.3]],
  ].map((w) => new THREE.CatmullRomCurve3(w.map(([x, y, z]) => new THREE.Vector3(x, y, z))).getSpacedPoints(NT - 1));
  const tails = tailCurves.map((pts) => {
    const s = new Strip(NT, 0.27, goldMat);
    const W = pts.map((p: THREE.Vector3, i: number) => {
      const T = pts[Math.min(NT - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize();
      const out = new THREE.Vector3(p.x, 0, p.z).normalize();
      const Nf = new THREE.Vector3(0, 1, 0).multiplyScalar(1 - Math.abs(T.y)).addScaledVector(out, Math.abs(T.y)).normalize();
      return new THREE.Vector3().crossVectors(Nf, T).normalize();
    });
    const lift = pts.map((p: THREE.Vector3) => new THREE.Vector3(p.x, 0.6, p.z).normalize());
    const dist = pts.map((_: THREE.Vector3, i: number) => (i / (NT - 1)) * 2.3);
    root.add(s.mesh);
    return { s, pts, W, lift, dist };
  });

  const loopDefs = [
    { yaw: 0.25, L: 0.82, H: 0.36, lean: 0.95, ph: 0.3 }, { yaw: Math.PI - 0.25, L: 0.82, H: 0.36, lean: 0.95, ph: 1.7 },
    { yaw: -0.6, L: 0.6, H: 0.26, lean: 0.55, ph: 2.4 }, { yaw: Math.PI + 0.6, L: 0.6, H: 0.26, lean: 0.55, ph: 3.5 },
  ];
  const NL = 44;
  const loops = loopDefs.map((d) => { const s = new Strip(NL, 0.3, goldMat); root.add(s.mesh); return { ...d, s }; });
  const knot = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), goldMat);
  knot.castShadow = true; root.add(knot);

  /* ── interior: tissue, light leak, rays, halo, shadow ── */
  const tissueMats = [0xe9d3a6, 0xdcb468, 0xeedfba, 0xcfa24e].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, side: THREE.DoubleSide, emissive: 0xc98a22, emissiveIntensity: 0 }));
  const SEG = low ? 14 : 22;
  const sheets = tissueMats.map((m, k) => {
    const sz = 1.84 - k * 0.07;
    const g = new THREE.PlaneGeometry(sz, sz, SEG, SEG); g.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(g, m); mesh.position.y = 0.655 + k * 0.012; root.add(mesh);
    return { mesh, base: Float32Array.from(g.attributes.position.array as ArrayLike<number>), k };
  });

  const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.06, 2.06).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uGlow: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float uGlow; varying vec2 vUv; void main(){ float r=length(vUv-.5)*2.; float a=(.4+.6*smoothstep(.2,1.,r))*(1.-smoothstep(.98,1.3,r)); gl_FragColor=vec4(1.,.72,.3,a*uGlow); }',
  }));
  glowPlane.position.y = 0.64; root.add(glowPlane);

  const rays = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 0.85, 3.6, 40, 1, true), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: { uGlow: { value: 0 }, uT: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float uGlow,uT; varying vec2 vUv; void main(){ float band=.65+.35*sin(vUv.x*62.8+uT*.6)*sin(vUv.x*25.1-uT*.35); float a=pow(1.-vUv.y,1.7)*.3*band; gl_FragColor=vec4(1.,.78,.4,a*uGlow); }',
  }));
  rays.position.y = 0.7 + 1.8; root.add(rays);

  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(radialTex([[0, 'rgba(255,214,130,.9)'], [0.4, 'rgba(240,170,70,.35)'], [1, 'rgba(240,170,70,0)']])), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.set(0, 1.0, -0.5); halo.scale.setScalar(7); scene.add(halo);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 7).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: tex(radialTex([[0, 'rgba(0,0,0,.85)'], [0.45, 'rgba(0,0,0,.45)'], [1, 'rgba(0,0,0,0)']])), transparent: true, depthWrite: false }));
  floor.position.y = -0.715; scene.add(floor);
  if (!low) {
    const catcher = new THREE.Mesh(new THREE.PlaneGeometry(14, 14).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.45 }));
    catcher.position.y = -0.71; catcher.receiveShadow = true; scene.add(catcher);
  }

  /* ── lights ── */
  const key = new THREE.DirectionalLight(0xffe2b4, 2.6); key.position.set(-4, 6, 5);
  key.castShadow = !low; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 5; key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 }); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc873, 2.2); rim.position.set(5, 3, -5); scene.add(rim);
  const inner = new THREE.PointLight(0xffb85a, 0, 0, 2); inner.position.set(0, 0.7, 0); root.add(inner);
  scene.add(new THREE.HemisphereLight(0xffeedd, 0x0a0807, 0.25));

  /* ── particles: one pooled Points object (dust trail, box dust, dive streaks) + bokeh ── */
  const NP = low ? 380 : 900;
  const pPos = new Float32Array(NP * 3), pVel = new Float32Array(NP * 3), pLife = new Float32Array(NP), pMax = new Float32Array(NP).fill(1);
  const pSize = new Float32Array(NP), pAlpha = new Float32Array(NP);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1).setUsage(THREE.DynamicDrawUsage));
  pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1).setUsage(THREE.DynamicDrawUsage));
  const ptMat = (bokeh: number, col: number[]) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: PT_VERT, fragmentShader: PT_FRAG,
    uniforms: { uScale: { value: 500 }, uBokeh: { value: bokeh }, uCol: { value: new THREE.Vector3(...col) } },
  });
  const dustMat = ptMat(0, [1, 0.8, 0.42]);
  const dust = new THREE.Points(pGeo, dustMat); dust.frustumCulled = false; scene.add(dust);
  const NB = 26;
  const bPos = new Float32Array(NB * 3), bSize = new Float32Array(NB), bAlpha = new Float32Array(NB), bPh = new Float32Array(NB);
  for (let i = 0; i < NB; i++) { bPos.set([rnd(-10, 10), rnd(-3.5, 5), rnd(-14, -7)], i * 3); bSize[i] = rnd(0.7, 1.9); bPh[i] = rnd(0, 6.3); }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  bGeo.setAttribute('aSize', new THREE.BufferAttribute(bSize, 1));
  bGeo.setAttribute('aAlpha', new THREE.BufferAttribute(bAlpha, 1).setUsage(THREE.DynamicDrawUsage));
  const bokehMat = ptMat(1, [1, 0.72, 0.3]);
  const bokeh = new THREE.Points(bGeo, bokehMat); bokeh.frustumCulled = false; scene.add(bokeh);

  let cursor = 0, accTrail = 0, accBox = 0, accDive = 0;
  const spawn = (x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size: number) => {
    const i = cursor; cursor = (cursor + 1) % NP;
    pPos.set([x, y, z], i * 3); pVel.set([vx, vy, vz], i * 3); pLife[i] = pMax[i] = life; pSize[i] = size;
  };

  /* ── input: drag to look around, pull the ribbon tail to open ── */
  let locked = false, dragging = false, pulling = false, lx = 0, ly = 0, px = 0, py = 0, dragX = 0, dragY = 0;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const bowMeshes: THREE.Object3D[] = [...tails.map((t) => t.s.mesh), ...loops.map((l) => l.s.mesh), knot];
  const onDown = (e: PointerEvent) => {
    if (locked) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    pulling = ray.intersectObjects(bowMeshes, false).length > 0; dragging = !pulling;
    lx = px = e.clientX; ly = py = e.clientY;
    canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing';
  };
  const onMove = (e: PointerEvent) => {
    if (locked) return;
    if (pulling) {
      const dst = Math.hypot(e.clientX - px, e.clientY - py);
      S.knot = clamp(dst / 150) * 0.8;
      if (dst > 130) { pulling = false; opts.onPullOpen?.(); }
    } else if (dragging) {
      dragX = clamp(dragX + (e.clientX - lx) * 0.005, -0.6, 0.6); dragY = clamp(dragY + (e.clientY - ly) * 0.003, -0.22, 0.3);
      lx = e.clientX; ly = e.clientY;
    }
  };
  const onUp = () => {
    dragging = false;
    if (pulling && !locked) gsap.to(S, { knot: 0, duration: 0.5, ease: 'power2.out' });
    pulling = false; canvas.style.cursor = 'grab';
  };
  canvas.style.cursor = 'grab'; canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);

  /* ── per-frame update ── */
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), camPos = new THREE.Vector3(), look = new THREE.Vector3();
  const toCam = new THREE.Vector3(0.55, 0.3, 0.78).normalize();
  const diveCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(1.5, 3.9, 2.6), new THREE.Vector3(0, 3.4, 1.1), new THREE.Vector3(0, 1.7, 0.35), new THREE.Vector3(0, 0.85, 0.08)], false, 'centripetal');
  let aspect = 1;

  function updateRibbons(t: number) {
    // cross ribbons – peel from the knot outwards, then flutter down
    wraps.forEach((w, k) => {
      const s = wrapStrips[k];
      for (let i = 0; i < NW; i++) {
        const row = w.rows[i];
        s.P[i].copy(row.p); s.W[i].copy(w.W);
        s.P[i].addScaledVector(row.N, 0.025 * S.knot * Math.exp(-w.d[i] * 2));
        const sg = row.u >= 0 ? 1 : -1;
        tmp.set(k === 1 ? sg : 0, 0, k === 0 ? sg : 0);
        s.tw[i] = release(s.P[i], row.N, tmp, S.rel - 0.05 - w.d[i] / 2.2, i, k * 2.1, 1);
      }
      s.commit();
    });
    // tails – slide, swing; tail #2 floats across the camera before leaving
    tails.forEach((tl, k) => {
      for (let i = 0; i < NT; i++) {
        const f = i / (NT - 1);
        tl.s.P[i].copy(tl.pts[i]); tl.s.W[i].copy(tl.W[i]);
        tl.s.P[i].addScaledVector(tl.lift[i], 0.07 * S.knot * f);
        tl.s.P[i].y += Math.sin(t * 1.3 + i * 0.18 + k * 2) * 0.007 * f;
        const tau = S.rel - 0.15 - tl.dist[i] / 3.2;
        let fl = 0; if (k === 1 && tau > 0) fl = sm(tau / 1.3) * (1 - sm((tau - 1.9) / 1.1));
        tmp.copy(tl.pts[i]).setY(0).normalize();
        tl.s.tw[i] = release(tl.s.P[i], tl.lift[i], tmp, tau, i, k * 1.9 + 0.8, 1 - 0.85 * fl);
        if (fl > 0) { tl.s.P[i].addScaledVector(toCam, 3.4 * fl); tl.s.P[i].y += 0.9 * fl; }
      }
      tl.s.commit();
    });
    // loops + knot
    const relax = sm(S.loops);
    loops.forEach((lp, k) => {
      const lean = lp.lean + 0.5 * relax + Math.sin(t * 1.2 + k) * 0.012, L = lp.L * (1 + 0.1 * relax), H = lp.H * (1 - 0.12 * relax);
      const yaw = lp.yaw + (k % 2 === 0 ? -1 : 1) * 0.16 * relax * (k < 2 ? 1 : -1) + Math.sin(S.knot * 6 + k) * 0.02 * S.knot;
      const lift = 1.065 + H * 1.1 * Math.cos(lean) + (k > 1 ? 0.05 : 0);
      const tau = S.rel - 0.4 - k * 0.07;
      for (let i = 0; i < NL; i++) {
        const ph = (i / (NL - 1)) * Math.PI * 2;
        const x = L * (1 - Math.cos(ph)) / 2, y = H * 1.35 * Math.sin(ph) * Math.sin(ph / 2);
        const P = lp.s.P[i].set(x, y * Math.cos(lean), y * Math.sin(lean));
        lp.s.W[i].set(0, -Math.sin(lean), Math.cos(lean)).applyAxisAngle(tmp2.set(0, 1, 0), yaw);
        P.applyAxisAngle(tmp2.set(0, 1, 0), yaw); P.y += lift;
        lp.s.tw[i] = 0.5 * Math.sin(ph);
        tmp.set(Math.cos(yaw), 0, -Math.sin(yaw));
        lp.s.tw[i] += release(P, tmp2.set(0, 1, 0), tmp, tau, i, lp.ph, 1);
      }
      lp.s.commit();
    });
    const kt = S.rel - 0.3;
    knot.position.set(0, 1.07, 0); knot.scale.set(0.2, 0.13 * (1 - 0.3 * S.knot), 0.17);
    if (kt > 0) { tmp.set(0.3, 0, 0.2); release(knot.position, tmp2.set(0, 1, 0), tmp, kt, 0, 0.5, 1); knot.rotation.set(kt * 2, kt * 1.4, kt); }
  }

  function updateTissue(t: number) {
    sheets.forEach(({ mesh, base, k }) => {
      const arr = mesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i], z = base[i + 2];
        const e = Math.max(0, 1 - Math.pow(Math.max(Math.abs(x), Math.abs(z)) / 0.9, 2));
        const w = Math.sin(x * 4.3 + k * 1.7 + t * 0.9) * Math.cos(z * 3.9 + k + t * 0.7) * 0.55 + Math.sin((x + z) * 7 + t * 1.6 + k) * 0.25 + Math.sin(x * 11 - z * 9 + k * 2) * 0.1;
        arr[i + 1] = e * (S.tissue * (0.09 + k * 0.025) + (0.02 + 0.085 * S.tissue) * w + S.glow * 0.02 * w);
      }
      mesh.geometry.attributes.position.needsUpdate = true; mesh.geometry.computeVertexNormals();
    });
    tissueMats.forEach((m) => { m.emissiveIntensity = S.glow * 0.28; });
  }

  function updateParticles(dt: number, t: number) {
    if (S.rel > 0.1 && S.rel < 2.7) accTrail += dt * (low ? 70 : 130);
    while (accTrail >= 1) {
      accTrail--; const k = Math.random() < 0.5 ? 0 : 1, w = wraps[k];
      const front = Math.max(0, (S.rel - 0.05) * 2.2), step = w.d[1] - w.d[0] || 0.05;
      const n = Math.round(front / (w.d[Math.min(NW - 1, w.mid + 1)] || step)) || 0;
      const row = clamp(w.mid + (Math.random() < 0.5 ? -1 : 1) * Math.min(n, Math.floor(NW / 2) - 1), 0, NW - 1);
      const p = wrapStrips[k].P[Math.floor(row)];
      spawn(p.x + rnd(-0.05, 0.05), p.y, p.z + rnd(-0.05, 0.05), rnd(-0.15, 0.15), rnd(0.05, 0.35), rnd(-0.15, 0.15), rnd(0.9, 1.8), rnd(0.012, 0.03));
    }
    accBox += dt * S.dust * (low ? 80 : 170);
    while (accBox >= 1) {
      accBox--; const big = Math.random() < 0.06;
      spawn(rnd(-0.85, 0.85), 0.72, rnd(-0.85, 0.85), rnd(-0.12, 0.12), rnd(0.25, 0.9), rnd(-0.12, 0.12), rnd(2.2, 4.4), big ? rnd(0.06, 0.1) : rnd(0.012, 0.045));
    }
    if (S.dive > 0.02 && S.dive < 0.98) accDive += dt * (low ? 90 : 220);
    while (accDive >= 1) {
      accDive--; tmp.copy(look).sub(camPos).normalize();
      spawn(camPos.x + tmp.x * rnd(1, 3.2) + rnd(-0.7, 0.7), camPos.y + tmp.y * rnd(1, 3.2) + rnd(-0.5, 0.5), camPos.z + tmp.z * rnd(1, 3.2) + rnd(-0.7, 0.7), 0, 0, 0, rnd(0.8, 1.6), rnd(0.015, 0.05));
    }
    for (let i = 0; i < NP; i++) {
      if (pLife[i] <= 0) { pAlpha[i] = 0; continue; }
      pLife[i] -= dt; const o = i * 3;
      pVel[o] += Math.sin(t * 1.3 + i) * 0.12 * dt; pVel[o + 2] += Math.cos(t * 1.1 + i * 1.7) * 0.12 * dt;
      if (S.dive > 0) {
        tmp.set(camPos.x - pPos[o], camPos.y - pPos[o + 1], camPos.z - pPos[o + 2]);
        const d = tmp.length() || 1; const a = S.dive * 7 * dt / d;
        pVel[o] += tmp.x * a; pVel[o + 1] += tmp.y * a; pVel[o + 2] += tmp.z * a;
      }
      pPos[o] += pVel[o] * dt; pPos[o + 1] += pVel[o + 1] * dt; pPos[o + 2] += pVel[o + 2] * dt;
      const r = 1 - pLife[i] / pMax[i];
      pAlpha[i] = Math.pow(Math.sin(Math.PI * clamp(r)), 0.7) * (0.55 + 0.45 * Math.abs(Math.sin(t * 3 + i * 1.9)));
    }
    pGeo.attributes.position.needsUpdate = true; pGeo.attributes.aSize.needsUpdate = true; pGeo.attributes.aAlpha.needsUpdate = true;
    for (let i = 0; i < NB; i++) bAlpha[i] = (0.1 + 0.08 * Math.sin(t * 0.5 + bPh[i])) * (1 - S.dive) * (1 - S.flood);
    bGeo.attributes.aAlpha.needsUpdate = true;
  }

  const clock = new THREE.Clock(); let t = 0, raf = 0, disposed = false;
  function tick() {
    if (disposed) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05); t += dt;
    if (!dragging) { dragX *= locked ? 0.96 : 0.995; dragY *= locked ? 0.96 : 0.995; }

    root.position.y = Math.sin(t * 0.9) * 0.04 * (1 - S.dive); root.rotation.y = Math.sin(t * 0.4) * 0.03;
    updateRibbons(t); updateTissue(t);

    // lid: lift, then hinge about the back edge (back.out gives the overshoot-and-settle)
    lidGroup.position.y = 0.54 + S.lidLift * 0.28; lidGroup.rotation.x = -S.lid * 1.95; lidGroup.rotation.z = Math.sin(S.lid * Math.PI) * 0.035;

    // light
    const g = S.glow;
    inner.intensity = 26 * g * g * (0.93 + 0.07 * Math.sin(t * 7)); glowPlane.material.uniforms.uGlow.value = Math.min(1, g * 1.1);
    (rays.material as THREE.ShaderMaterial).uniforms.uGlow.value = sm(g * 1.2 - 0.25) * (1 - S.flood); (rays.material as THREE.ShaderMaterial).uniforms.uT.value = t;
    (halo.material as THREE.SpriteMaterial).opacity = (0.55 * g) * (1 - S.dive * 0.4);
    renderer.toneMappingExposure = 1 + 0.15 * g + 5 * S.flood * S.flood;

    // camera: gentle orbit → anticipation push-in → dive through the opening
    const fit = Math.max(1, 0.95 / aspect), r = (8.1 - 0.9 * S.antic) * fit;
    const az = 0.55 + Math.sin(t * 0.25) * 0.08 + dragX, el = 0.38 + dragY + Math.sin(t * 0.2) * 0.02;
    camPos.set(r * Math.cos(el) * Math.sin(az), r * Math.sin(el) + 0.3, r * Math.cos(el) * Math.cos(az));
    look.set(0, -0.12 + 0.15 * S.antic + 0.4 * S.lid * (1 - S.dive), 0);
    if (S.dive > 0) {
      diveCurve.points[0].copy(camPos);
      const d = S.dive; diveCurve.getPoint(d, tmp); camPos.copy(tmp);
      look.lerp(tmp2.set(0, 0, -0.4), sm(d * 1.3));
    }
    camera.position.copy(camPos); camera.lookAt(look);

    updateParticles(dt, t);
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false); aspect = w / h; camera.aspect = aspect; camera.updateProjectionMatrix();
    const sc = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
    dustMat.uniforms.uScale.value = sc; bokehMat.uniforms.uScale.value = sc;
  }
  resize(); tick();

  return {
    state: S,
    resize,
    createTimeline() {
      locked = true; dragging = pulling = false; canvas.style.cursor = 'default';
      const tl = gsap.timeline();
      tl.to(S, { antic: 1, duration: 1.0, ease: 'sine.inOut' }, 0)
        .to(S, { knot: 0.6, duration: 0.9, ease: 'sine.inOut' }, 0.1)
        .to(S, { knot: 1, duration: 0.5, ease: 'sine.inOut' }, 1.0)
        .to(S, { loops: 1, duration: 0.9, ease: 'sine.inOut' }, 1.1)
        .to(S, { rel: 3.2, duration: 2.2, ease: 'none' }, 1.3)
        .to(S, { lidLift: 1, duration: 0.45, ease: 'power2.out' }, 3.0)
        .to(S, { lid: 1, duration: 1.4, ease: 'back.out(1.25)' }, 3.2)
        .to(S, { glow: 1, duration: 1.7, ease: 'power2.inOut' }, 3.05)
        .to(S, { dust: 1, duration: 0.8 }, 3.4)
        .to(S, { tissue: 1, duration: 1.8, ease: 'power2.out' }, 3.5)
        .to(S, { dive: 1, duration: 1.9, ease: 'power2.inOut' }, 4.8)
        .to(S, { flood: 1, duration: 1.2, ease: 'power1.in' }, 5.3);
      return tl;
    },
    dispose() {
      disposed = true; cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
      gsap.killTweensOf(S);
      scene.traverse((o: THREE.Object3D) => {
        const m = o as THREE.Mesh; m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      textures.forEach((x) => x.dispose()); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
