const HONOREE_NAME = "Yaw Safo Marfo";
const BRAND_NAME = "KANTINKA";

const honoreeEl = document.getElementById("honoree-name");
const brandEl = document.getElementById("brand-name");
const yearEl = document.getElementById("year");
const form = document.getElementById("wish-form");
const listEl = document.getElementById("wish-list");
const emptyEl = document.getElementById("wish-empty");
const feedbackEl = document.getElementById("form-feedback");
const submitBtn = form.querySelector(".submit-btn");
const btnLabel = submitBtn.querySelector(".btn-label");
const btnSpinner = submitBtn.querySelector(".btn-spinner");

honoreeEl.textContent = HONOREE_NAME;
if (brandEl) brandEl.textContent = BRAND_NAME;
document.title = `Happy Birthday · ${HONOREE_NAME}`;
yearEl.textContent = new Date().getFullYear();

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

function renderWish(wish, isNew = false) {
  const li = document.createElement("li");
  li.className = `wish-card${isNew ? " is-new" : ""}`;
  li.dataset.id = wish.id;
  li.innerHTML = `
    <div class="wish-meta">
      <strong>${escapeHtml(wish.name)}</strong>
      <time datetime="${wish.createdAt}">${formatDate(wish.createdAt)}</time>
    </div>
    <p>${escapeHtml(wish.message)}</p>
  `;
  return li;
}

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
      const card = renderWish(wish);
      card.style.animationDelay = `${index * 0.06}s`;
      listEl.appendChild(card);
    });
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
    listEl.prepend(card);
    form.reset();
    setFeedback("Wish posted — thank you!", "success");
  } catch (err) {
    setFeedback(err.message || "Could not post wish. Try again.", "error");
  } finally {
    setLoading(false);
  }
});

loadWishes();
