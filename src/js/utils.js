function toIndex(x, y, width) {
  return y * width + x;
}

function fromIndex(index, width) {
  const y = Math.floor(index / width);
  const x = index % width;
  return { x, y };
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



export {
  toIndex,
  fromIndex,
  isParameterClean
}