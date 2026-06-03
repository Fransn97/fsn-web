/* ============================================================
   Certifications — data + render + 3D tilt + filters + sheet
   Vanilla (mirrors the project's no-framework approach).
   Data-driven: edit the `CERTIFICATIONS` array only.
   ============================================================ */
(function () {
  "use strict";

  const mount = document.getElementById("certs");
  if (!mount) return;

  /* ---- Source of truth (approved credentials only) ---- */
  const CERTIFICATIONS = [
    { shortName: "Platform Administrator", name: "Salesforce Certified Platform Administrator", issuer: "Salesforce", category: "CRM Administration", date: "13 mayo 2020", year: "2020", status: "Aprobado", type: "Salesforce", skills: ["Salesforce Setup", "Security", "Data Model", "Automation"], description: "Base sólida en administración de Salesforce: configuración de plataforma, usuarios, seguridad y automatización." },
    { shortName: "Sales Cloud Consultant", name: "Salesforce Certified Sales Cloud Consultant", issuer: "Salesforce", category: "Sales Cloud", date: "17 junio 2021", year: "2021", status: "Aprobado", type: "Salesforce", skills: ["Sales Process", "Lead Management", "Opportunity Mgmt", "CRM Strategy"], description: "Especialización en diseño e implantación de procesos comerciales sobre Salesforce Sales Cloud." },
    { shortName: "Service Cloud Consultant", name: "Salesforce Certified Service Cloud Consultant", issuer: "Salesforce", category: "Service Cloud", date: "29 septiembre 2021", year: "2021", status: "Aprobado", type: "Salesforce", skills: ["Case Management", "Omnichannel", "Service Processes", "Customer Support"], description: "Capacidad para diseñar soluciones de atención al cliente, gestión de casos y modelos de servicio escalables." },
    { shortName: "Platform App Builder", name: "Salesforce Certified Platform App Builder", issuer: "Salesforce", category: "Platform", date: "6 abril 2022", year: "2022", status: "Aprobado", type: "Salesforce", skills: ["Custom Objects", "Flows", "Lightning Pages", "App Design"], description: "Diseño y construcción de aplicaciones declarativas sobre Salesforce Platform." },
    { shortName: "Platform Admin II", name: "Salesforce Certified Platform Administrator II", issuer: "Salesforce", category: "Advanced Administration", date: "8 diciembre 2022", year: "2022", status: "Aprobado", type: "Salesforce", skills: ["Advanced Automation", "Security", "Data Management", "Governance"], description: "Administración avanzada de Salesforce: gobierno de plataforma, seguridad y configuración compleja." },
    { shortName: "Business Analyst", name: "Salesforce Certified Business Analyst", issuer: "Salesforce", category: "Business Analysis", date: "16 noviembre 2023", year: "2023", status: "Aprobado", type: "Salesforce", skills: ["Discovery", "Requirements", "User Stories", "Process Mapping"], description: "Conecto necesidades de negocio con soluciones Salesforce mediante análisis funcional y diseño de procesos." },
    { shortName: "CPQ Administrator", name: "Salesforce Certified CPQ Administrator", issuer: "Salesforce", category: "Revenue Cloud / CPQ", date: "1 diciembre 2023", year: "2023", status: "Aprobado", type: "Salesforce", skills: ["Product Rules", "Price Rules", "Quotes", "Revenue Processes"], description: "Especialización en configuración de procesos de cotización, pricing y ventas complejas con Salesforce CPQ." },
    { shortName: "Field Service Consultant", name: "Salesforce Certified Field Service Consultant", issuer: "Salesforce", category: "Field Service", date: "18 diciembre 2023", year: "2023", status: "Aprobado", type: "Salesforce", skills: ["Field Operations", "Scheduling", "Service Territories", "Work Orders"], description: "Diseño de soluciones para operaciones de campo, planificación de recursos y gestión de órdenes de trabajo." },
    { shortName: "Sharing & Visibility Architect", name: "Salesforce Certified Platform Sharing and Visibility Architect", issuer: "Salesforce", category: "Architecture", date: "31 enero 2024", year: "2024", status: "Aprobado", type: "Architecture", skills: ["Sharing Model", "Security Architecture", "Roles & OWD", "Enterprise Access"], description: "Especialización avanzada en arquitectura de seguridad, visibilidad, compartición de datos y modelos de acceso en Salesforce." },
    { shortName: "Data 360 Consultant", name: "Salesforce Certified Data 360 Consultant", issuer: "Salesforce", category: "Data & Customer 360", date: "22 enero 2025", year: "2025", status: "Aprobado", type: "Data & AI", skills: ["Data Cloud", "Customer 360", "Data Modeling", "Segmentation"], description: "Soluciones de datos, unificación de cliente y activación de información dentro del ecosistema Salesforce." },
    { shortName: "AI Associate", name: "Salesforce Certified AI Associate", issuer: "Salesforce", category: "Artificial Intelligence", date: "28 enero 2025", year: "2025", status: "Aprobado", type: "Data & AI", skills: ["AI Fundamentals", "Responsible AI", "CRM AI", "Agentforce Foundations"], description: "Fundamentos de inteligencia artificial aplicada al CRM, gobierno responsable de IA y casos de uso en Salesforce." },
    { shortName: "PMP®", name: "Project Management Professional (PMP)®", issuer: "Project Management Institute", category: "Project Management", date: "junio 2023", year: "2023", status: "Aprobado", type: "Project Management", credentialId: "3554326", skills: ["Project Governance", "Risk Management", "Planning", "Stakeholder Mgmt"], description: "Credencial internacional de dirección de proyectos: gobierno, planificación, gestión de riesgos y liderazgo de equipos." },
    { shortName: "PSM I", name: "Professional Scrum Master™ I (PSM I)", issuer: "Scrum.org", category: "Agile / Scrum", date: "febrero 2022", year: "2022", status: "Aprobado", type: "Agile", skills: ["Scrum Framework", "Agile Delivery", "Sprint Planning", "Continuous Improvement"], description: "Dominio del marco Scrum, entrega iterativa, facilitación de equipos y mejora continua." },
  ];

  /* ---- Filters (only categories that exist) ---- */
  const FILTERS = [
    { id: "all", label: "Todas", match: () => true },
    { id: "Salesforce", label: "Salesforce", match: (c) => c.type === "Salesforce" },
    { id: "Data & AI", label: "Data & AI", match: (c) => c.type === "Data & AI" },
    { id: "Architecture", label: "Architecture", match: (c) => c.type === "Architecture" },
    { id: "Project Management", label: "Project Management", match: (c) => c.type === "Project Management" },
    { id: "Agile", label: "Agile / Scrum", match: (c) => c.type === "Agile" },
  ];

  const METRICS = [
    { n: "11", l: "Salesforce ecosystem" },
    { n: "PMP®", l: "Project mgmt · PMI" },
    { n: "PSM I", l: "Agile · Scrum.org" },
    { n: "2020—25", l: "Trayectoria certificada" },
  ];

  const ISSUER_MARK = {
    "Salesforce": "SALESFORCE",
    "Project Management Institute": "PMI",
    "Scrum.org": "SCRUM.ORG",
  };
  const SHORT_ISSUER = {
    "Salesforce": "Salesforce",
    "Project Management Institute": "PMI",
    "Scrum.org": "Scrum.org",
  };
  const BADGE_DIR = "assets/badges/";
  const BADGE = {
    "Platform Administrator": "platform-administrator.png",
    "Sales Cloud Consultant": "sales-cloud-consultant.png",
    "Service Cloud Consultant": "service-cloud-consultant.png",
    "Platform App Builder": "platform-app-builder.png",
    "Platform Admin II": "platform-administrator-ii.png",
    "Business Analyst": "business-analyst.png",
    "CPQ Administrator": "cpq-administrator.png",
    "Field Service Consultant": "field-service-consultant.png",
    "Sharing & Visibility Architect": "sharing-visibility-architect.png",
    "Data 360 Consultant": "data-360-consultant.png",
    "AI Associate": "ai-associate.png",
    "PMP\u00ae": "pmp.png",
    "PSM I": "psm.png",
  };
  const LOGO_BADGES = new Set(["PMP\u00ae", "PSM I"]);

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  /* ---- Render metrics ---- */
  const metricsEl = document.getElementById("certs-metrics");
  if (metricsEl) {
    metricsEl.innerHTML = METRICS.map((m) =>
      `<div class="cmetric"><span class="cmetric__n">${esc(m.n)}</span><span class="cmetric__l">${esc(m.l)}</span></div>`
    ).join("");
  }

  /* ---- Render filters ---- */
  const filtersEl = document.getElementById("certs-filters");
  if (filtersEl) {
    filtersEl.setAttribute("role", "tablist");
    filtersEl.innerHTML = FILTERS.map((f) => {
      const count = CERTIFICATIONS.filter(f.match).length;
      return `<button class="cfilter${f.id === "all" ? " is-active" : ""}" role="tab" aria-selected="${f.id === "all"}" data-filter="${esc(f.id)}">${esc(f.label)} <span class="cfilter__c">${count}</span></button>`;
    }).join("");
  }

  /* ---- Render grid ---- */
  const grid = document.getElementById("certs-grid");
  function cardHTML(c, i) {
    const img = BADGE_DIR + (BADGE[c.shortName] || "");
    const isLogo = LOGO_BADGES.has(c.shortName);
    const issuerShort = SHORT_ISSUER[c.issuer] || c.issuer;
    return `
    <article class="cert${isLogo ? " cert--logo" : ""}" data-type="${esc(c.type)}" tabindex="0" role="button"
      aria-haspopup="dialog" aria-label="${esc(c.name)} — ${esc(c.issuer)}, ${esc(c.year)}. Ver detalle." data-i="${i}">
      <div class="cert__card">
        <div class="cert__badge"><img src="${img}" alt="${esc(c.name)}" loading="lazy" decoding="async"></div>
        <div class="cert__cap">
          <p class="cert__name">${esc(c.shortName)}</p>
          <p class="cert__meta">${esc(issuerShort)} · ${esc(c.year)}</p>
        </div>
      </div>
    </article>`;
  }

  if (grid) {
    grid.setAttribute("data-stagger", "");
    grid.innerHTML = CERTIFICATIONS.map(cardHTML).join("");
  }

  const cards = grid ? [...grid.querySelectorAll(".cert")] : [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 560px)").matches;
  const MAX = 5; // deg — subtle, professional

  /* ---- Subtle 3D tilt + lift ---- */
  cards.forEach((cell) => {
    const card = cell.querySelector(".cert__card");
    if (!card) return;

    function move(e) {
      if (reduce || isMobile()) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * MAX * 2;
      const ry = (px - 0.5) * MAX * 2;
      card.style.transform = `translateY(-5px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }
    function reset() { card.style.transform = ""; }
    cell.addEventListener("pointermove", move);
    cell.addEventListener("pointerleave", reset);
    cell.addEventListener("blur", reset);
    cell.addEventListener("focus", () => {
      if (!reduce && !isMobile()) card.style.transform = "translateY(-5px)";
    });

    /* click / keyboard -> expand into modal */
    const i = +cell.dataset.i;
    cell.addEventListener("click", () => openModal(i, cell));
    cell.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(i, cell); }
    });
  });

  /* ---- Filters behaviour ---- */
  if (filtersEl) {
    const btns = [...filtersEl.querySelectorAll(".cfilter")];
    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".cfilter");
      if (!btn) return;
      const id = btn.dataset.filter;
      const f = FILTERS.find((x) => x.id === id);
      if (!f) return;
      btns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      cards.forEach((cell, idx) => {
        cell.classList.toggle("is-hidden", !f.match(CERTIFICATIONS[idx]));
      });
      if (window.track) window.track("cert_filter", { filter: id });
    });
  }

  /* ============================================================
     Expand modal — shared-element (FLIP) "layoutId" morph
     ============================================================ */
  let modal = null, lastFocus = null, openIdx = -1;

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "cexp";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="cexp__scrim" data-close></div>
      <div class="cexp__dialog" role="dialog" aria-modal="true" aria-labelledby="cexp-name">
        <div class="cexp__media"><div class="cexp__badge"><img alt=""></div></div>
        <div class="cexp__body">
          <button class="cexp__close" data-close aria-label="Cerrar">&times;</button>
          <p class="cexp__issuer"></p>
          <h3 class="cexp__name" id="cexp-name"></h3>
          <dl class="cexp__meta"></dl>
          <span class="cexp__label">Skills</span>
          <div class="cexp__skills"></div>
          <p class="cexp__desc"></p>
          <div class="cexp__cta"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  }

  function flyGhost(srcEl, dstImg, fromRect, toRect, dur, onEnd) {
    const ghost = srcEl.cloneNode(true);
    ghost.className = "cexp__ghost";
    Object.assign(ghost.style, {
      position: "fixed", left: fromRect.left + "px", top: fromRect.top + "px",
      width: fromRect.width + "px", height: fromRect.height + "px",
      margin: "0", zIndex: "260", transformOrigin: "top left", pointerEvents: "none", opacity: "1",
      transition: "transform " + dur + "s cubic-bezier(0.22,0.61,0.36,1)"
    });
    document.body.appendChild(ghost);
    if (dstImg) dstImg.style.opacity = "0";
    const sx = toRect.width / fromRect.width, sy = toRect.height / fromRect.height;
    const tx = toRect.left - fromRect.left, ty = toRect.top - fromRect.top;
    requestAnimationFrame(() => { ghost.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + sx + "," + sy + ")"; });
    let done = false;
    const finish = () => { if (done) return; done = true; if (onEnd) onEnd(); if (ghost.isConnected) ghost.remove(); };
    ghost.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, dur * 1000 + 120);
  }

  function openModal(i, cell) {
    const c = CERTIFICATIONS[i];
    if (!c) return;
    if (!modal) buildModal();
    openIdx = i;
    lastFocus = document.activeElement;

    const isLogo = LOGO_BADGES.has(c.shortName);
    modal.querySelector(".cexp__dialog").classList.toggle("cexp__dialog--logo", isLogo);
    const dlgImg = modal.querySelector(".cexp__badge img");
    dlgImg.style.opacity = "1";
    dlgImg.src = BADGE_DIR + (BADGE[c.shortName] || "");
    dlgImg.alt = c.name;
    modal.querySelector(".cexp__issuer").textContent = (SHORT_ISSUER[c.issuer] || c.issuer);
    modal.querySelector(".cexp__name").textContent = c.name;
    const credLine = c.credentialId ? "<div><dt>Credencial</dt><dd>" + esc(c.credentialId) + "</dd></div>" : "";
    modal.querySelector(".cexp__meta").innerHTML =
      "<div><dt>Categoría</dt><dd>" + esc(c.category) + "</dd></div>" +
      "<div><dt>Obtenida</dt><dd>" + esc(c.date) + "</dd></div>" +
      "<div><dt>Estado</dt><dd class='is-ok'>" + esc(c.status) + "</dd></div>" +
      "<div><dt>Issuer</dt><dd>" + esc(c.issuer) + "</dd></div>" + credLine;
    modal.querySelector(".cexp__skills").innerHTML = c.skills.map((s) => "<span class='cexp__chip'>" + esc(s) + "</span>").join("");
    modal.querySelector(".cexp__desc").textContent = c.description;
    modal.querySelector(".cexp__cta").innerHTML = c.href
      ? "<a class='cexp__link' href='" + esc(c.href) + "' target='_blank' rel='noopener noreferrer'>Ver credencial <span aria-hidden='true'>→</span></a>" : "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const srcImg = cell && cell.querySelector(".cert__badge img");
    if (srcImg && !reduce) {
      const fromRect = srcImg.getBoundingClientRect();
      requestAnimationFrame(() => {
        const toRect = dlgImg.getBoundingClientRect();
        if (toRect.width) flyGhost(srcImg, dlgImg, fromRect, toRect, 0.44, () => { dlgImg.style.opacity = "1"; });
      });
    }
    setTimeout(() => modal.querySelector(".cexp__close").focus(), 70);
    if (window.track) window.track("cert_opened", { cert: c.shortName });
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    const cell = cards[openIdx];
    const srcImg = cell && cell.querySelector(".cert__badge img");
    const dlgImg = modal.querySelector(".cexp__badge img");
    const dlgRect = dlgImg.getBoundingClientRect();

    if (srcImg && !reduce && dlgRect.width) {
      const toRect = srcImg.getBoundingClientRect();
      flyGhost(dlgImg, dlgImg, dlgRect, toRect, 0.4, null);
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { dlgImg.style.opacity = "1"; }, 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* re-scan reveals (motion.js listens for content:ready) */
  document.dispatchEvent(new CustomEvent("content:ready"));
})();
