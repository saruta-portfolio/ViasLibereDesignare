/* ============================================
   Work Detail Page — JavaScript
   ============================================ */
import { loadWorksData } from "./data.js";

const BASE = import.meta.env.BASE_URL || "/";

// --- Initialize Detail Page dynamically ---
async function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const workId = params.get("id");

  const worksDataList = await loadWorksData();
  const work = worksDataList.find((w) => w.id === workId);

  if (!work) {
    // Fallback: redirect to works list
    window.location.href = `${BASE}works/`;
    return;
  }

  // Meta
  document.title = `${work.title} | ViasLibereDesignare`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc)
    metaDesc.setAttribute("content", work.description.slice(0, 120));

  // Hero
  const heroSection = document.getElementById("detail-hero");
  const heroImg = document.getElementById("detail-hero-img");
  const heroBg = document.getElementById("detail-hero-bg");

  const thumbPath =
    work.thumbnail && work.thumbnail.startsWith("/")
      ? work.thumbnail.slice(1)
      : work.thumbnail;
  if (thumbPath) {
    heroImg.src = `${BASE}${thumbPath}`;
    heroImg.alt = work.title;
    heroBg.style.display = "none";
  } else {
    heroImg.style.display = "none";
    heroBg.style.background = work.gradient;
    heroSection.classList.add("is-fallback");
  }

  document.getElementById("detail-category").textContent =
    work.categoryLabel || work.category;
  document.getElementById("detail-title").textContent = work.title;

  // Info
  document.getElementById("detail-client").textContent = work.client;
  document.getElementById("detail-year").textContent = work.year;
  document.getElementById("detail-role").textContent = work.role;
  document.getElementById("detail-description").textContent = work.description;

  // Gallery
  const galleryContainer = document.getElementById("detail-gallery");
  if (work.gallery && work.gallery.length > 0) {
    work.gallery.forEach((item) => {
      const div = document.createElement("div");
      div.className = "detail-gallery-item";
      // Update this later if gallery accepts images
      let mediaHtml = "";
      if (item.image) {
        const imgPath = item.image.startsWith("/")
          ? item.image.slice(1)
          : item.image;
        mediaHtml = `
          <div class="detail-gallery-image">
            <img src="${BASE}${imgPath}" alt="${item.caption || ""}" loading="lazy">
          </div>
        `;
      } else {
        mediaHtml = `<div class="detail-gallery-image" style="background: ${item.gradient || "var(--color-surface)"}"></div>`;
      }

      div.innerHTML = `
        ${mediaHtml}
        <span class="detail-gallery-caption">${item.caption || ""}</span>
      `;
      galleryContainer.appendChild(div);
    });
  }

  // Related works (same category, excluding current)
  const related = worksDataList
    .filter((w) => w.category === work.category && w.id !== work.id)
    .slice(0, 3);

  // If not enough same-category works, fill with others
  if (related.length < 3) {
    const others = worksDataList
      .filter((w) => w.id !== work.id && !related.includes(w))
      .slice(0, 3 - related.length);
    related.push(...others);
  }

  const relatedContainer = document.getElementById("detail-related");
  related.forEach((item) => {
    const a = document.createElement("a");
    a.className = "detail-related-item";
    a.href = `detail.html?id=${item.id}`;

    const relThumbPath =
      item.thumbnail && item.thumbnail.startsWith("/")
        ? item.thumbnail.slice(1)
        : item.thumbnail;
    const bgStyle = relThumbPath
      ? `background-image: url('${BASE}${relThumbPath}'); background-size: cover; background-position: center;`
      : `background: ${item.gradient}`;

    a.innerHTML = `
      <div class="detail-related-image" style="${bgStyle}">
        <div class="detail-related-overlay">
          <span class="detail-related-category">${item.categoryLabel || item.category}</span>
          <span class="detail-related-name">${item.title}</span>
        </div>
      </div>
    `;
    relatedContainer.appendChild(a);
  });
}

// Call init function on load
document.addEventListener("DOMContentLoaded", () => {
  initDetail();
});

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
