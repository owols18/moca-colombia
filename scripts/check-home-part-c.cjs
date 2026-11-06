// node scripts/check-home-part-c.cjs — deterministic scroll/geometry checks, not browser QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createRequire } = require('node:module');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
function load(name) {
  const source = fs.readFileSync(path.join(root, 'src/components/home', name), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const result = { exports: {} };
  new Function('exports', 'module', output)(result.exports, result);
  return result.exports;
}
const { getVegetationFrame, getVegetationGeometry, getVegetationProgress, VEGETATION_LAYERS, VEGETATION_TIMING } = load('vegetationMotion.ts');
const { MISSION_TIMING } = load('missionMotion.ts');
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} differs from ${b}`);
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
const assets = content.partC.vegetation;

async function main() {
  assert.equal(assets.length, 3);
  const raw = [];
  for (const [index, asset] of assets.entries()) {
    assert.equal(asset.src, `/images/home/vegetation${index + 1}.webp`);
    const file = path.join(root, 'public', asset.src);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.hasAlpha, true);
    raw.push(await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  }
  assert.deepEqual(VEGETATION_LAYERS.map(layer => layer.zIndex), [70, 80, 90]);
  // Physical A/B/B.1 scroll distances remain unchanged; C overlaps only the last entrance.
  close(getVegetationProgress(3520, 4000, 4000, MISSION_TIMING.foreground[2]), 0);
  close(getVegetationProgress(8000, 4000, 4000, MISSION_TIMING.foreground[2]), 1);
  close(getVegetationProgress(-2000, 4000, 4000, MISSION_TIMING.foreground[2]), 0);
  assert.ok(VEGETATION_TIMING.front[0] - VEGETATION_TIMING.sides[1] >= .2, 'Keep a readable hold before the front layer');
  for (const [w, h] of [[1920, 1080], [2560, 1440], [390, 844], [768, 1024], [3440, 1440], [1920, 400]]) {
    const geometry = getVegetationGeometry(w, h, assets);
    assert.ok(geometry[0].startX + geometry[0].width < 0);
    assert.ok(geometry[1].startX > w);
    assert.ok(geometry[2].startY > h);
    assert.ok(geometry[1].y < geometry[0].y);
    close(geometry[2].y - geometry[0].y, h * .1);
    close(geometry[2].x, 0);
    const start = getVegetationFrame(0, geometry);
    assert.ok(start.every(layer => !layer.visible));
    const sides = getVegetationFrame(VEGETATION_TIMING.sides[1], geometry);
    close(sides[0].x, geometry[0].x);
    close(sides[1].x, geometry[1].x);
    assert.equal(sides[2].visible, false);
    const final = getVegetationFrame(1, geometry);
    final.forEach((layer, index) => {
      close(layer.x, geometry[index].x);
      close(layer.y, geometry[index].y);
    });
    // Measure actual painted pixels, including transparency and foreground occlusion.
    // A loaded image may still be invisible if it sits below the viewport or another layer.
    for (const [label, progress, expected] of [['side hold', .45, [0, 1]], ['final hold', 1, [0, 1, 2]]]) {
      const frame = getVegetationFrame(progress, geometry);
      const painted = [0, 0, 0];
      for (let row = 0; row < 100; row++) {
        for (let col = 0; col < 100; col++) {
          let remaining = 1;
          for (let i = 2; i >= 0; i--) {
            if (!frame[i].visible) continue;
            const scale = geometry[i].width / assets[i].width;
            const x = Math.floor((w * (col + .5) / 100 - frame[i].x) / scale);
            const y = Math.floor((h * (row + .5) / 100 - frame[i].y) / scale);
            const alpha = x >= 0 && y >= 0 && x < assets[i].width && y < assets[i].height
              ? raw[i].data[(y * assets[i].width + x) * 4 + 3] / 255 : 0;
            painted[i] += alpha * remaining;
            remaining *= 1 - alpha;
          }
        }
      }
      expected.forEach(i => assert.ok(painted[i] / 10000 > .015,
        `vegetation${i + 1} is not distinguishable at ${w}×${h} during ${label}: ${painted[i] / 100}%`));
    }
    const frames = Array.from({ length: 101 }, (_, i) => getVegetationFrame(i / 100, geometry));
    for (let i = 100; i >= 0; i--) assert.deepEqual(getVegetationFrame(i / 100, geometry), frames[i]);
    for (let i = 1; i <= 100; i++) {
      assert.ok(frames[i][0].x >= frames[i - 1][0].x);
      assert.ok(frames[i][1].x <= frames[i - 1][1].x);
      assert.ok(frames[i][2].y <= frames[i - 1][2].y);
    }
    // No lower-edge holes after the side pair arrives, even before vegetation3 enters.
    for (let col = 0; col <= 100; col++) {
      let opacity = 0;
      for (let i = 0; i < 2; i++) {
        const layer = geometry[i];
        const height = layer.width * assets[i].height / assets[i].width;
        const x = Math.floor(((w - 1) * col / 100 - layer.x) / layer.width * assets[i].width);
        const y = Math.floor((h - 2 - layer.y) / height * assets[i].height);
        const alpha = x >= 0 && y >= 0 && x < assets[i].width && y < assets[i].height
          ? raw[i].data[(y * assets[i].width + x) * 4 + 3] / 255 : 0;
        opacity += alpha * (1 - opacity);
      }
      assert.ok(opacity >= .98, `Lower-edge gap at ${w}×${h}, column ${col}`);
    }
    if (w === 1920 && h === 1080 || w === 2560 && h === 1440) {
      geometry.forEach((layer, index) => {
        const visible = Math.min(w, layer.x + layer.width) - Math.max(0, layer.x);
        close(visible / layer.width, VEGETATION_LAYERS[index].visibleWidth);
      });
    }
    console.log(`PASS ${w}×${h}: visible vegetation, hold, order, crops, 10% separation, reverse scroll and lower-edge coverage.`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
