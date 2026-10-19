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
  var css = L+'{background:#fff;filter:invert(1) hue-rotate(180deg)}' +
    L+' img,'+L+' video,'+L+' canvas,'+L+' picture,'+L+' #mvpPromo,'+L+' iframe,'+L+' .wc-ic,'+L+' [style*="background-image"]{filter:invert(1) hue-rotate(180deg)}' +
    L+' .mvp-tt{filter:none}' +
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
