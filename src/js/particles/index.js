import MotionRules from "./motionrules";

class Particle {
  constructor(ctx, name = "Particle") {
    this.width = 2;
    this.height = 2;
    this.color = "black";
    this.density = 1;
    this.ctx = ctx;
    this.rules = new MotionRules({})

    this.name = name;
  }
}

class FluidParticle extends Particle {
  constructor(ctx, name, color) {
    super(ctx, name);
    this.width = 3;
    this.height = 3;
    this.density = 1;
    this.color = color;

    this.rules.l = true
    this.rules.r = true
    this.rules.ls = 3
    this.rules.rs = 3
    this.rules.ds = 5;
  }
}


const Box = Particle
const LiquidBox = FluidParticle
export { Box, LiquidBox, FluidParticle, Particle, MotionRules };
