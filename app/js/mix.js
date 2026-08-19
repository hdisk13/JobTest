(function () {
  const jobs = document.getElementById("jobs");
  const buttons = jobs.querySelectorAll("[data-horizon]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      jobs.setAttribute("data-horizon", button.getAttribute("data-horizon"));
      buttons.forEach(function (item) {
        item.classList.toggle("is-on", item === button);
      });
    });
  });
})();
