const { handleWishes } = require("../lib/wishes-handler");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(204).end();
  }
  return handleWishes(req, res);
};
