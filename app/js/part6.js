(function () {
  const page = document.querySelector(".phone.speed-grid");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const grid = document.getElementById("grid");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const tryChoices = document.getElementById("try-choices");
  const rows = document.getElementById("rows");
  const footMore = document.getElementById("foot-more");
  const clock = document.getElementById("clock");
  const items = window.JOBTEST_OBJECTS || [];
  const letters = ["A", "B", "C", "D"];
  let remaining = 5 * 60;
  let ticking = false;

  function paintClock() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function startClock() {
    if (ticking) return;
    ticking = true;
    remaining = 5 * 60;
    paintClock();
    window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      paintClock();
    }, 1000);
  }

  function pickIn(group, button, sel) {
    group.querySelectorAll(sel).forEach(function (cell) {
      cell.classList.toggle("is-on", cell === button);
    });
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
      startClock();
    }
  }

  items.forEach(function (item, index) {
    if (index === 21) {
      const mark = document.createElement("p");
      mark.className = "page-mark";
      mark.textContent = "page 2";
      rows.appendChild(mark);
    }
    const row = document.createElement("div");
    row.className = "match-row";
    const n = String(index + 1).padStart(2, "0");
    const cells = item.choices
      .map(function (choice, i) {
        return (
          '<button type="button" class="match-cell"><small>' +
          letters[i] +
          "</small>" +
          choice +
          "</button>"
        );
      })
      .join("");
    row.innerHTML =
      '<div class="match-head"><span class="idx">' +
      n +
      '</span><div class="match-stem">' +
      item.stem +
      "</div></div><div class=\"match-cells\">" +
      cells +
      "</div>";
    rows.appendChild(row);
  });

  rows.addEventListener("click", function (event) {
    const button = event.target.closest(".match-cell");
    if (!button) return;
    pickIn(button.parentElement, button, ".match-cell");
  });

  tryChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".match-cell");
    if (!button) return;
    pickIn(tryChoices, button, ".match-cell");
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
