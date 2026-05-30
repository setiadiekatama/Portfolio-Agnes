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
