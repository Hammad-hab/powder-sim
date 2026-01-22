import { Box, LiquidBox } from "./particles";
import { toIndex, fromIndex, isParameterClean } from "./utils";

class Renderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = this.width * this.height;
    this.grid = new Uint8Array(this.gridSize); // 0 = empty, 1 = sand
    this.backgroundBuffer = new Uint8Array(this.gridSize);

    this.target = 0;
    this.targets = [
      null
    ];
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

  registerParticleTypes(...particles) {
      this.targets.push(...particles)
  }

  spawn(x, y, thickness = 25) {
    const spawnX = x;
    const spawnY = y;

    if (spawnX != null && spawnY != null) {
      const minx = spawnX - thickness;
      const maxx = spawnX + thickness;
      const miny = spawnY - thickness;
      const maxy = spawnY + thickness;

      for (let x = minx; x < maxx; x += 1) {
        for (let y = miny; y < maxy; y += 1) {
          // const element = array[index];
          const instance = this.targets[this.target]
          const n = instance.doesSpreadRandomly ? 1.0 : 0.0
          const spawnIndex = toIndex(
            x + n*Math.floor(Math.random() * thickness - thickness / 2),
            y + n*Math.floor(Math.random() * thickness - thickness / 2),
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
        const rindex = toIndex(x, y, this.width);
        const typeId = this.grid[rindex];
        const index = toIndex(x, y - (this.targets[typeId] && this.targets[typeId].density === -Infinity /**Only fire has -Infinity */ ? 1.0 : 0.0), this.width);
        if (typeId !== 0) {
          let moved = false;
          const target = this.targets[typeId];
          if (!target) continue
          const down = toIndex(x, y + target.rules.ds, this.width);
          const up = toIndex(x, y - target.rules.ds, this.width);
          const downLeft = toIndex(
            x - target.rules.dls,
            y + target.rules.dls,
            this.width
          );
          const downRight = toIndex(
            x + target.rules.drs,
            y + target.rules.drs,
            this.width
          );

          const left = toIndex(x - target.rules.ls, y, this.width);
          const right = toIndex(x + target.rules.rs, y, this.width);

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
            y + target.rules.ds < this.height && // Move this check outward to prevent out-of-bounds access to grid[down]
            ((this.grid[down] === 0 &&
              this.backgroundBuffer[down] === 0 &&
              target.rules.d) ||
              (this.targets[this.grid[down]] instanceof LiquidBox &&
                !(target instanceof LiquidBox) && target.density > this.targets[this.grid[down]].density)) 
          ) {
            const displacedType = this.backgroundBuffer[down]; // Capture the current background value before overwriting
            moved = true;
            if (
              !(target instanceof LiquidBox) &&
              this.grid[down] !== 0 &&
              this.backgroundBuffer[up] === 0 &&
              displacedType !== 0 // Only displace if there was actually something (the staying liquid) to displace
            ) {
              this.backgroundBuffer[up] = displacedType; // Use the captured type for accuracy
              
            }
            
            this.backgroundBuffer[down] = typeId;


          }
          // Try down-left
          else if (
            x > 0 &&
            y + target.rules.dls < this.height &&
            this.grid[downLeft] === 0 &&
            this.backgroundBuffer[downLeft] === 0 &&
            target.rules.dl
          ) {
            this.backgroundBuffer[downLeft] = typeId;
            moved = true;
          }
          // Try down-right
          else if (
            x + target.rules.drs < this.width &&
            y + target.rules.drs < this.height &&
            this.grid[downRight] === 0 &&
            this.backgroundBuffer[downRight] === 0 &&
            target.rules.dr
          ) {
            this.backgroundBuffer[downRight] = typeId;
            moved = true;
          }

          if (typeId === 3 && y + target.rules.ds < this.height && this.grid[down] !== 0 &&
            this.backgroundBuffer[down] !== 0 && this.grid[down] !== 3 &&  this.backgroundBuffer[down] !== 3) {
              this.backgroundBuffer[index] = 0
            this.backgroundBuffer[down] = 0
            this.backgroundBuffer[up] = 6
            moved = true
          }


          if (typeId === 1 && y + target.rules.ds < this.height && (this.grid[down] === 3 ||   this.grid[down] === 5) &&
            (this.backgroundBuffer[down] ===3 || this.backgroundBuffer[down] === 5)) {
              this.backgroundBuffer[index] = 0
            this.backgroundBuffer[down] = 1
            this.backgroundBuffer[up] = 6
            moved = true
          }

          if (typeId === 10 && y + target.rules.ds < this.height && (this.grid[down] === 1 ||   this.backgroundBuffer[down] === 1) || (this.grid[down] === 11 || this.backgroundBuffer[down] === 11)) {
            // (this.backgroundBuffer[down] ===3 || this.backgroundBuffer[down] === 5)) {
              // this.backgroundBuffer[index] = 0
            // this.backgroundBuffer[down] = 1
            this.backgroundBuffer[up] = 11
            moved = true
          }

          if (typeId === 11 && this.grid[up] === 0 || this.backgroundBuffer[up] === 0 &&  this.grid[down] === 11 || this.backgroundBuffer[down] === 11) {
            this.backgroundBuffer[up] = 11
            moved = true
          }

          if (this.targets[typeId] && this.targets[typeId].density < 0) {
            if (typeId === 8) {  // Fire
                // Check all 8 surrounding cells for wood (typeId 9)
                const neighbors = [
                    {x: x, y: y  -1},      // top
                    // top-left
                    {x: x - 1, y: y - 1},
                    // top-right
                    {x: x + 1, y: y - 1},
                    // bottom
                    {x: x, y: y + 1},
                    // bottom-left
                    {x: x - 1, y: y + 1},
                    // bottom-right
                    {x: x + 1, y: y + 1},
                    {x: x - 1, y: y},      // left
                    {x: x + 1, y: y},      // right
                ];
        
                // Burn any adjacent wood - check BOTH grid and backgroundBuffer
                for (const neighbor of neighbors) {
                        const neighborIndex = toIndex(neighbor.x, neighbor.y, this.width);
                        if (this.grid[index] === 9 || this.backgroundBuffer[index]===9 || this.grid[neighborIndex] === 9 || this.backgroundBuffer[neighborIndex]===9 || this.grid[neighborIndex] === 8 || this.backgroundBuffer[neighborIndex]=== 8) {
                            this.backgroundBuffer[neighborIndex] = this.grid[neighborIndex] === 8 || this.backgroundBuffer[neighborIndex] === 8 ? 0.0 : 8;  // Turn wood into fire
                            this.backgroundBuffer[index] = 0;  // Turn wood into fire
                        }
                }

                // if (this.backgroundBuffer[down] === typeId)
                    this.backgroundBuffer[index] = 0;

                if (this.backgroundBuffer[down] === typeId)
                  this.backgroundBuffer[down] = 0;


             
                if (this.backgroundBuffer[up]===9) {
                    this.backgroundBuffer[up] = typeId;
                } 
                
            } else {
                // Other negative density particles (steam)
                const nextUp = toIndex(x, y - 2*target.rules.ds, this.width);
                this.backgroundBuffer[up] = typeId;
                this.backgroundBuffer[nextUp] = 0;
                this.backgroundBuffer[down] = 0;
                this.backgroundBuffer[downRight] = 0;
                this.backgroundBuffer[downLeft] = 0;
                this.backgroundBuffer[left] = 0;
                this.backgroundBuffer[index] = 0;
            }
            moved = true;
        }

          if (typeId === 5 && y + target.rules.ds < this.height && this.grid[down] === 1 &&  this.backgroundBuffer[down] === 1) {
            // this.backgroundBuffer[down] = typeId
            const displacedType = this.backgroundBuffer[up]
            this.backgroundBuffer[up] = 6
            if (displacedType !== 1)
            {
              this.backgroundBuffer[down] = displacedType

            }


            moved = true
          }

          if (!moved) {
            if (canLeft && canRight) {
              if (Math.random() < 0.9) {
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
            // else {
              this.backgroundBuffer[index] = typeId;
            // }
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
          if (Array.isArray(color)) 
          {
            this.pixels[index * 4 + 0] = color[0] + 1;
            this.pixels[index * 4 + 1] = color[1] + 1;
            this.pixels[index * 4 + 2] = color[2] + 1;
            this.pixels[index * 4 + 3] = color[3] ? color[3]*100*255 : 255;
          } else {
            // it's a function, color generator
            const CC = color()
            this.pixels[index * 4 + 0] = CC[0] + 1;
            this.pixels[index * 4 + 1] = CC[1] + 1;
            this.pixels[index * 4 + 2] = CC[2] + 1;
            this.pixels[index * 4 + 3] = CC[3] ? color[3]*100*255 : 255;
          }
        }
      } else if (
        this.pixels[index * 4] !== 0 &&
        this.pixels[index * 4 + 1] !== 0 &&
        this.pixels[index * 4 + 2] !== 0 &&
        this.pixels[index * 4 + 3] !== 0
      ) {
        const t = this.targets[this.backgroundBuffer[index * 4 + 1]];
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

  clear() {
    this.ctx.putImageData(this.imageData, 0, 0);
    this.grid.fill(0)
    this.backgroundBuffer.fill(0)
  }
}

export default Renderer;
