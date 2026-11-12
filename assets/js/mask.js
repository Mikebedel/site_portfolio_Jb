/* JBN Studio — masque d'inspiration Baoulé, généré en 3D (Three.js)
   Masque original stylisé : visage allongé, sourcils en arc, yeux mi-clos,
   nez fin, petite bouche, scarifications et coiffe tressée. */
(function () {
  'use strict';
  var canvas = document.getElementById('mask');
  if (!canvas || !window.THREE) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ORANGE = new THREE.Color('#FF7A1A');
  var WARM = new THREE.Color('#FFE2C4');

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  var root = new THREE.Group();   // position / échelle
  var mask = new THREE.Group();   // rotation
  root.add(mask);
  scene.add(root);

  /* ---------- Forme du visage ---------- */
  function g(dx, dy, sx, sy) { return Math.exp(-(dx * dx) / (2 * sx * sx) - (dy * dy) / (2 * sy * sy)); }
  function halfW(y) {
    var t = (y - 0.05) / 1.32;
    if (Math.abs(t) >= 1) return 0;
    var w = 0.74 * Math.sqrt(1 - t * t);
    if (y < -0.45) w *= 1 - 0.38 * Math.min(1, (-0.45 - y) / 0.85);
    return w;
  }
  function surf(x, y) {
    var w = halfW(y);
    if (w <= 0) return null;
    var nx = x / w;
    if (Math.abs(nx) > 1) return null;
    var z = 0.44 * Math.sqrt(1 - nx * nx) * (0.86 + 0.14 * Math.cos(y * 1.1));
    // nez fin et long
    z += 0.17 * g(x, y + 0.05, 0.05, 0.34) + 0.07 * g(x, y + 0.38, 0.1, 0.06);
    // bouche
    z += 0.07 * g(x, y + 0.68, 0.085, 0.045);
    for (var s = -1; s <= 1; s += 2) {
      // arcade sourcilière
      var d = Math.abs(Math.sqrt(Math.pow((x - s * 0.31) / 0.24, 2) + Math.pow((y - 0.2) / 0.17, 2)) - 1);
      if (y > 0.18) z += 0.07 * Math.exp(-(d * d) / 0.02);
      // orbites et paupières mi-closes
      z -= 0.09 * g(x - s * 0.3, y - 0.17, 0.13, 0.065);
      z += 0.055 * g(x - s * 0.3, y - 0.15, 0.1, 0.03);
      // joues creusées
      z -= 0.03 * g(x - s * 0.38, y + 0.25, 0.12, 0.18);
    }
    return z;
  }
  function onSurf(x, y, lift) {
    var z = surf(x, y);
    if (z === null) {
      // projeter sur le bord le plus proche
      var w = halfW(y) * 0.985;
      x = Math.max(-w, Math.min(w, x));
      z = surf(x, y) || 0;
    }
    return new THREE.Vector3(x, y, z + (lift || 0.012));
  }

  /* ---------- Particules (surface + coiffe) ---------- */
  var targets = [];
  var colors = [];
  var step = window.innerWidth < 760 ? 0.042 : 0.03;
  for (var y = -1.3; y <= 1.4; y += step) {
    for (var x = -0.8; x <= 0.8; x += step) {
      var jx = x + (Math.random() - 0.5) * step * 0.5;
      var jy = y + (Math.random() - 0.5) * step * 0.5;
      var z = surf(jx, jy);
      if (z === null) continue;
      targets.push(jx, jy, z);
      var c = WARM.clone().lerp(ORANGE, Math.min(1, 0.35 + (0.5 - z) * 1.2));
      colors.push(c.r, c.g, c.b);
    }
  }
  // coiffe tressée : arcs concentriques au-dessus du front
  for (var k = 0; k < 6; k++) {
    var r = 0.32 + k * 0.075;
    for (var a = 0; a <= Math.PI; a += 0.035) {
      var px = Math.cos(a) * r * 1.45;
      var py = 1.22 + Math.sin(a) * r * 0.9;
      targets.push(px + (Math.random() - 0.5) * 0.02, py, 0.12 - k * 0.012 + Math.sin(a) * 0.05);
      colors.push(ORANGE.r, ORANGE.g, ORANGE.b);
    }
  }
  // tresses latérales
  for (var s2 = -1; s2 <= 1; s2 += 2) {
    for (var a2 = 0; a2 < Math.PI * 2; a2 += 0.09) {
      for (var rr = 0.05; rr <= 0.17; rr += 0.06) {
        targets.push(s2 * 0.82 + Math.cos(a2) * rr, 1.05 + Math.sin(a2) * rr, 0.08);
        colors.push(ORANGE.r, ORANGE.g, ORANGE.b);
      }
    }
  }

  var count = targets.length / 3;
  var starts = new Float32Array(count * 3);
  var scatter = new Float32Array(count * 3);
  for (var i = 0; i < count; i++) {
    var th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    var R = 4 + Math.random() * 5;
    starts[i * 3] = R * Math.sin(ph) * Math.cos(th);
    starts[i * 3 + 1] = R * Math.sin(ph) * Math.sin(th);
    starts[i * 3 + 2] = R * Math.cos(ph) - 2;
    // direction de dispersion au scroll
    var tx = targets[i * 3], ty = targets[i * 3 + 1], tz = targets[i * 3 + 2];
    var len = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
    var f = 2 + Math.random() * 3;
    scatter[i * 3] = (tx / len) * f + (Math.random() - 0.5);
    scatter[i * 3 + 1] = (ty / len) * f + (Math.random() - 0.5);
    scatter[i * 3 + 2] = (tz / len) * f + Math.random() * 2;
  }
  var tArr = new Float32Array(targets);
  var pos = new Float32Array(count * 3);
  pos.set(reduced ? tArr : starts);

  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  var dot = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x2 = c.getContext('2d');
    var gr = x2.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x2.fillStyle = gr; x2.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  var pMat = new THREE.PointsMaterial({ size: 0.042, map: dot, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  var points = new THREE.Points(pGeo, pMat);
  mask.add(points);

  /* ---------- Lignes de balayage (effet scan) ---------- */
  var scanMat = new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  for (var yy = -1.26; yy <= 1.36; yy += 0.06) {
    var row = [];
    for (var xx = -0.8; xx <= 0.8; xx += 0.02) {
      var zz = surf(xx, yy);
      if (zz !== null) row.push(new THREE.Vector3(xx, yy, zz + 0.004));
    }
    if (row.length > 2) mask.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(row), scanMat));
  }

  /* ---------- Traits du visage (tubes lumineux) ---------- */
  var featMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  var glowMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  function tube(pts, r, closed) {
    var curve = new THREE.CatmullRomCurve3(pts, !!closed);
    var seg = Math.max(24, pts.length * 4);
    mask.add(new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r || 0.011, 6, !!closed), featMat));
    mask.add(new THREE.Mesh(new THREE.TubeGeometry(curve, seg, (r || 0.011) * 3.2, 6, !!closed), glowMat));
  }
  function arc(cx, cy, rx, ry, a0, a1, n, lift) {
    var out = [];
    for (var j = 0; j <= n; j++) {
      var a = a0 + (a1 - a0) * (j / n);
      out.push(onSurf(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, lift));
    }
    return out;
  }
  // contour du visage
  var outline = [];
  for (var oy = 1.34; oy >= -1.24; oy -= 0.04) outline.push(onSurf(halfW(oy) * 0.97, oy, 0.006));
  for (var oy2 = -1.24; oy2 <= 1.34; oy2 += 0.04) outline.push(onSurf(-halfW(oy2) * 0.97, oy2, 0.006));
  tube(outline, 0.009, true);
  for (var sd = -1; sd <= 1; sd += 2) {
    tube(arc(sd * 0.31, 0.2, 0.24, 0.17, 0.12, Math.PI - 0.12, 26, 0.02), 0.014);           // sourcil
    tube(arc(sd * 0.3, 0.165, 0.13, 0.034, 0, Math.PI, 18, 0.02), 0.011);                  // paupière
    tube(arc(sd * 0.3, 0.165, 0.13, -0.014, 0, Math.PI, 18, 0.02), 0.009);                 // fente de l'œil
    for (var m = 0; m < 3; m++) {                                                          // scarifications
      var mx = sd * (0.5 + m * 0.05);
      tube([onSurf(mx, 0.02, 0.015), onSurf(mx, 0.12, 0.015), onSurf(mx, 0.22, 0.015)], 0.008);
    }
    tube([onSurf(sd * 0.02, -0.36, 0.02), onSurf(sd * 0.075, -0.4, 0.02), onSurf(sd * 0.06, -0.45, 0.02)], 0.008); // narine
  }
  var nose = [];
  for (var ny = 0.3; ny >= -0.4; ny -= 0.05) nose.push(onSurf(0, ny, 0.018));
  tube(nose, 0.011);
  tube(arc(0, -0.68, 0.075, 0.035, 0, Math.PI * 2, 24, 0.02), 0.01, true);                 // bouche
  for (var fm = 0; fm < 3; fm++) {                                                          // marques du front
    var fy = 0.62 + fm * 0.09;
    tube([onSurf(-0.03, fy, 0.015), onSurf(0, fy + 0.05, 0.015), onSurf(0.03, fy, 0.015)], 0.008);
  }
  // coiffe : arcs lumineux
  for (var ck = 0; ck < 6; ck += 2) {
    var cr = 0.32 + ck * 0.075, cpts = [];
    for (var ca = 0; ca <= Math.PI; ca += Math.PI / 30) cpts.push(new THREE.Vector3(Math.cos(ca) * cr * 1.45, 1.22 + Math.sin(ca) * cr * 0.9, 0.12 - ck * 0.012 + Math.sin(ca) * 0.05 + 0.01));
    tube(cpts, 0.01);
  }
  // barbe tressée sous le menton
  for (var b = -2; b <= 2; b++) {
    tube([new THREE.Vector3(b * 0.06, -1.2, 0.06), new THREE.Vector3(b * 0.055, -1.32, 0.05), new THREE.Vector3(b * 0.05, -1.46, 0.04)], 0.008);
  }

  /* ---------- Anneau orbital (touche futuriste) ---------- */
  var ringMat = new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
  var rings = new THREE.Group();
  [1.45, 1.62].forEach(function (rad, idx) {
    var rp = [];
    for (var ra = 0; ra <= Math.PI * 2 + 0.01; ra += 0.03) rp.push(new THREE.Vector3(Math.cos(ra) * rad, Math.sin(ra) * rad * 0.3, Math.sin(ra) * 0.2));
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp), ringMat);
    line.rotation.z = idx ? -0.35 : 0.25;
    rings.add(line);
  });
  root.add(rings);

  /* ---------- Mise en page ---------- */
  var baseX = 0, baseY = 0, baseScale = 1;
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI / 180) / 2);
    var visW = visH * camera.aspect;
    if (w >= 900) {
      // à droite du texte, entièrement visible (coiffe comprise)
      baseScale = Math.min(1.05, (visH * 0.66) / 3.4);
      baseX = visW * 0.27; baseY = -0.12 * baseScale;
      canvas.style.opacity = 1;
    } else {
      // mobile : au-dessus du texte
      baseScale = Math.min(0.62, (visH * 0.34) / 3.4);
      baseX = 0; baseY = visH * 0.24;
      canvas.style.opacity = 1;
    }
    root.position.set(baseX, baseY, 0);
    root.scale.setScalar(baseScale);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---------- Interaction ---------- */
  var mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  var state = { form: reduced ? 1 : 0, lines: reduced ? 1 : 0, scroll: 0 };
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  window.JBNMask = {
    state: state,
    form: function () {
      if (reduced) return;
      if (window.gsap) {
        gsap.to(state, { form: 1, duration: 2.6, ease: 'none' });
        gsap.to(state, { lines: 1, duration: 1.4, delay: 1.6, ease: 'power2.out' });
      } else { state.form = 1; state.lines = 1; }
    },
    setScroll: function (p) { state.scroll = p; }
  };

  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  var clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = clock.getElapsedTime();
    var f = easeInOut(Math.min(1, state.form));
    var sc = state.scroll;

    // particules : formation puis dispersion au scroll
    for (var i = 0; i < count; i++) {
      var i3 = i * 3;
      var delay = (i % 97) / 97 * 0.35;
      var fi = Math.max(0, Math.min(1, (f - delay) / (1 - delay)));
      fi = fi * fi * (3 - 2 * fi);
      for (var a = 0; a < 3; a++) {
        var target = tArr[i3 + a] + scatter[i3 + a] * sc * 1.6;
        pos[i3 + a] = starts[i3 + a] + (target - starts[i3 + a]) * fi;
      }
      if (!reduced && fi >= 1) pos[i3 + 2] += Math.sin(t * 1.4 + i * 0.37) * 0.004;
    }
    pGeo.attributes.position.needsUpdate = true;

    // lumière des traits + scintillement léger
    var flicker = (Math.sin(t * 13) > 0.985) ? 0.45 : 1;
    var L = state.lines * (1 - sc) * flicker;
    featMat.opacity = 0.95 * L;
    glowMat.opacity = 0.12 * L;
    scanMat.opacity = 0.22 * L * (0.75 + 0.25 * Math.sin(t * 2));
    ringMat.opacity = 0.35 * L;
    pMat.opacity = 0.9 * (1 - sc * 0.6);

    // rotation : respiration + suivi de la souris
    cur.x += (mouse.x - cur.x) * 0.05;
    cur.y += (mouse.y - cur.y) * 0.05;
    if (!reduced) {
      mask.rotation.y = Math.sin(t * 0.35) * 0.45 + cur.x * 0.5 + (1 - f) * 2.4;
      mask.rotation.x = cur.y * 0.22 + Math.sin(t * 0.5) * 0.04;
      mask.position.y = Math.sin(t * 0.8) * 0.06;
      rings.rotation.y = t * 0.25;
      rings.rotation.x = 0.2 + cur.y * 0.1;
    }
    root.position.y = baseY + sc * 0.8;
    renderer.render(scene, camera);
  }
  frame();
})();
