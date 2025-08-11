import { Renderer, TwoVaryingColorBox as Box } from "./js/index";
const r = new Renderer(window.innerWidth, window.innerHeight);
r.target = 1
const box = new Box(r.ctx, ['rgb(255, 188, 64)', 'rgb(196, 145, 49)']);


r.targets.push(null, box);

const pointer = {
  x: 0,
  y: 0,
  isMouseDown: false
};
window.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
  pointer.isMouseDown = true
});

window.addEventListener("mouseup", (e) => {
  pointer.isMouseDown = false
});

window.addEventListener("mouseenter", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});


let lastFrameTime = 0
const counter = document.querySelector('div#fps')
const num_particles = document.querySelector('div#npart')
function tick() {
  requestAnimationFrame(tick);

  if (pointer.isMouseDown)
    r.render(pointer.x, pointer.y);
  else
    r.render(null, null)
  r.backgroundBuffer.fill(0)
  const currentTime = performance.now()/1000
  const delta = currentTime - lastFrameTime 
  lastFrameTime = currentTime
  let fps = 1/delta
  counter.innerText = `${fps.toFixed(0)}FPS`
  num_particles.innerText = r.spawnedParticles
}

tick();
