function toIndex(x, y, width) {
  return y * width + x;
}


function isParameterClean({
  grid,
  width,
  height,
  spawnX,
  spawnY,
  windowwidth,
}) {
  return (
    grid[toIndex(spawnX, spawnY, windowwidth)] === 0 &&
    grid[toIndex(spawnX - width / 2, spawnY, windowwidth)] === 0 &&
    grid[toIndex(spawnX + width / 2, spawnY, windowwidth)] === 0 &&
    grid[toIndex(spawnX, spawnY - height / 2, windowwidth)] === 0 &&
    grid[toIndex(spawnX, spawnY + height / 2, windowwidth)] === 0
  );
}

onmessage = (e) => {
  console.log("Message received from main script");
  // postMessage("workerResult");
  const grid = e.data[0]
  const newGrid = new Uint8Array(grid.length);
  const wh = e.data[1]
  // Update bottom → top for natural falling
  for (let y = wh[1] - 1; y >= 0; y--) {
    for (let x = 0; x < wh[0]; x++) {
      const index = toIndex(x, y, wh[0]);

      if (grid[index] !== 0) {
        const typeId = grid[index];
        let moved = false;

        // Positions to check for movement
        const down = toIndex(x, y + 1, wh[0]);
        const downLeft = toIndex(x - 1, y + 1, wh[0]);
        const downRight = toIndex(x + 1, y + 1, wh[0]);

        // Try down
        if (
          y + 1 < wh[1] &&
          grid[down] === 0 &&
          newGrid[down] === 0
        ) {
          newGrid[down] = typeId;
          moved = true;
        }
        // Try down-left
        else if (
          x > 0 &&
          y + 1 < wh[1] &&
          grid[downLeft] === 0 &&
          newGrid[downLeft] === 0
        ) {
          newGrid[downLeft] = typeId;
          moved = true;
        }
        // Try down-right
        else if (
          x + 1 < wh[0] &&
          y + 1 < wh[1] &&
          grid[downRight] === 0 &&
          newGrid[downRight] === 0
        ) {
          newGrid[downRight] = typeId;
          moved = true;
        }

        // Stay put if can't move
        if (!moved) {
          newGrid[index] = typeId;
        }
      }
    }
  }


  // Spawn new particle AFTER movement so you don't overwrite moving particles
  const minx = spawnX - 10;
  const maxx = spawnX + 10;
  const miny = spawnY - 10;
  const maxy = spawnY + 10;
  for (let x = minx; x < maxx; x += 2) {
    for (let y = miny; y < maxy; y += 2) {
      // const element = array[index];
      const spawnIndex = toIndex(
        x + Math.floor(Math.random() * 10),
        y + Math.floor(Math.random() * 10),
        wh[0]
      );
      if (
        isParameterClean({
          grid: newGrid,
          width: 10,
          height: 10,
          spawnX: x,
          spawnY: y,
          windowwidth: wh[0],
        })
      ) {
        newGrid[spawnIndex] = 1;
      }
    }
  }
  postMessage(newGrid)

};
