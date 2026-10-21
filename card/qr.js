/* Tiny QR code generator (byte mode, error correction M, versions 1-6). No dependencies.
   MVPQR(text) -> { size, get(x, y) } or null if the text is too long. */
(function () {
  var TAB = { // version: [data codewords, ec codewords per block, blocks]
    1: [16, 10, 1], 2: [28, 16, 1], 3: [44, 26, 1], 4: [64, 18, 2], 5: [86, 24, 2], 6: [108, 16, 4]
  };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };
  var EXP = [], LOG = [];
  (function () { var x = 1; for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  function mul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
  function rsGen(n) {
    var g = [1];
    for (var i = 0; i < n; i++) {
      var ng = new Array(g.length + 1).fill(0);
      for (var j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= mul(g[j], EXP[i]); }
      g = ng;
    }
    return g;
  }
  function rsEc(data, n) {
    var g = rsGen(n), res = new Array(n).fill(0);
    for (var i = 0; i < data.length; i++) {
      var f = data[i] ^ res[0];
      res.shift(); res.push(0);
      for (var j = 0; j < n; j++) res[j] ^= mul(g[j + 1], f);
    }
    return res;
  }
  function utf8(s) { return Array.prototype.slice.call(new TextEncoder().encode(s)); }
  function bit(v, i) { return ((v >>> i) & 1) !== 0; }

  function make(text) {
    var bytes = utf8(text), ver = 0;
    for (var v = 1; v <= 6; v++) { if (bytes.length <= TAB[v][0] - 2) { ver = v; break; } }
    if (!ver) return null;
    var t = TAB[ver], cap = t[0], ecn = t[1], nb = t[2], size = 17 + 4 * ver;
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4); put(bytes.length, 8);
    bytes.forEach(function (b) { put(b, 8); });
    for (var k = 0; k < 4 && bits.length < cap * 8; k++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var cw = [], i, j;
    for (i = 0; i < bits.length; i += 8) { var b = 0; for (j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; cw.push(b); }
    for (var pad = 0xEC; cw.length < cap; pad ^= 0xEC ^ 0x11) cw.push(pad);
    var per = cap / nb, blocks = [], ecs = [];
    for (i = 0; i < nb; i++) { var d = cw.slice(i * per, (i + 1) * per); blocks.push(d); ecs.push(rsEc(d, ecn)); }
    var all = [];
    for (i = 0; i < per; i++) blocks.forEach(function (d) { all.push(d[i]); });
    for (i = 0; i < ecn; i++) ecs.forEach(function (e) { all.push(e[i]); });

    var m = [], fn = [];
    for (i = 0; i < size; i++) { m.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function set(x, y, v) { m[y][x] = v; fn[y][x] = true; }
    for (i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) set(xx, yy, dist !== 2 && dist !== 4);
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var ap = ALIGN[ver], dy, dx;
    for (i = 0; i < ap.length; i++) for (j = 0; j < ap.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === ap.length - 1) || (i === ap.length - 1 && j === 0)) continue;
      for (dy = -2; dy <= 2; dy++) for (dx = -2; dx <= 2; dx++) set(ap[i] + dx, ap[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    function formatBits(mask) {
      var data = mask, rem = data, q; // error correction level M = 00
      for (q = 0; q < 10; q++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var bts = ((data << 10) | rem) ^ 0x5412;
      for (q = 0; q <= 5; q++) set(8, q, bit(bts, q));
      set(8, 7, bit(bts, 6)); set(8, 8, bit(bts, 7)); set(7, 8, bit(bts, 8));
      for (q = 9; q < 15; q++) set(14 - q, 8, bit(bts, q));
      for (q = 0; q < 8; q++) set(size - 1 - q, 8, bit(bts, q));
      for (q = 8; q < 15; q++) set(8, size - 15 + q, bit(bts, q));
      set(8, size - 8, true);
    }
    formatBits(0);
    var idx = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (j = 0; j < 2; j++) {
        var x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && idx < all.length * 8) { m[y][x] = bit(all[idx >>> 3], 7 - (idx & 7)); idx++; }
      }
    }
    function applyMask(mask) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        var inv;
        switch (mask) {
          case 0: inv = (x + y) % 2 === 0; break;
          case 1: inv = y % 2 === 0; break;
          case 2: inv = x % 3 === 0; break;
          case 3: inv = (x + y) % 3 === 0; break;
          case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: inv = (x * y) % 2 + (x * y) % 3 === 0; break;
          case 6: inv = ((x * y) % 2 + (x * y) % 3) % 2 === 0; break;
          default: inv = ((x + y) % 2 + (x * y) % 3) % 2 === 0;
        }
        if (inv && !fn[y][x]) m[y][x] = !m[y][x];
      }
    }
    function penalty() {
      var p = 0, y, x;
      function lines(get) {
        for (var a = 0; a < size; a++) {
          var run = 1, line = "";
          for (var b = 0; b < size; b++) {
            var c = get(a, b); line += c ? "1" : "0";
            if (b > 0 && c === get(a, b - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1;
          }
          var r, re = /10111010000|00001011101/g;
          while ((r = re.exec(line))) { p += 40; re.lastIndex = r.index + 1; }
        }
      }
      lines(function (a, b) { return m[a][b]; });
      lines(function (a, b) { return m[b][a]; });
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = m[y][x]; if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
      }
      var dark = 0; for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (m[y][x]) dark++;
      p += (Math.ceil(Math.abs(dark * 20 - size * size * 10) / (size * size)) - 1) * 10;
      return p;
    }
    var best = 0, bestP = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      applyMask(mk); formatBits(mk);
      var pp = penalty(); if (pp < bestP) { bestP = pp; best = mk; }
      applyMask(mk);
    }
    applyMask(best); formatBits(best);
    return { size: size, get: function (x, y) { return m[y][x]; } };
  }
  if (typeof window !== "undefined") window.MVPQR = make;
  if (typeof module !== "undefined") module.exports = make;
})();
