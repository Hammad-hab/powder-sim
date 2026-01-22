import { Renderer, LiquidBox, Box, toIndex } from "./js/index";
import { renderParticleBox, renderUI, updateStats } from "./interface"
import { rgb, rgba } from "./js/utils";

const pointer = {
  x: null,
  y: null,
  isMouseDown: false,
};

const renderer = new Renderer(window.innerWidth, window.innerHeight);
window.renderer = renderer; // Make accessible to control panel
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
const spores = new Box(renderer.ctx, 'Spores')
const Fungi = new Box(renderer.ctx, 'Fungi')

sand.density = 2.0

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

spores.color = rgb(255, 203, 158)
spores.density = 0.5
spores.pointerSize = 10

Fungi.color = rgb(55, 133, 0) 
Fungi.density = 0.5
Fungi.rules.ds = 0
Fungi.rules.dls = 0
Fungi.rules.drs = 0
Fungi.rules.rs = 0
Fungi.rules.ls = 0
Fungi.doesSpreadRandomly = false

renderer.registerParticleTypes(water, sand, acid, dirt, lava, steam, stone, fire, wood, spores, Fungi)

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
  e.preventDefault();
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
let fps = 0;

document.querySelector('button#paused').addEventListener("click", () => {
  paused = !paused
});

// Update stats every 200ms
setInterval(() => {
  updateStats(fps, renderer.spawnedParticles);
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
        : target.pointerSize;
    
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
renderParticleBox(spores, renderer)
renderUI()
tick();