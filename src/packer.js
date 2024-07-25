const Node = require('./Node');

const defaultOptions = {
  gap: 0,
};

class GrowingPacker {
  constructor (options = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  fit (blocks) {
    const len = blocks.length;
    const w = len > 0 ? blocks[0].w : 0;
    const h = len > 0 ? blocks[0].h : 0;
    this.root = new Node(0, 0, w, h);

    const rects = blocks.map(block => {
      const node = this.findNode(this.root, block.w, block.h);

      const fit = node
        ? this.splitNode(node, block.w, block.h)
        : this.growNode(block.w, block.h);

      return { ...block, x: fit.x, y: fit.y };
    });

    return { rects, width: this.root.w, height: this.root.h };
  }

  findNode (root, w, h) {
    if (root.used) {
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    }

    if ((w <= root.w) && (h <= root.h)) return root;

    return null;
  }

  splitNode (node, w, h) {
    const { gap } = this.options;
    node.used = true;
    node.down = new Node(node.x, node.y + h + gap, node.w, node.h - h);
    node.right = new Node(node.x + w + gap, node.y, node.w - w, h);

    return node;
  }

  growNode (w, h) {
    const canGrowDown = w <= this.root.w;
    const canGrowRight = h <= this.root.h;
    const hBiggerW = this.root.h >= (this.root.w + w);
    const wBiggerH = this.root.w >= (this.root.h + h);
    const shouldGrowRight = canGrowRight && hBiggerW;
    const shouldGrowDown = canGrowDown && wBiggerH;

    if (shouldGrowRight) return this.growRight(w, h);
    if (shouldGrowDown) return this.growDown(w, h);
    if (canGrowRight) return this.growRight(w, h);
    if (canGrowDown) return this.growDown(w, h);

    return null;
  }

  growRight (w, h) {
    const { gap } = this.options;
    const newRoot = new Node(0, 0, this.root.w + w + gap, this.root.h);
    newRoot.used = true;
    newRoot.down = this.root;
    newRoot.right = new Node(this.root.w + gap, 0, w, this.root.h);
    this.root = newRoot;

    const node = this.findNode(this.root, w, h);
    if (node) return this.splitNode(node, w, h);

    return null;
  }

  growDown (w, h) {
    const { gap } = this.options;
    const newRoot = new Node(0, 0, this.root.w, this.root.h + h + gap);
    newRoot.used = true;
    newRoot.down = new Node(0, this.root.h + gap, this.root.w, h);
    newRoot.right = this.root;
    this.root = newRoot;

    const node = this.findNode(this.root, w, h);
    if (node) return this.splitNode(node, w, h);

    return null;
  }
}

const packer = (blocks, options) => {
  blocks.sort((a, b) => b.h - a.h);
  const growingPacker = new GrowingPacker(options);

  return growingPacker.fit(blocks);
};

module.exports = packer;
