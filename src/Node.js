class Node {
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.used = false;
    this.down = null;
    this.right = null;
  }
}

module.exports = Node;
