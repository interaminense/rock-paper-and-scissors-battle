let lastFrameTime = 0;
let fps = 0;

function updateFPS() {
  const fpsElement = document.querySelector("#fps");
  const currentTime = performance.now();
  const delta = currentTime - lastFrameTime;

  lastFrameTime = currentTime;
  fps = 1000 / delta;

  if (fpsElement) {
    fpsElement.innerHTML = fps.toFixed(2);
  }

  requestAnimationFrame(updateFPS);
}

updateFPS();

export function FPS() {
  return (
    <div>
      fps <span id="fps" />
    </div>
  );
}
