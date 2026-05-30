const fs = require("fs");
const path = require("path");

const PLACEHOLDER = "__SITE_ORIGIN__";
const INDEX_PATH = path.join(__dirname, "..", "public", "index.html");

function getSiteOrigin() {
  const raw =
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!raw) return null;

  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const origin = getSiteOrigin();

if (!origin) {
  console.warn(
    "[inject-meta] No SITE_URL / VERCEL_URL — share images need absolute URLs. Set SITE_URL in Vercel or run build on Vercel."
  );
  process.exit(0);
}

let html = fs.readFileSync(INDEX_PATH, "utf8");

if (!html.includes(PLACEHOLDER)) {
  console.log("[inject-meta] Placeholders already replaced or missing; skipping.");
  process.exit(0);
}

html = html.replaceAll(PLACEHOLDER, origin);
fs.writeFileSync(INDEX_PATH, html, "utf8");

console.log(`[inject-meta] Absolute share URLs set to ${origin}`);
