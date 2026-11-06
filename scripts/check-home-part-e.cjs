const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sharp = require('node:module').createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
function load(name) {
  const m = { exports: {} };
  const src = fs.readFileSync(path.join(root, 'src/components/home', name + '.ts'), 'utf8');
  new Function('exports', 'module', ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(m.exports, m);
  return m.exports;
}
const {getProjectsGeometry, getProjectsFrame} = load('projectsMotion');
const {getImpactGeometry, getImpactFrame, getImpactLetter, getImpactLine, HOUSE_ANCHORS} = load('impactMotion');
const {getVegetationPinTravel} = load('vegetationPin');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8'));
const close = (a,b) => assert.ok(Math.abs(a-b)<.001, `${a} != ${b}`);
async function main() {
  assert.equal(content.partE.descriptionLines.join(' '), content.partE.description);
  assert.deepEqual(content.partE.cta, { label: 'EXPLORE OUR IMPACT', href: '/en/impact' });
  assert.ok(fs.existsSync(path.join(root, 'src/app/[locale]/impact/page.tsx')));
  for (const asset of [...content.partE.houses, content.partD.vegetationPath]) {
    const metadata = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.ok(metadata.hasAlpha);
  }
  for (const [w,h] of [[1920,1080],[2560,1440],[1280,720],[390,844],[320,568],[768,1024],[844,390],[3440,1440]]) {
    const d = getProjectsGeometry(w,h,content.partD);
    close(d.way.y, h*.82); // Approved manual Part D settings remain intact.
    close(d.trees[1].y+d.trees[1].height,h*1.04);
    close(getVegetationPinTravel(h,99999),h*.28);
    const e = getImpactGeometry(w,h,d,content.partE.houses);
    assert.ok(d.vegetationPath.width > w, 'Vegetation must cover both viewport edges');
    close(d.vegetationPath.y + d.vegetationPath.blend, d.church.y + d.church.height);
    assert.ok(d.vegetationPath.y + d.vegetationPath.height + e.finalPan > h, 'Vegetation lower edge stays below the final frame');
    e.houses.forEach((house,i) => {
      close(house.y+house.height,d.way.y+d.way.height*HOUSE_ANCHORS[i].y);
      close(house.x+house.width/2,d.way.x+d.way.width*HOUSE_ANCHORS[i].x);
    });
    const frames = Array.from({length:201},(_,i)=>getImpactFrame(i/200,e));
    assert.equal(frames[0].projectsOpacity,1);
    close(frames[0].pan,0);
    assert.equal(getProjectsFrame(1,d).projectsOpacity,1);
    assert.ok(!frames[0].houseVisible.some(Boolean));
    assert.deepEqual(getImpactFrame(.28,e).houseVisible,[true,true,false,false]);
    for(let i=200;i>=0;i--) assert.deepEqual(getImpactFrame(i/200,e),frames[i]);
    for(let i=1;i<=200;i++) {
      assert.ok(frames[i].pan<=frames[i-1].pan+.0001);
      assert.ok(frames[i].projectsOpacity<=frames[i-1].projectsOpacity);
    }
    const end=frames[200];
    assert.equal(end.projectsOpacity,0);
    assert.equal(end.cta,1);
    assert.equal(end.blur,12);
    end.houseX.forEach(x=>close(x,0));
    close(e.houses[3].y+e.houses[3].height*.5+end.pan,h);
    assert.ok(e.houses[2].width>e.houses[0].width);
    assert.deepEqual(getImpactFrame(.96,e),getImpactFrame(1,e));
    for(let i=0;i<6;i++) assert.equal(getImpactLetter(1,i,6).opacity,1);
    for(let i=0;i<3;i++) assert.equal(getImpactLine(1,i,3),1);
    console.log(`PASS E ${w}×${h}: platform anchors, pairs, half-house stop, fade, reverse, approved D preserved.`);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
