const util = require('util');
const path = require('path');
const { exec, spawnSync } = require('child_process');
const packer = require('./packer');

const defaultOptions = {
  fileName: 'spriteMe.png',
};

const asyncExec = util.promisify(exec);

const spriteMe = async (files, userOptions) => {
  const options = { ...defaultOptions, ...userOptions };

  const blocks = await Promise.all(files.map(async img => {
    /* eslint-disable max-len */
    const { stdout } = await asyncExec(`identify -ping -format '%w:%h' ${img}`);
    const [w, h] = stdout.split(':');

    return { w: Number.parseInt(w, 10), h: Number.parseInt(h, 10), img };
  }));

  const { width, height, rects } = packer(blocks);
  const args = [];
  args.push('(', '-size', `${width}x${height}`, 'xc:none', ')');

  rects.forEach(rect => {
    const { img, x, y } = rect;
    args.push('(', img, '-geometry', `+${x}+${y}`, '-background', 'transparent', ')', '-composite');
  });

  args.push('png:-');

  const r = spawnSync('magick', args);
  const err = r.stderr.toString();
  const png = r.stdout.toString();
  if (err) {
    throw new Error(err);
  }

  const json = {
    meta: {
      image: options.fileName,
      size: { w: width, h: height },
      scale: 1,
    },
    frames: rects.reduce((acc, rect) => {
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
    }, {}),
  };

  return {
    png,
    json,
  };
};

module.exports = spriteMe;
