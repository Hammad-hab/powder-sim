
class Box {
  constructor(ctx) {
    this.width = 2;
    this.height = 2;
    this.color = "black";
    this.ctx = ctx;
    this.rules = {
      d: true,
      dr: true,
      dl: true
    }
  }

  draw(x, y) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y, this.width, this.height);
  }
}


class TwoVaryingColorBox extends Box{
  constructor(ctx, colors) {
    super(ctx)
    this.colors = colors
    this.color = this.colors[Math.floor(Math.random()*this.colors.length)]
     this.rules = {
      d: true,
      dr: true,
      dl: true
    }
  }

  draw(x, y) {
    super.draw(x, y)
  }
}

export {
  Box,
  TwoVaryingColorBox
}