(function () {
  var css = '.mvl{position:fixed;inset:0;z-index:2147483000;background:#0b1220;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#9fb3c8;font:700 13px/1 system-ui,sans-serif;letter-spacing:.06em;transition:opacity .25s}.mvl.out{opacity:0;pointer-events:none}.pl-sp{display:inline-grid;grid-template-columns:repeat(3,14px);grid-template-rows:repeat(3,14px);gap:4px}.pl-sp i{background:#4aa8ff;border-radius:2px;animation:plb 1.2s infinite both}.pl-sp i:nth-child(1){animation-delay:0s}.pl-sp i:nth-child(2){animation-delay:.1s}.pl-sp i:nth-child(3){animation-delay:.2s}.pl-sp i:nth-child(6){animation-delay:.3s}.pl-sp i:nth-child(9){animation-delay:.4s}.pl-sp i:nth-child(8){animation-delay:.5s}.pl-sp i:nth-child(7){animation-delay:.6s}.pl-sp i:nth-child(4){animation-delay:.7s}.pl-sp i:nth-child(5){animation-delay:.8s}.pl-sp.sm{grid-template-columns:repeat(3,8px);grid-template-rows:repeat(3,8px);gap:3px}.pl-ld{display:flex;flex-direction:column;align-items:center;gap:14px;padding:60px 0;color:#9fb3c8;font-weight:700;letter-spacing:.04em}@keyframes plb{0%,60%,100%{opacity:.18;transform:scale(.8)}20%{opacity:1;transform:scale(1)}}@media(prefers-reduced-motion:reduce){.pl-sp i{animation:none;opacity:.6}}';
  var st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  var sp = function (c) { return '<span class="pl-sp ' + (c || '') + '" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>'; };
  window.mvpSpin = function (txt) { return '<div class="pl-ld" role="status">' + sp() + (txt ? '<span>' + txt + '</span>' : '') + '</div>'; };
  window.mvpSpinSm = function () { return sp('sm'); };
  var ov = document.createElement('div'); ov.className = 'mvl'; ov.setAttribute('role', 'status'); ov.innerHTML = sp() + '<span>LOADING</span>';
  (document.body || document.documentElement).appendChild(ov);
  var gone = false;
  function hide() { if (gone) return; gone = true; ov.classList.add('out'); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 400); }
  if (document.readyState === 'complete') setTimeout(hide, 150); else window.addEventListener('load', function () { setTimeout(hide, 200); });
  setTimeout(hide, 7000);
})();
