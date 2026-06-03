/* ============================================================
   Hero background — generative "sand / waves" flow field.
   Palette-driven (reads --bg, --ink, --accent), subtle, looping.
   Long horizontal streaks undulating like wind over dunes.
   ============================================================ */
(function () {
  "use strict";

  const canvas = document.getElementById("hero-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const root = document.documentElement;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1;
  let cols = { bg: "#EFEDE6", ink: "#1A1A17", accent: "#C8F135" };
  let particles = [];
  let t = 0;
  let raf = 0, running = false, frame = 0;

  function readColors() {
    const cs = getComputedStyle(root);
    const bg = cs.getPropertyValue("--bg").trim();
    const ink = cs.getPropertyValue("--ink").trim();
    const accent = cs.getPropertyValue("--accent").trim();
    if (bg) cols.bg = bg;
    if (ink) cols.ink = ink;
    if (accent) cols.accent = accent;
  }

  function hexToRgb(hex) {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Density of streaks scales with area, capped for performance.
  function particleCount() {
    return Math.min(560, Math.max(180, Math.round((W * H) / 3600)));
  }

  function seedParticle(p) {
    p.x = Math.random() * W;
    // weight slightly toward the lower 2/3 — "sand settles"
    p.y = Math.pow(Math.random(), 0.82) * H;
    p.speed = 0.45 + Math.random() * 0.95;
    p.life = 60 + Math.random() * 260;
    p.age = Math.random() * p.life;
    p.green = Math.random() < 0.035;          // very sparse acid-green strands
    p.alpha = p.green ? 0.05 + Math.random() * 0.035
                      : 0.02 + Math.random() * 0.03;
    p.w = p.green ? 1.05 : 0.9 + Math.random() * 0.35;
    return p;
  }

  function build() {
    particles = [];
    const n = particleCount();
    for (let i = 0; i < n; i++) particles.push(seedParticle({}));
  }

  // Flow field: angle stays near horizontal so streaks read as long dune/wave ridges.
  function angleAt(x, y, time) {
    const n =
      Math.sin(y * 0.0061 + time * 0.22) +
      0.55 * Math.sin(x * 0.0039 - time * 0.16 + y * 0.0020) +
      0.30 * Math.sin(y * 0.0135 - time * 0.30) +
      0.18 * Math.sin(x * 0.011 + time * 0.12);
    return n * 0.42; // radians around 0 (rightward)
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // clear to solid bg
    ctx.fillStyle = cols.bg;
    ctx.fillRect(0, 0, W, H);
    build();
  }

  function step() {
    t += 0.016;
    frame++;
    if (frame % 90 === 0) readColors();

    // fade previous frame toward bg -> leaves soft sandy trails
    ctx.fillStyle = rgba(cols.bg, 0.085);
    ctx.fillRect(0, 0, W, H);

    ctx.lineCap = "round";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const a = angleAt(p.x, p.y, t);
      const nx = p.x + Math.cos(a) * p.speed * 1.7;
      const ny = p.y + Math.sin(a) * p.speed * 1.7;

      ctx.strokeStyle = rgba(p.green ? cols.accent : cols.ink, p.alpha);
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      p.x = nx; p.y = ny; p.age++;

      // recycle when off-screen or aged out
      if (p.age > p.life || p.x > W + 8 || p.x < -8 || p.y > H + 8 || p.y < -8) {
        seedParticle(p);
        if (p.x > W + 8 || p.x < -8) p.x = Math.random() < 0.5 ? -6 : W + 6;
      }
    }
  }

  function loop() {
    if (!running) return;
    step();
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function staticRender() {
    // reduced-motion: bake a still sandy texture, then hold
    for (let k = 0; k < 320; k++) step();
  }

  function init() {
    readColors();
    resize();
    if (reduced) { staticRender(); return; }
    start();
  }

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); if (reduced) staticRender(); }, 180);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (!reduced) start();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
