(function () {
  const clock = document.getElementById("clock");
  const stay = document.getElementById("stay");
  let remaining = 5 * 60;
  let timer = null;

  if (stay) stay.disabled = true;

  function paintClock() {
    if (!clock) return;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function unlock() {
    remaining = 0;
    paintClock();
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (stay) stay.disabled = false;
  }

  paintClock();
  timer = window.setInterval(function () {
    if (remaining <= 0) return;
    remaining -= 1;
    paintClock();
    if (remaining <= 0) unlock();
  }, 1000);

  if (stay) {
    stay.addEventListener("click", function () {
      if (stay.disabled) return;
      window.location.href = "part4.html";
    });
  }
})();
