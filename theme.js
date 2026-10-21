/* MVP site theme: "Blue" (default) or "Light" (white). The choice is remembered in this browser. */
(function () {
  var KEY = "mvp_site_theme", root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY) === "light" ? "light" : "blue"; } catch (e) { return "blue"; } }
  function apply(t) {
    if (t === "light") root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "light" ? "#ffffff" : "#03080f");
  }
  apply(get());
  var L='html[data-theme="light"]';
  var css = L+'{background:#fff;filter:invert(1) hue-rotate(180deg)}' +
    L+' img,'+L+' video,'+L+' canvas,'+L+' picture,'+L+' #mvpPromo,'+L+' iframe,'+L+' .wc-ic,'+L+' [style*="background-image"]{filter:invert(1) hue-rotate(180deg)}' +
    L+' .link-discord,'+L+' .copy,'+L+' .buy,'+L+' .mgb:not(.ghost),'+L+' .cm-go,'+L+' .st-av,'+L+' .tile,'+L+' .wc,'+L+' .st-b.red,'+L+' .wc-bdg,'+L+' .wc-mi{filter:invert(1) hue-rotate(180deg)}' +
    L+' .logo{filter:invert(1) hue-rotate(180deg) drop-shadow(0 1px 3px rgba(3,8,15,.55))}' +
    L+' .wc img,'+L+' .wc-ic img,'+L+' .st-av img,'+L+' .tile img,'+L+' .wc-bdg img,'+L+' .wc-mi img{filter:none}' +
    L+' dialog img,'+L+' dialog video,'+L+' dialog .logo{filter:none}' +
    L+' .mvp-tt{filter:none}' +
    '.mvp-tt{flex:none;width:38px;height:38px;margin:0 2px 0 4px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#cfe6f7;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;transition:background .2s,transform .2s}' +
    '.mvp-tt:hover{background:rgba(255,255,255,.16);transform:scale(1.06)}.mvp-tt svg{width:18px;height:18px}' +
    '@media (max-width:640px){.nav .link-discord .dt{display:none}}' +
    '@media (max-width:520px){.nav .brand-text{display:none}.nav .logo{width:38px;height:21px}}' +
    '@media (max-width:440px){.nav{padding-left:10px!important}.nav .menu{gap:0!important}.nav .link{padding:9px 7px!important;font-size:.82rem!important}.nav .link-discord{padding:8px 10px!important}.nav .dc{width:20px;height:15px}}' +
    '@media (max-width:370px){.nav .link{padding:9px 5px!important;font-size:.76rem!important}.nav .logo{width:32px;height:18px}}';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var DROP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/></svg>';
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  }
  window.mvpTheme = { get: get, set: function (t) { try { localStorage.setItem(KEY, t === "light" ? "light" : "blue"); } catch (e) {} apply(t === "light" ? "light" : "blue"); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();

/* Red dot on the News link when there is news the visitor has not opened yet. */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev", SEEN = "mvp_news_seen", CACHE = "mvp_news_top";
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function link() { var a = document.querySelectorAll("a.link"); for (var i = 0; i < a.length; i++) { var h = (a[i].getAttribute("href") || "").replace(/\/+$/, ""); if (/(^|\/)news$/.test(h)) return a[i]; } return null; }
  function paint(top) {
    var a = link(); if (!a) return;
    var onNews = /\/news(\/|$)/.test(location.pathname);
    if (onNews) { ls(SEEN, String(top)); return; }
    var seen = Number(ls(SEEN) || 0);
    if (!seen) { ls(SEEN, String(top)); return; }   // first visit ever: nothing to flag
    if (top > seen && !a.querySelector(".nw-dot")) {
      if (!document.getElementById("nwdotcss")) { var st = document.createElement("style"); st.id = "nwdotcss"; st.textContent = ".nw-dot{position:absolute;top:-2px;right:-9px;width:9px;height:9px;border-radius:50%;background:#ff3b4a;box-shadow:0 0 0 2px rgba(3,8,15,.9)}"; document.head.appendChild(st); }
      if (getComputedStyle(a).position === "static") a.style.position = "relative";
      var d = document.createElement("span"); d.className = "nw-dot"; d.setAttribute("aria-label", "New news"); a.appendChild(d);
    }
  }
  function go() {
    var c = null; try { c = JSON.parse(sessionStorage.getItem(CACHE) || "null"); } catch (e) {}
    if (c && Date.now() - c.t < 50000) { paint(c.top); return; }
    fetch(API + "/api/news").then(function (r) { return r.ok ? r.json() : []; }).then(function (l) {
      var top = 0; (l || []).forEach(function (n) { if (n && n.id > top) top = n.id; });
      if (!top) return;
      try { sessionStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), top: top })); } catch (e) {}
      paint(top);
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  setInterval(function () { if (!document.hidden) go(); }, 60000);
})();

/* Live alerts on every page except My card (that page has its own): a small popup in the corner + a quiet chime when something new arrives. */
(function () {
  if (/\/card\/?$/.test(location.pathname)) return;
  var API = "https://mvp-news-api.mvp-shop.workers.dev", KEY = "mvp_card_token", last = null, busy = false, AC = null;
  function tok() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
  function chime() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      [660, 880].forEach(function (f, i) {
        var t = AC.currentTime + i * 0.12, os = AC.createOscillator(), g = AC.createGain();
        os.type = "sine"; os.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        os.connect(g); g.connect(AC.destination); os.start(t); os.stop(t + 0.4);
      });
    } catch (e) {}
  }
  ["click", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, function () { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) {} }, true); });
  function toast(title, text, href, nick) {
    if (!document.getElementById("mtcss")) { var st = document.createElement("style"); st.id = "mtcss"; st.textContent = ".mt{position:fixed;right:18px;bottom:18px;z-index:2147483000;max-width:min(340px,calc(100vw - 36px));display:flex;gap:12px;align-items:center;padding:12px 16px;border-radius:16px;background:#0e2236;color:#fff;border:1px solid rgba(111,208,255,.35);box-shadow:0 14px 40px rgba(0,0,0,.5);cursor:pointer;font:500 .9rem Inter,system-ui,sans-serif}.mt b{display:block;font-weight:700}.mt span{display:block;color:#b9cddd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:230px}.mt img{width:36px;height:36px;border-radius:8px;image-rendering:pixelated;flex:none}"; document.head.appendChild(st); }
    var old = document.getElementById("mvptoast"); if (old) old.remove();
    var t = document.createElement("div"); t.id = "mvptoast"; t.className = "mt";
    if (nick) { var im = document.createElement("img"); im.alt = ""; im.src = API + "/api/skin/" + encodeURIComponent(nick); im.onerror = function () { im.remove(); }; t.appendChild(im); }
    var d = document.createElement("div"), b = document.createElement("b"), s = document.createElement("span"); b.textContent = title; s.textContent = text; d.appendChild(b); d.appendChild(s); t.appendChild(d);
    t.onclick = function () { location.href = href; };
    document.body.appendChild(t); setTimeout(function () { if (t.parentNode) t.remove(); }, 7000);
    chime();
    try { if (window.Notification && Notification.permission === "granted" && !document.hasFocus()) { var nt = new Notification(title, { body: text, icon: "/icon-192.png", tag: "mvp-live" }); nt.onclick = function () { window.focus(); nt.close(); }; } } catch (e) {}
  }
  var lastT = 0;
  function tick() {
    var k = tok(); if (!k || busy) return;
    // a hidden tab checks only once a minute (saves the daily request limit)
    if (document.hidden && Date.now() - lastT < 60000) return;
    lastT = Date.now(); busy = true;
    fetch(API + "/api/app/pulse", { headers: { Authorization: "Bearer " + k } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (n) {
      busy = false; if (!n) return;
      var o = last; last = n; if (!o) return;
      var mid = function (x) { return Number(String(x.msgs).split(".")[1]) || 0; };
      if (n.latest && mid(n) > mid(o)) toast(n.latest.from + " sent you a message", n.latest.body, "/card/", n.latest.from);
      else if (Number(n.requests) > Number(o.requests)) toast("New friend request", "Open My profile to answer it.", "/card/#inbox");
      else if (Number(n.inbox) > Number(o.inbox)) toast("New notification", "You have a new message in your Inbox.", "/card/#inbox");
    }).catch(function () { busy = false; });
  }
  setInterval(tick, 20000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick); else tick();
})();

/* Contest banner: a slim bar at the bottom of every page except the home page while a contest is running. */
(function () {
  var seg = (location.pathname.replace(/^\/+/, "").split("/")[0] || "").toLowerCase();
  if (seg === "" || seg === "index.html" || seg === "daily") return;
  var API = "https://mvp-news-api.mvp-shop.workers.dev", KEY = "mvp_card_token";
  function ls(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function left(ms) { var t = Math.max(0, Math.ceil(ms / 1000)), d = Math.floor(t / 86400), h = Math.floor(t % 86400 / 3600), m = Math.floor(t % 3600 / 60); return d ? d + "d " + h + "h" : h ? h + "h " + m + "m" : m + "m"; }
  var base = (function () { var s = document.currentScript; return s ? s.src.replace(/theme\.js(\?.*)?$/, "") : "/"; })();
  function run() {
    var tok = ls(KEY), h = tok ? { Authorization: "Bearer " + tok } : {};
    fetch(API + "/api/contests", { headers: h }).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var c = null;
      (list || []).forEach(function (x) { if (!c && x.open && !x.joined && Date.now() - Number(ls("mvp_ct_" + x.id) || 0) > 86400000) c = x; });
      if (!c || document.getElementById("mvpCt")) return;
      var st = document.createElement("style");
      st.textContent = "#mvpCt{position:fixed;z-index:55;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(620px,calc(100% - 24px));display:flex;align-items:center;gap:12px;padding:10px 12px 10px 14px;border-radius:18px;color:#fff;font:600 .9rem system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:linear-gradient(120deg,rgba(255,157,28,.97),rgba(190,70,12,.97));box-shadow:0 14px 40px rgba(0,0,0,.45);animation:mvpCtIn .6s cubic-bezier(.2,.9,.3,1.1) both;box-sizing:border-box}" +
        "#mvpCt img.i{width:32px;height:32px;image-rendering:pixelated;flex:none}#mvpCt .t{flex:1;min-width:0}#mvpCt b{display:block;font-size:.98rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mvpCt small{display:block;opacity:.92;font-weight:600;font-size:.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        "#mvpCt a.go{flex:none;display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 16px;border-radius:999px;background:#fff;color:#8a3a00;font-weight:800;text-decoration:none}#mvpCt button{flex:none;border:0;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:2px 4px;opacity:.85}" +
        "@keyframes mvpCtIn{from{opacity:0;transform:translate(-50%,24px)}to{opacity:1;transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){#mvpCt{animation:none}}";
      document.head.appendChild(st);
      var el = document.createElement("div"); el.id = "mvpCt"; el.setAttribute("role", "complementary"); el.setAttribute("aria-label", "Contest");
      el.innerHTML = '<img class="i" src="' + base + 'img/ic/calendar.png" alt=""><div class="t"><b>' + esc(c.title) + '</b><small>' + (c.prize ? "Prize: " + esc(c.prize) + " | " : "") + 'Ends in ' + left(c.ends_at - Date.now()) + '</small></div><a class="go" href="' + base + 'card/#contests">Join</a><button type="button" aria-label="Close">&times;</button>';
      el.querySelector("button").addEventListener("click", function () { lsSet("mvp_ct_" + c.id, String(Date.now())); el.remove(); });
      document.body.appendChild(el);
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();

/* MVP social links: shown above the legal links at the bottom of every page */
(function () {
  var LINKS = [
    { name: "Discord", href: "https://playmvp.org/discord", img: "/img/share/discord.png" },
    { name: "TikTok", href: "https://playmvp.org/tiktok", img: "/img/share/tiktok.png" },
    { name: "Instagram", href: "https://playmvp.org/instagram", img: "/img/share/instagram.png" },
    { name: "YouTube", href: "https://playmvp.org/youtube", img: "/img/share/youtube.png" },
    { name: "X", href: "https://playmvp.org/x", img: "/img/share/x.png" }
  ];
  var css = ".mvp-social{position:relative;z-index:10;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:18px 18px 6px}" +
    ".mvp-social a{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#e6f2fb;font-family:inherit;font-weight:600;font-size:.88rem;text-decoration:none;transition:background .15s,border-color .15s}" +
    ".mvp-social a:hover{background:rgba(46,162,234,.22);border-color:rgba(111,208,255,.5);color:#fff}" +
    ".mvp-social img{width:18px;height:18px;object-fit:contain}";
  function run() {
    var navs = document.querySelectorAll("nav.legal-links");
    if (!navs.length || document.querySelector(".mvp-social")) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    Array.prototype.forEach.call(navs, function (nav) {
      var box = document.createElement("nav"); box.className = "mvp-social"; box.setAttribute("aria-label", "MVP on social media");
      LINKS.forEach(function (l) {
        var a = document.createElement("a"); a.href = l.href; a.target = "_blank"; a.rel = "noopener me";
        a.setAttribute("aria-label", "MVP on " + l.name);
        a.innerHTML = (l.img ? '<img src="' + l.img + '" alt="">' : l.svg) + "<span>" + l.name + "</span>";
        box.appendChild(a);
      });
      nav.parentNode.insertBefore(box, nav);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
