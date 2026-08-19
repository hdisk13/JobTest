(function () {
  const jobs = document.getElementById("jobs");
  const horizonButtons = jobs.querySelectorAll("[data-horizon]");
  const zoneButtons = jobs.querySelectorAll("[data-zone]");
  const zoneLabel = document.getElementById("zone-label");

  const labels = {
    "12": "Job Zone 1–2: Very Little to Some Preparation Needed",
    "3": "Zone 3 · Medium prep",
    "4": "Zone 4 · Considerable prep",
    "5": "Zone 5 · Extensive prep",
  };

  horizonButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      jobs.setAttribute("data-horizon", button.getAttribute("data-horizon"));
      horizonButtons.forEach(function (item) {
        item.classList.toggle("is-on", item === button);
      });
    });
  });

  zoneButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const zone = button.getAttribute("data-zone");
      jobs.setAttribute("data-zone", zone);
      zoneButtons.forEach(function (item) {
        item.classList.toggle("is-on", item === button);
      });
      zoneLabel.textContent = labels[zone];
    });
  });
})();
