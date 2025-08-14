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


function rgb(r, g, b) {
  return [r,g,b]
}

function rgba(r, g, b, a=-1) {
  if (typeof r == 'number')
    return [r,g,b,a]
  else {
    if (r[3])
      return `rgba(${r})`
    else 
      return `rgb(${r})`
  }
}


export {
  toIndex,
  fromIndex,
  isParameterClean,
  rgb, rgba
}