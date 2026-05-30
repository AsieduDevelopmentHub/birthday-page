function isAdmin(req) {
  const expected = process.env.WISHES_ADMIN_KEY;
  if (!expected) return false;
  const provided = req.headers["x-admin-key"];
  return typeof provided === "string" && provided === expected;
}

function isAdminConfigured() {
  return Boolean(process.env.WISHES_ADMIN_KEY);
}

module.exports = { isAdmin, isAdminConfigured };
