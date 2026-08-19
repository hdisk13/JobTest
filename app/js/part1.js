(function () {
  const choices = document.getElementById("choices");
  choices.addEventListener("click", function (event) {
    const button = event.target.closest(".choice");
    if (!button) return;
    choices.querySelectorAll(".choice").forEach(function (choice) {
      choice.classList.toggle("is-on", choice === button);
    });
  });
})();
