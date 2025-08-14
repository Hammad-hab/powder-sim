import { Renderer, LiquidBox, Box, toIndex } from "./js/index";
import { renderParticleBox, renderUI } from "./interface"
import { rgb, rgba } from "./js/utils";

let RAIN = false
const pointer = {
  x: null,
  y: null,
  isMouseDown: false,
};

const renderer = new Renderer(window.innerWidth, window.innerHeight);
renderer.target = 1;


const water = new LiquidBox(renderer.ctx, 'Water');
const acid = new LiquidBox(renderer.ctx, 'Acid');
const oil = new LiquidBox(renderer.ctx, 'Oil');
const sand = new Box(renderer.ctx, 'Sand');
const dirt = new Box(renderer.ctx, 'Dirt')

sand.density = 1.6
sand.color = rgb(219, 188, 103)

dirt.density = 2.0
dirt.color = rgba(95, 69, 0, 1)
dirt.rules.ds = 2

oil.color = rgba(174, 119, 0, 0.5)
oil.rules.ls = 1
oil.rules.rs = 1

water.color = rgb(0, 76, 255);

acid.density = 1.25
acid.color = rgb(26, 255, 0);

renderer.registerParticleTypes(water, sand, acid, dirt, oil)

renderer.domElement.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

renderer.domElement.addEventListener("mousedown", (e) => {
  pointer.isMouseDown = true;
  if (!pointer.x || !pointer.y)
  {
    pointer.x = e.clientX
    pointer.y = e.clientY
  }
});

renderer.domElement.addEventListener("mouseup", () => {
  pointer.isMouseDown = false;
});

renderer.domElement.addEventListener("mouseenter", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

// Touch events for mobile
renderer.domElement.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  pointer.x = touch.clientX;
  pointer.y = touch.clientY;
  pointer.isMouseDown = true;
  e.preventDefault(); // prevent scrolling while touching
});

renderer.domElement.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  pointer.x = touch.clientX;
  pointer.y = touch.clientY;
  e.preventDefault();
});

renderer.domElement.addEventListener("touchend", () => {
  pointer.isMouseDown = false;
});
let lastFrameTime = performance.now();
const counter = document.querySelector("div#fps");
const num_particles = document.querySelector("div#npart");
let fps = 0;

setInterval(() => {
  counter.innerText = `${fps.toFixed(0)} FPS`;
  num_particles.innerText = renderer.spawnedParticles;

  // FPS → hue (green at 60 FPS)
  const maxFPS = 60;
  const clampedFPS = Math.min(fps, maxFPS);
  const hueFPS = (clampedFPS / maxFPS) * 120; // red→green
  counter.style.color = `hsl(${hueFPS}, 80%, 50%)`;

}, 200);

function tick() {
  requestAnimationFrame(tick);

  renderer.render();

  const currentTime = performance.now();
  const delta = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;
  fps = 1 / delta;

  if (pointer.isMouseDown) {
    renderer.spawn(pointer.x, pointer.y);
  }
}

renderParticleBox(water, renderer)
renderParticleBox(sand, renderer)
renderParticleBox(acid, renderer)
renderParticleBox(dirt, renderer)
renderParticleBox(oil, renderer)
renderUI()
tick();
