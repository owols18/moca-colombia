// Run: node scripts/check-home-part-b.cjs
// --timeline-only skips the strict original full-screen-cover requirement.
// Pure timeline + real asset alpha checks; does not replace browser visual review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/home/mountainMotion.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'module', compiled)(loaded.exports, loaded);
const { getMountainFrame, MOUNTAIN_LAYERS, MOUNTAIN_TIMING } = loaded.exports;
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));

async function main() {
  assert.equal(content.partB.mountains.length, 6);
  assert.equal(getMountainFrame(0).visible, false);
  assert.equal(getMountainFrame(.179).covered, false);
  assert.equal(getMountainFrame(.18).covered, true);
  assert.equal(getMountainFrame(.76).cameraScale, 1);
  assert.equal(getMountainFrame(.84).blur, 0);
  assert.equal(getMountainFrame(.88).mission, 0);
  assert.equal(getMountainFrame(1).mission, 1);
  assert.equal(getMountainFrame(1).blur, MOUNTAIN_TIMING.blurPixels);
  assert.equal('veil' in getMountainFrame(1), false);
  assert.deepEqual(getMountainFrame(1).layers.map(layer => layer.blur), [12, 12, 12, 0, 0, 0]);
  assert.equal(getMountainFrame(1).layers[3].yVh, 74);
  assert.ok(getMountainFrame(1).layers[4].yVh > 100);
  assert.ok(getMountainFrame(1).layers[5].yVh > 100);
  let previousScale = Infinity;
  for (let step = 0; step <= 1000; step++) {
    const frame = getMountainFrame(step / 1000);
    assert.ok(frame.cameraScale <= previousScale);
    assert.ok(frame.layers.every(layer => Number.isFinite(layer.yVh)));
    assert.ok(frame.layers.every((layer, index) => layer.blur === (index <= 2 ? frame.blur : 0)));
    previousScale = frame.cameraScale;
  }
  const forward = Array.from({ length: 101 }, (_, i) => getMountainFrame(i / 100));
  for (let i = 100; i >= 0; i--) assert.deepEqual(getMountainFrame(i / 100), forward[i]);
  content.partB.mountains.forEach((asset, i) => {
    assert.equal(asset.src, `/images/home/mountain${i + 1}.webp`);
    assert.ok(fs.existsSync(path.join(root, 'public', asset.src)));
  });
  for (const asset of content.partB.mountains) {
    const metadata = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.hasAlpha, true);
  }
  if (process.argv.includes('--timeline-only')) {
    console.log('PASS: six assets, timing, reverse scroll, mission framing, no veil and blur on mountains 1–3 only.');
    console.log('Full-screen mountain1 coverage was not asserted in this mode.');
    return;
  }
  const { data, info } = await sharp(path.join(root, 'public', content.partB.mountains[0].src))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const [w, h] of [[1920, 1080], [2560, 1440], [390, 844], [768, 1024], [3440, 1440], [1920, 400]]) {
    const layer = MOUNTAIN_LAYERS[0];
    const width = Math.max(w * layer.width, h * layer.minWidthVh);
    const imageHeight = width * info.height / info.width;
    const frame = getMountainFrame(.18, imageHeight / h * 100);
    const left = w / 2 - width * frame.cameraScale / 2;
    const top = frame.layers[0].yVh / 100 * h * frame.cameraScale;
    let minimumAlpha = 255;
    for (let row = 0; row <= 100; row++) for (let col = 0; col <= 100; col++) {
      const x = Math.floor((col / 100 * (w - 1) - left) / (width * frame.cameraScale) * info.width);
      const y = Math.floor((row / 100 * (h - 1) - top) / (imageHeight * frame.cameraScale) * info.height);
      minimumAlpha = Math.min(minimumAlpha, data[(y * info.width + x) * 4 + 3] ?? 0);
    }
    assert.ok(minimumAlpha >= 250, `Uncovered Part A at ${w}×${h}: ${minimumAlpha}`);
    console.log(`PASS ${w}×${h}: mountain1 covers the viewport (min alpha ${minimumAlpha}/255).`);
  }
  console.log('PASS: six assets, timing, reverse scroll, camera pullback and cover geometry.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
