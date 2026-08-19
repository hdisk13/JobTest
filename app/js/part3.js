(function () {
  const page = document.querySelector(".phone.power");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const live = document.getElementById("live");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const tryChoices = document.getElementById("try-choices");
  const liveChoices = document.getElementById("choices");
  const partNext = document.getElementById("part-next");

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
    partNext.disabled = false;
  });

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(live, "live");
  });

  partNext.addEventListener("click", function () {
    if (partNext.disabled) return;
    window.location.href = "break.html";
  });
})();
