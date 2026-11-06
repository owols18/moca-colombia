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
const { getAboutGeometry, getAboutLetter } = load('aboutMotion');
const { getDonationGeometry } = load('donationMotion');
const { getContactGeometry, getContactFrame } = load('contactMotion');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
const close = (a,b) => assert.ok(Math.abs(a-b)<.001, `${a} != ${b}`);
(async () => {
  assert.equal(content.partH.cta.href, '/en/contact');
  assert.deepEqual(content.partH.titleLines, ['WE WOULD LOVE', 'TO HEAR FROM YOU']);
  const alpha = [];
  for (const asset of [...content.partH.grains, content.partH.image, ...content.partH.fruits]) {
    const file = path.join(root,'public',asset.src);
    const meta = await sharp(file).metadata();
    assert.equal(meta.width, asset.width);
    assert.equal(meta.height, asset.height);
    assert.ok(meta.hasAlpha);
    if (content.partH.grains.includes(asset)) alpha.push(await sharp(file).extractChannel('alpha').raw().toBuffer());
  }
  for (const [w,h] of [[1280,720],[1920,1080],[2560,1440],[390,844],[320,568],[844,390],[768,1024]]) {
    const d=getProjectsGeometry(w,h,content.partD);
    const e=getImpactGeometry(w,h,d,content.partE.houses);
    const f=getAboutGeometry(w,h,d,e,content.partF);
    const g=getDonationGeometry(w,h,f,0,content.partG);
    const geom=getContactGeometry(w,h,g,content.partH.grains);
    geom.grains.forEach(grain=>close(grain.y,g.grains.y+.8*g.grains.height));
    assert.ok(geom.grains[0].x+geom.grains[0].width+geom.grains[0].entryX<0);
    assert.ok(geom.grains[1].x+geom.grains[1].entryX>w);
    const frames=Array.from({length:201},(_,i)=>getContactFrame(i/200,geom));
    assert.equal(frames[0].visible,false);
    assert.equal(frames[0].donationOpacity,1);
    close(frames[0].pan,0);
    assert.equal(frames[200].donationOpacity,0);
    assert.equal(frames[200].blurFactor,0);
    assert.equal(frames[200].cta,1);
    assert.equal(frames[200].photo,1);
    assert.equal(frames[200].fruits,1);
    frames[200].grainX.forEach(x=>close(x,0));
    for(let i=200;i>=0;i--) assert.deepEqual(getContactFrame(i/200,geom),frames[i]);
    for(let i=1;i<=200;i++) {
      assert.ok(frames[i].pan<=frames[i-1].pan);
      assert.ok(frames[i].grainX[0]>=frames[i-1].grainX[0]);
      assert.ok(frames[i].grainX[1]<=frames[i-1].grainX[1]);
      if(frames[i].cta>0) assert.equal(frames[i].paragraph,1);
    }
    // Footer logo must sit over real cacao pixels, not transparent gaps between piles.
    for(const x of [w*.46,w*.5,w*.54]) {
      const covered=geom.grains.some((grain,i)=>{
        const asset=content.partH.grains[i];
        const sx=Math.floor((x-grain.x)/grain.width*asset.width);
        const sy=Math.floor((h*.90-grain.y-geom.finalPan)/grain.height*asset.height);
        return sx>=0 && sx<asset.width && sy>=0 && sy<asset.height && alpha[i][sy*asset.width+sx]>240;
      });
      assert.ok(covered, `Footer gap at ${w}×${h}, x=${x}`);
    }
    for(let i=0;i<33;i++) assert.equal(getAboutLetter(1,i,33).opacity,1);
    console.log(`PASS H ${w}×${h}: 20% overlap, opposite entries, opaque footer background, reveal, reverse.`);
  }
})().catch(error=>{console.error(error);process.exitCode=1});
