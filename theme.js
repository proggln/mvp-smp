/* MVP site theme: "Blue" (default, as before) or "Dark" (near-black). The choice is remembered in this browser. */
(function () {
  var KEY = "mvp_site_theme", root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY) === "dark" ? "dark" : "blue"; } catch (e) { return "blue"; } }
  function apply(t) {
    if (t === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "dark" ? "#000000" : "#03080f");
  }
  apply(get());
  var css = 'html[data-theme="dark"]{--bg:#000;--muted:#a3adb8}' +
    'html[data-theme="dark"] .bg{background:radial-gradient(ellipse at 50% 30%,#101216 0%,#06070a 55%,#000 90%)}' +
    'html[data-theme="dark"] .blob{opacity:.07}html[data-theme="dark"] .pgrid{opacity:.35}' +
    'html[data-theme="dark"] .grade{background:linear-gradient(180deg,rgba(255,255,255,.02) 0%,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%)}' +
    'html[data-theme="dark"] .vignette{background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%)}' +
    'html[data-theme="dark"] .nav{background:rgba(12,13,16,.82)}' +
    'html[data-theme="dark"] .card2{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))}' +
    '.mvp-tt{flex:none;width:38px;height:38px;margin:0 2px 0 4px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#cfe6f7;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;transition:background .2s,transform .2s}' +
    '.mvp-tt:hover{background:rgba(255,255,255,.16);transform:scale(1.06)}.mvp-tt svg{width:18px;height:18px}';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var DROP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/></svg>';
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var menu = document.querySelector(".nav .menu") || document.querySelector(".nav");
    if (!menu) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "mvp-tt";
    function paint() { var d = get() === "dark"; b.innerHTML = d ? DROP : MOON; b.setAttribute("aria-label", d ? "Switch to the blue theme" : "Switch to the dark theme"); b.title = d ? "Blue theme" : "Dark theme"; }
    b.addEventListener("click", function () { var n = get() === "dark" ? "blue" : "dark"; try { localStorage.setItem(KEY, n); } catch (e) {} apply(n); paint(); });
    paint();
    var dc = menu.querySelector(".link-discord"); if (dc) menu.insertBefore(b, dc); else menu.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
