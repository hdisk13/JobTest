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
  const practice = document.getElementById("practice");
  const live = document.getElementById("live");
  const practiceChoices = document.getElementById("practice-choices");
  const liveChoices = document.getElementById("choices");
  const next = document.getElementById("practice-next");
  const partNext = document.getElementById("part-next");

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
    partNext.disabled = false;
  });

  partNext.addEventListener("click", function () {
    if (partNext.disabled) return;
    window.location.href = "part2.html";
  });
})();
