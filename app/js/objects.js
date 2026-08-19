(function () {
  function svg(inner) {
    return '<svg viewBox="0 0 80 64" class="match-svg">' + inner + "</svg>";
  }

  function rect(x, y, w, h, fill) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"/>';
  }

  function circ(cx, cy, r, fill) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>';
  }

  var ink = "#0b1220";
  var mid = "#2a354c";
  var teal = "#12d4c4";
  var mute = "#8b93a7";
  var paper = "#f4f0e6";

  function make(kind, n, mut) {
    var parts = "";
    if (kind === 0) {
      var count = 2 + (n % 2);
      var w = 34 + n * 3;
      var x = 14 + (n % 3) * 4;
      if (mut === 1) w += 12;
      if (mut === 2) count = count === 2 ? 3 : 2;
      if (mut === 3) x += 14;
      var y = 14;
      for (var i = 0; i < count; i += 1) {
        parts += rect(x, y + i * 16, w, 12, i % 2 ? mid : ink);
      }
      if (mut === 0 && n > 2) parts += circ(x + w - 6, y + 6, 3, teal);
    } else if (kind === 1) {
      var foot = 22 + n * 3;
      var flip = mut === 1;
      var short = mut === 2;
      var thick = mut === 3 ? 18 : 12;
      var lx = flip ? 44 : 16;
      var fy = short ? 40 : 34;
      parts += rect(lx, 12, thick, 40, ink);
      parts += rect(flip ? lx - foot + thick : lx, fy, short ? foot - 8 : foot, 12, mid);
      if (mut === 0) parts += circ(lx + 6, 18, 3, teal);
    } else if (kind === 2) {
      var cap = 36 + n * 3;
      var stemX = 28 + (n % 3) * 4;
      if (mut === 1) stemX += 12;
      if (mut === 2) cap -= 12;
      if (mut === 3) stemX -= 8;
      parts += rect(12, 12, cap, 12, ink);
      parts += rect(stemX, 24, 12, 28, mid);
      if (mut === 0) parts += rect(12 + cap - 8, 14, 5, 8, teal);
    } else if (kind === 3) {
      var gap = 16 + n * 2;
      var leftH = 40;
      var rightH = 40;
      if (mut === 1) gap += 10;
      if (mut === 2) leftH = 28;
      if (mut === 3) rightH = 28;
      parts += rect(14, 12, 12, leftH, ink);
      parts += rect(14 + 12 + gap, 12, 12, rightH, ink);
      parts += rect(14, 12, 12 + gap + 12, 10, mid);
      if (mut === 0) parts += circ(20, 50, 3, teal);
    } else if (kind === 4) {
      var px = 20 + (n % 5) * 8;
      var py = 18 + Math.floor(n / 3) * 10;
      if (mut === 1) px = 58;
      if (mut === 2) py = 46;
      if (mut === 3) px = 20;
      parts += rect(14, 12, 52, 40, ink);
      parts += rect(18, 16, 44, 32, paper);
      parts += circ(px, py, mut === 2 ? 5 : 4, teal);
      if (mut === 0) parts += rect(18, 40, 12 + n, 4, mid);
    } else if (kind === 5) {
      var space = 18 + n * 2;
      var r = 7 + (n % 3);
      var c1 = 22;
      var c2 = c1 + space;
      if (mut === 1) r += 3;
      if (mut === 2) c2 += 8;
      if (mut === 3) space = 12;
      parts += circ(c1, 32, r, ink);
      if (mut !== 3) parts += circ(c2, 32, r, mid);
      parts += rect(c1, 29, mut === 3 ? 28 : space, 6, teal);
      if (mut === 0) parts += circ(c1, 18, 3, mute);
    }
    return svg(parts);
  }

  var items = [];
  for (var i = 0; i < 42; i += 1) {
    var kind = i % 6;
    var n = Math.floor(i / 6);
    var original = make(kind, n, 0);
    var choices = [make(kind, n, 1), make(kind, n, 2), make(kind, n, 3)];
    var slot = i % 4;
    choices.splice(slot, 0, original);
    items.push({ stem: original, choices: choices });
  }

  window.JOBTEST_OBJECTS = items;
})();
