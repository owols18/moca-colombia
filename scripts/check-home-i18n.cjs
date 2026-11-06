const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const en = read("content/en/home.json");
const es = read("content/es/home.json");
const assets = value => {
  if (Array.isArray(value)) return value.flatMap(assets);
  if (value && typeof value === "object") {
    if (value.src) return [{ src: value.src, width: value.width, height: value.height }];
    return Object.values(value).flatMap(assets);
  }
  return typeof value === "string" && value.startsWith("/images/") ? [value] : [];
};
assert.deepEqual(assets(es), assets(en), "Both homes must use identical assets and dimensions");
for (const part of ["partA", "partB", "partC", "partC1", "partD", "partE", "partF", "partG", "partH"]) {
  assert.ok(es[part], part + " must exist in Spanish");
}
for (const part of ["partB", "partC1", "partE", "partF", "partH"]) {
  assert.equal(es[part].cta.href, en[part].cta.href.replace("/en/", "/es/"));
  assert.notEqual(es[part].description, en[part].description);
  assert.notEqual(es[part].cta.label, en[part].cta.label);
}
es.partD.projects.forEach((project, i) => {
  assert.equal(project.href, en.partD.projects[i].href.replace("/en/", "/es/"));
  assert.notEqual(project.summary, en.partD.projects[i].summary);
});
assert.deepEqual(es.partG.cta, read("content/es/about-us.json").cta);
for (const key of Object.keys(en.partF.galleryLabels)) {
  assert.ok(es.partF.galleryLabels[key]);
  assert.notEqual(es.partF.galleryLabels[key], en.partF.galleryLabels[key]);
}
for (const part of ["partC1", "partF"]) {
  es[part].images.forEach((image, i) => assert.notEqual(image.alt, en[part].images[i].alt));
}
assert.notEqual(es.partH.image.alt, en.partH.image.alt);
assert.notEqual(es.partA.statement, en.partA.statement);
assert.notEqual(es.partA.scrollLabel, en.partA.scrollLabel);
console.log("Home ES/EN: identical assets, complete scenes, translated content and localized links verified.");
