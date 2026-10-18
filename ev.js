/* MVP event countdown timers (design B). Usage: mvpEvents(element, pinnedOnly) */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev";
  var css = ".ev{position:relative;overflow:hidden;border-radius:24px;padding:24px 26px;margin:0 0 16px;color:#fff;background:linear-gradient(135deg,#0094e6,#0a4d86 70%,#06223d);box-shadow:0 18px 40px rgba(0,112,184,.35)}" +
    ".ev::after{content:'';position:absolute;right:-70px;top:-70px;width:250px;height:250px;border-radius:50%;background:rgba(255,255,255,.1);pointer-events:none}" +
    ".ev>*{position:relative;z-index:1}" +
    ".ev-top{display:flex;gap:8px;align-items:center;margin-bottom:8px}" +
    ".ev-lab{font:800 .72rem/1 inherit;letter-spacing:.14em;text-transform:uppercase;opacity:.85}" +
    ".ev-pin{font:800 .68rem/1 inherit;letter-spacing:.1em;padding:5px 9px;border-radius:99px;background:rgba(255,255,255,.22)}" +
    ".ev-t{margin:0;font-weight:800;font-size:clamp(1.4rem,4vw,1.9rem);line-height:1.15}" +
    ".ev-s{margin:4px 0 0;color:#d8efff;font-size:.95rem}" +
    ".ev-big{font-weight:900;font-size:clamp(2.4rem,9vw,3.8rem);line-height:1;letter-spacing:-.02em;margin:16px 0 2px;font-variant-numeric:tabular-nums}" +
    ".ev-big span{font-size:clamp(.95rem,3vw,1.25rem);font-weight:700;opacity:.8;margin:0 12px 0 3px}" +
    ".ev-bar{height:10px;background:rgba(255,255,255,.22);border-radius:9px;margin-top:16px;overflow:hidden}" +
    ".ev-bar i{display:block;height:100%;background:#fff;border-radius:9px;transition:width .6s}" +
    ".ev-pc{font-size:.8rem;opacity:.85;margin-top:6px}";
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  window.mvpEvents = function (box, pinnedOnly) {
    if (!box) return;
    if (!document.getElementById("ev-css")) { var st = document.createElement("style"); st.id = "ev-css"; st.textContent = css; document.head.appendChild(st); }
    fetch(API + "/api/events").then(function (r) { return r.json(); }).then(function (a) {
      if (!Array.isArray(a)) return;
      if (pinnedOnly) a = a.filter(function (e) { return e.pinned; });
      box.textContent = "";
      var els = [];
      a.forEach(function (e) {
        var d = document.createElement("section"); d.className = "ev";
        d.innerHTML = '<div class="ev-top"><span class="ev-lab"></span>' + (e.pinned ? '<span class="ev-pin">PINNED</span>' : "") + '</div>' +
          '<h3 class="ev-t">' + esc(e.title) + '</h3>' + (e.subtitle ? '<p class="ev-s">' + esc(e.subtitle) + '</p>' : "") +
          '<div class="ev-big"></div><div class="ev-bar"><i></i></div><div class="ev-pc"></div>';
        box.appendChild(d); els.push({ e: e, d: d });
      });
      function tick() {
        var now = Date.now();
        els.forEach(function (x) {
          var e = x.e, left = e.target_at - now, d = x.d, big = d.querySelector(".ev-big");
          var starts = e.label !== "Ends in";
          d.querySelector(".ev-lab").textContent = left > 0 ? e.label : (starts ? "Started" : "Finished");
          if (left <= 0) { big.textContent = starts ? "It has begun!" : "Finished"; d.querySelector(".ev-bar i").style.width = "100%"; d.querySelector(".ev-pc").textContent = ""; return; }
          var s = Math.floor(left / 1000), dd = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
          big.innerHTML = (dd > 0 ? dd + "<span>d</span>" : "") + pad(h) + "<span>h</span>" + pad(m) + "<span>m</span>" + pad(sec) + "<span>s</span>";
          var total = Math.max(1, e.target_at - e.start_at), pc = Math.min(100, Math.max(0, Math.round((now - e.start_at) / total * 100)));
          d.querySelector(".ev-bar i").style.width = pc + "%"; d.querySelector(".ev-pc").textContent = pc + "% of the time has passed";
        });
      }
      tick(); if (els.length) setInterval(tick, 1000);
    }).catch(function () {});
  };
})();
