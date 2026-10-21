/* Comments under a news item. Usage: container.appendChild(mvpComments(newsId)) */
(function () {
  var API = "https://mvp-news-api.mvp-shop.workers.dev", KEY = "mvp_card_token";
  var css = ".cm{margin:14px 0 0}.cm-t{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:9px 16px;font:700 .9rem inherit;cursor:pointer}.cm-t:hover{background:rgba(255,255,255,.12)}" +
    ".cm-b{margin-top:12px}.cm-box{margin:0 0 16px;border-radius:18px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);transition:border-color .2s,background .2s}.cm-box:focus-within{border-color:rgba(111,208,255,.6);background:rgba(255,255,255,.07)}.cm-box textarea{display:block;width:100%;box-sizing:border-box;min-height:52px;max-height:200px;resize:none;padding:14px 16px 4px;border:0;outline:0;background:transparent;color:inherit;font:inherit;font-size:.95rem;line-height:1.5;margin:0}.cm-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 10px 10px 16px}.cm-cnt{font-size:.78rem;color:#9db6c9}" +
    ".cm-go{border:0;border-radius:999px;padding:9px 20px;font:700 .88rem inherit;color:#fff;background:linear-gradient(180deg,#22a6f2,#0081cc);cursor:pointer;flex:none;box-shadow:0 4px 14px rgba(0,129,204,.35)}.cm-go:hover{background:linear-gradient(180deg,#45b6f7,#0a8ee0)}.cm-go:disabled{opacity:.45;cursor:default;box-shadow:none}" +
    ".mch{display:inline-block;flex:none;border-radius:8px;overflow:hidden;image-rendering:pixelated;vertical-align:middle}.mch.bad{background:url(\"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%208%208%27%20shape-rendering=%27crispEdges%27%3E%3Crect%20width=%278%27%20height=%278%27%20fill=%27%23b98a63%27/%3E%3Crect%20width=%278%27%20height=%272%27%20fill=%27%233b2a1d%27/%3E%3Crect%20y=%272%27%20width=%271%27%20height=%271%27%20fill=%27%233b2a1d%27/%3E%3Crect%20x=%277%27%20y=%272%27%20width=%271%27%20height=%271%27%20fill=%27%233b2a1d%27/%3E%3Crect%20x=%271%27%20y=%274%27%20width=%272%27%20height=%271%27%20fill=%27%23fff%27/%3E%3Crect%20x=%275%27%20y=%274%27%20width=%272%27%20height=%271%27%20fill=%27%23fff%27/%3E%3Crect%20x=%272%27%20y=%274%27%20width=%271%27%20height=%271%27%20fill=%27%233a4fa0%27/%3E%3Crect%20x=%275%27%20y=%274%27%20width=%271%27%20height=%271%27%20fill=%27%233a4fa0%27/%3E%3Crect%20x=%273%27%20y=%275%27%20width=%272%27%20height=%271%27%20fill=%27%238f6444%27/%3E%3Crect%20x=%272%27%20y=%276%27%20width=%274%27%20height=%271%27%20fill=%27%236e4a31%27/%3E%3C/svg%3E\") center/cover}.mch img{width:100%;height:100%;display:block;image-rendering:pixelated}" +
    ".cm-av{flex:none;display:block;line-height:0}.cm-w{display:flex;gap:12px;align-items:flex-start}.cm-c{flex:1;min-width:0}.cm-w .mch{border-radius:10px;margin-top:2px}.cm-i{padding:12px 0;border-top:1px solid rgba(255,255,255,.08)}.cm-i.re{margin-left:28px}.cm-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.85rem;color:#9db6c9}.cm-h a{color:#fff;font-weight:700;text-decoration:none}.cm-h a:hover{text-decoration:underline}" +
    ".cm-rk{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.1);font-size:.7rem;font-weight:700;color:#cfe3f1}.cm-p{margin:4px 0 6px;font-size:.95rem;line-height:1.5;overflow-wrap:anywhere;white-space:pre-wrap}" +
    ".cm-hi{filter:grayscale(1) brightness(1.2) opacity(.7)}.cm-lk.on .cm-hi{filter:none}" +
    ".cm-a{display:flex;align-items:center;flex-wrap:wrap;gap:6px 16px;font-size:.8rem}.cm-a button{display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:#9db6c9;cursor:pointer;padding:2px 0;font:inherit}.cm-a button:hover{color:#fff}.cm-a svg{width:16px;height:16px;flex:none}.cm-a .cm-lk.on{color:#ff6b81}.cm-a .cm-lk.on svg{fill:#ff6b81}.cm-a .cm-rp:hover svg{transform:translateX(2px)}.cm-a .cm-fl{color:#ff6b81}.cm-a .cm-fl:hover{color:#ff95a5}.cm-a .cm-fl:disabled{opacity:.6;cursor:default}.cm-all{margin:6px 0 0;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:8px 16px;font:700 .85rem inherit;cursor:pointer}.cm-all:hover{background:rgba(255,255,255,.12)}" +
    ".cm-n{font-size:.85rem;color:#9db6c9;margin:0 0 12px}.cm-n a{color:#6fd0ff}.cm-m{font-size:.85rem;min-height:1.1em;margin:4px 0 0;color:#ffb3b9}.cm-m.ok{color:#9fe3b5}.cm-e{color:#9db6c9;font-size:.9rem;padding:6px 0}";
  var VTICK = '<svg class="wc-ver" viewBox="0 0 24 24" width="16" height="16" style="vertical-align:-3px;margin-left:4px;display:inline-block" aria-label="Verified" role="img"><path d="M12.00 2.00 L14.23 3.69 L17.00 3.34 L18.08 5.92 L20.66 7.00 L20.31 9.77 L22.00 12.00 L20.31 14.23 L20.66 17.00 L18.08 18.08 L17.00 20.66 L14.23 20.31 L12.00 22.00 L9.77 20.31 L7.00 20.66 L5.92 18.08 L3.34 17.00 L3.69 14.23 L2.00 12.00 L3.69 9.77 L3.34 7.00 L5.92 5.92 L7.00 3.34 L9.77 3.69 Z" fill="#2ea2ea"/><path d="M8 12.3 L10.8 15 L16.2 9.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function head(n, s) { return '<span class="mch" style="width:' + s + 'px;height:' + s + 'px"><img alt="" loading="lazy" src="' + API + '/api/skin/' + encodeURIComponent(n) + '" onerror="this.style.display=\'none\';this.parentNode.className+=\' bad\'"></span>'; }
  var IC = {
    heart: '<img class="cm-hi" src="/img/ic/heart.png" alt="" width="32" height="32" style="width:32px;height:32px;display:block;image-rendering:pixelated">',
    reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>'
  };
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
  window.mvpComments = function (nid, opts) {
    var prof = opts && opts.profile ? String(opts.profile) : "";
    if (!document.getElementById("cm-css")) { var st = document.createElement("style"); st.id = "cm-css"; st.textContent = css; document.head.appendChild(st); }
    var wrap = document.createElement("div"); wrap.className = "cm";
    var tb = document.createElement("button"); tb.type = "button"; tb.className = "cm-t";
    tb.innerHTML = '<img src="/img/ic/comments.png" alt="" width="32" height="32" style="width:32px;height:32px;image-rendering:pixelated"><span>Comments</span>';
    var body = document.createElement("div"); body.className = "cm-b"; body.hidden = true;
    wrap.appendChild(tb); wrap.appendChild(body);
    var loaded = false, data = null, showAll = false;
    function compose(parent, onDone) {
      var d = data, box = document.createElement("div");
      if (!d.can_comment) {
        var why = d.why;
        box.className = "cm-n";
        box.innerHTML = why === "self" ? "You can not comment on your own profile." : why === "signin" ? '<a href="../card/">Log in</a> to comment.' : why === "link" ? 'Link your Minecraft account to comment. Open <a href="../card/">My card</a> and use Get link command.' : why === "email" ? 'Add an e-mail to your account to comment. Open <a href="../card/">My card</a>.' : "You can not comment right now.";
        return box;
      }
      var row = document.createElement("div"); row.className = "cm-box";
      var ta = document.createElement("textarea"); ta.maxLength = 500; ta.placeholder = parent ? "Write a reply..." : "Share your thoughts..."; ta.rows = 1;
      var bar = document.createElement("div"); bar.className = "cm-bar"; var cnt = document.createElement("span"); cnt.className = "cm-cnt"; cnt.textContent = "0 / 500";
      var go = document.createElement("button"); go.type = "button"; go.className = "cm-go"; go.textContent = parent ? "Reply" : "Post comment";
      var m = document.createElement("div"); m.className = "cm-m";
      go.disabled = true;
      ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; cnt.textContent = ta.value.length + " / 500"; go.disabled = !ta.value.trim(); });
      bar.appendChild(cnt); bar.appendChild(go); row.appendChild(ta); row.appendChild(bar);
      go.onclick = function () {
        var t = ta.value.trim(); if (!t) return; go.disabled = true; m.textContent = "";
        call("POST", "/api/app/comments", (prof ? { profile: prof, body: t, parent: parent || undefined } : { news: nid, body: t, parent: parent || undefined })).then(function (r) {
          go.disabled = !ta.value.trim();
          if (!r.ok) { m.textContent = ERR[r.j && r.j.error] || "Could not post. Try again later."; return; }
          data.items.push(r.j.item); ta.value = ""; go.disabled = true; onDone();
        }).catch(function () { go.disabled = false; m.textContent = "Cannot reach the server."; });
      };
      var o = document.createElement("div"); o.appendChild(row); o.appendChild(m); return o;
    }
    function item(c, isReply) {
      var el = document.createElement("div"); el.className = "cm-i" + (isReply ? " re" : "");
      el.innerHTML = '<div class="cm-w"><a class="cm-av" href="../u/?n=' + encodeURIComponent(c.nick) + '" aria-label="' + esc(c.nick) + '">' + head(c.nick, isReply ? 34 : 44) + '</a><div class="cm-c"><div class="cm-h"><a href="../u/?n=' + encodeURIComponent(c.nick) + '">' + esc(c.nick) + (c.verified ? VTICK : "") + '</a>' + (c.rank ? '<span class="cm-rk">' + esc(c.rank) + '</span>' : "") + '<span>' + esc(ago(c.at)) + '</span></div><div class="cm-p">' + esc(c.body) + '</div><div class="cm-a"></div><div class="cm-r"></div></div></div>';
      var act = el.querySelector(".cm-a"), rbox = el.querySelector(".cm-r");
      function btn(label, fn, cls, icon, title) { var b = document.createElement("button"); b.type = "button"; if (cls) b.className = cls; if (icon) b.innerHTML = icon + (label ? "<span>" + label + "</span>" : ""); else b.textContent = label; if (title) { b.title = title; b.setAttribute("aria-label", title); } b.onclick = fn; act.appendChild(b); return b; }
      var lb = btn(String(c.likes || ""), function () {
        if (!(data.can_like !== undefined ? data.can_like : data.can_comment)) { window.alert(data.why === "signin" ? "Log in to like comments." : "Link your Minecraft account and add an e-mail to like comments."); return; }
        var was = !!c.liked, wn = c.likes || 0;
        function paint(l, n) { c.liked = l; c.likes = n; lb.className = "cm-lk" + (l ? " on" : ""); lb.innerHTML = IC.heart + (n ? "<span>" + n + "</span>" : ""); }
        paint(!was, Math.max(0, wn + (was ? -1 : 1)));
        call("POST", "/api/app/comments/like", { id: c.id }).then(function (r) { if (r.ok) paint(r.j.liked, r.j.likes); else paint(was, wn); }).catch(function () { paint(was, wn); });
      }, "cm-lk" + (c.liked ? " on" : ""), IC.heart, "Like");
      if (!isReply) btn("Reply", function () { if (rbox.firstChild) { rbox.innerHTML = ""; return; } rbox.appendChild(compose(c.id, draw)); }, "cm-rp", IC.reply);
      if (c.mine) btn("Delete", function () { if (!window.confirm("Delete this comment?")) return; call("POST", "/api/app/comments/delete", { id: c.id }).then(function (r) { if (r.ok) { data.items = data.items.filter(function (x) { return x.id !== c.id && x.parent_id !== c.id; }); draw(); } }); });
      else if (data.admin) {
        btn("Delete (admin)", function () { if (!window.confirm("Delete this comment" + (c.parent_id ? "" : " and its replies") + "?")) return; call("POST", "/api/app/comments/mod", { action: "delete", id: c.id }).then(function (r) { if (r.ok) { data.items = data.items.filter(function (x) { return x.id !== c.id && x.parent_id !== c.id; }); draw(); } }); });
        btn("Ban from comments", function (e) { if (!window.confirm("Ban " + c.nick + " from commenting?")) return; var b = e.currentTarget; call("POST", "/api/app/comments/mod", { action: "ban", player_id: c.pid, on: true }).then(function (r) { b.textContent = r.ok ? "Banned" : "Error"; b.disabled = true; }); }, "", '<img src="/img/ic/ban.png" alt="" width="16" height="16" style="width:16px;height:16px;image-rendering:pixelated">');
      }
      var fl = btn("", function (e) {
        if (c.mine) { window.alert("You can not report your own comment."); return; }
        if (!(data.can_like !== undefined ? data.can_like : data.can_comment)) { window.alert(data.why === "signin" ? "Log in to report comments." : "Link your Minecraft account and add an e-mail to report comments."); return; }
        if (!window.confirm("Report this comment by " + c.nick + " to the moderators?")) return;
        var b = fl; b.disabled = true;
        call("POST", "/api/app/comments/report", { id: c.id }).then(function (r) { b.title = r.ok ? "Reported" : "Try later"; b.setAttribute("aria-label", b.title); if (r.ok) { b.textContent = "Reported, thank you"; b.style.color = "#9fe3b5"; } else b.disabled = false; }).catch(function () { b.disabled = false; });
      }, "cm-fl", IC.flag, "Report");
      return el;
    }
    function draw() {
      body.innerHTML = "";
      body.appendChild(compose(0, draw));
      var tops = data.items.filter(function (x) { return !x.parent_id; }).sort(function (a, b) { return (b.likes || 0) - (a.likes || 0) || b.at - a.at; });
      var total = tops.length;
      if (!showAll && tops.length > 5) tops = tops.slice(0, 5);
      tb.querySelector("span").textContent = data.items.length ? "Comments (" + data.items.length + ")" : "Comments";
      if (!tops.length) { var e = document.createElement("div"); e.className = "cm-e"; e.textContent = "No comments yet."; body.appendChild(e); }
      tops.forEach(function (c) {
        body.appendChild(item(c, false));
        data.items.filter(function (x) { return x.parent_id === c.id; }).forEach(function (r) { body.appendChild(item(r, true)); });
      });
      if (total > 5) { var more = document.createElement("button"); more.type = "button"; more.className = "cm-all"; more.textContent = showAll ? "Show top 5 only" : "Show all " + total + " comments"; more.onclick = function () { showAll = !showAll; draw(); }; body.appendChild(more); }
    }
    function load() {
      body.innerHTML = '<div class="cm-e">Loading...</div>';
      call("GET", (prof ? "/api/comments?profile=" + encodeURIComponent(prof) : "/api/comments?news=" + nid)).then(function (r) {
        if (!r.ok) { body.innerHTML = '<div class="cm-e">Could not load comments.</div>'; return; }
        data = r.j; loaded = true; draw();
      }).catch(function () { body.innerHTML = '<div class="cm-e">Cannot reach the server.</div>'; });
    }
    body.hidden = false; load();
    // new comments and likes show up by themselves (not while somebody is typing)
    var sig = function (d) { return d.items.map(function (x) { return x.id + ":" + x.likes + ":" + (x.liked ? 1 : 0); }).join(",") + "|" + d.can_comment; };
    var iv = setInterval(function () {
      if (!document.body.contains(wrap)) { clearInterval(iv); return; }
      if (document.hidden || !loaded) return;
      var ae = document.activeElement; if (ae && wrap.contains(ae) && /^(TEXTAREA|INPUT)$/.test(ae.tagName)) return;
      if (wrap.querySelector("textarea") && Array.prototype.some.call(wrap.querySelectorAll("textarea"), function (t) { return t.value; })) return;
      call("GET", (prof ? "/api/comments?profile=" + encodeURIComponent(prof) : "/api/comments?news=" + nid)).then(function (r) {
        if (r.ok && sig(r.j) !== sig(data)) { data = r.j; draw(); }
      }).catch(function () {});
    }, 30000);
    tb.onclick = function () { body.hidden = !body.hidden; };
    return wrap;
  };
})();
