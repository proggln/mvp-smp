/* Comments under a news item. Usage: container.appendChild(mvpComments(newsId)) */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev", KEY = "mvp_card_token";
  var css = ".cm{margin:14px 0 0}.cm-t{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:9px 16px;font:700 .9rem inherit;cursor:pointer}.cm-t:hover{background:rgba(255,255,255,.12)}" +
    ".cm-b{margin-top:12px}.cm-box{display:flex;gap:10px;align-items:flex-start;margin:0 0 14px}.cm-box textarea{flex:1;min-height:46px;max-height:160px;resize:vertical;padding:11px 13px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(3,8,15,.6);color:inherit;font:inherit;margin:0}" +
    ".cm-go{border:0;border-radius:999px;padding:11px 20px;font:700 .9rem inherit;color:#fff;background:linear-gradient(180deg,#22a6f2,#0081cc);cursor:pointer;flex:none}.cm-go:disabled{opacity:.55;cursor:default}" +
    ".cm-i{padding:12px 0;border-top:1px solid rgba(255,255,255,.08)}.cm-i.re{margin-left:28px}.cm-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.85rem;color:#9db6c9}.cm-h a{color:#fff;font-weight:700;text-decoration:none}.cm-h a:hover{text-decoration:underline}" +
    ".cm-rk{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.1);font-size:.7rem;font-weight:700;color:#cfe3f1}.cm-p{margin:4px 0 6px;font-size:.95rem;line-height:1.5;overflow-wrap:anywhere;white-space:pre-wrap}" +
    ".cm-a{display:flex;gap:14px;font-size:.8rem}.cm-a button{border:0;background:none;color:#9db6c9;cursor:pointer;padding:2px 0;font:inherit}.cm-a button:hover{color:#fff;text-decoration:underline}" +
    ".cm-n{font-size:.85rem;color:#9db6c9;margin:0 0 12px}.cm-n a{color:#6fd0ff}.cm-m{font-size:.85rem;min-height:1.1em;margin:4px 0 0;color:#ffb3b9}.cm-m.ok{color:#9fe3b5}.cm-e{color:#9db6c9;font-size:.9rem;padding:6px 0}";
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tok() { var t = ""; try { t = localStorage.getItem(KEY) || ""; } catch (e) {} return t; }
  function call(method, path, body) {
    var o = { method: method, headers: {} }, t = tok();
    if (t) o.headers.Authorization = "Bearer " + t;
    if (body) { o.headers["Content-Type"] = "application/json"; o.body = JSON.stringify(body); }
    return fetch(API + path, o).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); });
  }
  function ago(ms) { var s = Math.max(1, Math.floor((Date.now() - ms) / 1000)); if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + " min ago"; if (s < 86400) return Math.floor(s / 3600) + " h ago"; if (s < 2592000) return Math.floor(s / 86400) + " d ago"; return new Date(ms).toLocaleDateString(); }
  var ERR = { not_allowed: "Please keep it friendly. This text is not allowed.", no_links: "Links are not allowed in comments.", slow_down: "You are posting too fast. Wait a little.", duplicate: "You already wrote this.", banned: "You can not comment right now.", link_first: "Link your Minecraft account to comment.", email_first: "Add an e-mail to your account to comment.", too_many: "Too many tries. Wait a little.", bad_text: "Write 1 to 500 characters." };
  window.mvpComments = function (nid) {
    if (!document.getElementById("cm-css")) { var st = document.createElement("style"); st.id = "cm-css"; st.textContent = css; document.head.appendChild(st); }
    var wrap = document.createElement("div"); wrap.className = "cm";
    var tb = document.createElement("button"); tb.type = "button"; tb.className = "cm-t";
    tb.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg><span>Comments</span>';
    var body = document.createElement("div"); body.className = "cm-b"; body.hidden = true;
    wrap.appendChild(tb); wrap.appendChild(body);
    var loaded = false, data = null;
    function compose(parent, onDone) {
      var d = data, box = document.createElement("div");
      if (!d.can_comment) {
        var why = d.why;
        box.className = "cm-n";
        box.innerHTML = why === "signin" ? '<a href="../card/">Log in</a> to comment.' : why === "link" ? 'Link your Minecraft account to comment. Open <a href="../card/">My card</a> and use Get link command.' : why === "email" ? 'Add an e-mail to your account to comment. Open <a href="../card/">My card</a>.' : "You can not comment right now.";
        return box;
      }
      var row = document.createElement("div"); row.className = "cm-box";
      var ta = document.createElement("textarea"); ta.maxLength = 500; ta.placeholder = parent ? "Write a reply..." : "Write a comment..."; ta.rows = 2;
      var go = document.createElement("button"); go.type = "button"; go.className = "cm-go"; go.textContent = parent ? "Reply" : "Post";
      var m = document.createElement("div"); m.className = "cm-m";
      row.appendChild(ta); row.appendChild(go);
      go.onclick = function () {
        var t = ta.value.trim(); if (!t) return; go.disabled = true; m.textContent = "";
        call("POST", "/api/app/comments", { news: nid, body: t, parent: parent || undefined }).then(function (r) {
          go.disabled = false;
          if (!r.ok) { m.textContent = ERR[r.j && r.j.error] || "Could not post. Try again later."; return; }
          data.items.push(r.j.item); ta.value = ""; onDone();
        }).catch(function () { go.disabled = false; m.textContent = "Cannot reach the server."; });
      };
      var o = document.createElement("div"); o.appendChild(row); o.appendChild(m); return o;
    }
    function item(c, isReply) {
      var el = document.createElement("div"); el.className = "cm-i" + (isReply ? " re" : "");
      el.innerHTML = '<div class="cm-h"><a href="../u/?n=' + encodeURIComponent(c.nick) + '">' + esc(c.nick) + '</a>' + (c.rank ? '<span class="cm-rk">' + esc(c.rank) + '</span>' : "") + '<span>' + esc(ago(c.at)) + '</span></div><div class="cm-p">' + esc(c.body) + '</div><div class="cm-a"></div><div class="cm-r"></div>';
      var act = el.querySelector(".cm-a"), rbox = el.querySelector(".cm-r");
      function btn(label, fn) { var b = document.createElement("button"); b.type = "button"; b.textContent = label; b.onclick = fn; act.appendChild(b); return b; }
      if (!isReply) btn("Reply", function () { if (rbox.firstChild) { rbox.innerHTML = ""; return; } rbox.appendChild(compose(c.id, draw)); });
      if (c.mine) btn("Delete", function () { if (!window.confirm("Delete this comment?")) return; call("POST", "/api/app/comments/delete", { id: c.id }).then(function (r) { if (r.ok) { data.items = data.items.filter(function (x) { return x.id !== c.id && x.parent_id !== c.id; }); draw(); } }); });
      else if (data.admin) {
        btn("Delete (admin)", function () { if (!window.confirm("Delete this comment" + (c.parent_id ? "" : " and its replies") + "?")) return; call("POST", "/api/app/comments/mod", { action: "delete", id: c.id }).then(function (r) { if (r.ok) { data.items = data.items.filter(function (x) { return x.id !== c.id && x.parent_id !== c.id; }); draw(); } }); });
        btn("Ban from comments", function (e) { if (!window.confirm("Ban " + c.nick + " from commenting?")) return; var b = e.target; call("POST", "/api/app/comments/mod", { action: "ban", player_id: c.pid, on: true }).then(function (r) { b.textContent = r.ok ? "Banned" : "Error"; b.disabled = true; }); });
      }
      else if (data.can_comment) btn("Report", function (e) { var b = e.target; call("POST", "/api/app/comments/report", { id: c.id }).then(function (r) { b.textContent = r.ok ? "Reported" : "Try later"; b.disabled = true; }); });
      return el;
    }
    function draw() {
      body.innerHTML = "";
      body.appendChild(compose(0, draw));
      var tops = data.items.filter(function (x) { return !x.parent_id; });
      tb.querySelector("span").textContent = data.items.length ? "Comments (" + data.items.length + ")" : "Comments";
      if (!tops.length) { var e = document.createElement("div"); e.className = "cm-e"; e.textContent = "No comments yet."; body.appendChild(e); }
      tops.forEach(function (c) {
        body.appendChild(item(c, false));
        data.items.filter(function (x) { return x.parent_id === c.id; }).forEach(function (r) { body.appendChild(item(r, true)); });
      });
    }
    tb.onclick = function () {
      body.hidden = !body.hidden;
      if (body.hidden || loaded) return;
      body.innerHTML = '<div class="cm-e">Loading...</div>';
      call("GET", "/api/comments?news=" + nid).then(function (r) {
        if (!r.ok) { body.innerHTML = '<div class="cm-e">Could not load comments.</div>'; return; }
        data = r.j; loaded = true; draw();
      }).catch(function () { body.innerHTML = '<div class="cm-e">Cannot reach the server.</div>'; });
    };
    return wrap;
  };
})();
