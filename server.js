const express = require("express");
const path = require("path");
const { handleWishes } = require("./lib/wishes-handler");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.json({ limit: "4kb" }));
app.use(express.static(PUBLIC_DIR));

app.get("/api/wishes", (req, res) => handleWishes(req, res));
app.post("/api/wishes", (req, res) => handleWishes(req, res));

app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Birthday page running at http://localhost:${PORT}`);
});
