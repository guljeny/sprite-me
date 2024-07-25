const util = require('util');
const path = require('path');
const { exec, spawnSync } = require('child_process');
const packer = require('./packer');

const defaultOptions = {
  format: 'png',
  gap: 10,
};

const asyncExec = util.promisify(exec);

const spriteMe = async (files, userOptions) => {
  const options = { ...defaultOptions, ...userOptions };

  const blocks = await Promise.all(files.map(async img => {
    const { stdout } = await asyncExec(`identify -ping -format '%w:%h' ${img}`);
    const [w, h] = stdout.split(':');

    return { w: Number.parseInt(w, 10), h: Number.parseInt(h, 10), img };
  }));

  const { width, height, rects } = packer(blocks, { gap: options.gap });
  const args = [];
  args.push('(', '-size', `${width}x${height}`, 'xc:none', ')');

  rects.forEach(rect => {
    const { img, x, y } = rect;
    // eslint-disable-next-line max-len
    args.push('(', img, '-geometry', `+${x}+${y}`, '-background', 'transparent', ')', '-composite');
  });

  args.push(`${options.format}:-`);

  const r = spawnSync('magick', args);
  const err = r.stderr.toString();

  if (err) {
    throw new Error(err);
  }

  const meta = {
    size: { w: width, h: height },
    scale: 1,
  };

  const frames = rects.reduce((acc, rect) => {
    const { img, x, y, w, h } = rect;
    const imgName = path.basename(img);

    return {
      ...acc,
      [imgName]: {
        frame: { x, y, w, h },
        spriteSourceSize: { x: 0, y: 0, w, h },
        sourceSize: { w, h },
      },
    };
  }, {});

  return {
    image: r.stdout,
    meta,
    frames,
  };
};

module.exports = spriteMe;
