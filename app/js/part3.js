(function () {
  (function sitSplit() {
    if (new URLSearchParams(window.location.search).get("split") !== "1") return;
    document.body.classList.add("is-split");
    var sitting = document.querySelector("[data-sitting]");
    if (sitting) sitting.textContent = "Phone split";
    var phone = document.querySelector(".phone");
    if (phone && !phone.querySelector(".sticker")) {
      var sticker = document.createElement("p");
      sticker.className = "sticker";
      sticker.textContent = "JobTest sitting plan, not official AP admin";
      phone.insertBefore(sticker, phone.firstChild);
    }
  })();

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
