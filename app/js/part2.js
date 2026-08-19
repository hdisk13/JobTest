(function () {
  const page = document.querySelector(".phone.power");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const live = document.getElementById("live");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const tryChoices = document.getElementById("try-choices");
  const liveChoices = document.getElementById("live-choices");
  const tryPair = document.getElementById("try-pair");
  const livePair = document.getElementById("live-pair");

  function selected(group) {
    return Array.prototype.slice.call(group.querySelectorAll(".word-pick.is-on"));
  }

  function pairLabel(buttons) {
    if (buttons.length !== 2) return "Pair —";
    const letters = buttons
      .map(function (button) {
        return button.getAttribute("data-letter");
      })
      .sort();
    return "Pair " + letters[0] + "–" + letters[1];
  }

  function bindPair(group, readout, onReady) {
    group.addEventListener("click", function (event) {
      const button = event.target.closest(".word-pick");
      if (!button || button.disabled) return;
      if (button.classList.contains("is-on")) {
        button.classList.remove("is-on");
      } else if (selected(group).length < 2) {
        button.classList.add("is-on");
      }
      const picks = selected(group);
      readout.textContent = pairLabel(picks);
      if (onReady) onReady(picks.length === 2);
    });
  }

  function show(card, beat) {
    [walk, tryCard, live].forEach(function (section) {
      const on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    page.setAttribute("data-beat", beat);
  }

  bindPair(tryChoices, tryPair, function (ready) {
    tryNext.disabled = !ready;
  });
  bindPair(liveChoices, livePair);

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(live, "live");
  });
})();
