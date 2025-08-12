import { Renderer, LiquidBox, Box } from "./js/index";
import { Button } from "@playcanvas/pcui";
import "@playcanvas/pcui/styles";

const topbar = document.querySelector(".topbar");

const renderer = new Renderer(window.innerWidth, window.innerHeight);
renderer.target = 1;

const gradient = renderer.ctx.createLinearGradient(
  0,
  window.innerHeight - 25,
  0,
  window.innerHeight
);

// Define color stops
gradient.addColorStop(0, "blue"); // Start color
gradient.addColorStop(1, "darkblue"); // End color

const water = new LiquidBox(renderer.ctx);
const box = new Box(renderer.ctx);
box.color = [219, 188, 103];
water.color = [0, 76, 255];
renderer.targets.push(null, water, box);

const pointer = {
  x: 0,
  y: 0,
  isMouseDown: false,
};

// Mouse events
renderer.domElement.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

renderer.domElement.addEventListener("mousedown", () => {
  pointer.isMouseDown = true;
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
  counter.innerText = `${fps.toFixed(0)}FPS`;
  num_particles.innerText = renderer.spawnedParticles;
}, 500);

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

const b = new Button({
  text: "Reset",
});

const b2 = new Button({
  text: "Sand",
});

const b3 = new Button({
  text: "Water",
});

b.dom.addEventListener("click", () => {
  renderer.grid.fill(0);
});

b2.dom.addEventListener("click", () => {
  renderer.target = 2;
});

b3.dom.addEventListener("click", () => {
  renderer.target = 1;
});

topbar.appendChild(b.dom);
topbar.appendChild(b2.dom);
topbar.appendChild(b3.dom);

tick();
