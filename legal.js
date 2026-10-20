// FILL THIS IN ONCE: these values appear on the Privacy Policy, Terms, Refund Policy and Support pages.
window.LEGAL = {
  operator: "[Vardenis Pavardenis], individuali veikla (pažyma Nr. [XXXXXX])",   // seller shown ONLY on Terms, Privacy and Refunds. Replace the [brackets] with real data once
  address:  "[street, city, postal code]",   // EU law: a seller must show a postal address (can be a business address, not necessarily your home)
  email:    "info@playmvp.org",               // public support email
  country:  "Lithuania",     // for the governing law, e.g. Lithuania
  retention:"10 years",              // Lithuanian accounting rules: keep order/accounting records 10 years (confirm with your accountant)
  portal:   "https://www.tebex.io/",   // Tebex: replace with your store page or the Tebex customer portal link once your store exists
  updated:  "20 October 2026"
};
(function () {
  function fill() {
    document.querySelectorAll("[data-k]").forEach(function (el) {
      var v = window.LEGAL[el.getAttribute("data-k")];
      if (!v) return;
      el.textContent = v;
      if (el.tagName === "A" && el.getAttribute("data-k") === "email" && v.indexOf("@") > 0) el.href = "mailto:" + v;
      if (el.tagName === "A" && el.getAttribute("data-k") === "portal") { el.href = v; el.textContent = "Tebex payment portal"; }
      if (v.charAt(0) !== "[") el.classList.remove("ph");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
