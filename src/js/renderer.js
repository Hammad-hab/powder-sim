import { LiquidBox } from "./box";
import { toIndex, fromIndex, isParameterClean } from "./utils";

class Renderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = this.width * this.height;
    this.grid = new Uint8Array(this.gridSize); // 0 = empty, 1 = sand
    this.backgroundBuffer = new Uint8Array(this.gridSize);

    this.target = 0;
    this.targets = [];
    this.domElement = document.querySelector("canvas");
    this.ctx = this.domElement.getContext("2d");
    if (!this.domElement) {
      console.error("Error: failed to locate canvas element");
    }
    this.domElement.width = this.width;
    this.domElement.height = this.height;
    this.spawnedParticles = 0;

    this.imageData = this.ctx.createImageData(width, height);
    this.pixels = this.imageData.data;
  }

  spawn(x, y, thickness = 25) {
    const spawnX = x;
    const spawnY = y;

    if (spawnX != null && spawnY != null) {
      const minx = spawnX - thickness;
      const maxx = spawnX + thickness;
      const miny = spawnY - thickness;
      const maxy = spawnY + thickness;
      console.log(maxx * maxy);
      for (let x = minx; x < maxx; x += 2) {
        for (let y = miny; y < maxy; y += 2) {
          // const element = array[index];
          const spawnIndex = toIndex(
            x + Math.floor(Math.random() * thickness - thickness / 2),
            y + Math.floor(Math.random() * thickness - thickness / 2),
            this.width
          );
          if (
            isParameterClean({
              grid: this.backgroundBuffer,
              width: 10,
              height: 10,
              spawnX: x,
              spawnY: y,
              windowwidth: this.width,
            })
          ) {
            this.backgroundBuffer[spawnIndex] = this.target;
          }
        }
      }
    }
  }

  render() {
    this.spawnedParticles = 0;
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const index = toIndex(x, y, this.width);

        if (this.grid[index] !== 0) {
          const typeId = this.grid[index];
          let moved = false;
          const target = this.targets[typeId];
          const down = toIndex(x, y + target.speeds.d, this.width);
          const up = toIndex(x, y - target.speeds.d, this.width);
          const downLeft = toIndex(
            x - target.speeds.dl,
            y + target.speeds.dl,
            this.width
          );
          const downRight = toIndex(
            x + target.speeds.dr,
            y + target.speeds.dr,
            this.width
          );

          const left = toIndex(x - target.speeds.l, y, this.width);
          const right = toIndex(x + target.speeds.r, y, this.width);
          const canLeft =
            this.grid[left] === 0 &&
            this.backgroundBuffer[left] === 0 &&
            target.rules.l;

          const canRight =
            this.grid[right] === 0 &&
            this.backgroundBuffer[right] === 0 &&
            target.rules.r;

          // Try down
          if (
            y + target.speeds.d < this.height && // Move this check outward to prevent out-of-bounds access to grid[down]
            ((this.grid[down] === 0 &&
              this.backgroundBuffer[down] === 0 &&
              target.rules.d) ||
              (this.targets[this.grid[down]] instanceof LiquidBox &&
                !(target instanceof LiquidBox)))
          ) {
            const displacedType = this.backgroundBuffer[down]; // Capture the current background value before overwriting
            this.backgroundBuffer[down] = typeId;
            moved = true;
            if (
              this.targets[this.grid[down]] instanceof LiquidBox &&
              !(target instanceof LiquidBox) &&
              this.grid[down] !== 0 &&
              this.backgroundBuffer[up] === 0 &&
              displacedType !== 0 // Only displace if there was actually something (the staying liquid) to displace
            ) {
              this.backgroundBuffer[up] = displacedType; // Use the captured type for accuracy
            }
          }
          // Try down-left
          else if (
            x > 0 &&
            y + target.speeds.dl < this.height &&
            this.grid[downLeft] === 0 &&
            this.backgroundBuffer[downLeft] === 0 &&
            target.rules.dl
          ) {
            this.backgroundBuffer[downLeft] = typeId;
            moved = true;
          }
          // Try down-right
          else if (
            x + target.speeds.dr < this.width &&
            y + target.speeds.dr < this.height &&
            this.grid[downRight] === 0 &&
            this.backgroundBuffer[downRight] === 0 &&
            target.rules.dr
          ) {
            this.backgroundBuffer[downRight] = typeId;
            moved = true;
          }

          if (!moved) {
            if (canLeft && canRight) {
              if (Math.random() < 0.5) {
                this.backgroundBuffer[left] = typeId;
              } else {
                this.backgroundBuffer[right] = typeId;
              }
              moved = true;
            } else if (canLeft) {
              this.backgroundBuffer[left] = typeId;
              moved = true;
            } else if (canRight) {
              this.backgroundBuffer[right] = typeId;
              moved = true;
            }
          }

          // Stay put if can't move
          if (!moved) {
            this.backgroundBuffer[index] = typeId;
          }
        }
      }
    }

    for (let index = 0; index < this.gridSize; index++) {
      if (this.backgroundBuffer[index] !== 0) {
        const t = this.targets[this.backgroundBuffer[index]];

        if (t) {
          const color = t.color;
          this.spawnedParticles += 1;

          this.pixels[index * 4 + 0] = color[0] + 1;
          this.pixels[index * 4 + 1] = color[1] + 1;
          this.pixels[index * 4 + 2] = color[2] + 1;
          this.pixels[index * 4 + 3] = 255;
        }
      } else if (
        this.pixels[index * 4] !== 0 &&
        this.pixels[index * 4 + 1] !== 0 &&
        this.pixels[index * 4 + 2] !== 0 &&
        this.pixels[index * 4 + 3] !== 0
      ) {
        this.pixels[index * 4 + 0] = this.pixels[index * 4 + 0] * 0.9;
        this.pixels[index * 4 + 1] = this.pixels[index * 4 + 1] * 0.9;
        this.pixels[index * 4 + 2] = this.pixels[index * 4 + 2] * 0.9;

        this.pixels[index * 4 + 3] = this.pixels[index * 4 + 3] * 0.9;
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    this.grid.set(this.backgroundBuffer);
    this.backgroundBuffer.fill(0);
  }
}

export default Renderer;
