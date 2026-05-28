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

/* ── Before/After Slider ── */
document.querySelectorAll("[data-ba]").forEach((wrapper) => {
  const before = wrapper.querySelector(".ba-before, .ba-placeholder-before");
  const track = wrapper.querySelector(".ba-slider-track");
  let dragging = false;

  function setPos(x) {
    const rect = wrapper.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    track.style.left = pct + "%";
  }

  wrapper.addEventListener("mousedown", (e) => {
    dragging = true;
    setPos(e.clientX);
  });
  wrapper.addEventListener(
    "touchstart",
    (e) => {
      dragging = true;
      setPos(e.touches[0].clientX);
    },
    { passive: true },
  );
  document.addEventListener("mousemove", (e) => {
    if (dragging) setPos(e.clientX);
  });
  document.addEventListener(
    "touchmove",
    (e) => {
      if (dragging) setPos(e.touches[0].clientX);
    },
    { passive: true },
  );
  document.addEventListener("mouseup", () => (dragging = false));
  document.addEventListener("touchend", () => (dragging = false));
});

/* ── Filter Buttons ── */
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".procedures-grid .card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const match = f === "all" || card.dataset.cat === f;
      card.style.display = match ? "" : "none";
    });
  });
});

/* ── Scroll fade-in ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".card").forEach((c) => {
  c.style.opacity = 0;
  c.style.transform = "translateY(20px)";
  c.style.transition = "opacity .5s ease, transform .5s ease";
  observer.observe(c);
});
