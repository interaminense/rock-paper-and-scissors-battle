let loopRequestId = null;

function handleChangeCircle(param, event, boolean = false) {
  stopRecord();

  if (boolean) {
    animation.updateProps(param, Number(event.target.checked));
  } else {
    animation.updateProps(param, Number(event.target.value));
  }
}

function handleStartAnimation() {
  cancelAnimationFrame(loopRequestId);

  const startButton = document.querySelector("#startAnimationBtn");
  const stopButton = document.querySelector("#stopAnimationBtn");
  const recording = document.querySelector("#recording");

  stopButton.style.display = "inline";
  startButton.style.display = "none";
  recording.style.display = "block";

  startRecord();

  animation.start();

  loop();
}

function handleStopAnimation() {
  cancelAnimationFrame(loopRequestId);

  const startButton = document.querySelector("#startAnimationBtn");
  const stopButton = document.querySelector("#stopAnimationBtn");
  const videoContainer = document.querySelector("#videoContainer");
  const recording = document.querySelector("#recording");

  stopButton.style.display = "none";
  startButton.style.display = "inline";
  videoContainer.style.display = "block";
  recording.style.display = "none";

  stopRecord();

  animation.stop();
}

function handleResetAnimation() {
  window.location.reload();
}

function loop() {
  if (animation.areAllTypesEqual()) {
    handleStopAnimation();

    return;
  }

  loopRequestId = requestAnimationFrame(() => loop());
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
