/**
 * Hamburger menu toggle untuk navigasi mobile.
 * Menambahkan / menghapus class "open" pada .mobile-nav
 * sehingga drawer muncul atau tersembunyi.
 */
const ham = document.getElementById("ham");
const mobileNav = document.getElementById("mobileNav");

ham.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});

/**
 * Tutup mobile nav saat salah satu link diklik.
 * Berguna agar drawer langsung menutup setelah navigasi.
 */
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
  });
});

/* ════════════════════════════════════════
     Helper: init a before/after slider on a .ba-wrapper element
  ════════════════════════════════════════ */
function initSlider(wrapper) {
  const before = wrapper.querySelector(".ba-before");
  const divider = wrapper.querySelector(".ba-divider");
  let dragging = false;

  function setPos(clientX) {
    const rect = wrapper.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left = pct + "%";
  }

  // start at 50 %
  requestAnimationFrame(() => {
    const r = wrapper.getBoundingClientRect();
    setPos(r.left + r.width / 2);
  });

  wrapper.addEventListener("mousedown", (e) => {
    dragging = true;
    setPos(e.clientX);
    e.preventDefault();
  });
  wrapper.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      setPos(e.touches[0].clientX);
    },
    { passive: true },
  );

  const onMove = (e) => {
    if (dragging) setPos(e.clientX);
  };
  const onTouch = (e) => {
    if (dragging) setPos(e.touches[0].clientX);
  };
  const onUp = () => {
    dragging = false;
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onTouch, { passive: true });
  document.addEventListener("mouseup", onUp);
  document.addEventListener("touchend", onUp);
}

/* ── Init all card sliders ── */
document.querySelectorAll("[data-ba]").forEach(initSlider);

/* ════════════════════════════════════════
     MODAL
  ════════════════════════════════════════ */
const overlay = document.getElementById("modalOverlay");
const modalBa = document.getElementById("modalBa");
const modalAfter = document.getElementById("modalAfter");
const modalBefore = document.getElementById("modalBefore");
const modalDivider = document.getElementById("modalDivider");
let modalSliderReady = false;

function openModal(card) {
  // ── pull data from card ──
  const baWrapper = card.querySelector("[data-ba]");
  const afterEl = baWrapper.querySelector(".ba-after");
  const beforeEl = baWrapper.querySelector(".ba-before");

  modalAfter.innerHTML = afterEl.innerHTML;
  modalBefore.innerHTML = beforeEl.innerHTML;

  document.getElementById("modalIcon").textContent = card.querySelector(".card-icon").textContent;
  document.getElementById("modalCategory").textContent = card.querySelector(".card-category").textContent;
  document.getElementById("modalTitle").textContent = card.querySelector(".card-title").textContent;
  document.getElementById("modalDesc").textContent = card.querySelector(".card-desc").textContent;
  document.getElementById("modalDuration").textContent = card.querySelector(".duration-pill").textContent.trim();
  document.getElementById("modalDifficulty").textContent = card.querySelector(".difficulty-badge").textContent;

  // ── open overlay ──
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  // ── init modal slider (fresh each open) ──
  modalBefore.style.clipPath = "inset(0 50% 0 0)";
  modalDivider.style.left = "50%";

  let dragging = false;
  function setPos(clientX) {
    const rect = modalBa.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    modalBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    modalDivider.style.left = pct + "%";
  }

  function onDown(e) {
    dragging = true;
    setPos(e.clientX);
    e.preventDefault();
  }
  function onTouch(e) {
    dragging = true;
    setPos(e.touches[0].clientX);
  }
  function onMove(e) {
    if (dragging) setPos(e.clientX);
  }
  function onTMove(e) {
    if (dragging) setPos(e.touches[0].clientX);
  }
  function onUp() {
    dragging = false;
  }

  modalBa.addEventListener("mousedown", onDown);
  modalBa.addEventListener("touchstart", onTouch, { passive: true });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onTMove, { passive: true });
  document.addEventListener("mouseup", onUp);
  document.addEventListener("touchend", onUp);

  // cleanup on close
  overlay._cleanup = () => {
    modalBa.removeEventListener("mousedown", onDown);
    modalBa.removeEventListener("touchstart", onTouch);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("touchmove", onTMove);
    document.removeEventListener("mouseup", onUp);
    document.removeEventListener("touchend", onUp);
  };
}

function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  if (overlay._cleanup) {
    overlay._cleanup();
    overlay._cleanup = null;
  }
}

// ── Card click ──
document.querySelectorAll(".procedures-grid .card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // don't open if user was dragging the card's own slider
    if (e.target.closest("[data-ba]")) return;
    openModal(card);
  });
});

// ── Close triggers ──
document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ════════════════════════════════════════
     PAGINATION + FILTER
  ════════════════════════════════════════ */
const CARDS_PER_PAGE = 6;
const allCards = Array.from(document.querySelectorAll(".procedures-grid .card"));
const paginationBar = document.getElementById("paginationBar");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let currentPage = 1;

function getVisible() {
  return allCards.filter((c) => currentFilter === "all" || c.dataset.cat === currentFilter);
}

function totalPages() {
  return Math.max(1, Math.ceil(getVisible().length / CARDS_PER_PAGE));
}

function renderCards() {
  const visible = getVisible();
  const start = (currentPage - 1) * CARDS_PER_PAGE;
  const end = start + CARDS_PER_PAGE;

  // hide all first
  allCards.forEach((c) => {
    c.style.display = "none";
    c.style.opacity = "0";
    c.style.transform = "translateY(16px)";
  });

  // show page slice with stagger
  visible.slice(start, end).forEach((c, i) => {
    c.style.display = "";
    setTimeout(() => {
      c.style.transition = "opacity .4s ease, transform .4s ease";
      c.style.opacity = "1";
      c.style.transform = "translateY(0)";
      // reset slider to 50%
      const wrapper = c.querySelector("[data-ba]");
      if (wrapper) {
        const before = wrapper.querySelector(".ba-before");
        const divider = wrapper.querySelector(".ba-divider");
        if (before && divider) {
          before.style.clipPath = "inset(0 50% 0 0)";
          divider.style.left = "50%";
        }
      }
    }, i * 60);
  });

  renderPagination(visible.length);
}

function renderPagination(total) {
  const tp = totalPages();
  const cp = currentPage;
  paginationBar.innerHTML = "";

  if (tp <= 1) return;

  const start = Math.min((cp - 1) * CARDS_PER_PAGE + 1, total);
  const end = Math.min(cp * CARDS_PER_PAGE, total);

  // info
  const info = document.createElement("span");
  info.className = "page-info";
  info.textContent = `${start}–${end} dari ${total}`;
  paginationBar.appendChild(info);

  // prev
  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.innerHTML = "&#8592;";
  prev.disabled = cp === 1;
  prev.title = "Halaman sebelumnya";
  prev.addEventListener("click", () => goTo(cp - 1));
  paginationBar.appendChild(prev);

  // page numbers
  buildPageRange(cp, tp).forEach((p) => {
    if (p === "…") {
      const el = document.createElement("span");
      el.className = "page-ellipsis";
      el.textContent = "…";
      paginationBar.appendChild(el);
    } else {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (p === cp ? " active" : "");
      btn.textContent = p;
      btn.addEventListener("click", () => goTo(p));
      paginationBar.appendChild(btn);
    }
  });

  // next
  const next = document.createElement("button");
  next.className = "page-btn";
  next.innerHTML = "&#8594;";
  next.disabled = cp === tp;
  next.title = "Halaman berikutnya";
  next.addEventListener("click", () => goTo(cp + 1));
  paginationBar.appendChild(next);
}

function buildPageRange(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, cur]);
  if (cur > 1) set.add(cur - 1);
  if (cur < total) set.add(cur + 1);
  const sorted = Array.from(set).sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

function goTo(page) {
  currentPage = Math.max(1, Math.min(page, totalPages()));
  renderCards();
  document.getElementById("proceduresGrid").closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    renderCards();
  });
});

// initial render
renderCards();
