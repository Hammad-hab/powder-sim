/**
 * Represents movement rules for particles or objects in a grid-based or physics simulation.
 * Provides directional movement flags and associated speed modifiers, along with convenient getters and setters.
 *
 * @class MotionRules
 *
 * @property {boolean} down - Indicates if downward motion is allowed.
 * @property {boolean} downRight - Indicates if diagonal motion to the bottom-right is allowed.
 * @property {boolean} downLeft - Indicates if diagonal motion to the bottom-left is allowed.
 * @property {boolean} left - Indicates if motion to the left is allowed.
 * @property {boolean} right - Indicates if motion to the right is allowed.
 *
 * @property {number} ds - Speed for downward motion.
 * @property {number} drs - Speed for down-right motion.
 * @property {number} dls - Speed for down-left motion.
 * @property {number} ls - Speed for left motion.
 * @property {number} rs - Speed for right motion.
 *
 * @constructor
 * @param {Object} options - Configuration options for motion rules.
 * @param {boolean} [options.d=true] - Allow downward movement.
 * @param {boolean} [options.dr=true] - Allow down-right movement.
 * @param {boolean} [options.dl=true] - Allow down-left movement.
 * @param {boolean} [options.l=false] - Allow leftward movement.
 * @param {boolean} [options.r=false] - Allow rightward movement.
 * @param {number} [options.ds=1] - Downward speed.
 * @param {number} [options.drs=1] - Down-right speed.
 * @param {number} [options.dls=1] - Down-left speed.
 * @param {number} [options.ls=3] - Leftward speed.
 * @param {number} [options.rs=3] - Rightward speed.
 */
class MotionRules {
  constructor({
    d = true,
    dr = true,
    dl = true,
    l = false,
    r = false,
    ds = 1,
    drs = 1,
    dls = 1,
    ls = 3,
    rs = 3,
  } = {}) {
    // backing fields
    this._down = d;
    this._downRight = dr;
    this._downLeft = dl;
    this._left = l;
    this._right = r;

    // initialize alias properties so they're usable immediately
    this.d = this._down;
    this.dr = this._downRight;
    this.dl = this._downLeft;
    this.l = this._left;
    this.r = this._right;

    // speeds
    this.ds = ds;
    this.ls = ls;
    this.rs = rs;
    this.drs = drs;
    this.dls = dls;
  }

  get down() {
    return this._down;
  }
  set down(value) {
    this._down = value;
    this.d = value; // alias
  }

  get downRight() {
    return this._downRight;
  }
  set downRight(value) {
    this._downRight = value;
    this.dr = value; // alias
  }

  get downLeft() {
    return this._downLeft;
  }
  set downLeft(value) {
    this._downLeft = value;
    this.dl = value; // alias
  }

  get left() {
    return this._left;
  }
  set left(value) {
    this._left = value;
    this.l = value; // alias
  }

  get right() {
    return this._right;
  }
  set right(value) {
    this._right = value;
    this.r = value; // alias
  }
}

export default MotionRules;
