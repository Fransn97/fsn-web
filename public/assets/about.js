/* ============================================================
   About — journey timeline: progress fill, active chapter,
   click-to-scroll on the sticky rail. Vanilla, reveal handled
   by motion.js.
   ============================================================ */
(function () {
  "use strict";

  const journey = document.getElementById("journey");
  if (!journey) return;

  const fill = document.getElementById("journey-fill");
  const steps = [...document.querySelectorAll(".jstep")];
  const chapters = [...document.querySelectorAll(".chapter")];
  if (!chapters.length) return;

  const stepByTarget = {};
  steps.forEach((s) => { stepByTarget[s.dataset.target] = s; });

  /* click a rail step -> smooth scroll to its chapter */
  steps.forEach((s) => {
    s.addEventListener("click", () => {
      const target = document.getElementById(s.dataset.target);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  function setActive(id) {
    steps.forEach((s) => s.classList.toggle("is-active", s.dataset.target === id));
  }

  /* active chapter = the one whose top is closest to ~40% viewport */
  let activeId = chapters[0].id;
  function onScroll() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const anchor = vh * 0.4;

    let best = chapters[0].id, bestDist = Infinity;
    chapters.forEach((c) => {
      const r = c.getBoundingClientRect();
      const dist = Math.abs(r.top - anchor);
      if (r.top - anchor < vh * 0.5 && dist < bestDist) { bestDist = dist; best = c.id; }
    });
    if (best !== activeId) { activeId = best; setActive(best); }

    /* progress fill across the journey block */
    const jr = journey.getBoundingClientRect();
    const total = jr.height - vh * 0.5;
    const passed = Math.min(Math.max(anchor - jr.top, 0), total);
    const pct = total > 0 ? (passed / total) * 100 : 0;
    if (fill) fill.style.height = pct.toFixed(2) + "%";
  }

  window.onScrollTick(onScroll);
})();
