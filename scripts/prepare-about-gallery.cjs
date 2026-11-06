// Generate lightweight web copies; never modify the supplied originals.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('node:module').createRequire(require.resolve('next/package.json'))('sharp');
const dir = path.resolve(__dirname, '../public/images/home');
(async () => {
  for (let n = 1; n <= 6; n++) {
    const source = path.join(dir, `about-us-slider${n}.${n === 2 ? 'jpg' : 'png'}`);
    const target = path.join(dir, `about-us-slider${n}.webp`);
    if (!fs.existsSync(target)) await sharp(source).webp({ quality: 90 }).toFile(target);
    console.log(path.basename(target), fs.statSync(target).size);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
