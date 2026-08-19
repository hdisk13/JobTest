(function () {
  const page = document.querySelector(".phone");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const grid = document.getElementById("grid");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const tryRow = document.getElementById("try-row");
  const rows = document.getElementById("rows");
  const footMore = document.getElementById("foot-more");
  const partNext = document.getElementById("part-next");
  const names = window.JOBTEST_NAMES || [];
  const clock = document.getElementById("clock");
  const clockRow = document.getElementById("clock-row");
  let remaining = 6 * 60;
  let ticking = false;

  function paintClock() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function startClock() {
    if (ticking) return;
    ticking = true;
    remaining = 6 * 60;
    paintClock();
    window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      paintClock();
    }, 1000);
  }

  function show(card, beat) {
    [walk, tryCard, grid].forEach(function (section) {
      const on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    page.setAttribute("data-beat", beat);
    if (beat === "live") {
      footMore.textContent = "↓ more below";
      partNext.hidden = false;
      partNext.classList.remove("is-hidden");
      clockRow.hidden = false;
      startClock();
    }
  }

  names.forEach(function (item, index) {
    const row = document.createElement("div");
    row.className = "row";
    const n = String(index + 1).padStart(2, "0");
    row.innerHTML =
      '<span class="idx">' +
      n +
      "</span>" +
      '<p class="pair">' +
      item.left +
      " — " +
      item.right +
      "</p>" +
      '<div class="cells">' +
      '<button type="button" class="cell same' +
      (item.pick === "same" ? " is-on" : "") +
      '">SAME</button>' +
      '<button type="button" class="cell diff' +
      (item.pick === "diff" ? " is-on" : "") +
      '">DIFF</button>' +
      "</div>";
    rows.appendChild(row);
  });

  function pickIn(group, button) {
    group.querySelectorAll(".cell").forEach(function (cell) {
      cell.classList.toggle("is-on", cell === button);
    });
  }

  rows.addEventListener("click", function (event) {
    const button = event.target.closest(".cell");
    if (!button) return;
    pickIn(button.parentElement, button);
  });

  tryRow.addEventListener("click", function (event) {
    const button = event.target.closest(".cell");
    if (!button) return;
    pickIn(button.parentElement, button);
    tryNext.disabled = false;
  });

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(grid, "live");
  });
})();
