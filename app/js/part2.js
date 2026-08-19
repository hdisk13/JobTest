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

  const page = document.querySelector(".phone.power");
  const walk = document.getElementById("walk");
  const tryCard = document.getElementById("try");
  const live = document.getElementById("live");
  const walkNext = document.getElementById("walk-next");
  const tryNext = document.getElementById("try-next");
  const partNext = document.getElementById("part-next");

  function bindBoard(grid, object, onReady) {
    function picks() {
      return Array.prototype.slice.call(grid.querySelectorAll(".word-pick.is-wait"));
    }

    function paint() {
      const chosen = picks();
      const ready = chosen.length === 2;
      grid.classList.toggle("has-pair", ready);
      object.classList.toggle("is-hidden", !ready);
      if (ready) {
        const ordered = chosen.slice().sort(function (a, b) {
          return a.getAttribute("data-letter").localeCompare(b.getAttribute("data-letter"));
        });
        object.innerHTML =
          "<span>" +
          ordered[0].getAttribute("data-letter") +
          "–" +
          ordered[1].getAttribute("data-letter") +
          "</span><strong>" +
          ordered[0].getAttribute("data-word") +
          " · " +
          ordered[1].getAttribute("data-word") +
          "</strong>";
      } else {
        object.textContent = "";
      }
      if (onReady) onReady(ready);
    }

    grid.addEventListener("click", function (event) {
      const button = event.target.closest(".word-pick");
      if (!button || button.disabled) return;
      if (picks().length === 2) return;
      if (button.classList.contains("is-wait")) {
        button.classList.remove("is-wait");
      } else {
        button.classList.add("is-wait");
      }
      paint();
    });

    object.addEventListener("click", function () {
      grid.querySelectorAll(".word-pick").forEach(function (button) {
        button.classList.remove("is-wait");
      });
      paint();
    });
  }

  function show(card, beat) {
    [walk, tryCard, live].forEach(function (section) {
      const on = section === card;
      section.hidden = !on;
      section.classList.toggle("is-hidden", !on);
    });
    page.setAttribute("data-beat", beat);
  }

  bindBoard(document.getElementById("try-choices"), document.getElementById("try-object"), function (ready) {
    tryNext.disabled = !ready;
  });
  bindBoard(document.getElementById("live-choices"), document.getElementById("live-object"), function (ready) {
    partNext.disabled = !ready;
  });

  walkNext.addEventListener("click", function () {
    show(tryCard, "try");
  });

  tryNext.addEventListener("click", function () {
    if (tryNext.disabled) return;
    show(live, "live");
  });

  if (partNext) {
    partNext.addEventListener("click", function () {
      if (partNext.disabled) return;
      window.location.href = "part3.html";
    });
  }
})();
