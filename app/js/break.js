(function () {
  const clock = document.getElementById("clock");
  const stay = document.getElementById("stay");
  let remaining = 5 * 60;
  let timer = null;

  function paintClock() {
    if (!clock) return;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    clock.textContent = minutes + ":" + String(seconds).padStart(2, "0");
  }

  function reveal(el) {
    if (!el) return;
    el.classList.remove("is-hidden");
    el.removeAttribute("hidden");
    el.hidden = false;
    el.disabled = false;
    el.setAttribute("aria-hidden", "false");
  }

  function unlock() {
    remaining = 0;
    paintClock();
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    reveal(stay);
  }

  paintClock();
  timer = window.setInterval(function () {
    if (remaining <= 0) return;
    remaining -= 1;
    paintClock();
    if (remaining <= 0) unlock();
  }, 1000);

  if (stay) {
    stay.addEventListener("click", function (event) {
      if (stay.hidden || stay.classList.contains("is-hidden")) {
        event.preventDefault();
        return;
      }
      window.location.href = "part4.html";
    });
  }
})();
