// Arka plandaki 3D sahne: Erzincan ovası gibi dağlarla çevrili bir vadi ve üstünde süzülen
// bir yapay sinir ağı. Sayfa kaydırıldıkça kamera vadinin içinde ilerler.
(function () {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas || !window.THREE) {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: "high-performance" });
  } catch (e) {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x040705, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x040705, 50, 190);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  scene.add(camera);

  const shared = {
    uTime: { value: 0 },
    uBase: { value: new THREE.Color("#1c6b4c") },
    uAccent: { value: new THREE.Color("#5cf2a6") },
    uPixel: { value: pixelRatio }
  };

  const glowChunk = `
    float wave = pow(0.5 + 0.5 * sin(position.z * 0.05 + uTime * 1.1), 10.0);
    float peak = smoothstep(3.0, 20.0, position.y);`;
  const fadeChunk = `
    float dist = -mv.z;
    vFade = (1.0 - smoothstep(70.0, 200.0, dist)) * smoothstep(0.5, 6.0, dist);`;

  const pointVert = `
    uniform float uTime;
    uniform float uPixel;
    uniform float uSize;
    attribute float aRand;
    varying float vGlow;
    varying float vFade;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      ${glowChunk}
      float tw = 0.5 + 0.5 * sin(uTime * 1.7 + aRand * 6.2831);
      vGlow = clamp(wave + peak * 0.6 + tw * aRand * 0.5, 0.0, 1.6);
      ${fadeChunk}
      gl_PointSize = uSize * uPixel * (1.0 + vGlow) * (28.0 / max(dist, 1.0));
      gl_Position = projectionMatrix * mv;
    }`;

  const pointFrag = `
    uniform vec3 uBase;
    uniform vec3 uAccent;
    varying float vGlow;
    varying float vFade;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d);
      vec3 col = mix(uBase, uAccent, clamp(vGlow, 0.0, 1.0));
      gl_FragColor = vec4(col, a * vFade * (0.3 + vGlow * 0.9));
    }`;

  const lineVert = `
    uniform float uTime;
    varying float vGlow;
    varying float vFade;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      ${glowChunk}
      vGlow = clamp(wave + peak * 0.5, 0.0, 1.4);
      ${fadeChunk}
      gl_Position = projectionMatrix * mv;
    }`;

  const lineFrag = `
    uniform vec3 uBase;
    uniform vec3 uAccent;
    uniform float uOpacity;
    varying float vGlow;
    varying float vFade;
    void main() {
      vec3 col = mix(uBase, uAccent, clamp(vGlow, 0.0, 1.0));
      gl_FragColor = vec4(col, vFade * (0.08 + vGlow * 0.3) * uOpacity);
    }`;

  function material(vert, frag, extra) {
    return new THREE.ShaderMaterial({
      uniforms: Object.assign({}, shared, extra),
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }

  // Terrain
  const COLS = isMobile ? 70 : 120;
  const ROWS = isMobile ? 150 : 240;
  const WIDTH = 180;
  const Z0 = 40;
  const LENGTH = 520;

  function height(x, z) {
    const valley = Math.pow(Math.min(1, Math.max(0, (Math.abs(x) - 6) / 40)), 1.4);
    const h = Math.sin(x * 0.09 + z * 0.03) * Math.cos(z * 0.045) * 4
      + Math.sin(x * 0.23 - z * 0.11) * 1.6
      + Math.sin(z * 0.17 + x * 0.05) * 0.8;
    return (h + 6) * valley * 2.2 + Math.sin(x * 0.5 + z * 0.4) * 0.15 - 2;
  }

  const count = (COLS + 1) * (ROWS + 1);
  const positions = new Float32Array(count * 3);
  const rands = new Float32Array(count);
  for (let r = 0; r <= ROWS; r++) {
    const z = Z0 - (r * LENGTH) / ROWS;
    for (let c = 0; c <= COLS; c++) {
      const x = -WIDTH / 2 + (c * WIDTH) / COLS;
      const i = r * (COLS + 1) + c;
      positions[i * 3] = x;
      positions[i * 3 + 1] = height(x, z);
      positions[i * 3 + 2] = z;
      rands[i] = Math.random() < 0.08 ? Math.random() : 0;
    }
  }

  const terrainGeo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3);
  terrainGeo.setAttribute("position", posAttr);
  terrainGeo.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));
  scene.add(new THREE.Points(terrainGeo, material(pointVert, pointFrag, { uSize: { value: 1.1 } })));

  const lineIdx = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * (COLS + 1) + c;
      lineIdx.push(i, i + 1);
    }
  }
  for (let c = 0; c <= COLS; c += 6) {
    for (let r = 0; r < ROWS; r++) {
      const i = r * (COLS + 1) + c;
      lineIdx.push(i, i + COLS + 1);
    }
  }
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute("position", posAttr);
  linesGeo.setIndex(lineIdx);
  scene.add(new THREE.LineSegments(linesGeo, material(lineVert, lineFrag, { uOpacity: { value: 1 } })));

  // Neural network floating above the valley
  const N = isMobile ? 110 : 240;
  const nodePos = new Float32Array(N * 3);
  const nodeRand = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    nodePos[i * 3] = (Math.random() - 0.5) * 32;
    nodePos[i * 3 + 1] = 3 + Math.random() * 15;
    nodePos[i * 3 + 2] = 30 - Math.random() * 400;
    nodeRand[i] = Math.random();
  }
  const links = [];
  const degree = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (degree[i] >= 3 || degree[j] >= 3) continue;
      const dx = nodePos[i * 3] - nodePos[j * 3];
      const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
      const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < 81) {
        links.push(i, j);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  const network = new THREE.Group();
  const nodeGeo = new THREE.BufferGeometry();
  const nodeAttr = new THREE.BufferAttribute(nodePos, 3);
  nodeGeo.setAttribute("position", nodeAttr);
  nodeGeo.setAttribute("aRand", new THREE.BufferAttribute(nodeRand, 1));
  const silver = {
    uBase: { value: new THREE.Color("#55635e") },
    uAccent: { value: new THREE.Color("#eef6f2") }
  };
  network.add(new THREE.Points(nodeGeo, material(pointVert, pointFrag, Object.assign({ uSize: { value: 2.6 } }, silver))));

  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute("position", nodeAttr);
  linkGeo.setIndex(links);
  network.add(new THREE.LineSegments(linkGeo, material(lineVert, lineFrag, Object.assign({ uOpacity: { value: 1.6 } }, silver))));
  scene.add(network);

  // Soft glow on the horizon, always in front of the camera
  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 160),
    new THREE.ShaderMaterial({
      uniforms: { uA: shared.uAccent, uB: { value: new THREE.Color("#cfd8d4") } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 uA; uniform vec3 uB; varying vec2 vUv; void main(){ vec2 p = vUv - 0.5; p.x *= 2.4; float a = smoothstep(0.5, 0.0, length(p)); vec3 c = mix(uA, uB, smoothstep(0.25, 0.75, vUv.x)); gl_FragColor = vec4(c * 0.6, a * a * 0.26); }",
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending
    })
  );
  horizon.position.set(0, -6, -250);
  horizon.renderOrder = -1;
  camera.add(horizon);

  // Camera driven by scroll and pointer
  let prog = 0;
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let running = true;
  const clock = new THREE.Clock();

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  window.addEventListener("pointermove", (e) => {
    tmx = (e.clientX / window.innerWidth) * 2 - 1;
    tmy = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.fov = w < h ? 75 : 60;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", resize);
  resize();

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);

    const t = clock.getElapsedTime();
    if (!reduceMotion) shared.uTime.value = t;

    prog += (scrollProgress() - prog) * (reduceMotion ? 1 : 0.05);
    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;

    const z = 28 - prog * 320;
    const y = 6 + Math.sin(prog * Math.PI) * 5;
    const x = Math.sin(prog * Math.PI * 2.5) * 3.5;
    camera.position.set(x + mx * 1.6, y - my * 0.9, z);
    camera.lookAt(x * 0.3 + mx * 0.8, y - 3, z - 40);
    camera.rotation.z += Math.sin(prog * Math.PI * 2) * 0.04;

    network.position.y = reduceMotion ? 0 : Math.sin(t * 0.4) * 0.8;

    renderer.render(scene, camera);
  }

  document.addEventListener("visibilitychange", () => {
    const wasRunning = running;
    running = !document.hidden;
    if (running && !wasRunning) requestAnimationFrame(frame);
  });

  requestAnimationFrame(frame);
})();
