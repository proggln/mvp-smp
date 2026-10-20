/* MVP site: the site has one look (blue). This file only makes the menu bar fit on small phones.
   (There used to be a light theme switch; an old saved choice is cleared here.) */
(function () {
  try { localStorage.removeItem("mvp_site_theme"); } catch (e) {}
  document.documentElement.removeAttribute("data-theme");
  var css =
    /* small phones: everything in the menu bar must fit, the Discord button included */
    '@media (max-width:640px){.nav .link-discord .dt{display:none}}' +
    '@media (max-width:520px){.nav .brand-text{display:none}.nav .logo{width:38px;height:21px}}' +
    '@media (max-width:440px){.nav{padding-left:10px!important}.nav .menu{gap:0!important}.nav .link{padding:9px 7px!important;font-size:.82rem!important}.nav .link-discord{padding:8px 10px!important}.nav .dc{width:20px;height:15px}}' +
    '@media (max-width:370px){.nav .link{padding:9px 5px!important;font-size:.76rem!important}.nav .logo{width:32px;height:18px}}';
  var st = document.createElement("style"); st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();
