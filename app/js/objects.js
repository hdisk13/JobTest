(function () {
  function svg(inner) {
    return '<svg viewBox="0 0 80 64" class="match-svg">' + inner + "</svg>";
  }

  const fig = {
    cube: svg(
      '<polygon points="22,16 52,16 64,26 34,26" fill="#12d4c4"/>' +
        '<polygon points="22,16 34,26 34,52 22,42" fill="#0b1220"/>' +
        '<polygon points="34,26 64,26 64,52 34,52" fill="#2a354c"/>'
    ),
    cubeTurn: svg(
      '<polygon points="18,18 46,12 62,22 34,28" fill="#12d4c4"/>' +
        '<polygon points="18,18 34,28 34,54 18,44" fill="#0b1220"/>' +
        '<polygon points="34,28 62,22 62,48 34,54" fill="#2a354c"/>'
    ),
    ell: svg(
      '<polygon points="16,14 40,14 48,20 24,20" fill="#12d4c4"/>' +
        '<polygon points="16,14 24,20 24,50 16,44" fill="#0b1220"/>' +
        '<polygon points="24,20 48,20 48,36 24,36" fill="#2a354c"/>' +
        '<polygon points="24,36 64,36 70,42 30,42" fill="#12d4c4"/>' +
        '<polygon points="24,36 30,42 30,56 24,50" fill="#0b1220"/>' +
        '<polygon points="30,42 70,42 70,56 30,56" fill="#2a354c"/>'
    ),
    ellTurn: svg(
      '<polygon points="20,12 42,12 50,18 28,18" fill="#12d4c4"/>' +
        '<polygon points="20,12 28,18 28,46 20,40" fill="#0b1220"/>' +
        '<polygon points="28,18 50,18 50,32 28,32" fill="#2a354c"/>' +
        '<polygon points="28,32 66,32 72,38 34,38" fill="#12d4c4"/>' +
        '<polygon points="28,32 34,38 34,52 28,46" fill="#0b1220"/>' +
        '<polygon points="34,38 72,38 72,52 34,52" fill="#2a354c"/>'
    ),
    tee: svg(
      '<polygon points="18,12 62,12 70,20 26,20" fill="#12d4c4"/>' +
        '<polygon points="18,12 26,20 26,32 18,24" fill="#0b1220"/>' +
        '<polygon points="26,20 70,20 70,32 26,32" fill="#2a354c"/>' +
        '<polygon points="32,32 48,32 54,38 38,38" fill="#12d4c4"/>' +
        '<polygon points="32,32 38,38 38,56 32,50" fill="#0b1220"/>' +
        '<polygon points="38,38 54,38 54,56 38,56" fill="#2a354c"/>'
    ),
    teeTurn: svg(
      '<polygon points="14,14 56,14 64,22 22,22" fill="#12d4c4"/>' +
        '<polygon points="14,14 22,22 22,34 14,26" fill="#0b1220"/>' +
        '<polygon points="22,22 64,22 64,34 22,34" fill="#2a354c"/>' +
        '<polygon points="30,34 46,34 52,40 36,40" fill="#12d4c4"/>' +
        '<polygon points="30,34 36,40 36,58 30,52" fill="#0b1220"/>' +
        '<polygon points="36,40 52,40 52,58 36,58" fill="#2a354c"/>'
    ),
    channel: svg(
      '<polygon points="16,16 28,16 34,22 22,22" fill="#12d4c4"/>' +
        '<polygon points="16,16 22,22 22,54 16,48" fill="#0b1220"/>' +
        '<polygon points="22,22 34,22 34,54 22,54" fill="#2a354c"/>' +
        '<polygon points="34,46 58,46 64,52 40,52" fill="#12d4c4"/>' +
        '<polygon points="52,16 64,16 70,22 58,22" fill="#12d4c4"/>' +
        '<polygon points="52,16 58,22 58,54 52,48" fill="#0b1220"/>' +
        '<polygon points="58,22 70,22 70,54 58,54" fill="#2a354c"/>'
    ),
    channelTurn: svg(
      '<polygon points="14,14 26,14 32,20 20,20" fill="#12d4c4"/>' +
        '<polygon points="14,14 20,20 20,52 14,46" fill="#0b1220"/>' +
        '<polygon points="20,20 32,20 32,52 20,52" fill="#2a354c"/>' +
        '<polygon points="32,44 56,44 62,50 38,50" fill="#12d4c4"/>' +
        '<polygon points="50,14 62,14 68,20 56,20" fill="#12d4c4"/>' +
        '<polygon points="50,14 56,20 56,52 50,46" fill="#0b1220"/>' +
        '<polygon points="56,20 68,20 68,52 56,52" fill="#2a354c"/>'
    ),
    stair: svg(
      '<polygon points="36,10 60,10 70,18 46,18" fill="#12d4c4"/>' +
        '<polygon points="36,10 46,18 46,34 36,26" fill="#0b1220"/>' +
        '<polygon points="46,18 70,18 70,34 46,34" fill="#2a354c"/>' +
        '<polygon points="18,34 46,34 56,42 28,42" fill="#12d4c4"/>' +
        '<polygon points="18,34 28,42 28,58 18,50" fill="#0b1220"/>' +
        '<polygon points="28,42 56,42 56,58 28,58" fill="#2a354c"/>'
    ),
    stairTurn: svg(
      '<polygon points="34,8 58,8 68,16 44,16" fill="#12d4c4"/>' +
        '<polygon points="34,8 44,16 44,32 34,24" fill="#0b1220"/>' +
        '<polygon points="44,16 68,16 68,32 44,32" fill="#2a354c"/>' +
        '<polygon points="16,32 44,32 54,40 26,40" fill="#12d4c4"/>' +
        '<polygon points="16,32 26,40 26,56 16,48" fill="#0b1220"/>' +
        '<polygon points="26,40 54,40 54,56 26,56" fill="#2a354c"/>'
    ),
    wedge: svg(
      '<polygon points="18,46 40,14 62,46" fill="#0b1220"/>' +
        '<polygon points="40,14 62,46 70,40 50,12" fill="#2a354c"/>' +
        '<ellipse cx="40" cy="46" rx="22" ry="6" fill="#8b93a7"/>'
    ),
    wedgeTurn: svg(
      '<polygon points="16,48 38,12 60,48" fill="#0b1220"/>' +
        '<polygon points="38,12 60,48 68,42 48,10" fill="#2a354c"/>' +
        '<ellipse cx="38" cy="48" rx="22" ry="6" fill="#8b93a7"/>'
    ),
    tube: svg(
      '<ellipse cx="40" cy="18" rx="18" ry="7" fill="#8b93a7"/>' +
        '<rect x="22" y="18" width="36" height="30" fill="#2a354c"/>' +
        '<ellipse cx="40" cy="48" rx="18" ry="7" fill="#0b1220"/>'
    ),
    tubeTurn: svg(
      '<ellipse cx="40" cy="16" rx="16" ry="6" fill="#8b93a7"/>' +
        '<rect x="24" y="16" width="32" height="32" fill="#2a354c"/>' +
        '<ellipse cx="40" cy="48" rx="16" ry="6" fill="#0b1220"/>'
    ),
    plus: svg(
      '<polygon points="30,10 50,10 56,16 36,16" fill="#12d4c4"/>' +
        '<polygon points="30,10 36,16 36,50 30,44" fill="#0b1220"/>' +
        '<polygon points="36,16 56,16 56,50 36,50" fill="#2a354c"/>' +
        '<polygon points="14,26 66,26 72,32 20,32" fill="#12d4c4"/>' +
        '<polygon points="14,26 20,32 20,42 14,36" fill="#0b1220"/>' +
        '<polygon points="20,32 72,32 72,42 20,42" fill="#2a354c"/>'
    ),
    plusTurn: svg(
      '<polygon points="28,8 48,8 54,14 34,14" fill="#12d4c4"/>' +
        '<polygon points="28,8 34,14 34,48 28,42" fill="#0b1220"/>' +
        '<polygon points="34,14 54,14 54,48 34,48" fill="#2a354c"/>' +
        '<polygon points="12,24 64,24 70,30 18,30" fill="#12d4c4"/>' +
        '<polygon points="12,24 18,30 18,40 12,34" fill="#0b1220"/>' +
        '<polygon points="18,30 70,30 70,40 18,40" fill="#2a354c"/>'
    ),
    arch: svg(
      '<polygon points="16,18 30,18 36,24 22,24" fill="#12d4c4"/>' +
        '<polygon points="16,18 22,24 22,54 16,48" fill="#0b1220"/>' +
        '<polygon points="22,24 36,24 36,54 22,54" fill="#2a354c"/>' +
        '<polygon points="22,18 58,18 64,24 28,24" fill="#12d4c4"/>' +
        '<polygon points="50,18 64,18 70,24 56,24" fill="#12d4c4"/>' +
        '<polygon points="50,18 56,24 56,54 50,48" fill="#0b1220"/>' +
        '<polygon points="56,24 70,24 70,54 56,54" fill="#2a354c"/>'
    ),
    archTurn: svg(
      '<polygon points="14,16 28,16 34,22 20,22" fill="#12d4c4"/>' +
        '<polygon points="14,16 20,22 20,52 14,46" fill="#0b1220"/>' +
        '<polygon points="20,22 34,22 34,52 20,52" fill="#2a354c"/>' +
        '<polygon points="20,16 56,16 62,22 26,22" fill="#12d4c4"/>' +
        '<polygon points="48,16 62,16 68,22 54,22" fill="#12d4c4"/>' +
        '<polygon points="48,16 54,22 54,52 48,46" fill="#0b1220"/>' +
        '<polygon points="54,22 68,22 68,52 54,52" fill="#2a354c"/>'
    ),
    bar: svg(
      '<polygon points="12,24 68,24 76,34 20,34" fill="#12d4c4"/>' +
        '<polygon points="12,24 20,34 20,46 12,36" fill="#0b1220"/>' +
        '<polygon points="20,34 76,34 76,46 20,46" fill="#2a354c"/>'
    ),
    barTurn: svg(
      '<polygon points="10,22 64,18 74,28 20,32" fill="#12d4c4"/>' +
        '<polygon points="10,22 20,32 20,44 10,34" fill="#0b1220"/>' +
        '<polygon points="20,32 74,28 74,40 20,44" fill="#2a354c"/>'
    ),
    slab: svg(
      '<polygon points="20,28 60,16 70,24 30,36" fill="#12d4c4"/>' +
        '<polygon points="20,28 30,36 30,52 20,44" fill="#0b1220"/>' +
        '<polygon points="30,36 70,24 70,40 30,52" fill="#2a354c"/>'
    ),
    slabTurn: svg(
      '<polygon points="18,26 56,14 68,22 30,34" fill="#12d4c4"/>' +
        '<polygon points="18,26 30,34 30,50 18,42" fill="#0b1220"/>' +
        '<polygon points="30,34 68,22 68,38 30,50" fill="#2a354c"/>'
    ),
    crank: svg(
      '<polygon points="14,14 38,14 46,20 22,20" fill="#12d4c4"/>' +
        '<polygon points="14,14 22,20 22,36 14,30" fill="#0b1220"/>' +
        '<polygon points="22,20 46,20 46,36 22,36" fill="#2a354c"/>' +
        '<polygon points="34,36 66,36 72,42 40,42" fill="#12d4c4"/>' +
        '<polygon points="34,36 40,42 40,56 34,50" fill="#0b1220"/>' +
        '<polygon points="40,42 72,42 72,56 40,56" fill="#2a354c"/>'
    ),
    crankTurn: svg(
      '<polygon points="12,12 36,12 44,18 20,18" fill="#12d4c4"/>' +
        '<polygon points="12,12 20,18 20,34 12,28" fill="#0b1220"/>' +
        '<polygon points="20,18 44,18 44,34 20,34" fill="#2a354c"/>' +
        '<polygon points="32,34 64,34 70,40 38,40" fill="#12d4c4"/>' +
        '<polygon points="32,34 38,40 38,54 32,48" fill="#0b1220"/>' +
        '<polygon points="38,40 70,40 70,54 38,54" fill="#2a354c"/>'
    )
  };

  window.JOBTEST_OBJECTS = [
    { stem: fig.tee, choices: [fig.tube, fig.teeTurn, fig.wedge, fig.bar] },
    { stem: fig.channel, choices: [fig.arch, fig.cube, fig.channelTurn, fig.plus] },
    { stem: fig.stair, choices: [fig.stairTurn, fig.slab, fig.tube, fig.ell] },
    { stem: fig.plus, choices: [fig.tee, fig.bar, fig.wedge, fig.plusTurn] },
    { stem: fig.arch, choices: [fig.channel, fig.archTurn, fig.cube, fig.stair] },
    { stem: fig.bar, choices: [fig.slab, fig.tube, fig.barTurn, fig.plus] },
    { stem: fig.slab, choices: [fig.wedge, fig.slabTurn, fig.cube, fig.tee] },
    { stem: fig.tube, choices: [fig.wedge, fig.cube, fig.bar, fig.tubeTurn] },
    { stem: fig.wedge, choices: [fig.wedgeTurn, fig.plus, fig.arch, fig.ell] },
    { stem: fig.cube, choices: [fig.stair, fig.tube, fig.cubeTurn, fig.bar] },
    { stem: fig.ell, choices: [fig.tee, fig.ellTurn, fig.channel, fig.slab] },
    { stem: fig.crank, choices: [fig.plus, fig.arch, fig.crankTurn, fig.tube] }
  ];
})();
