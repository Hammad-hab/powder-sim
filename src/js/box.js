class Box {
  constructor(ctx) {
    this.width = 2;
    this.height = 2;
    this.color = "black";
    this.ctx = ctx;
    this.rules = {
      d: true,
      dr: true,
      dl: true,
      l: false,
      r: false,
    };
    this.speeds = {
      d: 1,
      dr: 1,
      dl: 1,
      l: 5,
      r: 5
    }
  }

  draw(x, y) {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(x,y, this.width, 0, 2*Math.PI)
    this.ctx.fill();
    // this.ctx.fillRect(x, y, this.width, this.height);
  }
}

class TwoVaryingColorBox extends Box {
  constructor(ctx, colors) {
    super(ctx);
    this.width = 3
    this.height = 3
    this.colors = colors;
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.rules = {
      d: true,
      dr: true,
      dl: true,
      l: true,
      r: true,
    };

    this.speeds.d = 5
  }

  draw(x, y) {
    super.draw(x, y);
  }
}

export { Box, TwoVaryingColorBox };
