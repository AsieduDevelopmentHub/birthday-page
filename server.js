const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const WISHES_FILE = path.join(__dirname, "wishes.json");
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json({ limit: "4kb" }));
app.use(express.static(PUBLIC_DIR));

function readWishes() {
  const raw = fs.readFileSync(WISHES_FILE, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

function writeWishes(wishes) {
  fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), "utf8");
}

app.get("/api/wishes", (_req, res) => {
  try {
    const wishes = readWishes().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(wishes);
  } catch {
    res.status(500).json({ error: "Could not load wishes." });
  }
});

app.post("/api/wishes", (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 60);
  const message = String(req.body?.message ?? "").trim().slice(0, 400);

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  try {
    const wishes = readWishes();
    const wish = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    wishes.unshift(wish);
    writeWishes(wishes);
    res.status(201).json(wish);
  } catch {
    res.status(500).json({ error: "Could not save wish." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Birthday page running at http://localhost:${PORT}`);
});
