// Deterministic C.1 checks. This is not a substitute for visual browser review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createRequire } = require('node:module');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/home/argentinaMotion.ts'), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'module', output)(loaded.exports, loaded);
const { getArgentinaFrame, getArgentinaWordOpacity, ARGENTINA_TIMING } = loaded.exports;
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8')).partC1;

async function main() {
  assert.deepEqual(content.titleLines, ['LA ARGENTINA', 'COLOMBIA']);
  assert.deepEqual(content.cta, { label: 'SEE HOW WE HELP', href: '/en/la-argentina' });
  assert.equal(content.images.length, 3);
  for (const [index, asset] of content.images.entries()) {
    assert.equal(asset.src, `/images/home/la-argentina-${index + 1}.webp`);
    const metadata = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.ok(asset.alt.length > 10);
  }
  const first = getArgentinaFrame(0);
  assert.equal(first.visible, false);
  assert.equal(first.riseVh, 110);
  assert.equal(first.opacity, 0);
  assert.equal(getArgentinaFrame(ARGENTINA_TIMING.entrance[1]).riseVh, 0);
  assert.equal(getArgentinaFrame(.25).activePhoto, 0);
  assert.equal(getArgentinaFrame(.55).activePhoto, 1);
  assert.equal(getArgentinaFrame(.85).activePhoto, 2);
  assert.deepEqual(getArgentinaFrame(1).photoY, [-100, -100, 0]);
  const readingEnd = ARGENTINA_TIMING.reading[1];
  assert.equal(getArgentinaFrame(readingEnd - .001).ctaOpacity, 0);
  assert.equal(getArgentinaFrame(readingEnd).ctaOpacity, 0);
  assert.ok(getArgentinaFrame(readingEnd + .001).ctaOpacity > 0);
  assert.equal(getArgentinaFrame(readingEnd + ARGENTINA_TIMING.ctaReveal).ctaOpacity, 1);
  const wordCount = content.description.split(' ').length;
  for (let i = 0; i < wordCount; i++) {
    assert.equal(getArgentinaWordOpacity(0, i, wordCount), 0);
    assert.equal(getArgentinaWordOpacity(1, i, wordCount), 1);
  }
  // Representative content/window measurements: full desktop, cramped laptop,
  // portrait tablet/mobile, and short landscape. Never lose the paragraph's end.
  for (const [textHeight, windowHeight] of [[480, 700], [640, 430], [650, 520], [940, 360], [1040, 110]]) {
    const frames = Array.from({ length: 201 }, (_, i) => getArgentinaFrame(i / 200, textHeight, windowHeight));
    for (let i = 200; i >= 0; i--) assert.deepEqual(getArgentinaFrame(i / 200, textHeight, windowHeight), frames[i]);
    for (let i = 0; i <= 200; i++) {
      const frame = frames[i];
      if (frame.reading < 1) assert.equal(frame.ctaOpacity, 0);
      assert.ok(frame.copyY <= 0 && frame.copyY >= -Math.max(0, textHeight - windowHeight));
      if (i) {
        assert.ok(frame.reading >= frames[i - 1].reading);
        assert.ok(frame.ctaOpacity >= frames[i - 1].ctaOpacity);
        assert.ok(frame.copyY <= frames[i - 1].copyY);
        assert.ok(frame.riseVh <= frames[i - 1].riseVh);
      }
      // The incoming and outgoing images tile the clipping window without a gap.
      for (let y = 0; y < 100; y++) {
        assert.ok(frame.photoY.some(top => y >= top && y < top + 100), `Uncovered photo mask at ${i / 200}`);
      }
    }
    assert.equal(frames[200].copyY + textHeight, Math.min(textHeight, windowHeight));
  }
  const css = fs.readFileSync(path.join(root, 'src/components/home/HomeStory.module.css'), 'utf8');
  for (const [part, distance] of [['a', 260], ['b', 520], ['b1', 400], ['c', 400], ['c1', 600]]) {
    assert.ok(css.includes(`--part-${part}-scroll: ${distance}svh`));
  }
  console.log('PASS C.1: 3 distinct assets, dimensions, two-line title, reversible entrance, masked image transitions without gaps, full paragraph reveal and overflow reading. Approved scroll distances preserved.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
