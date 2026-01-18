import { Renderer, LiquidBox, Box, toIndex } from "./js/index";
import { renderParticleBox, renderUI } from "./interface"
import { rgb, rgba } from "./js/utils";

const pointer = {
  x: null,
  y: null,
  isMouseDown: false,
};

const renderer = new Renderer(window.innerWidth, window.innerHeight);
let paused = false
renderer.target = 1;


const water = new LiquidBox(renderer.ctx, 'Water');
const acid = new LiquidBox(renderer.ctx, 'Acid');
const lava = new LiquidBox(renderer.ctx, 'Lava');
const sand = new Box(renderer.ctx, 'Sand');
const dirt = new Box(renderer.ctx, 'Dirt')
const steam = new Box(renderer.ctx, 'Steam')
const fire = new Box(renderer.ctx, 'Fire')
const stone = new Box(renderer.ctx, 'Stone')
const wood = new Box(renderer.ctx, 'Wood')

sand.density = 0.5

stone.pointerSize = 25
sand.color = rgb(219, 188, 103)

water.density = 1

steam.density = -1
steam.ignore = true
steam.clearSpeed = 0.1
steam.color = rgb(207, 249, 255)

fire.density = -Infinity
fire.rules.ds = 1.0
fire.rules.dls = 1.0
fire.rules.drs = 1.0
fire.rules.rs = 1.0
fire.rules.ls = 1.0
fire.pointerSize = 25
fire.color = () => {
  const CC = [rgb(255, 149, 35), rgb(255, 95, 2),rgb(255, 2, 2)]
  return CC[Math.floor(Math.random()*CC.length)]
}
// fire.doesSpreadRandomly = false

dirt.density = 2.0
dirt.color = rgba(95, 69, 0, 1)
dirt.rules.ds = 2

lava.color = rgb(255, 85, 0)

dirt.density = 5.0

lava.rules.ls = 1
lava.rules.rs = 1

water.color = rgb(0, 76, 255);

acid.density = 1.25
acid.color = rgb(26, 255, 0);

stone.rules.ds = 0
stone.rules.dls = 0
stone.rules.drs = 0
stone.rules.rs = 0
stone.rules.ls = 0
stone.doesSpreadRandomly = false
stone.color = rgb(75, 75, 75)


wood.rules.ds = 0
wood.rules.dls = 0
wood.rules.drs = 0
wood.rules.rs = 0
wood.rules.ls = 0
wood.doesSpreadRandomly = false
wood.color = rgb(108, 34, 0)

renderer.registerParticleTypes(water, sand, acid, dirt, lava, steam, stone, fire, wood)

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


document.querySelector('button#paused').addEventListener("click", () => {
  paused = !paused
});

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
  
  const currentTime = performance.now();
  const delta = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;
  fps = 1 / delta;
  
  if (pointer.isMouseDown) {
    const target = renderer.targets[renderer.target];
    const psize = typeof target.pointerSize === 'function' 
        ? 25
        : target.pointerSize;  // This will use the default 25 if not set
    
    renderer.spawn(pointer.x, pointer.y, psize ?? 25);
    if (paused) renderer.render()
  }

  if (paused) return

  renderer.render();
}

renderParticleBox(water, renderer)
renderParticleBox(sand, renderer)
renderParticleBox(acid, renderer)
renderParticleBox(dirt, renderer)
renderParticleBox(lava, renderer)
renderParticleBox(steam, renderer)
renderParticleBox(stone, renderer)
renderParticleBox(fire, renderer)
renderParticleBox(wood, renderer)
renderUI()
tick();
