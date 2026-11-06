const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { createRequire } = require('node:module');
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/home/projectsMotion.ts'), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'module', output)(loaded.exports, loaded);
const { getProjectsFrame, getProjectsGeometry, PROJECTS_TIMING, CHURCH_ANCHOR, PROJECTS_REST_OFFSET } = loaded.exports;
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8')).partD;
const vegetationAssets = JSON.parse(fs.readFileSync(path.join(root, 'content/en/home.json'), 'utf8')).partC.vegetation;
const vegetationModule = { exports: {} };
new Function('exports', 'module', ts.transpileModule(fs.readFileSync(path.join(root, 'src/components/home/vegetationMotion.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(vegetationModule.exports, vegetationModule);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);

async function main() {
  assert.equal(content.title, 'OUR PROJECTS');
  assert.deepEqual(content.projects.map(item => item.title), ['MOCACAO', 'NUTRITION', 'ACADEMIC SUPPORT', 'MEDICAL CARE']);
  assert.deepEqual(content.projects.map(item => item.href), ['mocacao', 'nutrition', 'academic-support', 'medical-care'].map(slug => `/en/projects/${slug}`));
  for (const item of content.projects) assert.ok(fs.existsSync(path.join(root, 'src/app/[locale]', item.href.replace('/en/', ''), 'page.tsx')));
  assert.deepEqual(content.trees.map(item => item.src), [1, 2, 3].map(i => `/images/home/tree${i}.webp`));
  const decorative = [...content.trees, content.way, content.church];
  const vegetationPixels = await Promise.all(vegetationAssets.map(asset => sharp(path.join(root, 'public', asset.src)).ensureAlpha().raw().toBuffer()));
  for (const asset of [...decorative, ...content.projects.map(item => item.image)]) {
    const meta = await sharp(path.join(root, 'public', asset.src)).metadata();
    assert.equal(meta.width, asset.width);
    assert.equal(meta.height, asset.height);
    if (decorative.includes(asset)) assert.ok(meta.hasAlpha);
  }
  for (let i = 1; i < 3; i++) {
    assert.ok(PROJECTS_TIMING.trees[i][0] > PROJECTS_TIMING.trees[i - 1][0]);
    assert.ok(PROJECTS_TIMING.trees[i][0] < PROJECTS_TIMING.trees[i - 1][1], 'Staggered tree entries must overlap');
  }
  for (const [w, h] of [[1920,1080],[2560,1440],[390,844],[320,568],[768,1024],[844,390],[3440,1440]]) {
    const vegetation = vegetationModule.exports.getVegetationGeometry(w,h,vegetationAssets);
    const vegetationBottom = Math.max(...vegetation.map((layer, i) => layer.y + layer.width * vegetationAssets[i].height / vegetationAssets[i].width));
    const geometry = getProjectsGeometry(w,h,content,vegetationBottom);
    const originalWayWidth = Math.min(Math.max(w * .88, h * .62), h * 1.45);
    close(geometry.way.width, originalWayWidth * 1.2 * 1.1);
    close(geometry.church.width, originalWayWidth * CHURCH_ANCHOR.width * 1.2 * 1.1);
    [0,2].forEach(i => close(geometry.trees[i].y + geometry.trees[i].height, Math.min(vegetationBottom, h * .98) + h * PROJECTS_REST_OFFSET));
    close(geometry.trees[1].y + geometry.trees[1].height, h * (.87 + PROJECTS_REST_OFFSET));
    close(geometry.way.y, h * (.54 + PROJECTS_REST_OFFSET));
    assert.ok(PROJECTS_TIMING.church[0] >= PROJECTS_TIMING.trees[2][1]);
    // Sample actual alpha across the bottom, not just image bounding boxes.
    for (let col = 0; col <= 100; col++) {
      let opacity = 0;
      vegetation.forEach((layer, i) => {
        const asset = vegetationAssets[i];
        const scale = layer.width / asset.width;
        const x = Math.floor(((w - 1) * col / 100 - layer.x) / scale);
        const y = Math.floor((h - 2 - layer.y) / scale);
        const alpha = x >= 0 && y >= 0 && x < asset.width && y < asset.height ? vegetationPixels[i][(y * asset.width + x) * 4 + 3] / 255 : 0;
        opacity += alpha * (1 - opacity);
      });
      assert.ok(opacity >= .98, `Vegetation lower-edge hole: ${w}×${h}, column ${col}`);
    }
    const originalTreeWidths = w < h ? [.60, .64, .56] : [.24, .30, .25];
    geometry.trees.forEach((tree, i) => close(tree.width, Math.min(w * originalTreeWidths[i], h * .46) * 1.3));
    close(geometry.church.x + geometry.church.width / 2, geometry.way.x + geometry.way.width * CHURCH_ANCHOR.x);
    close(geometry.church.y + geometry.church.height, geometry.way.y + geometry.way.height * CHURCH_ANCHOR.y);
    assert.ok(geometry.church.y > 0, 'Church should fit above the first platform');
    const first = getProjectsFrame(0, geometry);
    assert.equal(first.visible, false);
    assert.equal(first.previousOpacity, 1);
    assert.equal(first.previousInteractive, true);
    assert.equal(first.wayReveal, 0);
    assert.equal(first.projectsOpacity, 0);
    assert.equal(first.projectsInteractive, false);
    first.treeY.forEach((y,i) => assert.ok(y + geometry.trees[i].y > h));
    assert.ok(first.churchY + geometry.church.y > h);
    for (let i = 0; i < 3; i++) {
      const frame = getProjectsFrame(PROJECTS_TIMING.trees[i][1], geometry);
      close(frame.treeY[i], 0);
      close(frame.panY, 0);
      close(frame.backgroundY, 0);
      if (i < 2) assert.equal(frame.treeVisible[i+1], true);
    }
    const church = getProjectsFrame(PROJECTS_TIMING.church[1], geometry);
    close(church.wayReveal, 1);
    close(church.churchY, 0);
    const frames = Array.from({length:201}, (_,i) => getProjectsFrame(i/200,geometry));
    for (let i = 200; i >= 0; i--) assert.deepEqual(getProjectsFrame(i/200,geometry), frames[i]);
    for (let i = 1; i <= 200; i++) {
      assert.ok(frames[i].wayReveal >= frames[i-1].wayReveal);
      assert.ok(frames[i].projectsOpacity >= frames[i-1].projectsOpacity);
      assert.ok(frames[i].panY <= frames[i-1].panY);
      assert.ok(frames[i].backgroundY <= frames[i-1].backgroundY);
      close(frames[i].panY, 0);
      close(frames[i].backgroundY, 0);
      close(frames[i].wayY, frames[i].churchY);
      close(geometry.church.y + geometry.church.height + frames[i].churchY, geometry.way.y + geometry.way.height * CHURCH_ANCHOR.y + frames[i].wayY);
      frames[i].treeY.forEach((y,j) => assert.ok(y <= frames[i-1].treeY[j]));
    }
    const last = frames[200];
    close(last.wayReveal,1);
    close(last.projectsOpacity,1);
    assert.equal(last.projectsInteractive,true);
    assert.equal(last.previousOpacity,0);
    assert.ok(geometry.way.y + geometry.way.height + last.panY > h, 'Complete road continues below the viewport');
    assert.ok(geometry.church.y + last.panY > 0, 'Church remains in view behind Projects');
    close(last.backgroundY, 0);
    const docked = getProjectsFrame(PROJECTS_TIMING.church[1], geometry);
    close(docked.panY, last.panY);
    close(docked.churchY, last.churchY);
    close(docked.backgroundY, last.backgroundY);
    console.log(`PASS D ${w}×${h}: sequential trees, church/platform anchor, full path reveal, project fade and reverse scroll.`);
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
