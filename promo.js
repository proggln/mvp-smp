/* MVP: "get the app" banner on the Profile and News pages (Android app / iPhone Home Screen). */
(function () {
  var KEY = "mvp_promo_hidden", HAS = "mvp_has_app", TK = "mvp_card_token", API = "https://mvp-news-api.mvp-shop.workers.dev";
  var script = document.currentScript, base = script ? script.src.replace(/promo\.js(\?.*)?$/, "") : "/";
  var ua = navigator.userAgent || "";
  var ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var desktop = !ios && !android;
  var standalone = false;
  try { standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; } catch (e) {}
  function lsGet(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var token = lsGet(TK);
  if (!token) { var cm = document.cookie.match(new RegExp("(?:^|; )" + TK + "=([^;]+)")); if (cm) token = cm[1]; }
  function me(pwa) {
    var c = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (c) c.abort(); }, 2500);
    return fetch(API + "/api/app/me" + (pwa ? "?pwa=1" : ""), { headers: { Authorization: "Bearer " + token }, signal: c ? c.signal : undefined })
      .then(function (r) { clearTimeout(timer); return r.ok ? r.json() : null; }).catch(function () { clearTimeout(timer); return null; });
  }
  // opened from the Home Screen: remember it (here and on the server) and never show the banner
  if (standalone) { lsSet(HAS, "1"); if (token) me(true); return; }
  if (lsGet(HAS)) return;
  var t = Number(lsGet(KEY) || 0); if (t && Date.now() - t < 7 * 86400000) return;
  if (token) me(false).then(function (p) { if (p && p.has_app) { lsSet(HAS, "1"); return; } start(); }); else start();

  function start() {
    var href = ios ? base + "ios/" : base + "app/";
    var title = ios ? "Add MVP to your home screen" : "Download the MVP app right now";
    var sub = ios ? "Open the site like an app and get notifications." : (desktop ? "Open this page on your Android phone to install it." : "Your card, stats and server news in one app.");
    var tag = ios ? "iPhone and iPad" : "Only for Android";
    var cta = ios ? "Show me how" : "Download";
    var live = !desktop;   // on a computer the banner is only information
    var css = "#mvpPromo{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff;box-sizing:border-box;position:fixed;z-index:50;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(14,120,200,.96),rgba(11,58,120,.96));border:1px solid rgba(255,255,255,.22);box-shadow:0 14px 34px rgba(0,0,0,.45),0 0 0 1px rgba(111,208,255,.12) inset;animation:mvpUp .55s cubic-bezier(.2,.9,.3,1.1) both;" + (live ? "cursor:pointer;" : "") + "}" +
      "#mvpPromo img{width:44px;height:44px;border-radius:12px;flex:none}#mvpPromo .t{flex:1;min-width:0}#mvpPromo b{display:block;font-size:.98rem;line-height:1.25}#mvpPromo small{display:block;color:#d6ecfb;font-size:.8rem;margin-top:2px}" +
      "#mvpPromo .tag{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.2);margin-bottom:4px}" +
      "#mvpPromo .go{flex:none;display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 16px;border-radius:999px;background:#fff;color:#0a3a78;font-weight:800;text-decoration:none;font-size:.92rem;transition:transform .15s}" +
      "#mvpPromo .go.off{background:rgba(255,255,255,.18);color:#e3f3ff;font-weight:700;cursor:default}" +
      "#mvpPromo button.x{position:absolute;top:4px;right:6px;border:0;background:transparent;color:#d6ecfb;font-size:20px;line-height:1;cursor:pointer;padding:4px 6px}" +
      "@keyframes mvpUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}" +
      "@keyframes mvpIn{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}" +
      "@keyframes mvpFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}" +
      "@media(min-width:1500px){#mvpPromo{left:calc(50% - 770px);right:auto;bottom:auto;top:190px;width:268px;flex-direction:column;align-items:flex-start;padding:22px 20px 20px;gap:10px;border-radius:26px;" +
      "animation:mvpIn .7s cubic-bezier(.2,.9,.3,1.1) both,mvpFloat 7s ease-in-out .8s infinite}" +
      (live ? "#mvpPromo:hover{box-shadow:0 20px 46px rgba(0,0,0,.5),0 0 40px rgba(0,148,230,.45)}#mvpPromo:hover .go{transform:scale(1.04)}" : "") +
      "#mvpPromo img{width:60px;height:60px;border-radius:16px}#mvpPromo b{font-size:1.18rem}#mvpPromo small{font-size:.9rem}#mvpPromo .go{align-self:stretch;margin-top:8px}#mvpPromo button.x{top:8px;right:10px}}" +
      "@media(prefers-reduced-motion:reduce){#mvpPromo{animation:none!important}}";
    function hide() { lsSet(KEY, String(Date.now())); var a = document.getElementById("mvpPromo"); if (a) a.remove(); }
    function build() {
      var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
      var d = document.createElement("div"); d.id = "mvpPromo";
      d.innerHTML = '<img src="' + base + 'icon-192.png" alt=""><div class="t"><span class="tag">' + tag + '</span><b>' + title + '</b><small>' + sub + '</small></div>' +
        (live ? '<a class="go" href="' + href + '">' + cta + '</a>' : '<span class="go off">On your phone only</span>') + '<button class="x" type="button" aria-label="Close">&times;</button>';
      if (live) d.addEventListener("click", function (e) { if (e.target.closest("button.x") || e.target.closest("a")) return; location.href = href; });
      d.querySelector("button.x").addEventListener("click", function (e) { e.stopPropagation(); hide(); });
      document.body.appendChild(d);
    }
    if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
  }
})();
