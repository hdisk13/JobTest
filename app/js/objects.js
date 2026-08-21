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

  function poly(pts, fill) {
    return '<polygon points="' + pts + '" fill="' + fill + '"/>';
  }

  var ink = "#0b1220";
  var mid = "#2a354c";
  var teal = "#12d4c4";
  var mute = "#8b93a7";
  var paper = "#f4f0e6";

  function draw(id, mut) {
    var parts = "";
    if (id === 0) {
      parts += rect(18, 12, 44, 12, ink);
      parts += rect(18, 28, mut === 1 ? 28 : 44, 12, mid);
      if (mut !== 2) parts += rect(18, 44, 44, 12, ink);
      if (mut === 3) parts += circ(58, 18, 4, teal);
    } else if (id === 1) {
      parts += rect(16, 10, 14, 44, ink);
      parts += rect(16, mut === 2 ? 18 : 40, mut === 1 ? 22 : 38, 14, mid);
      if (mut === 0) parts += circ(22, 16, 3, teal);
      if (mut === 3) parts += circ(48, 47, 4, teal);
    } else if (id === 2) {
      parts += rect(12, 12, mut === 2 ? 28 : 52, 12, ink);
      parts += rect(mut === 1 ? 44 : 32, 24, 12, 28, mid);
      if (mut === 0) parts += rect(52, 14, 6, 8, teal);
      if (mut === 3) parts += circ(18, 18, 3, teal);
    } else if (id === 3) {
      parts += rect(14, 12, 12, mut === 2 ? 26 : 40, ink);
      parts += rect(14, 12, mut === 1 ? 28 : 48, 10, mid);
      parts += rect(50, 12, 12, mut === 3 ? 26 : 40, ink);
    } else if (id === 4) {
      parts += rect(14, 12, 52, 40, ink);
      parts += rect(18, 16, 44, 32, paper);
      parts += circ(mut === 1 ? 52 : 28, mut === 2 ? 40 : 26, 5, teal);
      if (mut === 3) parts += circ(52, 40, 5, mute);
    } else if (id === 5) {
      parts += circ(24, 32, mut === 1 ? 11 : 8, ink);
      if (mut !== 3) parts += circ(52, 32, 8, mid);
      parts += rect(24, 29, mut === 2 ? 16 : 28, 6, teal);
    } else if (id === 6) {
      parts += rect(34, 10, 12, 44, ink);
      parts += rect(mut === 1 ? 22 : 14, 26, mut === 2 ? 28 : 52, 12, mid);
      if (mut === 0) parts += circ(40, 16, 3, teal);
      if (mut === 3) parts += circ(40, 48, 4, mute);
    } else if (id === 7) {
      parts += rect(50, 10, 14, 44, ink);
      parts += rect(mut === 1 ? 36 : 16, 10, 34, 14, mid);
      if (mut === 2) parts += rect(50, 40, 14, 14, teal);
      if (mut === 3) parts += circ(24, 17, 4, teal);
    } else if (id === 8) {
      parts += rect(36, 10, 28, 16, ink);
      parts += rect(22, 26, mut === 1 ? 20 : 42, 14, mid);
      parts += rect(10, 40, mut === 2 ? 24 : 54, 14, ink);
      if (mut === 3) parts += circ(50, 18, 3, teal);
    } else if (id === 9) {
      parts += poly("40,10 64,32 40,54 16,32", ink);
      if (mut !== 2) parts += poly("40,18 56,32 40,46 24,32", paper);
      parts += circ(40, mut === 1 ? 24 : 32, mut === 3 ? 6 : 4, teal);
    } else if (id === 10) {
      parts += poly(mut === 1 ? "16,48 40,12 64,48" : "16,14 64,14 40,50", ink);
      parts += rect(22, mut === 2 ? 20 : 44, 36, 8, mid);
      if (mut === 3) parts += circ(40, 30, 4, teal);
    } else if (id === 11) {
      parts += rect(16, 12, 12, 40, ink);
      parts += rect(16, 12, 44, 10, mid);
      parts += rect(16, 42, mut === 1 ? 24 : 44, 10, mid);
      if (mut === 2) parts += rect(48, 22, 12, 20, mute);
      if (mut === 3) parts += circ(54, 17, 3, teal);
    } else if (id === 12) {
      parts += rect(16, 12, 12, 40, ink);
      parts += rect(52, 12, 12, 40, ink);
      parts += rect(16, mut === 1 ? 18 : 26, 48, 12, mid);
      if (mut === 2) parts += circ(22, 18, 3, teal);
      if (mut === 3) parts += rect(28, 12, 24, 8, teal);
    } else if (id === 13) {
      parts += rect(16, 10, 12, 44, ink);
      parts += rect(16, 10, mut === 1 ? 24 : 40, 10, mid);
      parts += rect(16, 28, 32, 8, mute);
      if (mut !== 2) parts += rect(16, 44, 40, 10, mid);
      if (mut === 3) parts += circ(50, 15, 3, teal);
    } else if (id === 14) {
      parts += rect(12, 16, 32, 12, ink);
      parts += rect(mut === 1 ? 12 : 36, 36, 32, 12, mid);
      if (mut === 2) parts += rect(36, 16, 32, 12, mute);
      if (mut === 3) parts += circ(28, 22, 3, teal);
      if (mut === 0) parts += circ(52, 42, 3, teal);
    } else if (id === 15) {
      parts += rect(18, 12, 44, 40, ink);
      parts += rect(22, 16, 36, 32, paper);
      parts += circ(mut === 1 ? 30 : 40, mut === 2 ? 24 : 32, 7, mid);
      if (mut === 3) parts += circ(50, 24, 4, teal);
    } else if (id === 16) {
      parts += circ(22, mut === 1 ? 22 : 32, 6, ink);
      parts += circ(40, 32, 6, mid);
      if (mut !== 3) parts += circ(58, mut === 2 ? 22 : 32, 6, mute);
      if (mut === 0) parts += rect(22, 44, 36, 6, teal);
    } else if (id === 17) {
      parts += rect(14, 14, 52, 36, ink);
      parts += rect(mut === 1 ? 40 : 14, 14, 18, 14, paper);
      if (mut === 2) parts += rect(40, 36, 18, 14, paper);
      if (mut === 3) parts += circ(40, 32, 5, teal);
      if (mut === 0) parts += circ(48, 40, 4, teal);
    } else if (id === 18) {
      parts += rect(16, 12, 20, 40, ink);
      parts += rect(44, 12, 20, mut === 1 ? 24 : 40, mid);
      if (mut === 2) parts += rect(16, 12, 48, 10, teal);
      if (mut === 3) parts += circ(26, 20, 4, teal);
    } else if (id === 19) {
      parts += rect(16, 14, 12, 36, ink);
      parts += rect(52, 14, 12, 36, ink);
      parts += rect(16, 14, 48, mut === 1 ? 8 : 14, mid);
      if (mut === 2) parts += rect(28, 36, 24, 10, mute);
      if (mut === 3) parts += circ(40, 21, 3, teal);
    } else if (id === 20) {
      parts += rect(18, 12, 14, 40, ink);
      parts += rect(18, 12, 40, 12, mid);
      parts += circ(mut === 1 ? 28 : 52, mut === 2 ? 24 : 46, 6, teal);
      if (mut === 3) parts += rect(32, 40, 20, 8, mute);
    } else if (id === 21) {
      parts += rect(mut === 1 ? 20 : 34, 12, 12, 28, ink);
      parts += rect(14, 40, mut === 2 ? 28 : 52, 12, mid);
      if (mut === 0) parts += circ(40, 18, 3, teal);
      if (mut === 3) parts += circ(20, 46, 4, mute);
    } else if (id === 22) {
      parts += rect(14, 40, 52, 12, ink);
      parts += rect(14, mut === 1 ? 28 : 12, 12, 28, mid);
      parts += rect(54, 12, 12, mut === 2 ? 16 : 28, mid);
      if (mut === 3) parts += circ(40, 46, 3, teal);
    } else if (id === 23) {
      parts += rect(10, 24, mut === 1 ? 36 : 60, 16, ink);
      parts += circ(mut === 2 ? 20 : 40, 20, 6, teal);
      if (mut === 3) parts += circ(60, 44, 5, mute);
    } else if (id === 24) {
      parts += rect(14, 10, 28, 24, ink);
      parts += rect(mut === 1 ? 14 : 38, 30, 28, 24, mid);
      if (mut === 2) parts += circ(28, 22, 4, teal);
      if (mut === 3) parts += rect(14, 10, 52, 8, teal);
      if (mut === 0) parts += circ(52, 42, 4, teal);
    } else if (id === 25) {
      parts += poly(mut === 1 ? "16,20 40,48 64,20" : "16,44 40,16 64,44", ink);
      parts += rect(28, mut === 2 ? 18 : 28, 24, 8, mid);
      if (mut === 3) parts += circ(40, 32, 4, teal);
    } else if (id === 26) {
      parts += rect(16, 12, 48, 40, ink);
      parts += rect(20, 16, 18, mut === 1 ? 28 : 14, paper);
      parts += rect(42, 16, 18, 14, paper);
      if (mut !== 2) parts += rect(20, 34, 18, 14, paper);
      parts += rect(42, mut === 3 ? 16 : 34, 18, 14, paper);
    } else if (id === 27) {
      parts += circ(40, 32, 20, ink);
      parts += circ(40, 32, 13, paper);
      parts += circ(40, 32, mut === 1 ? 4 : 7, teal);
      if (mut === 2) parts += rect(36, 12, 8, 40, mid);
      if (mut === 3) parts += circ(52, 20, 4, mute);
    } else if (id === 28) {
      parts += rect(18, 10, 8, 44, ink);
      parts += rect(26, 10, mut === 1 ? 18 : 36, 22, mid);
      if (mut === 2) parts += rect(26, 32, 36, 10, mute);
      if (mut === 3) parts += circ(30, 50, 3, teal);
      if (mut === 0) parts += circ(56, 21, 3, teal);
    } else if (id === 29) {
      parts += rect(50, 12, 12, 40, ink);
      parts += rect(22, 12, mut === 1 ? 20 : 40, 10, mid);
      parts += rect(22, 42, 40, 10, mid);
      if (mut === 2) parts += rect(22, 12, 10, 40, mute);
      if (mut === 3) parts += circ(28, 32, 4, teal);
    } else if (id === 30) {
      parts += rect(14, 18, 52, 10, ink);
      parts += rect(14, mut === 1 ? 28 : 36, 52, 10, mid);
      if (mut === 2) parts += rect(14, 50, 52, 8, mute);
      if (mut === 3) parts += circ(40, 14, 4, teal);
    } else if (id === 31) {
      parts += circ(28, 20, mut === 1 ? 4 : 6, ink);
      parts += circ(28, 44, 6, ink);
      parts += rect(40, 16, mut === 2 ? 12 : 22, 32, mid);
      if (mut === 3) parts += circ(52, 32, 4, teal);
    } else if (id === 32) {
      parts += poly("18,14 62,14 40,52", ink);
      if (mut !== 2) parts += poly("26,18 54,18 40,42", paper);
      parts += circ(40, mut === 1 ? 24 : 30, 4, teal);
      if (mut === 3) parts += rect(30, 48, 20, 6, mid);
    } else if (id === 33) {
      parts += poly("40,8 58,26 40,44 22,26", mid);
      parts += rect(34, 40, 12, mut === 1 ? 8 : 16, ink);
      if (mut === 2) parts += circ(40, 26, 5, teal);
      if (mut === 3) parts += rect(22, 48, 36, 6, mute);
      if (mut === 0) parts += circ(40, 26, 4, teal);
    } else if (id === 34) {
      parts += rect(22, 14, 12, 36, ink);
      parts += rect(46, mut === 1 ? 14 : 22, 12, 36, mid);
      parts += rect(22, 28, mut === 2 ? 20 : 36, 8, teal);
      if (mut === 3) parts += circ(28, 18, 3, mute);
    } else if (id === 35) {
      parts += rect(12, 12, mut === 1 ? 20 : 28, 28, ink);
      parts += rect(36, 24, 32, mut === 2 ? 18 : 28, mid);
      if (mut === 3) parts += circ(26, 26, 4, teal);
      if (mut === 0) parts += circ(52, 38, 4, teal);
    } else if (id === 36) {
      parts += rect(18, 12, 8, 40, ink);
      parts += rect(36, 12, 8, mut === 1 ? 24 : 40, mid);
      parts += rect(54, 12, 8, 40, mute);
      if (mut === 2) parts += rect(18, 48, 44, 6, teal);
      if (mut === 3) parts += circ(40, 20, 3, teal);
    } else if (id === 37) {
      parts += rect(16, 12, 14, 40, ink);
      parts += rect(16, 38, 40, 14, mid);
      parts += circ(mut === 1 ? 22 : 48, mut === 2 ? 20 : 28, 5, teal);
      if (mut === 3) parts += rect(30, 12, 20, 10, mute);
    } else if (id === 38) {
      parts += poly("16,28 40,10 64,28", ink);
      parts += rect(20, 28, 40, mut === 1 ? 16 : 24, mid);
      if (mut === 0) parts += rect(34, 36, 12, 16, paper);
      if (mut === 2) parts += circ(40, 40, 5, teal);
      if (mut === 3) parts += circ(40, 22, 4, teal);
    } else if (id === 39) {
      parts += circ(40, 32, 20, ink);
      parts += circ(40, 32, 14, paper);
      parts += rect(20, mut === 1 ? 24 : 30, 40, 6, mid);
      if (mut === 2) parts += circ(40, 32, 5, teal);
      if (mut === 3) parts += rect(36, 12, 8, 40, mute);
    } else if (id === 40) {
      parts += rect(14, 12, 12, 16, ink);
      parts += rect(14, 12, 16, 12, ink);
      parts += rect(54, mut === 1 ? 12 : 36, 12, 16, mid);
      parts += rect(50, mut === 1 ? 12 : 36, 16, 12, mid);
      if (mut === 2) parts += circ(40, 32, 5, teal);
      if (mut === 3) parts += rect(30, 28, 20, 8, mute);
    } else {
      parts += circ(40, 32, mut === 1 ? 8 : 16, ink);
      parts += rect(12, 28, mut === 2 ? 20 : 56, 8, mid);
      if (mut === 3) parts += circ(20, 18, 5, teal);
      if (mut === 0) parts += circ(60, 18, 4, teal);
    }
    return svg(parts);
  }

  var items = [];
  for (var i = 0; i < 42; i += 1) {
    var original = draw(i, 0);
    var choices = [draw(i, 1), draw(i, 2), draw(i, 3)];
    var slot = i % 4;
    choices.splice(slot, 0, original);
    items.push({ stem: original, choices: choices });
  }

  window.JOBTEST_OBJECTS = items;
})();
