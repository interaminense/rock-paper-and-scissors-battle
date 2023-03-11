const id = "canvas";
const circleSize = 15;
const circleTotal = 30;
const enableCollision = true;
const enableStroke = false;
const speed = 2;

let types = {
  rock: { name: "rock", icon: "🪨" },
  paper: { name: "paper", icon: "📰" },
  scissors: { name: "scissors", icon: "✂️" },
};

window.animation = new Animation({
  circleSize,
  circleTotal,
  enableCollision,
  enableStroke,
  id,
  speed,
  types,
});

const buttons = ["rock", "paper", "scissors"];
const recorder = new CanvasRecorder(canvas);

for (let i = 0; i < buttons.length; i++) {
  const button = document.querySelector(`#${buttons[i]}`);

  const picker = picmoPopup.createPopup(null, {
    triggerElement: button,
    referenceElement: button,
  });

  button.addEventListener("click", () => {
    picker.toggle();
  });

  picker.addEventListener("emoji:select", (event) => {
    const icons = document.querySelectorAll(`.icon-${buttons[i]}`);

    icons.forEach((icon) => {
      icon.innerHTML = event.emoji;
    });

    button.innerHTML = event.emoji;

    types = {
      ...types,
      [buttons[i]]: { name: buttons[i], icon: event.emoji },
    };

    stopRecord();

    animation.updateProps("types", types);
  });
}

loop();
