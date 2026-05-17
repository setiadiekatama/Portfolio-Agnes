// ── HAMBURGER MENU ──
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ── NAVBAR SCROLL SHADOW ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ── FORM SUBMIT ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector(".btn-send");
  btn.textContent = "✅ Pesan Terkirim!";
  btn.style.background = "#1B5EA6";
  setTimeout(() => {
    btn.textContent = "Kirim Pesan 📨";
    btn.style.background = "";
    e.target.reset();
  }, 3000);
}

// ── SKILL BAR ANIMATION ON SCROLL ──
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".skill-fill").forEach((bar) => {
          bar.style.animation = "none";
          bar.offsetHeight; // trigger reflow
          bar.style.animation = "barGrow 1.4s ease both";
        });
      }
    });
  },
  { threshold: 0.3 },
);

const skillsSection = document.getElementById("skills");
if (skillsSection) barObserver.observe(skillsSection);
