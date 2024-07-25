const packer = require('../packer');

const multiItemsConfig = [
  { w: 100, h: 120 },
  { w: 120, h: 100 },
  { w: 100, h: 80 },
  { w: 20, h: 20 },
];

describe('Packer', () => {
  it('Generated sprite size', () => {
    const { width, height } = packer(multiItemsConfig);

    expect(width).toBe(220);
    expect(height).toBe(200);
  });

  it('Generated sprite size with gap', () => {
    const { width, height } = packer(multiItemsConfig, { gap: 10 });

    expect(width).toBe(230);
    expect(height).toBe(210);
  });

  it('Rects positions', () => {
    const { rects } = packer(multiItemsConfig);

    expect(rects.length).toBe(4);
    expect(rects).toEqual([
      { w: 100, h: 120, x: 0, y: 0 },
      { w: 120, h: 100, x: 100, y: 0 },
      { w: 100, h: 80, x: 0, y: 120 },
      { w: 20, h: 20, x: 100, y: 100 },
    ]);
  });

  it('Rects positions with gap', () => {
    const { rects } = packer(multiItemsConfig, { gap: 10 });

    expect(rects).toEqual([
      { w: 100, h: 120, x: 0, y: 0 },
      { w: 120, h: 100, x: 110, y: 0 },
      { w: 100, h: 80, x: 0, y: 130 },
      { w: 20, h: 20, x: 110, y: 130 },
    ]);
  });

  it('Packing one item', () => {
    const { rects } = packer([{ w: 100, h: 100 }]);
    expect(rects).toEqual([{ w: 100, h: 100, x: 0, y: 0 }]);
  });
});
