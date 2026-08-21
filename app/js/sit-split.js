(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("split") !== "1") return;
  document.body.classList.add("is-split");
  const sitting = document.querySelector("[data-sitting]");
  if (sitting) sitting.textContent = "Phone split";
  const phone = document.querySelector(".phone");
  if (phone && !phone.querySelector(".sticker")) {
    const sticker = document.createElement("p");
    sticker.className = "sticker";
    sticker.textContent = "JobTest sitting plan, not official AP admin";
    phone.insertBefore(sticker, phone.firstChild);
  }
})();
