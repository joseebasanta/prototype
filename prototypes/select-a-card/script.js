const widget = document.getElementById("widget");
const replayBtn = document.getElementById("replayBtn");

function replay() {
  widget.style.animation = "none";
  widget.querySelectorAll(".widget-header, .stack-card").forEach((el) => {
    el.style.animation = "none";
  });

  // force reflow so the animations restart from their initial state
  void widget.offsetWidth;

  widget.style.animation = "";
  widget.querySelectorAll(".widget-header, .stack-card").forEach((el) => {
    el.style.animation = "";
  });
}

replayBtn.addEventListener("click", replay);
widget.addEventListener("click", replay);
