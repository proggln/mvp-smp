/* "Share" button for news. Usage: mvpShareBtn(newsItem) returns a button.
   On phones it opens the system share sheet (Discord, Snapchat, WhatsApp, ...); on computers a small menu. */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev";
  var css = ".wc-v button.wc-share{height:54px;padding:0 20px;border:1px solid rgba(255,255,255,.14)!important;border-radius:999px;background:rgba(255,255,255,.06);color:#b9d3e6;gap:8px}" +
    ".wc-v button.wc-share:hover{background:rgba(255,255,255,.12);color:#fff}" +
    ".wc-shm{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);padding:16px}" +
    "@media (min-width:640px){.wc-shm{align-items:center}}" +
    ".wc-shb{width:min(420px,100%);background:#06111d;border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:18px;color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:inherit}" +
    ".wc-shb h3{margin:0 0 4px;font-size:1.15rem}.wc-shb p{margin:0 0 14px;color:#9db6c9;font-size:.88rem;word-break:break-all}" +
    ".wc-shg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    ".wc-shg a,.wc-shg button{display:flex;align-items:center;justify-content:center;min-height:46px;padding:0 10px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#e6f2fb;font:600 .9rem inherit;text-decoration:none;cursor:pointer;text-align:center}" +
    ".wc-shg a:hover,.wc-shg button:hover{background:rgba(111,208,255,.14);border-color:rgba(111,208,255,.45)}" +
    ".wc-shg .wide{grid-column:1/-1;background:linear-gradient(180deg,#22a6f2,#0081cc);border:0;color:#fff}" +
    ".wc-shx{display:block;margin:12px auto 0;border:0;background:none;color:#9db6c9;font:600 .9rem inherit;cursor:pointer}.wc-shmsg{min-height:1.2em;margin-top:10px;text-align:center;color:#7be3a0;font-size:.88rem}";
  var IC = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8 L15.8 6.2"/><path d="M8.2 13.2 L15.8 17.8"/></svg>';
  function style() { if (document.getElementById("wc-sh-css")) return; var s = document.createElement("style"); s.id = "wc-sh-css"; s.textContent = css; document.head.appendChild(s); }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, bad) { try { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); ok(); } catch (e) { bad(e); } });
  }
  function menu(url, title) {
    style();
    var e = encodeURIComponent, u = e(url), t = e(title);
    var links = [
      ["WhatsApp", "https://wa.me/?text=" + e(title + " " + url)],
      ["Telegram", "https://t.me/share/url?url=" + u + "&text=" + t],
      ["Snapchat", "https://www.snapchat.com/scan?attachmentUrl=" + u],
      ["X", "https://twitter.com/intent/tweet?url=" + u + "&text=" + t],
      ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + u],
      ["Reddit", "https://www.reddit.com/submit?url=" + u + "&title=" + t],
      ["Email", "mailto:?subject=" + t + "&body=" + e(title + "\n" + url)]
    ];
    var m = document.createElement("div"); m.className = "wc-shm"; m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "Share");
    m.innerHTML = '<div class="wc-shb"><h3>Share</h3><p></p><div class="wc-shg"><button type="button" class="wide" data-a="copy">Copy link</button><button type="button" data-a="discord">Discord</button></div><div class="wc-shmsg"></div><button type="button" class="wc-shx">Close</button></div>';
    m.querySelector("p").textContent = url;
    var g = m.querySelector(".wc-shg"), msg = m.querySelector(".wc-shmsg");
    links.forEach(function (l) { var a = document.createElement("a"); a.textContent = l[0]; a.href = l[1]; a.target = "_blank"; a.rel = "noopener noreferrer"; g.appendChild(a); });
    function close() { m.remove(); document.removeEventListener("keydown", esc); }
    function esc(ev) { if (ev.key === "Escape") close(); }
    m.addEventListener("click", function (ev) { if (ev.target === m) close(); });
    m.querySelector(".wc-shx").onclick = close;
    m.querySelector('[data-a="copy"]').onclick = function () { copy(url).then(function () { msg.textContent = "Link copied."; }, function () { msg.textContent = "Copy it by hand: " + url; }); };
    m.querySelector('[data-a="discord"]').onclick = function () { copy(url).then(function () { msg.textContent = "Link copied. Paste it in Discord."; }, function () {}); window.open("https://discord.com/channels/@me", "_blank", "noopener"); };
    document.addEventListener("keydown", esc);
    document.body.appendChild(m);
    m.querySelector('[data-a="copy"]').focus();
  }
  window.mvpShareUrl = function (n) { return API + "/n/" + n.id; };
  window.mvpShareBtn = function (n) {
    style();
    var b = document.createElement("button"); b.type = "button"; b.className = "wc-share"; b.setAttribute("aria-label", "Share"); b.innerHTML = IC + "<span>Share</span>";
    b.onclick = function () {
      var url = window.mvpShareUrl(n), title = n.title || "MVP news";
      var touch = window.matchMedia && matchMedia("(pointer:coarse)").matches;
      if (navigator.share && touch) { navigator.share({ title: title, text: title, url: url }).catch(function () {}); return; }
      menu(url, title);
    };
    return b;
  };
})();
