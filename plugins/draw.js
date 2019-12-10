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
  _position;
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
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  rect(x, y, x1, y1, angle) {
    this.init();
    this.ctx.beginPath();
    this.edit(x, y, x1, y1, angle)
    // this.ctx.translate(x, y);
    // this.ctx.rotate(45 * Math.PI / 180);
    this.ctx.rect(x, y, x1 - x, y1 - y);
    this.drawEnd(x, y, x1, y1)
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
    this.drawEnd(x, y, x1, y1)
  }
  ellipse(x, y, x1, y1, angle) {
    this.init();
    this.ctx.beginPath();
    this.edit(x, y, x1, y1, angle)
    this.ctx.ellipse(x, y, Math.abs(x - x1), Math.abs(y - y1), 0, 0, 2 * Math.PI);
    this.drawEnd(x, y, x1, y1)
  }
  /**
   *
   * @param x 多边形
   * @param y
   * @param x1
   * @param y1
   * @param n
   */
  poly(x, y, x1, y1, angle) {
    let n = this._polyLine;
    this.init();
    let ctx = this.ctx;
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));;
    ctx.save();
    ctx.beginPath();
    this.edit(x, y, x1, y1, angle)
    for (let i = 0; i <= n; i++) {
      let radian = ((2 * Math.PI) / this.polyLine) * i;
      let radian1 = ((2 * Math.PI) / this.polyLine) * (i + 1);
      let nx = r * Math.sin(radian) + x;
      let ny = r * -Math.cos(radian) + y;
      let nx1 = r * Math.sin(radian1) + x;
      let ny1 = r * Math.cos(radian1) + y;
      ctx.lineTo(nx1, ny1);
    }
    ctx.closePath();     //闭合路径否则首位衔接处会怪怪的
    ctx.restore();
    if (this._fill) {
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.stroke();
    }
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
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(x1 - width / 2, y1 - width / 2, width, width);
  }
  drawEnd(x, y, x1, y1) {
    if (this._fill) {
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.stroke();
    }
  }
  edit(x, y, x1, y1, angle) {
    if (this.type == "rect") {
      x = x + Math.abs(x1 - x) / 2;
      y = y + Math.abs(y1 - y) / 2;
    }
    let deg = Math.PI / 180
    let cosNum = Math.cos(deg * angle);
    let sinNum = Math.sin(deg * angle)
    this.ctx.setTransform(cosNum, sinNum, -sinNum, cosNum, x - x * cosNum + y * sinNum, y - x * sinNum - y * cosNum);
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
