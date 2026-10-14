/* ==========================================================
   MVP SMP: script.js
   EDIT THE CONFIG BELOW with your real details.
   ========================================================== */
const CONFIG = {
  serverIP: "play.your-server-ip.example",        // PLACEHOLDER: your server address
  discordUrl: "https://discord.gg/YOUR_INVITE",   // PLACEHOLDER: your Discord invite
  storeUrl: "https://your-store.example",         // PLACEHOLDER: your store (or delete the Store section in index.html)
  leaderboardUrl: "https://your-leaderboard.example", // PLACEHOLDER: your leaderboard page (or delete the section)
  minecraftVersion: "[PLACEHOLDER: version]",     // PLACEHOLDER: Minecraft version
  videoId: "V2aUpnHDM1E"                          // YouTube trailer ID, looped in the hero background
};

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Apply config ---------- */
  const DEFAULTS = {
    serverIP: "play.your-server-ip.example",
    discordUrl: "YOUR_INVITE",
    storeUrl: "your-store.example",
    leaderboardUrl: "your-leaderboard.example"
  };
  const ipPh = CONFIG.serverIP === DEFAULTS.serverIP;
  const verPh = CONFIG.minecraftVersion.indexOf("PLACEHOLDER") !== -1;
  const isPh = (key) => String(CONFIG[key]).includes(DEFAULTS[key]);

  $$("[data-ip]").forEach((e) => { e.textContent = CONFIG.serverIP; e.classList.toggle("ph", ipPh); });
  $$("[data-version]").forEach((e) => { e.textContent = CONFIG.minecraftVersion; e.classList.toggle("ph", verPh); });
  $$("[data-link]").forEach((a) => {
    const key = a.getAttribute("data-link");
    if (CONFIG[key]) a.setAttribute("href", CONFIG[key]);
  });
  if (!ipPh) $$(".ph-note").forEach((n) => { if (/IP|address/i.test(n.textContent)) n.remove(); });
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let tt;
  function showToast(m) {
    toast.textContent = m;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ---------- Background trailer loop (muted autoplay; skipped for reduced motion / data saver) ---------- */
  const vbg = $("#video-bg"), frame = $("#bg-video");
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!reduceMotion && !saveData && CONFIG.videoId) {
    const p = new URLSearchParams({
      autoplay: 1, mute: 1, loop: 1, playlist: CONFIG.videoId, controls: 0,
      modestbranding: 1, playsinline: 1, rel: 0, iv_load_policy: 3, disablekb: 1, fs: 0
    });
    frame.addEventListener("load", () => setTimeout(() => vbg.classList.add("ready"), 1500));
    frame.src = "https://www.youtube-nocookie.com/embed/" + CONFIG.videoId + "?" + p.toString();
  }

  /* ---------- Copy IP ---------- */
  async function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return; }
    const ta = document.createElement("textarea");
    ta.value = t; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (!ok) throw new Error("copy failed");
  }
  function bindCopy(btn) {
    if (!btn) return;
    const label = $("span", btn);
    const orig = label.textContent;
    btn.addEventListener("click", async () => {
      try {
        await copyText(CONFIG.serverIP);
        label.textContent = "Copied!";
        showToast(ipPh ? "Copied the placeholder IP. Set your real IP in js/script.js." : "Server IP copied to clipboard");
      } catch (e) {
        showToast("Couldn't copy automatically. Please copy the IP manually.");
      }
      setTimeout(() => (label.textContent = orig), 1800);
    });
  }
  bindCopy($("#copy-ip"));
  bindCopy($("#copy-ip-2"));

  /* ---------- Placeholder link guards ---------- */
  $$("[data-link]").forEach((a) => {
    const key = a.getAttribute("data-link");
    if (DEFAULTS[key] && isPh(key)) {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("This link is a placeholder. Set it in js/script.js.");
      });
    }
  });
  $$("[data-ph-link]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("This community link is a placeholder. Edit it in index.html.");
  }));

  /* ---------- Mobile navigation ---------- */
  const nav = $("#nav"), toggle = $("#nav-toggle"), menu = $("#nav-menu");
  function setMenu(o) {
    menu.classList.toggle("open", o);
    nav.classList.toggle("menu-open", o);
    toggle.setAttribute("aria-expanded", String(o));
  }
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active link + reveal on scroll ---------- */
  const links = $$(".nav-link");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.map((l) => $(l.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));

    const rev = $$(".reveal");
    rev.forEach((el) => {
      const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--d", Math.min(idx, 6) * 0.08 + "s");
    });
    const io = new IntersectionObserver((es, o) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); o.unobserve(en.target); }
    }), { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    rev.forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Hero particles ---------- */
  const box = $("#particles");
  if (box && !reduceMotion) {
    const n = window.innerWidth < 600 ? 14 : 28;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = 8 + Math.random() * 10 + "s";
      s.style.animationDelay = -Math.random() * 14 + "s";
      s.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
      box.appendChild(s);
    }
  }
})();
