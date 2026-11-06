const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sharp = require('node:module').createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
function load(name) {
  const m = { exports: {} };
  const source = fs.readFileSync(path.join(root, 'src/components/home', name + '.ts'), 'utf8');
  new Function('exports', 'module', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(m.exports, m);
  return m.exports;
}
const { getProjectsGeometry } = load('projectsMotion');
const { getImpactGeometry } = load('impactMotion');
const { getAboutGeometry, getAboutFrame, getAboutLetter, getGalleryOffset, FINAL_HOUSE_ANCHOR, COCOA_ANCHORS } = load('aboutMotion');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
const close = (a, b) => assert.ok(Math.abs(a - b) < .001, `${a} != ${b}`);
async function main() {
  assert.deepEqual(content.partF.cta, { label: 'DISCOVER OUR STORY', href: '/en/about-us' });
  assert.ok(fs.existsSync(path.join(root, 'src/app/[locale]/about-us/page.tsx')));
  assert.equal(content.partF.images.length, 6);
  for (const asset of [content.partF.house, ...content.partF.grains, ...content.partF.images]) {
    const meta = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(meta.width, asset.width);
    assert.equal(meta.height, asset.height);
  }
  for (const [w, h] of [[1920,1080],[2560,1440],[1280,720],[390,844],[320,568],[768,1024],[844,390],[3440,1440]]) {
    const d = getProjectsGeometry(w, h, content.partD);
    const e = getImpactGeometry(w, h, d, content.partE.houses);
    const f = getAboutGeometry(w, h, d, e, content.partF);
    close(d.way.y + d.way.height + f.finalPan, h);
    close(f.house.y + f.house.height, d.way.y + d.way.height * FINAL_HOUSE_ANCHOR.y);
    close(f.house.x + f.house.width / 2, d.way.x + d.way.width * FINAL_HOUSE_ANCHOR.x);
    close(f.grains[1].x, -f.grains[1].width * COCOA_ANCHORS.left.hiddenFraction);
    close(f.grains[0].x, d.way.x + d.way.width * COCOA_ANCHORS.right.x);
    const frames = Array.from({ length: 201 }, (_, i) => getAboutFrame(i / 200, f));
    close(frames[0].extraPan, 0);
    assert.equal(frames[0].blurFactor, 1);
    assert.equal(frames[0].visible, false);
    assert.equal(getAboutFrame(.12, f).blurFactor, 0);
    close(getAboutFrame(.60, f).extraPan, f.extraPan);
    const end = frames[200];
    close(e.finalPan + end.extraPan, f.finalPan);
    assert.equal(end.overlay, .50);
    assert.equal(end.cta, 1);
    assert.equal(end.gallery, 1);
    close(end.houseX, 0);
    end.grainY.forEach(y => close(y, 0));
    for (let i = 200; i >= 0; i--) assert.deepEqual(getAboutFrame(i / 200, f), frames[i]);
    for (let i = 1; i <= 200; i++) assert.ok(frames[i].extraPan <= frames[i - 1].extraPan + .0001);
    for (let i = 0; i < 8; i++) {
      assert.equal(getAboutLetter(0, i, 8).opacity, 0);
      assert.deepEqual(getAboutLetter(1, i, 8), { opacity: 1, blur: 0, y: 0 });
    }
    console.log(`PASS F ${w}×${h}: sixth platform, road-end stop, cocoa offsets, unblur, overlay, stagger, reverse.`);
  }
  for (let active = 0; active < 6; active++) {
    assert.equal(getGalleryOffset(active, active, 6), 0);
    assert.equal(getGalleryOffset((active + 1) % 6, active, 6), 1);
    assert.equal(getGalleryOffset((active + 5) % 6, active, 6), -1);
    assert.equal(new Set(Array.from({ length: 6 }, (_, i) => getGalleryOffset(i, active, 6))).size, 6);
  }
  console.log('PASS F assets, CTA route and six-slide circular navigation.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
