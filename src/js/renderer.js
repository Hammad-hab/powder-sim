import { toIndex, fromIndex, isParameterClean } from "./utils";

class Renderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = this.width * this.height;
    this.grid = new Uint8Array(this.gridSize); // 0 = empty, 1 = sand
    this.backgroundBuffer = new Uint8Array(this.gridSize)
    this.target = 0;
    this.targets = [];
    this.domElement = document.querySelector("canvas");
    this.ctx = this.domElement.getContext("2d");
    if (!this.domElement) {
      console.error("Error: failed to locate canvas element");
    }
    this.domElement.width = this.width;
    this.domElement.height = this.height;
    this.spawnedParticles = 0

  }

  render(spawnX, spawnY) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        const index = toIndex(x, y, this.width);

        if (this.grid[index] !== 0) {
          const typeId = this.grid[index];
          let moved = false;
          const target = this.targets[typeId]

          // Positions to check for movement
          // const left = toIndex(x - 1, y, this.width);
          
          const down = toIndex(x, y + 1, this.width);
          const downLeft = toIndex(x - 1, y + 1, this.width);
          const downRight = toIndex(x + 1, y + 1, this.width);

          // Try down
           if (
            y + 1 < this.height &&
            this.grid[down] === 0 &&
            this.backgroundBuffer[down] === 0 && target.rules.d
          ) {
            this.backgroundBuffer[down] = typeId;
            moved = true;
          }
          // Try down-left
          else if (
            x > 0 &&
            y + 1 < this.height &&
            this.grid[downLeft] === 0 &&
            this.backgroundBuffer[downLeft] === 0 && target.rules.dl
          ) {
            this.backgroundBuffer[downLeft] = typeId;
            moved = true;
          }
          // Try down-right
          else if (
            x + 1 < this.width &&
            y + 1 < this.height &&
            this.grid[downRight] === 0 &&
            this.backgroundBuffer[downRight] === 0 && target.rules.dr
          ) {
            this.backgroundBuffer[downRight] = typeId;
            moved = true;
          }


          // if (
          //   x - 1 > 0 &&
          //   this.grid[left] === 0 &&
          //   y + 1 > this.height &&
          //   this.backgroundBuffer[left] === 0
          // ) {
          //   this.backgroundBuffer[left] = typeId;
          //   moved = true;
          // }
          // else if (
          //   x + 1 < this.width &&
          //   y + 1 > this.height &&
          //   this.grid[right] === 0 &&
          //   this.backgroundBuffer[right] === 0
          // ) {
          //   this.backgroundBuffer[right] = typeId;
          //   moved = true;
          // }
 
          // Stay put if can't move
          if (!moved) {
            this.backgroundBuffer[index] = typeId;
          }
        }
      }
    }

    // Spawn new particle AFTER movement so you don't overwrite moving particles
    if (spawnX != null && spawnY != null) {
      const minx = spawnX - 25;
      const maxx = spawnX + 25;
      const miny = spawnY - 25;
      const maxy = spawnY + 25;
      for (let x = minx; x < maxx; x += 2) {
        for (let y = miny; y < maxy; y += 2) {
          // const element = array[index];
          const spawnIndex = toIndex(
            x + Math.floor(Math.random() * 25 - 12.5),
            y + Math.floor(Math.random() * 25 - 12.5),
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
            this.spawnedParticles += 1
            this.backgroundBuffer[spawnIndex] = this.target;
          }
        }
      }
    }
    // Draw all particles
    for (let index = 0; index < this.gridSize; index++) {
      if (this.backgroundBuffer[index] !== 0) {
        const { x, y } = fromIndex(index, this.width);
        const t = this.targets[this.backgroundBuffer[index]];
        if (t) {
          t.draw(x, y);
        }
      }
    }

    this.grid.set(this.backgroundBuffer)
    this.backgroundBuffer.fill(0)
  }
}

export default Renderer;
