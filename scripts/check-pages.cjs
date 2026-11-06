const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(process.argv[2]);
const prefix = "/moca-colombia";
const errors = [];
let pages = 0;
function checkUrl(url, source) {
  if (!url.startsWith("/") || url.startsWith("//")) return;
  if (!url.startsWith(`${prefix}/`)) { errors.push(`${source}: missing prefix ${url}`); return; }
  const filename = path.join(root, decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0]));
  if (!fs.existsSync(filename)) errors.push(`${source}: missing asset/page ${url}`);
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".html")) {
      pages++;
      const html = fs.readFileSync(file, "utf8");
      for (const tag of html.matchAll(/<(a|img|script|link)\b[^>]*>/g)) {
        if (tag[1] === "link" && /rel="alternate"/.test(tag[0])) continue;
        for (const attr of tag[0].matchAll(/(?:src|href)="([^"\s]+)"/g)) checkUrl(attr[1], file);
      }
    } else if (entry.name.endsWith(".css")) {
      for (const match of fs.readFileSync(file, "utf8").matchAll(/url\(["']?(\/[^)'"\s]+)/g)) checkUrl(match[1], file);
    }
  }
}
walk(root);
for (const locale of ["en", "es"]) {
  const form = fs.readFileSync(path.join(root, locale, "contact/index.html"), "utf8");
  if (!/<button[^>]*disabled[^>]*type="submit"|<button[^>]*type="submit"[^>]*disabled/.test(form)) errors.push(`${locale}: submit not disabled`);
}
if (fs.existsSync(path.join(root, "api/contact"))) errors.push("Contact API must not be exported");
console.log(JSON.stringify({ pages, errors }, null, 2));
if (errors.length) process.exit(1);
