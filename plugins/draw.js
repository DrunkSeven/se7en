//一个对象
export default class Draw {
  ctx;
  _type;
  _fill;
  _fillColor;
  _color;
  _lineWidth;
  _polyLine;
  _dashLine;
  _ctxArr;
  constructor(ctx, type) {
    this.type = type || 'stroke'
    this.ctx = ctx;
    this.ctxArr = []
  }
  set ctxArr(val) {
    this._ctxArr = val;
  }
  get ctxArr() {
    return this._ctxArr
  }
  set dashLine(val) {
    this._dashLine = val;
  }
  get dashLine() {
    return this._dashLine
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
  set fillColor(val) {
    this._fillColor = val;
  }
  get fillColor() {
    return this._fillColor
  }
  init() {
    this.ctx.strokeStyle = this._color;
    this.ctx.fillStyle = this._fillColor;
    this.ctx.lineWidth = this._lineWidth;
    this.polyLine = this._polyLine;
    if (this._dashLine) {
      this.ctx.setLineDash([this._lineWidth * 2, this._lineWidth]);
    } else {
      this.ctx.setLineDash([0]);
    }
  }
  rect(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    this.ctx.rect(x, y, x1 - x, y1 - y);
    if (this._fill) {
      this.ctx.fill();
      this.ctx.stroke();
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
    this.init();
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (this._fill) {
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.stroke();
    }
  }
  ellipse(x, y, x1, y1) {
    this.init();
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, Math.abs(x - x1), Math.abs(y - y1), 0, 0, 2 * Math.PI);
    if (this._fill) {
      this.ctx.fill();
      this.ctx.stroke();
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
      this.ctx.stroke();
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
    if (this._lineWidth && this._lineWidth > 5) {
      width = this._lineWidth * 2
    }
    this.ctx.lineCap = "round";
    this.ctx.clearRect(x1 - width / 2, y1 - width / 2, width, width);
  }
  getShape(drawInfo) {
    // console.log(drawInfo);

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
