(function () {
  const clock = document.getElementById("clock");
  let remaining = 5 * 60;

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

  const stay = document.getElementById("stay");
  if (stay) {
    stay.addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
})();
