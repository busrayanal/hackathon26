(function () {
  "use strict";

  const D = window.HACKATECH;
  const root = document.documentElement;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const animate = hasGsap && !reduceMotion;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let lang = "tr";
  try {
    const saved = localStorage.getItem("hackatech-lang");
    if (saved === "tr" || saved === "en") lang = saved;
  } catch (e) {}

  let lenis = null;
  let aboutTween = null;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("gsap");
  }

  const svg = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const ICON = {
    pin: svg('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    insta: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>')
  };

  const EMAILS = [].concat(D.emails || D.email || []).filter(Boolean);

  const MARQUEE = {
    tr: ["KODLA", "ÜRET", "SUN", "KAZAN", "HACKATHON’26"],
    en: ["CODE", "BUILD", "PITCH", "WIN", "HACKATHON’26"]
  };

  function make(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  // Binds a bilingual {tr, en} text to an element so applyLang can swap it.
  function bi(node, text) {
    node.setAttribute("data-tr", text.tr);
    node.setAttribute("data-en", text.en);
    node.innerHTML = text[lang];
    return node;
  }

  const fmt = (n) => n.toLocaleString("tr-TR");

  /* ---------- Rendering ---------- */

  function renderSchedule() {
    const track = $("#track");
    let step = 0;
    D.schedule.forEach((day, i) => {
      const dayClass = `day-${i + 1}`;
      const card = make("article", `day-card ${dayClass}`, `<span class="day-num" aria-hidden="true">0${i + 1}</span>`);
      const top = make("div");
      top.append(bi(make("p", "day-label mono"), day.label), bi(make("h3", "day-title"), day.title));
      if (day.badge) top.append(bi(make("span", "day-badge mono"), day.badge));
      const bottom = make("div");
      bottom.append(bi(make("p", "day-date"), day.date), make("p", "day-venue", `${ICON.pin}<span>${day.venue}</span>`));
      card.append(top, bottom);
      track.append(card);

      day.items.forEach((item) => {
        const slot = make("article", `card slot ${dayClass}`);
        step += 1;
        const num = String(step).padStart(2, "0");
        const body = make("div", "slot-body");
        const meta = make("div", "slot-meta");
        meta.append(make("span", "slot-time", item.time || num), bi(make("span", "slot-day mono"), day.label));
        body.append(meta, bi(make("h4"), item.title), bi(make("p"), item.desc));
        slot.append(
          make("span", "slot-node", "<i></i>"),
          make("div", `slot-visual v-${item.visual || "default"}`, SLOT_VISUALS[item.visual] || ""),
          make("span", "slot-ghost", num),
          body
        );
        track.append(slot);
      });
    });
  }

  const SLOT_VISUALS = {
    unlock: `<span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
      <svg class="lock" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path class="shackle" d="M15 22v-6a9 9 0 0 1 18 0v6"/><rect x="9" y="22" width="30" height="20" rx="4"/><circle cx="24" cy="32" r="2.6"/></svg>`,
    code: `<div class="term"><div class="term-bar"><i></i><i></i><i></i><span>model.py</span></div>
      <div class="term-body"><span class="ln l1"></span><span class="ln l2"></span><span class="ln l3"></span><span class="ln l4"></span><span class="caret"></span></div></div>`,
    pitch: `<div class="screen"><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div><span class="stand"></span>`,
    judge: `<div class="stars">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>'.repeat(5)}</div>
      <div class="score mono">9.<b>4</b></div>`,
    trophy: `<span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span><span class="spark s4"></span>
      <i class="confetti c1"></i><i class="confetti c2"></i><i class="confetti c3"></i><i class="confetti c4"></i><i class="confetti c5"></i><i class="confetti c6"></i>
      <svg class="cup" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M16 42h16M24 34v8M14 8h20v10a10 10 0 0 1-20 0V8z"/><path d="M34 11h6v3a6 6 0 0 1-6 6M14 11H8v3a6 6 0 0 0 6 6"/></svg>`
  };

  function initials(name) {
    const parts = name.split(/\s+/).filter((w) => w && !w.endsWith("."));
    if (!parts.length) return "?";
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }

  function renderJuryBand() {
    const band = $("#juryBand");
    const items = D.jury
      .map((j) => (j.name ? `<span class="named">${(j.title ? j.title + " " : "") + j.name}</span>` : "<span>? ? ?</span>"))
      .map((s) => s + "<b>✦</b>")
      .join("");
    band.innerHTML = items.repeat(3) + items.repeat(3);
  }

  // Zooms the photo so the face given in photoFocus lands slightly above the portrait centre.
  function portraitStyle(j) {
    const zoom = j.photoZoom || 1;
    if (!j.photoFocus || zoom === 1) return "";
    const [fx, fy] = j.photoFocus.split(" ").map((v) => parseFloat(v) / 100);
    const origin = (face, target) => ((zoom * face - target) / (zoom - 1)) * 100;
    return `transform:scale(${zoom});transform-origin:${origin(fx, 0.5).toFixed(1)}% ${origin(fy, 0.42).toFixed(1)}%;`;
  }

  function renderJury() {
    const featured = $("#juryFeatured");
    const tba = $("#juryTba");
    const ringText = {
      tr: "JÜRİ ÜYESİ ✦ HACKATHON’26 ✦ JÜRİ ÜYESİ ✦ HACKATHON’26 ✦ ",
      en: "JURY MEMBER ✦ HACKATHON’26 ✦ JURY MEMBER ✦ HACKATHON’26 ✦ "
    };

    D.jury.filter((j) => j.name).forEach((j, i) => {
      const fullName = (j.title ? j.title + " " : "") + j.name;
      const card = make("article", "juror-stage" + (i % 2 ? " reverse" : ""));

      const portrait = j.photo
        ? `<div class="portrait-img"><img src="${j.photo}" alt="${fullName}" loading="lazy" style="${portraitStyle(j)}"></div>`
        : `<div class="portrait-img"><span class="portrait-initials">${initials(j.name)}</span></div>`;
      const stage = make("div", "stage", `
        <span class="stage-beam" aria-hidden="true"></span>
        <span class="stage-index" aria-hidden="true">0${i + 1}</span>
        <div class="stage-rings" aria-hidden="true">
          <span class="ring ring-2"><i></i></span>
          <span class="ring ring-1"><i></i></span>
        </div>
        <svg class="stage-text" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="ring-path-${i}" d="M100,100 m-93,0 a93,93 0 1,1 186,0 a93,93 0 1,1 -186,0"/></defs>
          <text><textPath href="#ring-path-${i}" textLength="580" lengthAdjust="spacing"></textPath></text>
        </svg>
        <div class="portrait">${portrait}<span class="portrait-tint"></span></div>`);
      bi(stage.querySelector("textPath"), ringText);

      const info = make("div", "stage-info");
      const index = make("p", "jf-index mono");
      index.append(bi(make("span"), { tr: "Jüri", en: "Jury" }), document.createTextNode(` / 0${i + 1}`));
      info.append(index);
      if (j.title) info.append(make("p", "stage-title", j.title));
      info.append(make("h3", "stage-name", j.name.split(" ").map((w) => `<span class="mask"><span class="inner">${w}</span></span>`).join("")));
      if (j.role) info.append(bi(make("p", "stage-role"), j.role));
      if (j.org) info.append(make("p", "stage-org", j.org));
      if (j.bio) info.append(bi(make("p", "stage-bio"), j.bio));
      if (j.tags && j.tags.length) {
        const tags = make("ul", "jf-tags");
        j.tags.forEach((t) => tags.append(bi(make("li"), t)));
        info.append(tags);
      }

      card.append(stage, info);
      featured.append(card);
    });

    const known = D.jury.filter((j) => j.name).length;
    const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    D.jury.filter((j) => !j.name).forEach((_, i) => {
      const card = make("article", "card juror-tba");
      card.setAttribute("data-reveal", "");
      card.innerHTML = `
        <div class="tba-top mono">
          <span data-tr="Jüri / ${String(known + i + 1).padStart(2, "0")}" data-en="Jury / ${String(known + i + 1).padStart(2, "0")}">${lang === "en" ? "Jury" : "Jüri"} / ${String(known + i + 1).padStart(2, "0")}</span>
          <span class="tba-lock">${lock}<span data-tr="Gizli" data-en="Classified">${lang === "en" ? "Classified" : "Gizli"}</span></span>
        </div>
        <div class="tba-avatar" aria-hidden="true">
          <span class="tba-ring"></span>
          <span class="tba-radar"></span>
          <svg class="tba-silhouette" viewBox="0 0 100 100"><circle cx="50" cy="40" r="17"/><path d="M16 100c0-21 15-34 34-34s34 13 34 34z"/></svg>
          <span class="tba-q">?</span>
          <span class="tba-scan"></span>
        </div>
        <p class="scramble tba-name" data-len="11" aria-hidden="true"></p>
        <div class="tba-redact" aria-hidden="true"><i></i><i></i></div>
        <p class="tba-status mono"><span class="tba-dot"></span><span data-tr="Kimliği yakında açıklanacak" data-en="Identity revealed soon">${lang === "en" ? "Identity revealed soon" : "Kimliği yakında açıklanacak"}</span></p>`;
      tba.append(card);
    });
  }

  function initScramble() {
    const chars = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ#%&@$*01";
    $$(".scramble").forEach((el) => {
      const len = Number(el.dataset.len) || 13;
      const render = () => {
        let s = "";
        for (let i = 0; i < len; i++) s += i % 7 === 6 ? " " : chars[Math.floor(Math.random() * chars.length)];
        el.textContent = s;
      };
      render();
      if (reduceMotion || !("IntersectionObserver" in window)) return;
      let timer = null;
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !timer) timer = setInterval(render, 90);
        else if (!entry.isIntersecting && timer) { clearInterval(timer); timer = null; }
      }).observe(el);
    });
  }

  function renderSponsors() {
    const grid = $("#sponsorGrid");
    D.sponsors.forEach((s) => {
      const card = make(s.url ? "a" : "article", "card sponsor tilt");
      card.setAttribute("data-reveal", "");
      if (s.url) {
        card.href = s.url;
        card.target = "_blank";
        card.rel = "noopener";
      }
      if (s.logo) {
        const img = new Image();
        img.src = s.logo;
        img.alt = s.name;
        img.loading = "lazy";
        card.append(img);
      } else {
        card.append(make("span", "sponsor-word", s.name));
      }
      if (s.tier) card.append(bi(make("span", "tier"), s.tier));
      grid.append(card);
    });

    const cta = make("button", "card sponsor sponsor-cta tilt");
    cta.type = "button";
    cta.setAttribute("data-reveal", "");
    cta.setAttribute("aria-haspopup", "dialog");
    cta.addEventListener("click", openSponsorDialog);
    cta.append(
      make("span", "plus", ICON.plus),
      bi(make("h3"), { tr: "Sponsorumuz olun", en: "Become a sponsor" }),
      bi(make("span", "tier"), { tr: "Bizimle iletişime geçin", en: "Get in touch" })
    );
    grid.append(cta);
  }

  function openSponsorDialog() {
    const dlg = $("#sponsorDialog");
    if (typeof dlg.showModal !== "function") {
      location.hash = "#iletisim";
      return;
    }
    dlg.showModal();
    if (lenis) lenis.stop();
  }

  function initSponsorDialog() {
    const dlg = $("#sponsorDialog");
    dlg.addEventListener("close", () => {
      $("#copyToast").classList.remove("show");
      document.body.append($("#copyToast"));
      if (lenis) lenis.start();
    });
    dlg.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return dlg.close();
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close();
    });
  }

  function renderPartners() {
    const inner = $("#partnersInner");
    const set = (hidden) => D.partners.map((p) => {
      const item = make("div", "partner");
      const img = new Image();
      img.src = p.logo;
      img.alt = hidden ? "" : p.name;
      const text = make("div");
      text.append(bi(make("span", "partner-role mono"), p.role), make("span", "partner-name", p.name));
      item.append(img, text);
      if (hidden) item.setAttribute("aria-hidden", "true");
      return [item, make("b", null, "✦")];
    }).flat();
    // Two identical halves so the CSS loop at -50% is seamless; each half repeats the set to fill wide screens.
    for (let i = 0; i < 6; i++) inner.append(...set(i > 0));
  }

  function renderFaq() {
    const list = $("#faqList");
    D.faq.forEach((f) => {
      const item = make("details", "faq-item");
      item.setAttribute("data-reveal", "");
      const summary = make("summary");
      summary.append(bi(make("span"), f.q), make("span", "faq-icon"));
      const answer = make("div", "faq-a");
      answer.append(bi(make("p"), f.a));
      item.append(summary, answer);
      item.addEventListener("toggle", () => hasGsap && ScrollTrigger.refresh());
      list.append(item);
    });
  }

  function setupLinks() {
    const btn = $("#applyBtn");
    const label = $("#applyBtnLabel");
    const closesAt = D.applyDeadline ? new Date(D.applyDeadline).getTime() : Infinity;
    if (Date.now() >= closesAt) {
      btn.classList.add("is-soon");
      btn.setAttribute("aria-disabled", "true");
      bi(label, { tr: "Başvurular Kapandı", en: "Applications Closed" });
    } else if (D.formUrl) {
      btn.href = D.formUrl;
      btn.target = "_blank";
      btn.rel = "noopener";
      bi(label, { tr: "Başvuru Formuna Git", en: "Open Application Form" });
    } else {
      btn.classList.add("is-soon");
      btn.setAttribute("aria-disabled", "true");
      bi(label, { tr: "Başvurular Yakında Açılıyor", en: "Applications Opening Soon" });
    }

    const deadline = $("#deadline");
    if (D.applyDeadline) {
      const d = new Date(D.applyDeadline);
      const opts = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" };
      bi(deadline, {
        tr: "Son başvuru: " + d.toLocaleString("tr-TR", opts),
        en: "Deadline: " + d.toLocaleString("en-GB", opts) + " (Turkey time)"
      });
    } else {
      bi(deadline, {
        tr: "Başvurular yarışmadan yaklaşık bir hafta önce kapanacak.",
        en: "Applications close about one week before the event."
      });
    }

    const contact = $("#contactLinks");
    const arrow = '<svg class="cc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    const copyIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    const row = (r) => `
      <li class="cc-row">
        <a class="cc-value" href="${r.href}"${r.ext ? ' target="_blank" rel="noopener"' : ""}>${r.text}</a>
        ${r.copy ? `<button class="cc-copy" type="button" data-copy="${r.copy}" aria-label="Kopyala: ${r.copy}">${copyIco}</button>` : ""}
      </li>`;
    const card = (o) => `
      <div class="contact-card tilt" data-reveal>
        <span class="cc-icon">${o.icon}<i></i></span>
        ${arrow}
        <span class="cc-label mono" data-tr="${o.label.tr}" data-en="${o.label.en}">${o.label[lang]}</span>
        <ul class="cc-rows">${o.rows.map(row).join("")}</ul>
        ${o.cta ? `<span class="cc-cta" data-tr="${o.cta.tr}" data-en="${o.cta.en}">${o.cta[lang]}</span>` : ""}
      </div>`;
    const cards = [];
    if (EMAILS.length) cards.push(card({
      icon: ICON.mail,
      label: { tr: "E-posta", en: "Email" },
      rows: EMAILS.map((m) => ({ href: "mailto:" + m, text: m.replace("@", "<wbr>@"), copy: m }))
    }));
    const phones = (D.phones || []).map((p) => (typeof p === "string" ? { number: p } : p));
    const phoneRow = (p) => ({
      href: "tel:+90" + p.number.replace(/\D/g, "").replace(/^0/, ""),
      text: p.name ? `${p.number}<span class="cc-who">${p.name}</span>` : p.number,
      copy: p.number
    });
    if (phones.length) cards.push(card({
      icon: ICON.phone,
      label: { tr: "Telefon", en: "Phone" },
      rows: phones.map(phoneRow)
    }));
    if (D.instagram) {
      const user = D.instagram.replace(/^@/, "");
      cards.push(card({
        icon: ICON.insta,
        label: { tr: "Instagram", en: "Instagram" },
        rows: [{ href: "https://www.instagram.com/" + user, ext: true, text: "@" + user }],
        cta: { tr: "Duyurular için bizi takip et.", en: "Follow us for announcements." }
      }));
    }
    if (cards.length) {
      contact.innerHTML = cards.join("");
      contact.style.setProperty("--n", cards.length);
    } else contact.append(bi(make("span"), { tr: "İletişim bilgileri yakında paylaşılacak.", en: "Contact details coming soon." }));

    const spGroups = [];
    const spEmails = D.sponsorEmails ? [].concat(D.sponsorEmails).filter(Boolean) : EMAILS;
    if (spEmails.length) spGroups.push({
      label: { tr: "E-posta", en: "Email" }, icon: ICON.mail,
      rows: spEmails.map((m) => ({ href: `mailto:${m}?subject=${encodeURIComponent("Hackathon’26 Sponsorluk")}`, text: m.replace("@", "<wbr>@"), copy: m }))
    });
    const spPhones = D.sponsorPhones ? D.sponsorPhones.map((p) => (typeof p === "string" ? { number: p } : p)) : phones;
    if (spPhones.length) spGroups.push({
      label: { tr: "Telefon", en: "Phone" }, icon: ICON.phone,
      rows: spPhones.map(phoneRow)
    });
    $("#sponsorContacts").innerHTML = spGroups.map((g) => `
      <div class="sp-group">
        <span class="sp-label mono"><span class="sp-ico">${g.icon}</span><span data-tr="${g.label.tr}" data-en="${g.label.en}">${g.label[lang]}</span></span>
        <ul class="cc-rows">${g.rows.map(row).join("")}</ul>
      </div>`).join("");

    const toast = $("#copyToast");
    let toastTimer;
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".cc-copy");
      if (!btn) return;
      const done = () => {
        (btn.closest("dialog") || document.body).append(toast);
        bi(toast, { tr: "Kopyalandı: " + btn.dataset.copy, en: "Copied: " + btn.dataset.copy });
        toast.classList.add("show");
        btn.classList.add("ok");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.classList.remove("show"); btn.classList.remove("ok"); }, 2200);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(done, () => {});
    });

    const venues = $(".venues");
    $$(".venue[data-venue]").forEach((card) => {
      const on = () => { venues.classList.add("focus-" + card.dataset.venue); card.classList.add("is-focus"); };
      const off = () => { venues.classList.remove("focus-a", "focus-b"); card.classList.remove("is-focus"); };
      card.addEventListener("pointerenter", on);
      card.addEventListener("pointerleave", off);
      card.addEventListener("focusin", on);
      card.addEventListener("focusout", off);
    });

    $$("[data-map]").forEach((a) => {
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a.dataset.map);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function renderMarquee() {
    const inner = $(".marquee-inner");
    const words = MARQUEE[lang].concat(MARQUEE[lang]);
    const half = words.map((w, i) => `<span class="${i % 2 ? "" : "solid"}">${w}</span><b>✦</b>`).join("");
    inner.innerHTML = half + half;
  }

  function splitAbout() {
    const el = $("#aboutText");
    el.innerHTML = D.about[lang]
      .split(" ")
      .map((w) => `<span class="w${w.startsWith("*") ? " hl" : ""}">${w.replace(/\*/g, "")}</span>`)
      .join(" ");

    if (!animate) return;
    if (aboutTween) {
      aboutTween.scrollTrigger.kill();
      aboutTween.kill();
    }
    aboutTween = gsap.fromTo(
      el.querySelectorAll(".w"),
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.6 }
      }
    );
  }

  /* ---------- Language ---------- */

  function applyLang(next) {
    lang = next;
    root.lang = next;
    $$("[data-en]").forEach((n) => {
      if (!n.hasAttribute("data-tr")) n.setAttribute("data-tr", n.innerHTML);
      n.innerHTML = n.getAttribute(next === "en" ? "data-en" : "data-tr");
    });
    $$(".lang-opt").forEach((o) => o.classList.toggle("on", o.dataset.l === next));
    document.title = next === "en"
      ? "Hackathon’26 · AI Hackathon in Erzincan"
      : "Hackathon’26 · Erzincan Yapay Zeka Hackathonu";
    renderMarquee();
    splitAbout();
    try { localStorage.setItem("hackatech-lang", next); } catch (e) {}
    if (hasGsap) ScrollTrigger.refresh();
  }

  /* ---------- Countdown ---------- */

  // Counts down to the application deadline, then switches to the event start.
  function startCountdown() {
    const deadline = D.applyDeadline ? new Date(D.applyDeadline).getTime() : 0;
    const eventStart = new Date(D.eventStart).getTime();
    const title = $("#cdTitle");
    const els = ["cdD", "cdH", "cdM", "cdS"].map((id) => document.getElementById(id));
    const pad = (n) => String(n).padStart(2, "0");
    let phase = null;
    const tick = () => {
      const now = Date.now();
      const next = now < deadline ? "apply" : "event";
      if (next !== phase) {
        phase = next;
        bi(title, phase === "apply"
          ? { tr: "Son başvuruya kalan süre", en: "Time left to apply" }
          : { tr: "Etkinliğe kalan süre", en: "Countdown to the event" });
      }
      let diff = Math.max(0, (phase === "apply" ? deadline : eventStart) - now);
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      [d, h, m, s].forEach((v, i) => {
        const text = pad(v);
        if (els[i].textContent !== text) els[i].textContent = text;
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Scrolling & navigation ---------- */

  function initLenis() {
    if (!window.Lenis || reduceMotion) return;
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    lenis.stop();
  }

  function initNav() {
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $("#langToggle").addEventListener("click", () => applyLang(lang === "tr" ? "en" : "tr"));

    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href.length < 2) return;
      const target = href === "#top" ? 0 : document.querySelector(href);
      if (target == null) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: target === 0 ? 0 : -60, duration: 1.6 });
      } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  /* ---------- Animations ---------- */

  function initAnimations() {
    // The pinned schedule must be created first so triggers below it account for its spacing.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const track = $("#track");
      const bar = $(".hprogress span");
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: "#program",
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; }
        }
      });
      $$("#track .slot, #track .day-card").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: slide,
          start: "left 62%",
          end: "right 38%",
          toggleClass: { targets: card, className: "is-active" }
        });
      });
    });
    mm.add("(max-width: 899px)", () => {
      const track = $("#track");
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting));
      }, { root: track, threshold: 0.6 });
      $$("#track .slot, #track .day-card").forEach((card) => io.observe(card));
      return () => io.disconnect();
    });

    gsap.set("[data-reveal]", { y: 50, opacity: 0 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.1, overwrite: true })
    });

    $$(".h2, .apply-title").forEach((h) => {
      gsap.from(h.querySelectorAll(".inner"), {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: h, start: "top 88%" }
      });
    });

    gsap.from(".footer-mega span", {
      yPercent: 60,
      opacity: 0,
      duration: 1.6,
      ease: "expo.out",
      scrollTrigger: { trigger: ".footer-mega", start: "top 98%" }
    });

    $$(".eyebrow").forEach((e) => {
      gsap.from(e, { opacity: 0, x: -24, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: e, start: "top 90%" } });
    });

    $$("[data-count]").forEach((n) => {
      const end = Number(n.dataset.count);
      const suffix = n.dataset.suffix || "";
      const state = { v: 0 };
      n.textContent = fmt(0) + suffix;
      ScrollTrigger.create({
        trigger: n,
        start: "top 92%",
        once: true,
        onEnter: () => gsap.to(state, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          onUpdate: () => { n.textContent = fmt(Math.round(state.v)) + suffix; }
        })
      });
    });

    $$(".juror-stage").forEach((js) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: js, start: "top 72%" } });
      tl.from(js.querySelector(".portrait"), { scale: 0.35, opacity: 0, duration: 1.5, ease: "expo.out" })
        .from(js.querySelector(".portrait-img"), { scale: 1.7, duration: 2, ease: "expo.out" }, 0)
        .from(js.querySelector(".stage-rings"), { scale: 0.5, opacity: 0, rotate: -90, duration: 1.6, ease: "expo.out" }, 0.1)
        .from(js.querySelector(".stage-text"), { opacity: 0, scale: 1.2, duration: 1.4, ease: "expo.out" }, 0.25)
        .from(js.querySelector(".stage-beam"), { opacity: 0, duration: 1.6 }, 0.2)
        .from(js.querySelectorAll(".stage-name .inner"), { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.25)
        .from(js.querySelectorAll(".stage-info > :not(.stage-name)"), { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 }, 0.35);

      gsap.to(js.querySelector(".stage-text"), {
        rotate: 220,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: { trigger: js, start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.fromTo(js.querySelector(".stage-index"), { yPercent: 40 }, {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: js, start: "top bottom", end: "bottom top", scrub: true }
      });
      ScrollTrigger.create({ trigger: js, start: "top 55%", end: "bottom 35%", toggleClass: { targets: js, className: "lit" } });
    });

    gsap.to(".hero-inner", {
      yPercent: -12,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    const loop = gsap.to(".marquee-inner", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
        gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1.2 }) });
      }
    });

    gsap.fromTo(".apply-bg", { xPercent: 5 }, {
      xPercent: -35,
      ease: "none",
      scrollTrigger: { trigger: ".apply", start: "top bottom", end: "bottom top", scrub: true }
    });

    $$("main section[id]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (!self.isActive) return;
          $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
        }
      });
    });
  }

  function initPointerFx() {
    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        gsap.to(card, { rotateY: (px - 0.5) * 8, rotateX: (0.5 - py) * 8, transformPerspective: 900, duration: 0.6, ease: "power2.out" });
      });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1, 0.6)" });
      });
    });

    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.25,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.4,
          ease: "power3.out"
        });
      });
      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      });
    });

    const glow = $(".cursor-glow");
    const xTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
    window.addEventListener("pointermove", (e) => {
      root.classList.add("has-cursor");
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });
  }

  /* ---------- Loader & intro ---------- */

  function intro(tl, position) {
    tl.from(".hero-title .ch", { yPercent: 120, rotate: 8, duration: 1.3, ease: "expo.out", stagger: 0.055 }, position)
      .from([".hero-kicker", ".hero-sub", ".hero-meta", ".cd-title", ".countdown", ".hero-cta", ".scroll-hint"], {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08
      }, "-=1.0");
  }

  function runLoader() {
    const loader = $("#loader");
    const word = $(".loader-word");
    const num = $("#loaderNum");
    let loaded = document.readyState === "complete";
    window.addEventListener("load", () => { loaded = true; });

    const start = performance.now();
    const minTime = reduceMotion ? 200 : 1500;
    const maxTime = 4000;

    const step = (now) => {
      const elapsed = now - start;
      const done = elapsed >= minTime && (loaded || elapsed >= maxTime);
      let p = 1 - Math.pow(1 - Math.min(1, elapsed / minTime), 3);
      p = done ? 1 : Math.min(p, 0.92);
      const pct = Math.round(p * 100);
      num.textContent = pct;
      word.style.setProperty("--p", pct + "%");
      if (done) finish();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    function finish() {
      document.body.classList.remove("is-loading");
      if (lenis) lenis.start();
      if (animate) {
        const tl = gsap.timeline();
        tl.to(loader, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }).set(loader, { display: "none" });
        intro(tl, "-=0.45");
      } else {
        loader.style.display = "none";
      }
      if (hasGsap) ScrollTrigger.refresh();
    }
  }

  /* ---------- Init ---------- */

  renderSchedule();
  renderJury();
  renderJuryBand();
  renderSponsors();
  renderFaq();
  renderPartners();
  setupLinks();
  applyLang(lang);
  initScramble();
  startCountdown();
  initLenis();
  initNav();
  initSponsorDialog();
  if (animate) initAnimations();
  if (animate && finePointer) initPointerFx();
  runLoader();
})();
