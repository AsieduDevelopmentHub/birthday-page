const crypto = require("crypto");
const { readWishes, writeWishes } = require("./wishes-store");
const { isAdmin } = require("./admin-auth");

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

  if (req.method === "DELETE") {
    if (!isAdmin(req)) {
      return res.status(401).json({ error: "Invalid or missing admin key." });
    }

    const id = String(req.query?.id ?? req.body?.id ?? "").trim();
    if (!id) {
      return res.status(400).json({ error: "Wish id is required." });
    }

    try {
      const wishes = await readWishes();
      const next = wishes.filter((w) => w.id !== id);
      if (next.length === wishes.length) {
        return res.status(404).json({ error: "Wish not found." });
      }
      await writeWishes(next);
      return res.status(200).json({ ok: true, id });
    } catch {
      return res.status(500).json({ error: "Could not delete wish." });
    }
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed." });
}

module.exports = { handleWishes };
