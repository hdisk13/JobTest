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
  const items = window.JOBTEST_OBJECTS || [];
  const letters = ["A", "B", "C", "D"];
  let remaining = 5 * 60;
  let ticking = false;
  let stopped = false;
  let timer = null;

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

  function stopLive() {
    if (stopped) return;
    stopped = true;
    remaining = 0;
    paintClock();
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    reveal(partNext);
  }

  function startClock() {
    if (ticking || !clock) return;
    ticking = true;
    stopped = false;
    remaining = 5 * 60;
    paintClock();
    timer = window.setInterval(function () {
      if (remaining <= 0) return;
      remaining -= 1;
      paintClock();
      if (remaining <= 0) stopLive();
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
    if (page) page.setAttribute("data-beat", beat);
    if (beat === "live") {
      if (footMore) footMore.textContent = "↓ more below";
      reveal(clockRow);
      startClock();
    }
  }

  items.forEach(function (item, index) {
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
    if (stopped) return;
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

  if (partNext) {
    partNext.addEventListener("click", function (event) {
      if (partNext.hidden || partNext.classList.contains("is-hidden")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      window.location.href = "mix.html";
    });
  }
})();
