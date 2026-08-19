const menuButton = document.querySelector("#menuButton");
const navPanel = document.querySelector("#navLinks");
const siteHeader = document.querySelector("#siteHeader");
const progress = document.querySelector("#scrollProgress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  navPanel.classList.toggle("is-open", open);
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

navPanel.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

let lastScroll = 0;
let ticking = false;

function updateScrollUi() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? scrollTop / maxScroll : 0})`;
  siteHeader.classList.toggle("is-scrolled", scrollTop > 12);
  siteHeader.classList.toggle(
    "is-hidden",
    scrollTop > lastScroll &&
      scrollTop > 180 &&
      !navPanel.classList.contains("is-open"),
  );
  lastScroll = scrollTop;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUi);
      ticking = true;
    }
  },
  { passive: true },
);

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-25% 0px -65%", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
updateScrollUi();
