/* Poll under a news post. Usage: mvpPoll(box, poll, token) */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev";
  var css = ".pl{margin:14px 0 4px;padding:16px;border-radius:18px;background:rgba(111,208,255,.07);border:1px solid rgba(111,208,255,.18)}" +
    ".pl-q{font-weight:800;font-size:1.15rem;margin:0 0 12px}.pl-o{position:relative;display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;min-height:48px;padding:0 16px;margin:0 0 8px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#e8f3fb;font:600 .98rem inherit;text-align:left;cursor:pointer;overflow:hidden;transition:border-color .15s}" +
    ".pl-o:hover{border-color:#6fd0ff}.pl-o i{position:absolute;left:0;top:0;bottom:0;background:rgba(34,166,242,.28);transition:width .5s;z-index:0}.pl-o span,.pl-o b{position:relative;z-index:1}.pl-o b{display:inline;font:800 1rem inherit;white-space:nowrap;border:0;padding:0;margin:0;background:none;-webkit-text-fill-color:currentColor;letter-spacing:0}" +
    ".pl-o.my{border-color:#6fd0ff;background:rgba(34,166,242,.12)}.pl-o.my i{background:rgba(34,166,242,.5)}.pl-o:disabled{cursor:default;opacity:.85}" +
    ".pl-f{font-size:.82rem;color:#9db6c9;margin-top:4px}.pl-f a{color:#6fd0ff}";
  window.mvpPoll = function (box, poll, tk) {
    if (!document.getElementById("pl-css")) { var st = document.createElement("style"); st.id = "pl-css"; st.textContent = css; document.head.appendChild(st); }
    var note = "";
    function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function draw() {
      var show = poll.my || poll.closed, h = '<div class="pl"><div class="pl-q">' + esc(poll.question) + '</div>';
      poll.options.forEach(function (o) {
        var pc = poll.total ? Math.round(o.votes * 100 / poll.total) : 0;
        h += '<button type="button" class="pl-o' + (poll.my === o.id ? " my" : "") + '" data-o="' + o.id + '"' + (poll.closed ? " disabled" : "") + '>' +
          (show ? '<i style="width:' + pc + '%"></i>' : "") + '<span>' + (poll.my === o.id ? "✓ " : "") + esc(o.text) + '</span>' + (show ? '<b>' + pc + '%</b>' : "") + '</button>';
      });
      h += '<div class="pl-f">' + poll.total + (poll.total === 1 ? " vote" : " votes") + (poll.closed ? " · Poll closed" : "") + (note ? " · " + note : "") + '</div></div>';
      box.innerHTML = h;
      Array.prototype.forEach.call(box.querySelectorAll(".pl-o"), function (b) { b.onclick = function () { vote(Number(b.getAttribute("data-o"))); }; });
    }
    function vote(id) {
      if (!tk) { note = '<a href="../card/">Create your card</a> to vote'; draw(); return; }
      var prev = JSON.parse(JSON.stringify(poll)), next = poll.my === id ? 0 : id;
      poll.options.forEach(function (o) { if (o.id === poll.my) o.votes--; if (o.id === next) o.votes++; });
      poll.total = poll.options.reduce(function (a, o) { return a + o.votes; }, 0); poll.my = next; note = ""; draw();
      fetch(API + "/api/app/poll-vote", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tk }, body: JSON.stringify({ poll_id: poll.id, option_id: next }) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) { if (!r.ok || !r.j.options) throw new Error("x"); poll = r.j; note = ""; draw(); })
        .catch(function () { poll = prev; note = "could not save, try again"; draw(); });
    }
    draw();
  };
})();
