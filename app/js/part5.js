(function () {
  "use strict";

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

  var page = document.querySelector(".phone.speed-grid") || document.querySelector(".phone");
  var walk = document.getElementById("walk");
  var tryCard = document.getElementById("try");
  var grid = document.getElementById("grid");
  var walkNext = document.getElementById("walk-next");
  var tryNext = document.getElementById("try-next");
  var tryRow = document.getElementById("try-row");
  var rows = document.getElementById("rows");
  var footMore = document.getElementById("foot-more");
  var partNext = document.getElementById("part-next");
  var clock = document.getElementById("clock");
  var clockRow = document.getElementById("clock-row");
  var names = window.JOBTEST_NAMES || [];
  var remaining = 6 * 60;
  var ticking = false;

  function paintClock() {
    if (!clock) return;
    var minutes = Math.floor(remaining / 60);
    var seconds = remaining % 60;
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

  function reveal(el) {
    if (!el) return;
    el.classList.remove("is-hidden");
    el.removeAttribute("hidden");
    el.hidden = false;
    el.disabled = false;
    el.setAttribute("aria-hidden", "false");
  }

  function openLive() {
    reveal(clockRow);
    startClock();
    reveal(partNext);
    if (footMore) footMore.textContent = "↓ more below";
  }

  function show(card, beat) {
    [walk, tryCard, grid].forEach(function (section) {
      if (!section) return;
      var on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    if (page) page.setAttribute("data-beat", beat);
    if (beat === "live") openLive();
  }

  function pickIn(group, button) {
    if (!group) return;
    group.querySelectorAll(".cell").forEach(function (cell) {
      cell.classList.toggle("is-on", cell === button);
    });
  }

  if (rows) {
    names.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "row";
      var n = String(index + 1).padStart(2, "0");
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

    rows.addEventListener("click", function (event) {
      var button = event.target.closest(".cell");
      if (!button) return;
      pickIn(button.parentElement, button);
    });
  }

  if (tryRow) {
    tryRow.addEventListener("click", function (event) {
      var button = event.target.closest(".cell");
      if (!button) return;
      pickIn(button.parentElement, button);
      if (tryNext) tryNext.disabled = false;
    });
  }

  if (walkNext) {
    walkNext.addEventListener("click", function () {
      show(tryCard, "try");
    });
  }

  if (tryNext) {
    tryNext.addEventListener("click", function () {
      if (tryNext.disabled) return;
      show(grid, "live");
    });
  }

  if (partNext) {
    partNext.addEventListener("click", function (event) {
      if (partNext.hidden || partNext.classList.contains("is-hidden")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      window.location.href = "part6.html";
    });
  }
})();
