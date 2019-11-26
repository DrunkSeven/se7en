//一个对象
export default class Draw {
  ctx;
  _type;
  _fill;
  _color;
  _lineWidth;
  _polyLine;
  constructor(ctx, type) {
    this.type = type || 'stroke'
    this.ctx = ctx;
  }
  set polyLine(val) {
    this._polyLine = val;
  }
  get polyLine() {
    return this._polyLine
  }
  set lineWidth(val) {
    this._lineWidth = val;
  }
  get lineWidth() {
    return this._lineWidth
  }
  set color(val) {
    this._color = val;
  }
  get color() {
    return this._color
  }
  set type(val) {
    this._type = val;
  }
  get type() {
    return this._type
  }
  set fill(val) {
    this._fill = val;
  }
  get fill() {
    return this._fill
  }
  init() {
    this.ctx.strokeStyle = this._color;
    this.ctx.fillStyle = this._color;
    this.ctx.lineWidth = this._lineWidth;
    this.polyLine = this._polyLine;
  }
  rect(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    this.ctx.rect(x, y, x1 - x, y1 - y);
    if (this._fill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
  line(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }
  circle(x, y, x1, y1) {
    console.log(x1);

    this.init();
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (this._fill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
  /**
   *
   * @param x 多边形
   * @param y
   * @param x1
   * @param y1
   * @param n
   */
  poly(x, y, x1, y1) {
    let n = this._polyLine;
    this.init();
    let ctx = this.ctx;
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2);
    let nx = r * Math.cos(Math.PI / n);
    let ny = r * Math.sin(Math.PI / n);
    ctx.beginPath();
    ctx.moveTo(nx, ny);
    for (let i = 0; i <= n; i++) {
      ctx.rotate(Math.PI * 2 / n);
      ctx.lineTo(nx, -ny);
    }
    ctx.closePath();     //闭合路径否则首位衔接处会怪怪的
    if (this._fill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
    //
    ctx.restore();
  }
  pen(x, y, x1, y1) {
    this.init();
    this.ctx.save();
    this.ctx.lineCap = "round";
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
    this.ctx.restore();
  }
  eraser(x, y, x1, y1) {
    let width = 10;
    if (this._lineWidth && this._lineWidth > 10) {
      width = this._lineWidth
    }
    this.ctx.lineCap = "round";
    this.ctx.clearRect(x1 - width / 2, y1 - width / 2, width, width);
  }
  dash(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    this.ctx.setLineDash([4, 2]);
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }
  cut(x, y, x1, y1) {
    this.init();
    this.ctx.save();
    this.ctx.setLineDash([4, 2]);
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.rect(x, y, x1 - x, y1 - y);
    this.ctx.stroke();
    this.ctx.restore();
  }
}
