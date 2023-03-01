let lastFrameTime = 0;
let fps = 0;

function updateFPS() {
  const fpsElement = document.getElementById("fps");
  const currentTime = performance.now();
  const delta = currentTime - lastFrameTime;

  lastFrameTime = currentTime;
  fps = 1000 / delta;

  fpsElement.innerHTML = fps.toFixed(2);

  requestAnimationFrame(updateFPS);
}

updateFPS();
