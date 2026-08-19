(function () {
  const page = document.querySelector(".phone.power");
  const practice = document.getElementById("practice");
  const live = document.getElementById("live");
  const practiceChoices = document.getElementById("practice-choices");
  const liveChoices = document.getElementById("live-choices");
  const next = document.getElementById("practice-next");

  function selectedCount(group) {
    return group.querySelectorAll(".word-pick.is-on").length;
  }

  function bindPickTwo(group, onChange) {
    group.addEventListener("click", function (event) {
      const button = event.target.closest(".word-pick");
      if (!button) return;
      if (button.classList.contains("is-on")) {
        button.classList.remove("is-on");
      } else if (selectedCount(group) < 2) {
        button.classList.add("is-on");
      }
      if (onChange) onChange();
    });
  }

  bindPickTwo(practiceChoices, function () {
    next.disabled = selectedCount(practiceChoices) !== 2;
  });

  bindPickTwo(liveChoices);

  next.addEventListener("click", function () {
    if (next.disabled) return;
    practice.hidden = true;
    practice.classList.add("is-hidden");
    live.hidden = false;
    live.classList.remove("is-hidden");
    page.setAttribute("data-beat", "live");
  });
})();
