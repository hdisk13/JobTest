(function () {
  const page = document.querySelector(".phone.power");
  const practice = document.getElementById("practice");
  const live = document.getElementById("live");
  const practiceChoices = document.getElementById("practice-choices");
  const liveChoices = document.getElementById("choices");
  const next = document.getElementById("practice-next");

  function pickIn(group, button) {
    group.querySelectorAll(".choice").forEach(function (choice) {
      choice.classList.toggle("is-on", choice === button);
    });
  }

  practiceChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".choice");
    if (!button) return;
    pickIn(practiceChoices, button);
    next.disabled = false;
  });

  next.addEventListener("click", function () {
    if (next.disabled) return;
    practice.hidden = true;
    practice.classList.add("is-hidden");
    live.hidden = false;
    live.classList.remove("is-hidden");
    page.setAttribute("data-beat", "live");
  });

  liveChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".choice");
    if (!button) return;
    pickIn(liveChoices, button);
  });
})();
