const HONOREE_NAME = "Yaw Safo Marfo";
const BRAND_NAME = "KANTINKA";

const honoreeEl = document.getElementById("honoree-name");
const brandEl = document.getElementById("brand-name");
const yearEl = document.getElementById("year");
const form = document.getElementById("wish-form");
const listEl = document.getElementById("wish-list");
const emptyEl = document.getElementById("wish-empty");
const feedbackEl = document.getElementById("form-feedback");
const devBanner = document.getElementById("dev-banner");
const devLogout = document.getElementById("dev-logout");
const submitBtn = form.querySelector(".submit-btn");
const btnLabel = submitBtn.querySelector(".btn-label");
const btnSpinner = submitBtn.querySelector(".btn-spinner");

const isDevUrl = new URLSearchParams(window.location.search).has("dev");
const ADMIN_KEY_STORAGE = "wishesAdminKey";

function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

function isDevMode() {
  return isDevUrl && Boolean(getAdminKey());
}

function promptAdminKey() {
  if (!isDevUrl) return;
  const key = window.prompt("Enter admin key to manage wishes:");
  if (key) sessionStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
  updateDevUi();
}

function clearAdminKey() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  updateDevUi();
  loadWishes();
}

function updateDevUi() {
  if (devBanner) devBanner.hidden = !isDevMode();
}

if (isDevUrl && !getAdminKey()) promptAdminKey();
else updateDevUi();

devLogout?.addEventListener("click", clearAdminKey);

honoreeEl.textContent = HONOREE_NAME;
if (brandEl) brandEl.textContent = BRAND_NAME;
document.title = `Happy Birthday · ${HONOREE_NAME}`;
yearEl.textContent = new Date().getFullYear();

function initAos() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 64,
    mirror: false,
    anchorPlacement: "top-bottom",
  });
}

function refreshAos() {
  if (typeof AOS !== "undefined") AOS.refresh();
}

initAos();

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderWish(wish, isNew = false, aosDelay = 0) {
  const li = document.createElement("li");
  li.className = `wish-card${isNew ? " is-new" : ""}`;
  li.dataset.id = wish.id;
  if (!isNew) {
    li.setAttribute("data-aos", "fade-up");
    li.setAttribute("data-aos-delay", String(Math.min(aosDelay, 400)));
    li.setAttribute("data-aos-offset", "40");
  }
  const deleteBtn = isDevMode()
    ? `<button type="button" class="wish-delete" data-id="${escapeHtml(wish.id)}" aria-label="Delete wish" title="Delete wish">×</button>`
    : "";
  li.innerHTML = `
    <div class="wish-meta">
      <div class="wish-meta-start">
        <strong>${escapeHtml(wish.name)}</strong>
        <time datetime="${wish.createdAt}">${formatDate(wish.createdAt)}</time>
      </div>
      ${deleteBtn}
    </div>
    <p>${escapeHtml(wish.message)}</p>
  `;
  return li;
}

async function deleteWish(id) {
  const key = getAdminKey();
  if (!key) return;

  if (!window.confirm("Delete this wish?")) return;

  try {
    const res = await fetch(`/api/wishes?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": key },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Delete failed");

    const card = listEl.querySelector(`[data-id="${CSS.escape(id)}"]`);
    card?.remove();
    if (!listEl.children.length) emptyEl.hidden = false;
    setFeedback("Wish deleted.", "success");
  } catch (err) {
    setFeedback(err.message || "Could not delete wish.", "error");
  }
}

listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".wish-delete");
  if (!btn) return;
  deleteWish(btn.dataset.id);
});

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnLabel.hidden = loading;
  btnSpinner.hidden = !loading;
}

function setFeedback(message, type = "") {
  feedbackEl.textContent = message;
  feedbackEl.className = `form-feedback${type ? ` ${type}` : ""}`;
}

async function loadWishes() {
  try {
    const res = await fetch("/api/wishes");
    if (!res.ok) throw new Error("load failed");
    const wishes = await res.json();
    listEl.replaceChildren();
    if (!wishes.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    wishes.forEach((wish, index) => {
      const card = renderWish(wish, false, index * 80);
      listEl.appendChild(card);
    });
    refreshAos();
  } catch {
    setFeedback("Could not load wishes. Is the server running?", "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setFeedback("");

  const name = form.name.value.trim();
  const message = form.message.value.trim();

  if (!name || !message) {
    setFeedback("Please enter your name and message.", "error");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Save failed");

    emptyEl.hidden = true;
    const card = renderWish(data, true);
    if (isDevMode()) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "wish-delete";
      del.dataset.id = data.id;
      del.setAttribute("aria-label", "Delete wish");
      del.title = "Delete wish";
      del.textContent = "×";
      card.querySelector(".wish-meta")?.appendChild(del);
    }
    listEl.prepend(card);
    refreshAos();
    form.reset();
    setFeedback("Wish posted — thank you!", "success");
  } catch (err) {
    setFeedback(err.message || "Could not post wish. Try again.", "error");
  } finally {
    setLoading(false);
  }
});

loadWishes();
