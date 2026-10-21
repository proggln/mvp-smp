/* "Get notifications" button. Usage: mvpPush(element) */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev";
  var VAPID = "BCoimz_BYv9NrmtQQ6Xp5OMceAkr-7kwWOwSuaKQS_wJXaZ8UMIRzj-2qZHA37dflnoWAux89fCX8AmCvPwLSdA";
  var CFG = { apiKey: "AIzaSyDS3Z0joAiGinz_IRAIWZpay4sPE2rLEbU", authDomain: "mvp-353a6.firebaseapp.com", projectId: "mvp-353a6", storageBucket: "mvp-353a6.firebasestorage.app", messagingSenderId: "460112027055", appId: "1:460112027055:web:5dadc267f18744b01e635a" };
  var V = "10.14.1", LS = "mvp_web_push";
  var css = ".pn{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 18px;margin:0 0 16px;border-radius:18px;background:rgba(6,16,28,.6);border:1px solid rgba(255,255,255,.12)}" +
    ".pn svg{flex:none;color:#6fd0ff}.pn .pt{flex:1;min-width:180px}.pn .pt b{display:block;font-size:1rem}.pn .pt span{font-size:.85rem;color:#9db6c9}" +
    ".pn button{min-height:46px;padding:0 22px;border-radius:999px;border:0;font:700 .95rem inherit;cursor:pointer;color:#fff;background:linear-gradient(180deg,#22a6f2,#0081cc);box-shadow:0 6px 18px rgba(0,129,204,.35)}" +
    ".pn button.off{background:rgba(255,255,255,.08);box-shadow:none;border:1px solid rgba(255,255,255,.18)}.pn button:disabled{opacity:.6}";
  var BELL = '<img src="/img/ic/bell.png" alt="" width="32" height="32" style="width:32px;height:32px;image-rendering:pixelated">';
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  function post(path, token) { var h = { "Content-Type": "application/json" }, ct = ""; try { ct = localStorage.getItem("mvp_card_token") || ""; } catch (e) {} if (ct) h.Authorization = "Bearer " + ct; return fetch(API + path, { method: "POST", headers: h, body: JSON.stringify({ token: token }) }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }); }
  var lib = null;
  function load() {
    if (lib) return lib;
    lib = Promise.all([import("https://www.gstatic.com/firebasejs/" + V + "/firebase-app.js"), import("https://www.gstatic.com/firebasejs/" + V + "/firebase-messaging.js")]).then(function (m) {
      var app = m[0].initializeApp(CFG); return { m: m[1], app: app };
    });
    return lib;
  }
  function getToken() {
    return Promise.all([load(), navigator.serviceWorker.register("/firebase-messaging-sw.js")]).then(function (a) {
      return navigator.serviceWorker.ready.then(function (reg) { return a[0].m.getToken(a[0].m.getMessaging(a[0].app), { vapidKey: VAPID, serviceWorkerRegistration: reg }); });
    });
  }
  window.mvpPush = function (box) {
    if (!box) return;
    if (!document.getElementById("pn-css")) { var st = document.createElement("style"); st.id = "pn-css"; st.textContent = css; document.head.appendChild(st); }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = window.navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
    var supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    var d = document.createElement("div"); d.className = "pn"; box.appendChild(d);
    function draw(title, sub, label, off, fn) {
      d.innerHTML = BELL + '<div class="pt"><b></b><span></span></div>';
      d.querySelector("b").textContent = title; d.querySelector("span").textContent = sub;
      if (label) { var b = document.createElement("button"); b.type = "button"; b.textContent = label; if (off) b.className = "off"; b.onclick = function () { b.disabled = true; fn(b); }; d.appendChild(b); }
    }
    function on() { if (d.parentNode) d.parentNode.removeChild(d); }
    function enable() {
      Notification.requestPermission().then(function (p) {
        if (p !== "granted") { draw("Notifications are blocked", "Allow notifications for this site in your browser settings, then try again.", "Try again", false, enable); return; }
        return getToken().then(function (tok) {
          if (!tok) throw new Error("no token");
          return post("/api/web/push-subscribe", tok).then(function (r) { if (!r.ok) throw new Error("server"); ls(LS, tok); on(); });
        });
      }).catch(function () { draw("Could not turn on notifications", "Please try again in a minute.", "Try again", false, enable); });
    }
    function idle() { draw("Get news notifications", "Server news and events straight to this device.", "Turn on", false, enable); }
    if (ios && !standalone) { draw("Notifications on iPhone", "Add this site to your Home Screen first (Share, then Add to Home Screen), then open it from there.", null); return; }
    if (!supported) { draw("Notifications are not available", "This browser does not support web notifications.", null); return; }
    if (VAPID.indexOf("__") === 0) return;
    if (Notification.permission === "granted" && ls(LS)) on(); else idle();
  };
})();
