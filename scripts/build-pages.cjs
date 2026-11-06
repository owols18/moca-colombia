// Build an isolated design/content review. The original server app stays intact.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const basePath = "/moca-colombia";
const tempRoot = path.join(root, "tmp");
fs.mkdirSync(tempRoot, { recursive: true });
const stage = fs.mkdtempSync(path.join(tempRoot, "pages-"));

for (const name of ["src", "content", "public", "package.json", "tsconfig.json"]) {
  fs.cpSync(path.join(root, name), path.join(stage, name), {
    recursive: true,
    filter: source => source !== path.join(root, "src", "proxy.ts") &&
      source !== path.join(root, "src", "app", "api"),
  });
}
fs.symlinkSync(path.join(root, "node_modules"), path.join(stage, "node_modules"),
  process.platform === "win32" ? "junction" : "dir");

// next/link handles basePath; public asset URLs in JSON, JSX and CSS need it too.
function prefixAssets(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) prefixAssets(filename);
    else if (/\.(tsx?|jsx?|json|css)$/.test(entry.name)) {
      const original = fs.readFileSync(filename, "utf8");
      const updated = original.replace(/(["'`(])\/(images|brand|media)\//g, `$1${basePath}/$2/`);
      if (updated !== original) fs.writeFileSync(filename, updated);
    }
  }
}
prefixAssets(path.join(stage, "src"));
prefixAssets(path.join(stage, "content"));
fs.writeFileSync(path.join(stage, "next.config.mjs"), `export default {
  output: "export",
  basePath: ${JSON.stringify(basePath)},
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};\n`);
// Avoid exporting the obsolete development landing page at the review URL.
fs.writeFileSync(path.join(stage, "src/app/(dev)/page.tsx"), `"use client";
import { useEffect } from "react";
export default function ReviewEntry() {
  useEffect(() => { window.location.replace("${basePath}/en/"); }, []);
  return <main><a href="${basePath}/en/">Open Moca Colombia / Abrir Moca Colombia</a></main>;
}
`);

const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: stage,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_REVIEW_ONLY: "true", NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.status !== 0) process.exit(result.status || 1);
const output = path.join(stage, "out");
fs.writeFileSync(path.join(output, ".nojekyll"), "");
fs.writeFileSync(path.join(output, "robots.txt"), "User-agent: *\nDisallow: /\n");
const check = spawnSync(process.execPath, [path.join(root, "scripts/check-pages.cjs"), output], { stdio: "inherit" });
if (check.status !== 0) process.exit(check.status || 1);
console.log(`\nGitHub Pages export ready: ${output}`);
console.log("Only publish this out directory to the gh-pages branch. No server credentials are included.");
