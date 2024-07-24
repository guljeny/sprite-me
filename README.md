# SpriteMe
_The spritesheet creation tool for Node.js_

SpriteMe designed as core module which do not create or modify any files.

## Installation

- Install [ImageMagic](https://imagemagick.org/script/download.php).

  For example on MacOS run: `brew install imagemagick`.
- Install package: `npm i -s sprite-me`.
- ✨Yo're awesome✨

## Usage
Base usage `spriteMe(string[], options?: Object)`. 

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

- `format` - default 'png' - format of compiled image.

  `spriteMe(images, { format: 'jpg' })`
