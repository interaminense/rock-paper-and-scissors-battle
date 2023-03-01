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

let animation = new Animation({
  circleSize,
  circleTotal,
  enableCollision,
  enableStroke,
  id,
  speed,
  types,
});

function handleChangeCircle(param, event, boolean = false) {
  if (boolean) {
    animation.updateProps(param, Number(event.target.checked));
  } else {
    animation.updateProps(param, Number(event.target.value));
  }
}

function handleResetAnimation() {
  types = {
    rock: { name: "rock", icon: "🪨" },
    paper: { name: "paper", icon: "📰" },
    scissors: { name: "scissors", icon: "✂️" },
  };

  animation = new Animation({
    circleSize,
    circleTotal,
    enableCollision,
    enableStroke,
    id,
    speed,
    types,
  });

  document.querySelector("#circleSize").value = circleSize;
  document.querySelector("#circleTotal").value = circleTotal;
  document.querySelector("#speed").value = speed;
  document.querySelector("#enableCollision").checked = enableCollision;
  document.querySelector("#enableStroke").checked = enableStroke;

  document.querySelector("#rock").innerHTML = "🪨";
  document.querySelector("#paper").innerHTML = "📰";
  document.querySelector("#scissors").innerHTML = "✂️";
}

const buttons = ["rock", "paper", "scissors"];

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

    animation.updateProps("types", types);
  });
}
