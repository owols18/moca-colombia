// Run: node scripts/check-home-part-b1.cjs
// Timeline tests, not a substitute for browser visual approval.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/home/missionMotion.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'module', compiled)(loaded.exports, loaded);
const { getMissionFrame, getMissionMountainY } = loaded.exports;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);

const start = getMissionFrame(.88, 0);
assert.equal(start.titleRiseVh, 90);
assert.equal(start.titleOpacity, 0);
assert.equal(start.copyInteractive, false);
const arrived = getMissionFrame(.97, 0);
assert.equal(arrived.titleRiseVh, 0);
assert.equal(arrived.titleOpacity, 1);
assert.equal(arrived.titleScale, 1);
for (const p of [.30, .4, .5, .66]) {
  const reading = getMissionFrame(1, p);
  close(reading.titleScale, .85);
  assert.equal(reading.titleOpacity, 1);
  assert.equal(reading.copyOpacity, 1);
  close(reading.copyX, 0);
  assert.equal(reading.copyInteractive, true);
  close(getMissionMountainY(3, 74, .32, p), 90);
}
const exit = getMissionFrame(1, .94);
assert.equal(exit.titleOpacity, 0);
assert.equal(exit.copyOpacity, 0);
assert.equal(exit.copyInteractive, false);
assert.ok(exit.titleScale < .85);
assert.ok(exit.copyScale < 1);
for (const [index, initial, target] of [[3, 74, .32], [4, 112, .42], [5, 122, .52]]) {
  close(getMissionMountainY(index, initial, target, 0), initial);
  close(getMissionMountainY(index, initial, target, 1), target * 100);
  let previous = Infinity;
  for (let step = 66; step <= 100; step++) {
    const next = getMissionMountainY(index, initial, target, step / 100);
    assert.ok(next <= previous + 1e-8);
    previous = next;
  }
}
for (let index = 0; index < 3; index++) close(getMissionMountainY(index, 22, .22, 1), 22);
const frames = Array.from({ length: 101 }, (_, index) => getMissionFrame(1, index / 100));
for (let index = 100; index >= 0; index--) assert.deepEqual(getMissionFrame(1, index / 100), frames[index]);
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
assert.equal(content.partB.cta.href, '/en/our-mission');
assert.equal(content.partB.cta.label, 'LEARN MORE');
assert.ok(content.partB.description.endsWith('their children.'));
const css = fs.readFileSync(path.join(root, 'src/components/home/HomeStory.module.css'), 'utf8');
assert.match(css, /--part-a-scroll: 260svh/);
assert.match(css, /--part-b-scroll: 520svh/);
assert.match(css, /--part-b1-scroll: 400svh/);
assert.match(css, /\.missionScene\s*\{[^}]*z-index: 35/);
assert.match(css, /\.missionCopy\s*\{[^}]*color: #fff/);
console.log('PASS B.1: rising title, exact 15% reduction, copy entrance/hold/exit, CTA, foreground return and reverse scroll.');
