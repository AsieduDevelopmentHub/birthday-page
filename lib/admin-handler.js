const { isAdmin, isAdminConfigured } = require("./admin-auth");

const SESSION_MS = 30 * 60 * 1000;

async function handleAdmin(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!isAdminConfigured()) {
    return res.status(503).json({
      valid: false,
      error: "Admin key is not configured on the server.",
    });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ valid: false, error: "Invalid admin key." });
  }

  return res.status(200).json({
    valid: true,
    expiresInMs: SESSION_MS,
  });
}

module.exports = { handleAdmin, SESSION_MS };
