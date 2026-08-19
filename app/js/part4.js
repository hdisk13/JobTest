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
  const clockRow = document.getElementById("clock-row");
  const partNext = document.getElementById("part-next");
  const items = window.JOBTEST_COMPUTATION || [];
  const letters = ["A", "B", "C", "D"];
  let remaining = 6 * 60;
  let ticking = false;

  function reveal(el) {
    if (!el) return;
    el.classList.remove("is-hidden");
    el.removeAttribute("hidden");
    el.hidden = false;
    el.disabled = false;
    el.setAttribute("aria-hidden", "false");
  }

  function paintClock() {
    if (!clock) return;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function startClock() {
    if (ticking || !clock) return;
    ticking = true;
    remaining = 6 * 60;
    paintClock();
    window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      paintClock();
    }, 1000);
  }

  function pickIn(group, button) {
    group.querySelectorAll(".comp-cell").forEach(function (cell) {
      cell.classList.toggle("is-on", cell === button);
    });
  }

  function show(card, beat) {
    [walk, tryCard, grid].forEach(function (section) {
      const on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    if (page) page.setAttribute("data-beat", beat);
    if (beat === "live") {
      if (footMore) footMore.textContent = "↓ more below";
      reveal(clockRow);
      startClock();
      reveal(partNext);
    }
  }

  items.forEach(function (item, index) {
    const row = document.createElement("div");
    row.className = "comp-row";
    const n = String(index + 1).padStart(2, "0");
    const cells = item.choices
      .map(function (choice, i) {
        return (
          '<button type="button" class="comp-cell"><small>' +
          letters[i] +
          "</small>" +
          choice +
          "</button>"
        );
      })
      .concat([
        '<button type="button" class="comp-cell none"><small>E</small>none of these</button>'
      ])
      .join("");
    row.innerHTML =
      '<div class="comp-stem"><span class="idx">' +
      n +
      '</span><span class="op-tag">' +
      item.op +
      '</span><p class="pair">' +
      item.stem +
      "</p></div><div class=\"comp-cells\">" +
      cells +
      "</div>";
    rows.appendChild(row);
  });

  rows.addEventListener("click", function (event) {
    const button = event.target.closest(".comp-cell");
    if (!button) return;
    pickIn(button.parentElement, button);
  });

  tryChoices.addEventListener("click", function (event) {
    const button = event.target.closest(".comp-cell");
    if (!button) return;
    pickIn(tryChoices, button);
    tryNext.disabled = false;
  });

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(grid, "live");
  });

  if (partNext) {
    partNext.addEventListener("click", function (event) {
      if (partNext.hidden || partNext.classList.contains("is-hidden")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      window.location.href = "part5.html";
    });
  }
})();
