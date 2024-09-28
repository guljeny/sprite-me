# Sprite-me
_The spritesheet creation tool for Node.js_

SpriteMe designed as core module which do not create or modify any files.

If you want build sprites during build procces look at [Sprite-me webpack plugin](https://www.npmjs.com/package/spriteme-webpack-plugin)

## Installation

- Install [ImageMagic V7](https://imagemagick.org/script/download.php).

    **Version `7` is required**. Check it by running `magick --version`

  > I recomend to use [ImageMagick Easy Instal](https://github.com/SoftCreatR/imei/)
  > Some package managers like `brew` can install imagemagick with version 6
  
- Install package: `npm i -s sprite-me`.

## Usage
Base usage `spriteMe(images: string[], options?: Object)`. 

Returns object with next keys:

- `image` - Buffer with generated sprite
- `frames` - Frames object
- `meta` - Meta information Object

Script example to create and save sprite:

```
const fs = require('fs');
const spriteMe = require('sprite-me');

const imageName = 'spriteMe.png';
const jsonName = 'spriteMe.json'
const images = ['./img1.png', './img2.png'];

(async () => {
    const { meta, frames, image } = await spriteMe(images);
    
    const json = JSON.stringify({
        meta: {
            ...meta,
            image: imageName,
        },
        frames,
    });

    fs.writeFileSync(imageName, image);
    fs.writeFileSync(jsonName, json);
})();
```

## Options

Options can be passed as second argument

`spriteMe(images, { format: 'jpg', gap: 100 })`

- `format` - Default `png` - Format of compiled image.
- `gap` - Default `10` - Distance beetween images.
