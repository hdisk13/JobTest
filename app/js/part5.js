(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("split") === "1") {
    document.body.classList.add("is-split");
    const sitting = document.querySelector("[data-sitting]");
    if (sitting) sitting.textContent = "Phone split";
  }

  const rows = document.getElementById("rows");
  const names = window.JOBTEST_NAMES || [];

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

  rows.addEventListener("click", function (event) {
    const button = event.target.closest(".cell");
    if (!button) return;
    const group = button.parentElement.querySelectorAll(".cell");
    group.forEach(function (cell) {
      cell.classList.toggle("is-on", cell === button);
    });
  });

  const clock = document.getElementById("clock");
  let remaining = 5 * 60 + 12;

  function paintClock() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  paintClock();
  window.setInterval(function () {
    if (remaining <= 0) return;
    remaining -= 1;
    paintClock();
  }, 1000);
})();
