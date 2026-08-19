(function () {
  const page = document.querySelector(".phone.power");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const live = document.getElementById("live");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const tryChoices = document.getElementById("try-choices");
  const liveChoices = document.getElementById("choices");
  const clock = document.getElementById("clock");
  let remaining = 4 * 60 + 40;
  let ticking = false;

  function paintClock() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function startClock() {
    if (ticking) return;
    ticking = true;
    paintClock();
    window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      paintClock();
    }, 1000);
  }

  function pickIn(group, button) {
    group.querySelectorAll(".choice").forEach(function (choice) {
      choice.classList.toggle("is-on", choice === button);
    });
  }

  function show(card, beat) {
    [walk, tryCard, live].forEach(function (section) {
      const on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    page.setAttribute("data-beat", beat);
    if (beat === "live") startClock();
  }

  tryChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".choice");
    if (!button) return;
    pickIn(tryChoices, button);
    tryNext.disabled = false;
  });

  liveChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".choice");
    if (!button) return;
    pickIn(liveChoices, button);
  });

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(live, "live");
  });
})();
