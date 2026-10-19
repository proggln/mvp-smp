/* MVP site theme: "Blue" (default) or "Light" (near-black). The choice is remembered in this browser. */
(function () {
  var KEY = "mvp_site_theme", root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY) === "light" ? "light" : "blue"; } catch (e) { return "blue"; } }
  function apply(t) {
    if (t === "light") root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "light" ? "#ffffff" : "#03080f");
  }
  apply(get());
  var L='html[data-theme="light"]';
  var css = L+'{--bg:#fff;--white:#0b1b2b;--muted:#5b6f82;--gray:#33475a;color-scheme:light}' +
    L+' body{background:#fff;color:#0b1b2b}' +
    L+' .bg,'+L+' .blob,'+L+' .pgrid,'+L+' .grade,'+L+' .vignette{display:none}' +
    L+' .nav{background:rgba(255,255,255,.88);border-color:rgba(11,27,43,.12);box-shadow:0 8px 28px rgba(11,27,43,.12)}' +
    L+' .nav a,'+L+' .nav .menu a{color:#0b1b2b}' +
    L+' .card2,'+L+' .card,'+L+' .panel{background:#f3f7fb !important;border-color:rgba(11,27,43,.1) !important;color:#0b1b2b}' +
    L+' h1,'+L+' h2,'+L+' h3,'+L+' h4,'+L+' p,'+L+' li,'+L+' label{color:#0b1b2b}' +
    L+' *{text-shadow:none !important}' +
    L+' .stat,'+L+' .ip-card,'+L+' .ip-inner,'+L+' .wc,'+L+' .mgb.ghost{background:#eef3f8 !important;border-color:rgba(11,27,43,.12) !important;color:#0b1b2b !important;box-shadow:0 4px 14px rgba(11,27,43,.08) !important}' +
    L+' .stat strong,'+L+' .ip-value,'+L+' .mgb.ghost{color:#0b1b2b !important}' +
    L+' .legal-links a,'+L+' .doc a,'+L+' footer a{color:#33475a !important}' +
    L+' .logo,'+L+' .brand img,'+L+' .brand svg{filter:invert(1) brightness(.35)}' +
    L+' .mvp-tt{border-color:rgba(11,27,43,.18);background:rgba(11,27,43,.06);color:#0b1b2b}' +
    '.mvp-tt{flex:none;width:38px;height:38px;margin:0 2px 0 4px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#cfe6f7;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;transition:background .2s,transform .2s}' +
    '.mvp-tt:hover{background:rgba(255,255,255,.16);transform:scale(1.06)}.mvp-tt svg{width:18px;height:18px}';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var DROP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/></svg>';
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var menu = document.querySelector(".nav .menu") || document.querySelector(".nav");
    if (!menu) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "mvp-tt";
    function paint() { var d = get() === "light"; b.innerHTML = d ? DROP : SUN; b.setAttribute("aria-label", d ? "Switch to the blue theme" : "Switch to the light theme"); b.title = d ? "Blue theme" : "Light theme"; }
    b.addEventListener("click", function () { var n = get() === "light" ? "blue" : "light"; try { localStorage.setItem(KEY, n); } catch (e) {} apply(n); paint(); });
    paint();
    var dc = menu.querySelector(".link-discord"); if (dc) menu.insertBefore(b, dc); else menu.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
