/* Banners made in the admin page (Banners tab). They look like the "get the app" banner:
   beside the page column on a wide screen, a bar at the bottom on a phone. Closing one hides it for 7 days. */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev", HIDE = 7 * 86400000, W = 268;
  var COL = { blue: ["rgba(14,120,200,.96)", "rgba(11,58,120,.96)"], purple: ["rgba(124,77,255,.96)", "rgba(58,30,140,.96)"], orange: ["rgba(255,138,31,.96)", "rgba(170,60,10,.96)"],
    green: ["rgba(40,170,90,.96)", "rgba(12,90,50,.96)"], red: ["rgba(225,60,75,.96)", "rgba(120,20,35,.96)"], gold: ["rgba(230,180,34,.96)", "rgba(140,90,8,.96)"], dark: ["rgba(30,40,55,.97)", "rgba(8,14,24,.97)"] };
  var me = document.currentScript, BASE = me ? me.src.replace(/banners\.js(\?.*)?$/, "") : "/";
  var seg = (location.pathname.replace(/^\/+/, "").split("/")[0] || "").toLowerCase();
  var PAGE = seg === "" || seg === "index.html" ? "home" : (["news", "store", "card", "wiki"].indexOf(seg) >= 0 ? seg : "other");
  var phone = window.matchMedia && matchMedia("(pointer:coarse)").matches;
  function lsGet(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hit(id, kind) { try { fetch(API + "/api/banners/" + id + "/" + kind, { method: "POST", keepalive: true }); } catch (e) {} }
  var css = ".mvp-bn{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff;box-sizing:border-box;position:fixed;z-index:49;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;padding:12px 34px 12px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.22);box-shadow:0 14px 34px rgba(0,0,0,.45);animation:mvpBnUp .55s cubic-bezier(.2,.9,.3,1.1) both;cursor:pointer;text-decoration:none}" +
    ".mvp-bn img{width:44px;height:44px;border-radius:12px;flex:none;object-fit:cover}.mvp-bn .t{flex:1;min-width:0}.mvp-bn b{display:block;font-size:.98rem;line-height:1.25}.mvp-bn small{display:block;color:#e6f2fb;font-size:.8rem;margin-top:2px}" +
    ".mvp-bn .tag{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.2);margin-bottom:4px}" +
    ".mvp-bn .go{flex:none;display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 16px;border-radius:999px;background:#fff;color:#0a3a78;font-weight:800;font-size:.92rem;transition:transform .15s}" +
    ".mvp-bn button.x{position:absolute;top:4px;right:6px;border:0;background:transparent;color:#e6f2fb;font-size:20px;line-height:1;cursor:pointer;padding:4px 6px}" +
    ".mvp-bn.side{right:auto;bottom:auto;width:" + W + "px;flex-direction:column;align-items:flex-start;padding:22px 20px 20px;gap:10px;border-radius:26px;animation:mvpBnIn .7s cubic-bezier(.2,.9,.3,1.1) both}" +
    ".mvp-bn.side:hover{box-shadow:0 20px 46px rgba(0,0,0,.5),0 0 40px rgba(0,148,230,.35)}.mvp-bn.side:hover .go{transform:scale(1.04)}" +
    ".mvp-bn.side img{width:60px;height:60px;border-radius:16px}.mvp-bn.side b{font-size:1.18rem}.mvp-bn.side small{font-size:.9rem}.mvp-bn.side .go{align-self:stretch;margin-top:8px}.mvp-bn.side button.x{top:8px;right:10px}" +
    "@keyframes mvpBnUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}@keyframes mvpBnIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}" +
    "@media(prefers-reduced-motion:reduce){.mvp-bn{animation:none!important}}";
  function make(b) {
    var c = COL[b.color] || COL.blue, el = document.createElement("div");
    el.className = "mvp-bn"; el.setAttribute("role", "complementary"); el.setAttribute("aria-label", b.title);
    el.style.background = "linear-gradient(135deg," + c[0] + "," + c[1] + ")";
    el.innerHTML = '<img src="' + esc(b.image || BASE + "icon-192.png") + '" alt=""><div class="t">' + (b.tag ? '<span class="tag">' + esc(b.tag) + '</span>' : "") +
      '<b>' + esc(b.title) + '</b>' + (b.subtitle ? '<small>' + esc(b.subtitle) + '</small>' : "") + '</div>' + (b.cta ? '<span class="go">' + esc(b.cta) + '</span>' : "") +
      '<button class="x" type="button" aria-label="Close">&times;</button>';
    el.querySelector("button.x").addEventListener("click", function (e) { e.stopPropagation(); lsSet("mvp_bn_" + b.id, String(Date.now())); el.remove(); place(); });
    if (b.link) el.addEventListener("click", function () {
      hit(b.id, "click");
      var ext = /^https?:\/\//.test(b.link) && b.link.indexOf(location.origin) !== 0;
      if (ext) window.open(b.link, "_blank", "noopener"); else location.href = b.link;
    });
    else el.style.cursor = "default";
    return el;
  }
  var shown = [];
  function place() {
    var col = document.querySelector("main") || document.body, r = col.getBoundingClientRect();
    var promo = document.getElementById("mvpPromo"), promoSide = promo && promo.classList.contains("side");
    var leftRoom = r.left >= W + 24 + 12, rightRoom = innerWidth - r.right >= W + 24 + 12, bar = null;
    shown = shown.filter(function (x) { return document.body.contains(x.el); });
    shown.forEach(function (x) {
      var side = x.b.side === "left" ? (leftRoom ? "left" : (rightRoom ? "right" : "")) : (rightRoom ? "right" : (leftRoom ? "left" : ""));
      var el = x.el;
      if (side) {
        el.classList.add("side"); el.style.display = "";
        var top = 150;
        if (side === "left" && promoSide) top = promo.getBoundingClientRect().bottom + 16;
        shown.forEach(function (y) { if (y !== x && y.side === side && y.el.classList.contains("side") && shown.indexOf(y) < shown.indexOf(x)) top = Math.max(top, y.el.getBoundingClientRect().bottom + 16); });
        el.style.top = Math.round(top) + "px"; el.style.bottom = "";
        el.style.left = side === "left" ? Math.round(r.left - W - 24) + "px" : Math.round(r.right + 24) + "px";
        x.side = side;
      } else {
        el.classList.remove("side"); el.style.left = ""; el.style.top = ""; x.side = "";
        // a phone shows one bar at a time (the "get the app" bar goes first)
        if (bar || (promo && !promoSide)) { el.style.display = "none"; return; }
        bar = el; el.style.display = ""; el.style.bottom = "";
      }
    });
  }
  function start(list) {
    var now = Date.now();
    list = (list || []).filter(function (b) {
      if ((b.pages || "").split(",").indexOf(PAGE) < 0) return false;
      if (b.device === "phone" && !phone) return false;
      if (b.device === "computer" && phone) return false;
      var t = Number(lsGet("mvp_bn_" + b.id) || 0); return !(t && now - t < HIDE);
    });
    if (!list.length) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    list.slice(0, 3).forEach(function (b) { var el = make(b); document.body.appendChild(el); shown.push({ b: b, el: el, side: "" }); });
    place(); window.addEventListener("resize", place); setTimeout(place, 700); setTimeout(place, 1600);
    shown.forEach(function (x) { if (x.el.style.display !== "none") hit(x.b.id, "view"); });
  }
  function go() { fetch(API + "/api/banners").then(function (r) { return r.ok ? r.json() : []; }).then(start).catch(function () {}); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
