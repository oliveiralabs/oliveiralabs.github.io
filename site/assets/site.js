const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation.toggleAttribute("data-open", !open);
  });
}

const score = document.querySelector("[data-score]");
if (score) {
  const playhead = score.querySelector("[data-playhead]");
  const status = score.querySelector("[data-score-status]");
  const tracks = [...score.querySelectorAll("[data-score-track]")];

  const selectTrack = (track) => {
    const icon = track.querySelector(".score-icon-wrap");
    const field = score.querySelector(".score-field");
    if (!icon || !field || !playhead) return;
    const iconBox = icon.getBoundingClientRect();
    const fieldBox = field.getBoundingClientRect();
    playhead.style.setProperty("--playhead-x", `${iconBox.left - fieldBox.left + iconBox.width / 2}px`);
    playhead.setAttribute("data-active", "");
    if (status) status.textContent = track.querySelector("strong")?.textContent ?? "Aplicativo selecionado";
  };

  tracks.forEach((track) => {
    track.addEventListener("pointerenter", () => selectTrack(track));
    track.addEventListener("focus", () => selectTrack(track));
  });
  selectTrack(tracks[0]);
}
