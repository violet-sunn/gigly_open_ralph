// The hero object: a raised glossy hand pinching a glass cube; white light in, six status colours out.
// Exposes window.Prism = { ready, render(p), resize(), bare } — p is the scene progress 0..1 (three screens of scroll).
// Rendered on a transparent canvas: colour pass (opaque clear, so transmission stays clear) + coverage pass → composite with alpha.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const out = (t) => 1 - Math.pow(1 - t, 3);
const seg = (t, a, b, e = out) => e(clamp((t - a) / (b - a)));
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const BG = 0x0d0b24;
const STATUS = [0x22d3ee, 0x7b5cff, 0x3d7bff, 0xff5fd2, 0xcfff04, 0xff6a3d];   // Открыт … Оплачен, top ray first

export async function createPrism(canvas, opts = {}) {
  let W = canvas.clientWidth || innerWidth, H = canvas.clientHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: !!opts.capture });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.NoToneMapping;   // tone mapping happens once, in the composite
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 50); camera.position.set(0, 0, 6); camera.lookAt(0, 0, 0);
  const unit = () => H / (2 * 6 * Math.tan(THREE.MathUtils.degToRad(15)));           // px per world unit at z=0
  const px = (x, y) => V((x - W / 2) / unit(), (H / 2 - y) / unit(), 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.5;
  scene.add(new THREE.HemisphereLight(0x2a2360, 0x05040f, 0.8));
  const key = new THREE.DirectionalLight(0xc9b3ff, 1.4); key.position.set(-2, 3, 4); scene.add(key);
  const glow = new THREE.PointLight(0xfff1e0, 7, 3, 2); scene.add(glow);

  // ---------- cube ----------
  const S = 0.46;
  const cubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.03, transmission: 1, thickness: 0.5, ior: 1.5, dispersion: 5,
    iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 620], clearcoat: 1, clearcoatRoughness: 0.03,
    attenuationColor: new THREE.Color(0xd9ccff), attenuationDistance: 2.5, envMapIntensity: 1.6, emissive: 0x2a1f6e, emissiveIntensity: 0.2,
  });
  const cube = new THREE.Mesh(new RoundedBoxGeometry(S, S, S, 3, 0.03), cubeMat);
  const wordMat = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.font = '800 300px Unbounded'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Gigly', 512, 270);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.2, side: THREE.DoubleSide });   // opaque: the transmission buffer captures it
  })();
  const word = new THREE.Mesh(new THREE.PlaneGeometry(S * 0.8, S * 0.4), wordMat); cube.add(word);

  // ---------- hand: WebXR generic hand (MIT), mirrored to a left hand, dark glossy iridescent, lavender rim ----------
  const handMat = new THREE.MeshPhysicalMaterial({ color: 0x120f33, metalness: 0.45, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 0.45, iridescenceIOR: 1.4, iridescenceThicknessRange: [150, 450], envMapIntensity: 1.3, side: THREE.DoubleSide });
  handMat.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = { value: new THREE.Color(0xc9b3ff) };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uRim;')
      .replace('#include <dithering_fragment>', 'float fres = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 3.0); gl_FragColor.rgb += uRim * fres * 0.7;\n#include <dithering_fragment>');
  };
  const hand = new THREE.Group(); scene.add(hand);
  const bones = {};
  const gltf = await new GLTFLoader().loadAsync(opts.handUrl ?? '/assets/hand-right.glb');
  gltf.scene.traverse((o) => { if (o.isBone) bones[o.name] = o; if (o.isMesh) { o.material = handMat; o.frustumCulled = false; } });
  hand.add(gltf.scene);
  hand.rotation.set(Math.PI, 0, 0); hand.scale.set(-11, 11, 11);
  scene.updateMatrixWorld(true);
  const at = (n) => { const v = V(); bones[n].getWorldPosition(v); return v; };
  // the asset's joints are siblings under one Armature (no parent chain): bending joint k carries the joints after it by the same rigid motion
  const bend = (chain, k, R) => {
    const J = bones[chain[k]]; const Mk = new THREE.Matrix4().compose(J.position, J.quaternion, J.scale);
    const Mk2 = Mk.clone().multiply(R), delta = Mk2.clone().multiply(Mk.clone().invert());
    Mk2.decompose(J.position, J.quaternion, J.scale);
    for (let i = k + 1; i < chain.length; i++) { const B = bones[chain[i]]; delta.clone().multiply(new THREE.Matrix4().compose(B.position, B.quaternion, B.scale)).decompose(B.position, B.quaternion, B.scale); }
  };
  const rotX = (a) => new THREE.Matrix4().makeRotationX(a), rotY = (a) => new THREE.Matrix4().makeRotationY(a), rotZ = (a) => new THREE.Matrix4().makeRotationZ(a);
  const curl = (chain, k, a) => bend(chain, k, rotX(-a));
  const CHAIN = (f) => [`${f}-finger-phalanx-proximal`, `${f}-finger-phalanx-intermediate`, `${f}-finger-phalanx-distal`, `${f}-finger-tip`];
  const THUMB = ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'];
  const AXIS = at('middle-finger-phalanx-proximal').sub(at('wrist')).normalize();
  const REST = { middle: [0.45, 0.45, 0.15], ring: [0.5, 0.5, 0.18], pinky: [0.55, 0.55, 0.2] }, SPREAD = { index: 0.12, middle: 0.04, ring: -0.08, pinky: -0.2 };
  for (const f of ['middle', 'ring', 'pinky']) { const ch = CHAIN(f); bend(ch, 0, rotY(SPREAD[f])); REST[f].forEach((a, k) => curl(ch, k, a)); }
  bend(CHAIN('index'), 0, rotY(SPREAD.index));
  // the pinch: search index flexion × thumb metacarpal yaw/pitch/roll × curl for thumb-tip ↔ index-tip = one cube
  const GAP = S + 0.03, DIGITS = [...CHAIN('index'), ...THUMB];
  const snap = DIGITS.map((n) => ({ p: bones[n].position.clone(), q: bones[n].quaternion.clone() }));
  const restore = () => DIGITS.forEach((n, i) => { bones[n].position.copy(snap[i].p); bones[n].quaternion.copy(snap[i].q); });
  const tipGap = () => { hand.updateMatrixWorld(true); return at('thumb-tip').distanceTo(at('index-finger-tip')); };
  const poseIndex = (fi) => { const ch = CHAIN('index'); curl(ch, 0, fi); curl(ch, 1, fi * 0.8); curl(ch, 2, fi * 0.3); };
  let best = { cost: Infinity };
  for (const fi of [0.35, 0.55, 0.75, 0.95]) for (let yaw = -1.4; yaw <= 1.41; yaw += 0.2) for (let pitch = -0.8; pitch <= 0.81; pitch += 0.27) for (let roll = -1.2; roll <= 1.21; roll += 0.4) {
    restore(); poseIndex(fi); bend(THUMB, 0, rotY(yaw).multiply(rotX(pitch)).multiply(rotZ(roll)));
    let c = 0, d = tipGap();
    while (d > GAP && c < 1.3) { curl(THUMB, 1, 0.07); curl(THUMB, 2, 0.05); c += 0.07; d = tipGap(); }
    const cost = (d > GAP ? (d - GAP) * 20 : 0) + Math.abs(yaw) * 0.4 + Math.abs(pitch) * 0.6 + Math.abs(roll) * 0.4 + c * 0.3 + fi * 0.5;
    if (cost < best.cost) best = { fi, yaw, pitch, roll, c };
  }
  restore(); poseIndex(best.fi); bend(THUMB, 0, rotY(best.yaw).multiply(rotX(best.pitch)).multiply(rotZ(best.roll)));
  for (let c = 0; c < best.c - 1e-6; c += 0.07) { curl(THUMB, 1, 0.07); curl(THUMB, 2, 0.05); }
  scene.updateMatrixWorld(true);
  // palm normal → the turn that shows the palm to the camera; the arm leans back from the wrist
  const palmSide = (() => { const ch = CHAIN('middle'), t0 = at('middle-finger-tip'); curl(ch, 0, 0.4); hand.updateMatrixWorld(true); const t1 = at('middle-finger-tip'); curl(ch, 0, -0.4); hand.updateMatrixWorld(true); const d = t1.sub(t0); d.addScaledVector(AXIS, -d.dot(AXIS)); return d.normalize(); })();
  const THETA0 = Math.atan2(-palmSide.x, palmSide.z);
  const TILT = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), -0.38);
  const turn = (a) => TILT.clone().multiply(new THREE.Quaternion().setFromAxisAngle(AXIS, a));
  const pivot = new THREE.Group(); pivot.position.copy(at('wrist')); scene.add(pivot); pivot.attach(hand);
  pivot.quaternion.copy(turn(THETA0)); scene.updateMatrixWorld(true);
  const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 2.0, 24), handMat);
  forearm.position.copy(at('wrist')).addScaledVector(V(0, 1, 0), -0.75); forearm.quaternion.setFromUnitVectors(V(0, 1, 0), AXIS); scene.add(forearm); pivot.attach(forearm);
  const pinch = () => at('thumb-tip').add(at('index-finger-tip')).multiplyScalar(0.5);
  {
    const Y = at('index-finger-tip').sub(at('thumb-tip')).normalize(), Z = V(0, 0, 1).addScaledVector(Y, -Y.z).normalize(), X = V().crossVectors(Y, Z);
    cube.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z)); cube.rotateY(0.55);
    cube.position.copy(pinch()); scene.add(cube); pivot.attach(cube);
  }
  let pivotHome = V();
  const place = () => {   // the pinch point lands at 66 % of the width, 32 % of the height (phone: centred, lower)
    const narrow = W < 768;
    pivot.quaternion.copy(turn(THETA0)); scene.updateMatrixWorld(true);
    const target = narrow ? px(W * 0.55, H * 0.42) : px(W * 0.66, H * 0.32);
    pivot.position.add(target.sub(pinch())); scene.updateMatrixWorld(true); pivotHome = pivot.position.clone();
  };
  place();

  // ---------- light: beam in, six rays out; additive quads with vertex alpha ----------
  const beamMat = () => new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const quad = () => { const m = new THREE.Mesh(new THREE.BufferGeometry(), beamMat()); m.frustumCulled = false; scene.add(m); return m; };
  const setQuad = (m, a, b, wa, wb, aa, ab, col) => {
    const d = b.clone().sub(a).normalize(), n = V(-d.y, d.x, 0);
    const p = [a.clone().addScaledVector(n, wa), b.clone().addScaledVector(n, wb), b.clone().addScaledVector(n, -wb), a.clone().addScaledVector(n, -wa)];
    const al = [aa, ab, ab, aa], idx = [0, 1, 2, 0, 2, 3], c = col.isColor ? col : new THREE.Color(col);
    m.geometry.setFromPoints(idx.map((i) => p[i]));
    m.geometry.setAttribute('color', new THREE.Float32BufferAttribute(idx.flatMap((i) => [c.r, c.g, c.b, al[i]]), 4));
  };
  const beamCore = quad(), beamHalo = quad(), rays = STATUS.map(() => quad()); const beams = [beamCore, beamHalo, ...rays];
  let targets = null;   // label anchor points in page px (set by the page in beat 2), one per ray
  const layBeams = (split, k = 1) => {
    const C = cube.getWorldPosition(V()); C.z = 0;
    const SRC = px(-W * 0.04, H * 0.14), inDir = C.clone().sub(SRC).normalize(), hit = C.clone().addScaledVector(inDir, -S * 0.45);
    setQuad(beamCore, SRC, hit, 0.01, 0.018, 0.12 * k, 1.0 * k, 0xffffff);
    setQuad(beamHalo, SRC, hit, 0.05, 0.1, 0.03 * k, 0.28 * k, 0xe9ddff);
    rays.forEach((m, i) => {
      const tight = 0.06 + (2.5 - i) * 0.075, dt = V(Math.cos(tight), Math.sin(tight), 0);
      let dir = dt, len = 3.4, wb = 0.135;
      if (targets && targets[i]) { const T = px(targets[i][0], targets[i][1]), dl = T.clone().sub(C); const L = dl.length(); dl.normalize(); dir = dt.clone().lerp(dl, split).normalize(); len = 3.4 + (L - 3.4) * split; wb = 0.135 - 0.09 * split; }
      const col = new THREE.Color(0xe9ddff).lerp(new THREE.Color(STATUS[i]), 0.35 + 0.65 * split);   // one lavender fan first, six colours when it splits
      setQuad(m, C.clone().addScaledVector(dir, S * 0.42), C.clone().addScaledVector(dir, len), 0.02, wb, 0.8 * k, 0.12 * split * k, col);
    });
  };

  // ---------- two-pass render: colour (opaque clear) + coverage → composite with alpha ----------
  const rtOpts = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true, samples: 4 };
  let rtColor = new THREE.WebGLRenderTarget(1, 1, rtOpts), rtMask = new THREE.WebGLRenderTarget(1, 1, { ...rtOpts, type: THREE.UnsignedByteType });
  const maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const beamMaskMat = new THREE.ShaderMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: 'varying float vA; void main(){ vA = color.a; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying float vA; void main(){ gl_FragColor = vec4(vec3(min(1.0, vA * 2.5)), 1.0); }' });
  const swaps = [[cube, cubeMat], [word, wordMat], ...[forearm, ...gltf.scene.children].flatMap((o) => { const arr = []; o.traverse((m) => { if (m.isMesh) arr.push([m, m.material]); }); return arr; })];
  const compScene = new THREE.Scene(), compCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const compMat = new THREE.ShaderMaterial({
    uniforms: { tColor: { value: null }, tMask: { value: null }, uBg: { value: new THREE.Color(BG) }, uBgCss: { value: new THREE.Color().setRGB(0x0d / 255, 0x0b / 255, 0x24 / 255, THREE.NoColorSpace) } },
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.NoBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    // straight-alpha output: the browser does cs*a + page*(1-a); we want page + (tonemapped colour - tonemapped ground), so cs = page + diff / a.
    // Solid objects (a = 1) come through as themselves; beams add light without being attenuated by their own alpha.
    fragmentShader: `uniform sampler2D tColor, tMask; uniform vec3 uBg, uBgCss; varying vec2 vUv;
      void main(){ vec3 c = texture2D(tColor, vUv).rgb; float a = clamp(texture2D(tMask, vUv).r, 0.0, 1.0);
        vec3 ct = linearToOutputTexel(vec4(toneMapping(c), 1.0)).rgb;
        vec3 bt = linearToOutputTexel(vec4(toneMapping(uBg), 1.0)).rgb;
        vec3 cs = uBgCss + (ct - bt) / max(a, 0.002);
        gl_FragColor = vec4(clamp(cs, 0.0, 1.0), a); }`,
  });
  compMat.toneMapped = true;
  compScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat));
  const sizeTargets = () => { const dpr = renderer.getPixelRatio(); rtColor.setSize(W * dpr, H * dpr); rtMask.setSize(W * dpr, H * dpr); };
  sizeTargets();

  const state = { p: 0, t: 0 };
  const render = (p = state.p, t = state.t) => {
    state.p = p; state.t = t;
    const turnA = THETA0 - 0.45 + seg(p, 0, 0.45) * 0.55 + seg(p, 0.45, 1) * 0.35 + Math.sin(t * 0.8) * 0.02;
    pivot.quaternion.copy(turn(turnA));
    pivot.position.copy(pivotHome).add(V(0, Math.sin(t * 1.3) * 0.015, 0));
    scene.updateMatrixWorld(true);
    const cw = cube.getWorldPosition(V()); glow.position.copy(cw).add(V(0, -0.1, 0.45)); glow.intensity = 6.5 + Math.sin(t * 2.2) * 1.2;
    layBeams(seg(p, 0.42, 0.72));
    // colour pass
    renderer.toneMapping = THREE.NoToneMapping; renderer.setClearColor(BG, 1);
    renderer.setRenderTarget(rtColor); renderer.clear(); renderer.render(scene, camera);
    // coverage pass: solid objects white, beams by their alpha
    for (const [m] of swaps) m.material = maskMat;
    const beamMats = beams.map((m) => m.material); beams.forEach((m) => (m.material = beamMaskMat));
    renderer.setClearColor(0x000000, 1); renderer.setRenderTarget(rtMask); renderer.clear(); renderer.render(scene, camera);
    for (const [m, mat] of swaps) m.material = mat; beams.forEach((m, i) => (m.material = beamMats[i]));
    // composite
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    compMat.uniforms.tColor.value = rtColor.texture; compMat.uniforms.tMask.value = rtMask.texture;
    renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(compScene, compCam);
    renderer.toneMapping = THREE.NoToneMapping;
  };
  const resize = () => {
    W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); sizeTargets(); place(); render();
  };
  return { render, resize, setTargets: (t) => { targets = t; }, cubePx: () => { const c = cube.getWorldPosition(V()); return [W / 2 + c.x * unit(), H / 2 - c.y * unit()]; }, state };
}
