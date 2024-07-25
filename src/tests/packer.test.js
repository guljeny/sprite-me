const packer = require('../packer');

const multiItemsConfig = [
  { w: 100, h: 100 },
  { w: 100, h: 100 },
  { w: 100, h: 80 },
  { w: 100, h: 80 },
];

describe('Packer', () => {
  it('Generated sprite size', () => {
    const { width, height } = packer(multiItemsConfig);

    expect(width).toBe(200);
    expect(height).toBe(180);
  });

  it('Generated sprite size with gap', () => {
    const { width, height } = packer(multiItemsConfig, { gap: 10 });

    expect(width).toBe(210);
    expect(height).toBe(190);
  });

  it('Rects positions', () => {
    const { rects } = packer(multiItemsConfig);

    expect(rects.length).toBe(4);
    expect(rects).toEqual([
      { w: 100, h: 100, x: 0, y: 0 },
      { w: 100, h: 100, x: 100, y: 0 },
      { w: 100, h: 80, x: 0, y: 100 },
      { w: 100, h: 80, x: 100, y: 100 },
    ]);
  });

  it('Rects positions with gap', () => {
    const { rects } = packer(multiItemsConfig, { gap: 10 });

    expect(rects.length).toBe(4);
    expect(rects).toEqual([
      { w: 100, h: 100, x: 0, y: 0 },
      { w: 100, h: 100, x: 110, y: 0 },
      { w: 100, h: 80, x: 0, y: 110 },
      { w: 100, h: 80, x: 110, y: 110 },
    ]);
  });

  it('Packing one item', () => {
    const { rects } = packer([{ w: 100, h: 100 }]);
    expect(rects).toEqual([{ w: 100, h: 100, x: 0, y: 0 }]);
  });
});
