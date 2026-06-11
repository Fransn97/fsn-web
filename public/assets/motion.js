/* ============================================================
   Motion + interaction (vanilla, no framework)
   ============================================================ */
(function () {
  "use strict";

  document.body.classList.add("js");

  /* ---- Analytics shim — swap console for PostHog in production.
     Mirrors the future /lib/analytics.ts contract. ---- */
  const track = (event, props) => {
    const payload = Object.assign({ path: location.pathname }, props || {});
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(event, payload);
    } else {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, payload);
    }
  };
  window.track = track;

  /* ---- Shared scroll ticker — one rAF-throttled scroll/resize loop;
     other code (incl. about.js) subscribes via window.onScrollTick(fn).
     Each fn runs once immediately on registration, then on every
     throttled tick. ---- */
  const scrollSubs = [];
  let scrollTickScheduled = false;
  function runScrollSubs() {
    scrollTickScheduled = false;
    scrollSubs.forEach((fn) => fn());
  }
  function requestScrollTick() {
    if (scrollTickScheduled) return;
    scrollTickScheduled = true;
    requestAnimationFrame(runScrollSubs);
  }
  window.onScrollTick = (fn) => { scrollSubs.push(fn); fn(); };
  window.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("resize", requestScrollTick, { passive: true });

  /* ---- Header stuck state + scroll progress bar ---- */
  const header = document.querySelector(".header");
  const heroScroll = document.getElementById("hero-scroll");
  const progressBar = document.getElementById("scroll-progress-bar");
  window.onScrollTick(() => {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 12);
    if (heroScroll) heroScroll.classList.toggle("is-hidden", window.scrollY > 60);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressBar.style.transform = `scaleX(${pct})`;
    }
  });

  /* ---- Nav scrollspy — highlights the in-page section link whose
     target section currently crosses the ~35% viewport line. ---- */
  function setupScrollSpy() {
    const spies = [...document.querySelectorAll('.nav__link[href*="#"]')]
      .map((link) => {
        const hash = link.getAttribute("href").split("#")[1];
        const target = hash && document.getElementById(hash);
        return target ? { link, target } : null;
      })
      .filter(Boolean);
    if (!spies.length) return;
    window.onScrollTick(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const anchor = vh * 0.35;
      let active = null;
      spies.forEach(({ target }) => {
        const r = target.getBoundingClientRect();
        if (r.top <= anchor && r.bottom > anchor) active = target;
      });
      spies.forEach(({ link, target }) => link.classList.toggle("is-active", target === active));
    });
  }

  /* ---- Hero scroll cue — dynamic glide to the next section ---- */
  if (heroScroll) {
    heroScroll.addEventListener("click", () => {
      const hero = heroScroll.closest("section");
      const next = hero && hero.nextElementSibling;
      const target = next || document.querySelector("#expertise");
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
      track("hero_scroll_cue_clicked", {});
    });
  }

  /* ---- Reveal — IntersectionObserver (robust; never stuck) ---- */
  function revealEl(t) {
    if (t.classList.contains("is-in")) return;
    if (t.hasAttribute("data-stagger")) {
      [...t.children].forEach((c, i) => { c.style.transitionDelay = (i * 70) + "ms"; });
    }
    if (t.classList.contains("reveal")) {
      t.querySelectorAll(".ln-inner").forEach((l, i) => { l.style.transitionDelay = (i * 90) + "ms"; });
    }
    t.classList.add("is-in");
  }
  let io = null;
  function setupReveals() {
    const targets = [...document.querySelectorAll(".reveal, .reveal-up, .reveal-fade, [data-stagger]")]
      .filter((t) => !t.classList.contains("is-in"));
    if (!("IntersectionObserver" in window)) { targets.forEach(revealEl); return; }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { revealEl(e.target); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
    }
    // reveal whatever is already on screen right now, then observe the rest
    const vh = window.innerHeight || document.documentElement.clientHeight;
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (r.top < vh * 0.96 && r.bottom > 0) revealEl(t);
      else io.observe(t);
    });
  }

  /* ---- Smooth anchor nav + close mobile menu ---- */
  function setupNav() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (ev) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        ev.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: "smooth" });
        if (a.closest(".nav, .mobile-menu")) {
          track("nav_clicked", { destination: id, cta_text: a.textContent.trim() });
        }
        closeMenu();
      });
    });
  }

  /* ---- Mobile menu ---- */
  const menu = document.getElementById("mobile-menu");
  const openBtn = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("menu-close");
  const openMenu = () => { if (menu) { menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; } };
  function closeMenu() { if (menu) { menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; } }
  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---- Inline validation helper ---- */
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  function setError(field, msg) {
    const f = field.closest(".field") || field.parentElement;
    let note = f.querySelector(".field__error");
    if (!note) {
      note = document.createElement("span");
      note.className = "field__error";
      f.appendChild(note);
    }
    note.textContent = msg || "";
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    f.classList.toggle("has-error", !!msg);
  }

  /* ---- Newsletter — provider-ready subscribe.
     Connect a real provider (Mailchimp / Substack / Beehiiv / Resend) by
     setting window.NEWSLETTER_ENDPOINT or the form's data-newsletter-endpoint
     to a POST URL. Until then it falls back to a prefilled email (mailto),
     so the CTA always does something honest — never a fake success. ---- */
  const news = document.getElementById("news-form");
  if (news) {
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = news.querySelector('input[type="email"]');
      if (!isEmail(input.value)) { setError(input, "Introduce un email válido."); input.focus(); return; }
      setError(input, "");
      const email = input.value.trim();
      track("newsletter_submitted", { source: "home_fieldnotes" });
      const endpoint = news.getAttribute("data-newsletter-endpoint") || window.NEWSLETTER_ENDPOINT;
      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).then(() => newsletterDone(news)).catch(() => newsletterDone(news));
        return;
      }
      const subject = encodeURIComponent("Suscripción — Field Notes");
      const body = encodeURIComponent("Quiero suscribirme a Field Notes.\n\nEmail: " + email);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    });
    news.querySelector('input[type="email"]').addEventListener("input", (ev) => setError(ev.target, ""));
  }
  function newsletterDone(form) {
    form.innerHTML = '<p class="news__ok">Gracias — revisa tu bandeja para confirmar la suscripción.</p>';
  }

  /* ---- Contact form — opens a real prefilled email (no fake send).
     TODO(prod): POST to /api/contact -> Supabase insert + Resend notify
     + PostHog `contact_form_submitted`. ---- */
  const form = document.getElementById("contact-form");
  if (form) {
    let started = false;
    form.addEventListener("input", () => { if (!started) { started = true; track("contact_form_started", { source: "home_contact" }); } });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#f-name");
      const email = form.querySelector("#f-email");
      const org = form.querySelector("#f-org");
      const topic = form.querySelector("#f-topic");
      const msg = form.querySelector("#f-msg");
      let ok = true;
      if (!name.value.trim()) { setError(name, "Dime tu nombre."); ok = false; } else setError(name, "");
      if (!isEmail(email.value)) { setError(email, "Introduce un email válido."); ok = false; } else setError(email, "");
      if (!msg.value.trim()) { setError(msg, "Cuéntame brevemente el reto."); ok = false; } else setError(msg, "");
      if (!ok) { form.querySelector(".has-error input, .has-error textarea")?.focus(); return; }

      track("contact_form_submitted", { category: topic.value, source: "home_contact" });
      const subject = encodeURIComponent(`Nuevo contacto — ${topic.value}`);
      const body = encodeURIComponent(
        `Nombre: ${name.value.trim()}\n` +
        `Email: ${email.value.trim()}\n` +
        `Organización: ${(org && org.value.trim()) || "—"}\n` +
        `Tipo de reto: ${topic.value}\n\n` +
        `${msg.value.trim()}`
      );
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    });
    ["#f-name", "#f-email", "#f-msg"].forEach((sel) => {
      const f = form.querySelector(sel);
      if (f) f.addEventListener("input", () => setError(f, ""));
    });
  }

  /* ---- Social link tracking ---- */
  document.querySelectorAll("[data-social]").forEach((a) =>
    a.addEventListener("click", () => track("social_link_clicked", { destination: a.dataset.social })));

  /* content.js renders lists after DOMContentLoaded; wire reveals then. */
  document.addEventListener("content:ready", setupReveals);
  document.addEventListener("DOMContentLoaded", () => { setupNav(); setupReveals(); setupScrollSpy(); track("page_viewed", { section: "home" }); });
  window.addEventListener("load", setupReveals);
})();
