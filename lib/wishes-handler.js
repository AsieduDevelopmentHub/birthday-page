const crypto = require("crypto");
const { readWishes, writeWishes } = require("./wishes-store");

function sortWishes(wishes) {
  return wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function handleWishes(req, res) {
  if (req.method === "GET") {
    try {
      const wishes = sortWishes(await readWishes());
      return res.status(200).json(wishes);
    } catch {
      return res.status(500).json({ error: "Could not load wishes." });
    }
  }

  if (req.method === "POST") {
    const name = String(req.body?.name ?? "").trim().slice(0, 60);
    const message = String(req.body?.message ?? "").trim().slice(0, 400);

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    try {
      const wishes = await readWishes();
      const wish = {
        id: crypto.randomUUID(),
        name,
        message,
        createdAt: new Date().toISOString(),
      };
      wishes.unshift(wish);
      await writeWishes(wishes);
      return res.status(201).json(wish);
    } catch {
      return res.status(500).json({ error: "Could not save wish." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed." });
}

module.exports = { handleWishes };
