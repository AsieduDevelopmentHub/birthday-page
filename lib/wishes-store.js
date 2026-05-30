const fs = require("fs");
const path = require("path");

const WISHES_FILE = path.join(__dirname, "..", "wishes.json");
const BLOB_PATHNAME = "wishes.json";

function readSeedFile() {
  const raw = fs.readFileSync(WISHES_FILE, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

function readLocal() {
  return readSeedFile();
}

function writeLocal(wishes) {
  fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), "utf8");
}

async function readBlob() {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  if (!blobs.length) {
    const seed = readSeedFile();
    await writeBlob(seed);
    return seed;
  }
  const response = await fetch(blobs[0].url);
  if (!response.ok) throw new Error("Could not fetch wishes from blob storage.");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function writeBlob(wishes) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATHNAME, JSON.stringify(wishes, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readWishes() {
  if (useBlobStorage()) return readBlob();
  return readLocal();
}

async function writeWishes(wishes) {
  if (useBlobStorage()) {
    await writeBlob(wishes);
    return;
  }
  writeLocal(wishes);
}

module.exports = { readWishes, writeWishes, useBlobStorage };
