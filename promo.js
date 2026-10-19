/* MVP: "get the app" banners for the Profile and News pages (Android app / iPhone Home Screen). */
(function () {
  var KEY = "mvp_promo_hidden";
  var script = document.currentScript, base = script ? script.src.replace(/promo\.js(\?.*)?$/, "") : "/";
  var ua = navigator.userAgent || "";
  var ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var standalone = false;
  try { standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; } catch (e) {}
  if (standalone) return;                                   // already opened from the Home Screen / installed
  try { var t = Number(localStorage.getItem(KEY) || 0); if (t && Date.now() - t < 7 * 86400000) return; } catch (e) {}
  var href = ios ? base + "ios/" : base + "app/";
  var title = ios ? "Add MVP to your home screen" : "Download the MVP app right now";
  var sub = ios ? "Open the site like an app and get notifications." : "Your card, stats and server news in one app.";
  var tag = ios ? "iPhone and iPad" : "Only for Android";
  var cta = ios ? "Show me how" : "Download";
  var css = "#mvpPromo,#mvpPromoR{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff;box-sizing:border-box}" +
    "#mvpPromo{position:fixed;z-index:50;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;background:linear-gradient(135deg,#0a6cb8,#0b3a78);border:1px solid rgba(255,255,255,.2);box-shadow:0 12px 30px rgba(0,0,0,.45)}" +
    "#mvpPromo img{width:44px;height:44px;border-radius:12px;flex:none}" +
    "#mvpPromo .t{flex:1;min-width:0}#mvpPromo b{display:block;font-size:.98rem;line-height:1.25}#mvpPromo small{display:block;color:#cfe6f7;font-size:.8rem;margin-top:2px}" +
    "#mvpPromo .tag{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.2);margin-bottom:4px}" +
    "#mvpPromo a.go{flex:none;display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:999px;background:#fff;color:#0a3a78;font-weight:800;text-decoration:none;font-size:.92rem}" +
    "#mvpPromo button.x,#mvpPromoR button.x{position:absolute;top:6px;right:8px;border:0;background:transparent;color:#cfe6f7;font-size:20px;line-height:1;cursor:pointer;padding:4px}" +
    "#mvpPromoR{display:none}" +
    "@media(min-width:1500px){" +
    "#mvpPromo{left:calc(50% - 780px);right:auto;bottom:auto;top:170px;width:270px;flex-direction:column;align-items:flex-start;padding:20px 18px;gap:10px}" +
    "#mvpPromo img{width:56px;height:56px;border-radius:15px}#mvpPromo b{font-size:1.15rem}#mvpPromo small{font-size:.88rem}#mvpPromo a.go{align-self:stretch;justify-content:center;margin-top:6px}" +
    "#mvpPromo button.x{top:8px;right:10px}" +
    "#mvpPromoR{display:block;position:fixed;z-index:50;left:calc(50% + 510px);top:170px;width:270px;padding:20px 18px;border-radius:18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}" +
    "#mvpPromoR b{display:block;font-size:1.02rem;margin-bottom:8px}#mvpPromoR ul{margin:0;padding:0;list-style:none;color:#cfe3f1;font-size:.9rem}#mvpPromoR li{padding:5px 0 5px 22px;position:relative}#mvpPromoR li:before{content:'\\2713';position:absolute;left:0;color:#6fd0ff;font-weight:800}}";
  function hide() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} var a = document.getElementById("mvpPromo"), b = document.getElementById("mvpPromoR"); if (a) a.remove(); if (b) b.remove(); }
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement("div"); d.id = "mvpPromo";
    d.innerHTML = '<img src="' + base + 'icon-192.png" alt=""><div class="t"><span class="tag">' + tag + '</span><b>' + title + '</b><small>' + sub + '</small></div><a class="go" href="' + href + '">' + cta + '</a><button class="x" type="button" aria-label="Close">&times;</button>';
    d.addEventListener("click", function (e) { if (e.target.closest("button.x")) return; if (!e.target.closest("a")) location.href = href; });
    d.querySelector("button.x").addEventListener("click", function (e) { e.stopPropagation(); hide(); });
    document.body.appendChild(d);
    var r = document.createElement("div"); r.id = "mvpPromoR";
    r.innerHTML = '<button class="x" type="button" aria-label="Close">&times;</button><b>Why get it?</b><ul><li>Your player card with coins and stats</li><li>Server news and event timers</li><li>Notifications on your phone</li><li>Polls and unique card styles</li></ul>';
    r.querySelector("button.x").addEventListener("click", hide);
    r.style.cursor = "pointer"; r.addEventListener("click", function (e) { if (!e.target.closest("button")) location.href = href; });
    document.body.appendChild(r);
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
