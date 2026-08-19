(function () {
  const jobs = document.getElementById("jobs");
  const buttons = jobs.querySelectorAll("[data-view]");
  const zone = document.getElementById("zone");

  const copy = {
    current: "Zone 2 · Some prep",
    future: "Zone 4 · Considerable prep",
  };

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const view = button.getAttribute("data-view");
      jobs.setAttribute("data-view", view);
      buttons.forEach(function (item) {
        item.classList.toggle("is-on", item === button);
      });
      zone.textContent = copy[view];
    });
  });
})();
