function handleChangeCircle(param, event, boolean = false) {
  if (boolean) {
    animation.updateProps(param, Number(event.target.checked));
  } else {
    animation.updateProps(param, Number(event.target.value));
  }
}

function handleStartAnimation() {
  const startButton = document.querySelector("#startAnimationBtn");

  startButton.remove();

  startRecord();

  animation.start();
}

function handleResetAnimation() {
  window.location.reload();
}

function loop() {
  if (animation.areAllTypesEqual()) {
    stopRecord();

    return;
  }

  requestAnimationFrame(loop);
}

function startRecord() {
  recorder.record();
}

function stopRecord() {
  setTimeout(() => {
    recorder.stop(function (blob) {
      const video = document.querySelector("#video");

      video.src = URL.createObjectURL(blob);
    });
  }, 1000);
}

function getPos(min, max) {
  const pos = Math.random() * max;

  return pos < min ? min : pos > max - min ? max - min : pos;
}
