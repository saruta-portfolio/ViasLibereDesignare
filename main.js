/* ============================================
   ViasLibereDesignare — Main JavaScript
   ============================================ */

// --- Loader ---
const loader = document.getElementById("loader");
const loaderProgressBar = document.getElementById("loader-progress-bar");
const loaderText = document.getElementById("loader-text");

let progress = 0;
const loaderInterval = setInterval(() => {
  progress += Math.random() * 12 + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
      animateHero();
    }, 400);
  }
  loaderProgressBar.style.width = `${progress}%`;
  loaderText.textContent = Math.floor(progress);
}, 80);

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
  "a, button, .work-item, .service-row",
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

// --- Hero Animation ---
function animateHero() {
  const heroLogo = document.querySelector(".hero-logo");
  const heroPortrait = document.querySelector(".hero-portrait");

  // Logo fade in
  setTimeout(() => {
    if (heroLogo) {
      heroLogo.style.transition =
        "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      heroLogo.style.opacity = "1";
      heroLogo.style.transform = "translateY(0)";
    }
  }, 200);

  // Portrait
  setTimeout(() => {
    if (heroPortrait) {
      heroPortrait.style.transition =
        "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
      heroPortrait.style.opacity = "1";
    }
  }, 400);
}

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

// Close mobile menu on link click
document.querySelectorAll(".mobile-menu-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// --- Reveal on Scroll (Intersection Observer) ---
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

// --- Counter Animation ---
const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-count"));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

counters.forEach((counter) => counterObserver.observe(counter));

function animateCounter(element, target) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current >= target) {
      element.textContent = target;
      return;
    }
    element.textContent = Math.floor(current);
    requestAnimationFrame(update);
  }
  update();
}

// --- Initialize Top Page Works dynamically ---
import { loadWorksData, renderWorkCard } from "./works/data.js";

async function initTopWorks() {
  const worksGrid = document.getElementById("works-grid");
  if (!worksGrid) return;
  
  const worksDataList = await loadWorksData();
  
  // Get at most 6 items for top page (e.g., from an array of works)
  const topWorks = worksDataList.slice(0, 6);
  
  let html = "";
  topWorks.forEach((work, index) => {
    // Make every 3rd item large for layout variety as in original
    const isLarge = index === 2;
    html += renderWorkCard(work, isLarge);
  });
  
  worksGrid.innerHTML = html;
  
  // Re-observe items for reveal animation
  const newWorkItems = worksGrid.querySelectorAll(".work-item");
  newWorkItems.forEach((el) => {
    revealObserver.observe(el);
  });

  // Re-apply hover animations
  const hoverTargets = worksGrid.querySelectorAll(".work-item, .service-row");
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

  // Re-apply hover scale transformation logic
  newWorkItems.forEach((item) => {
    const image = item.querySelector(".work-image");
    if (image) {
      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        image.style.transform = `scale(1.03) translate(${(x - 0.5) * -6}px, ${(y - 0.5) * -6}px)`;
      });

      item.addEventListener("mouseleave", () => {
        image.style.transform = "";
      });
    }
  });

  // Filter initialization
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length > 0) {
    const freshWorkItems = worksGrid.querySelectorAll(".work-item");
    filterBtns.forEach((btn) => {
      // Re-add event listeners if needed (wait, original ones are already bound but don't close over freshWorkItems, so we must replace logic or bind dynamically)
      // Actually simpler: bind here using fresh elements
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener("click", () => {
        const filter = newBtn.getAttribute("data-filter");

        // Update active state
        const updatedBtns = document.querySelectorAll(".filter-btn");
        updatedBtns.forEach((b) => b.classList.remove("active"));
        newBtn.classList.add("active");

        // Filter items
        freshWorkItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.classList.remove("hidden");
            item.style.position = "";
          } else {
            item.classList.add("hidden");
            setTimeout(() => {
              if (item.classList.contains("hidden")) {
                item.style.position = "absolute";
              }
            }, 500);
          }
        });
      });
    });
  }
}

// Call init function on load
document.addEventListener("DOMContentLoaded", () => {
  initTopWorks();
});

// --- Works Filter ---
const filterBtns = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    // Update active state
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Filter items
    workItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        item.classList.remove("hidden");
        item.style.position = "";
      } else {
        item.classList.add("hidden");
        setTimeout(() => {
          if (item.classList.contains("hidden")) {
            item.style.position = "absolute";
          }
        }, 500);
      }
    });
  });
});

// --- Magnetic Button Effect ---
const magneticBtns = document.querySelectorAll(".btn-primary");

magneticBtns.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// --- Contact Form ---
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", () => {
    const btn = contactForm.querySelector(".btn-submit span");
    const originalText = btn.textContent;
    btn.textContent = "Opening Mail Client...";
    setTimeout(() => {
      btn.textContent = originalText;
      contactForm.reset();
    }, 3000);
  });
}

// --- Work Items Hover Scale ---
workItems.forEach((item) => {
  const image = item.querySelector(".work-image");
  if (image) {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      image.style.transform = `scale(1.03) translate(${(x - 0.5) * -6}px, ${(y - 0.5) * -6}px)`;
    });

    item.addEventListener("mouseleave", () => {
      image.style.transform = "";
    });
  }
});

// --- Nav active state on scroll ---
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: "-80px 0px -50% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));
