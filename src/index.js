import { Renderer, TwoVaryingColorBox as Box } from "./js/index";
const r = new Renderer(window.innerWidth, window.innerHeight);
r.target = 1;
const box = new Box(r.ctx, ["blue", "blue"]);

r.targets.push(null, box);

const pointer = {
  x: 0,
  y: 0,
  isMouseDown: false,
};
window.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
  pointer.isMouseDown = true;
});

window.addEventListener("mouseup", (e) => {
  pointer.isMouseDown = false;
});

window.addEventListener("mouseenter", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

let lastFrameTime = performance.now();
const counter = document.querySelector("div#fps");
const num_particles = document.querySelector("div#npart");
let fps = 0;
setInterval(() => {
  counter.innerText = `${fps.toFixed(0)}FPS`;
  num_particles.innerText = r.spawnedParticles;
}, 500);

function tick() {
  requestAnimationFrame(tick);

  if (pointer.isMouseDown) r.render(pointer.x, pointer.y);
  else r.render(null, null);

  const currentTime = performance.now();
  const delta = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;
  fps = 1 / delta;
}

tick();
