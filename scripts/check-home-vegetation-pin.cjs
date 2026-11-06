const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createRequire } = require('node:module');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
function load(name) {
  const module = { exports: {} };
  new Function('exports', 'module', ts.transpileModule(fs.readFileSync(path.join(root, 'src/components/home', name), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(module.exports, module);
  return module.exports;
}
const { getVegetationPinFrame, getVegetationPinTravel, VEGETATION_PIN_MARGIN_PX } = load('vegetationPin.ts');
const { getVegetationGeometry } = load('vegetationMotion.ts');
const assets = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8')).partC.vegetation;
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-6, `${a} != ${b}`);
async function main() {
  const raw = await Promise.all(assets.map(a => sharp(path.join(root, 'public', a.src)).ensureAlpha().raw().toBuffer()));
  for (const [w,h] of [[1280,720],[1920,1080],[2560,1440],[390,844],[320,568],[768,1024],[3440,1440]]) {
    const geometry = getVegetationGeometry(w,h,assets);
    const alphaAt = (x,y) => {
      let opacity = 0;
      geometry.forEach((layer,i) => {
        const scale = layer.width/assets[i].width;
        const sx = Math.floor((x-layer.x)/scale), sy = Math.floor((y-layer.y)/scale);
        if (sx<0 || sy<0 || sx>=assets[i].width || sy>=assets[i].height) return;
        const alpha = raw[i][(sy*assets[i].width+sx)*4+3]/255;
        opacity += alpha*(1-opacity);
      });
      return opacity;
    };
    let opaqueBottom = h;
    outer: for (;opaqueBottom<h*1.35;opaqueBottom++) {
      for (let x=0;x<w;x+=Math.max(1,w/768)) if(alphaAt(x,opaqueBottom)<250/255) break outer;
    }
    const travel = getVegetationPinTravel(h,opaqueBottom);
    assert.ok(travel>0, 'Available normal-scroll segment');
    assert.ok(opaqueBottom-h-travel>=VEGETATION_PIN_MARGIN_PX-1e-6);
    const distance = h*9, release = distance*.05;
    const before = getVegetationPinFrame(release-1,distance,travel);
    assert.equal(before.mode,'intro');
    const a = getVegetationPinFrame(release+travel*.25,distance,travel);
    const b = getVegetationPinFrame(release+travel*.75,distance,travel);
    assert.equal(a.mode,'flow'); assert.equal(b.mode,'flow');
    close(b.travelled-a.travelled,travel*.5); // Exactly 1:1 document scrolling.
    close(a.progressD,.05); close(b.progressD,.05); // No tree entry during travel.
    const pin = getVegetationPinFrame(release+travel,distance,travel);
    assert.equal(pin.mode,'pinned'); close(pin.travelled,travel); close(pin.progressD,.05);
    const end = getVegetationPinFrame(distance+travel,distance,travel);
    close(end.progressD,1); close(end.travelled,travel);
    for (let i=0;i<=100;i++) {
      const scroll = (distance+travel)*i/100;
      const frame = getVegetationPinFrame(scroll,distance,travel);
      assert.deepEqual(frame,getVegetationPinFrame(scroll,distance,travel));
      for(let x=0;x<w;x+=w/100) assert.ok(alphaAt(x,h-2+frame.travelled)>=.98,'Lower edge stays covered');
    }
    console.log(`PASS normal scroll → pin ${w}×${h}: ${travel.toFixed(1)}px travel, margin, 1:1 motion, delayed trees, covered bottom.`);
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
