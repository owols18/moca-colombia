const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sharp = require('node:module').createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
function load(name) {
  const m = { exports: {} };
  new Function('exports', 'module', ts.transpileModule(fs.readFileSync(path.join(root, 'src/components/home', name + '.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(m.exports, m);
  return m.exports;
}
const { getProjectsGeometry } = load('projectsMotion');
const { getImpactGeometry } = load('impactMotion');
const { getAboutGeometry } = load('aboutMotion');
const { getDonationGeometry, getDonationFrame, DONATION_TIMING } = load('donationMotion');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
const close = (a,b) => assert.ok(Math.abs(a-b) < .001, `${a} != ${b}`);
(async () => {
  assert.deepEqual(content.partG.cta, JSON.parse(fs.readFileSync(path.join(root, 'content/en/about-us.json'), 'utf8')).cta);
  for (const asset of [...content.partG.trees, content.partG.grains]) {
    const metadata = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.ok(metadata.hasAlpha);
  }
  for (const [w,h] of [[1280,720],[1920,1080],[2560,1440],[390,844],[320,568],[844,390],[768,1024]]) {
    const d = getProjectsGeometry(w,h,content.partD);
    const e = getImpactGeometry(w,h,d,content.partE.houses);
    const f = getAboutGeometry(w,h,d,e,content.partF);
    for (const readingTravel of [0,100,h*.4]) {
      const g = getDonationGeometry(w,h,f,readingTravel,content.partG);
      g.trees.forEach(tree => {
        close(tree.y, f.house.y + f.house.height*.5 + f.finalPan - readingTravel);
        assert.ok(tree.y + tree.entryY >= h);
      });
      close(g.grains.width,w);
      close(g.grains.x,0);
      const frames = Array.from({length:201},(_,i)=>getDonationFrame(i/200,g));
      assert.equal(frames[0].visible,false);
      assert.equal(frames[0].aboutOpacity,1);
      assert.equal(frames[0].overlayFactor,1);
      const halfway = getDonationFrame(DONATION_TIMING.grains[0],g);
      halfway.treeY.forEach((y,i)=>close(y,g.trees[i].entryY*.5));
      assert.equal(halfway.grainsVisible,false);
      for (let i=200;i>=0;i--) assert.deepEqual(getDonationFrame(i/200,g),frames[i]);
      for (let i=1;i<=200;i++) {
        assert.ok(frames[i].treeY[0]<=frames[i-1].treeY[0]);
        assert.ok(frames[i].grainY<=frames[i-1].grainY);
      }
      const end=frames[200];
      assert.equal(end.aboutOpacity,0);
      assert.equal(end.overlayFactor,0);
      assert.equal(end.blur,12);
      assert.equal(end.cta,1);
      end.treeY.forEach(y=>close(y,0));
      close(end.grainY,0);
    }
    console.log(`PASS G ${w}×${h}: house5 alignment, simultaneous trees, halfway grain entry, full width, blur, CTA, reverse.`);
  }
})().catch(error=>{console.error(error);process.exitCode=1});
