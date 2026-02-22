/* ============================================
   Work Detail Page — JavaScript
   ============================================ */
import { worksData } from "./data.js";

// --- Get work ID from URL ---
const params = new URLSearchParams(window.location.search);
const workId = params.get("id");

// --- Find work data ---
const work = worksData.find((w) => w.id === workId);

if (!work) {
  // Fallback: redirect to works list
  window.location.href = "/ViasLibereDesignare/works/";
}

// --- Populate page ---
function populatePage() {
  if (!work) return;

  // Meta
  document.title = `${work.title} | ViasLibereDesignare`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", work.description.slice(0, 120));

  // Hero
  const heroBg = document.getElementById("detail-hero-bg");
  heroBg.style.background = work.gradient;

  document.getElementById("detail-category").textContent = work.categoryLabel;
  document.getElementById("detail-title").textContent = work.title;

  // Info
  document.getElementById("detail-client").textContent = work.client;
  document.getElementById("detail-year").textContent = work.year;
  document.getElementById("detail-role").textContent = work.role;
  document.getElementById("detail-description").textContent = work.description;

  // Gallery
  const galleryContainer = document.getElementById("detail-gallery");
  work.gallery.forEach((item) => {
    const div = document.createElement("div");
    div.className = "detail-gallery-item";
    div.innerHTML = `
      <div class="detail-gallery-image" style="background: ${item.gradient}"></div>
      <span class="detail-gallery-caption">${item.caption}</span>
    `;
    galleryContainer.appendChild(div);
  });

  // Related works (same category, excluding current)
  const related = worksData
    .filter((w) => w.category === work.category && w.id !== work.id)
    .slice(0, 3);

  // If not enough same-category works, fill with others
  if (related.length < 3) {
    const others = worksData
      .filter((w) => w.id !== work.id && !related.includes(w))
      .slice(0, 3 - related.length);
    related.push(...others);
  }

  const relatedContainer = document.getElementById("detail-related");
  related.forEach((item) => {
    const a = document.createElement("a");
    a.className = "detail-related-item";
    a.href = `detail.html?id=${item.id}`;
    a.innerHTML = `
      <div class="detail-related-image" style="background: ${item.gradient}">
        <div class="detail-related-overlay">
          <span class="detail-related-category">${item.categoryLabel}</span>
          <span class="detail-related-name">${item.title}</span>
        </div>
      </div>
    `;
    relatedContainer.appendChild(a);
  });
}

populatePage();

// --- Loader ---
const loader = document.getElementById("loader");
const loaderProgressBar = document.getElementById("loader-progress-bar");
const loaderText = document.getElementById("loader-text");

let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 15 + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
    }, 400);
  }
  loaderProgressBar.style.width = `${progress}%`;
  loaderText.textContent = Math.floor(progress);
}, 60);

document.body.style.overflow = "hidden";

// --- Custom Cursor ---
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");

let mouseX = 0,
  mouseY = 0;
let followerX = 0,
  followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = `${followerX}px`;
  cursorFollower.style.top = `${followerY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverTargets = document.querySelectorAll(
  "a, button, .detail-gallery-item, .detail-related-item",
);
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
    cursorFollower.classList.add("active");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
    cursorFollower.classList.remove("active");
  });
});

// --- Navigation ---
const nav = document.getElementById("nav");
const navMenuBtn = document.getElementById("nav-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

navMenuBtn.addEventListener("click", () => {
  navMenuBtn.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "";
});

document.querySelectorAll(".mobile-menu-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// --- Reveal on Scroll ---
const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px",
  },
);

revealElements.forEach((el) => revealObserver.observe(el));
